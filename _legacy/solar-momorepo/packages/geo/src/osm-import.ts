#!/usr/bin/env tsx
import { prisma } from '@solar/db';
import { BBox, CITY_BBOX, OSMFeature, OSMImportOptions, OSMImportResult, ParsedHouse } from './osm-types';

const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

function buildOverpassQuery(bbox: BBox): string {
  const [minLng, minLat, maxLng, maxLat] = bbox;
  return `[out:json][timeout:60];(way["building"](${minLat},${minLng},${maxLat},${maxLng}););out body;>;out skel qt;`;
}

async function fetchFromOverpass(bbox: BBox, verbose: boolean): Promise<OSMFeature[]> {
  if (verbose) console.log('📡 Fetching from Overpass API...\n   BBOX: [' + bbox.join(', ') + ']');
  const response = await fetch(OVERPASS_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(buildOverpassQuery(bbox))}`,
  });
  if (!response.ok) throw new Error(`Overpass API error: ${response.status}`);
  return convertOverpassToFeatures(await response.json(), verbose);
}

function convertOverpassToFeatures(data: any, verbose: boolean): OSMFeature[] {
  const elements = data.elements || [];
  const nodes = new Map<number, [number, number]>();
  const ways: any[] = [];
  for (const el of elements) {
    if (el.type === 'node') nodes.set(el.id, [el.lon, el.lat]);
    else if (el.type === 'way' && el.tags?.building) ways.push(el);
  }
  if (verbose) console.log(`   Found ${nodes.size} nodes, ${ways.length} building ways`);
  const features: OSMFeature[] = [];
  for (const way of ways) {
    const coords: number[][] = [];
    let valid = true;
    for (const nodeId of way.nodes) {
      const coord = nodes.get(nodeId);
      if (coord) coords.push(coord); else { valid = false; break; }
    }
    if (valid && coords.length >= 4) {
      if (coords[0][0] !== coords[coords.length - 1][0] || coords[0][1] !== coords[coords.length - 1][1]) coords.push([...coords[0]]);
      features.push({ type: 'Feature', id: `way/${way.id}`, properties: { ...way.tags, id: way.id }, geometry: { type: 'Polygon', coordinates: [coords] } });
    }
  }
  return features;
}

function polygonToWKT(coordinates: number[][][]): string {
  return `POLYGON((${coordinates[0].map(([lng, lat]) => `${lng} ${lat}`).join(', ')}))`;
}

function parseFeature(feature: OSMFeature): ParsedHouse | null {
  if (feature.geometry.type !== 'Polygon') return null;
  const props = feature.properties;
  const osmId = props.id || props['@id'];
  if (!osmId) return null;
  let buildingLevels: number | null = null;
  if (props['building:levels']) {
    const parsed = parseInt(props['building:levels'], 10);
    if (!isNaN(parsed) && parsed > 0 && parsed < 200) buildingLevels = parsed;
  }
  return {
    osmId: BigInt(typeof osmId === 'string' ? osmId.replace(/\D/g, '') : osmId),
    geometry: polygonToWKT(feature.geometry.coordinates),
    buildingType: props.building || null,
    buildingLevels,
    addressStreet: props['addr:street'] || null,
    addressNumber: props['addr:housenumber'] || null,
    addressCity: props['addr:city'] || null,
    addressPostcode: props['addr:postcode'] || null,
  };
}

async function houseExists(osmId: bigint): Promise<boolean> {
  const result = await prisma.$queryRaw<{count: bigint}[]>`SELECT COUNT(*) as count FROM houses WHERE osm_id = ${osmId}`;
  return Number(result[0].count) > 0;
}

async function insertHouse(house: ParsedHouse): Promise<boolean> {
  try {
    await prisma.$executeRaw`
      INSERT INTO houses (osm_id, geometry, centroid, building_type, building_levels, address_street, address_number, address_city, address_postcode)
      VALUES (${house.osmId}, ST_GeomFromText(${house.geometry}, 4326), ST_Centroid(ST_GeomFromText(${house.geometry}, 4326)),
        ${house.buildingType}, ${house.buildingLevels}, ${house.addressStreet}, ${house.addressNumber}, ${house.addressCity}, ${house.addressPostcode})`;
    return true;
  } catch { return false; }
}

async function importBuildings(options: OSMImportOptions): Promise<OSMImportResult> {
  const startTime = Date.now();
  const { bbox, limit = 500, verbose = true } = options;
  console.log('\n🏗️  OSM BUILDING IMPORT\n' + '═'.repeat(50));
  console.log(`📍 BBox: [${bbox.join(', ')}]\n📊 Limit: ${limit}\n` + '═'.repeat(50));
  const features = await fetchFromOverpass(bbox, verbose);
  console.log(`\n✅ Received ${features.length} building features\n📥 Processing...\n`);
  let imported = 0, skipped = 0, errors = 0;
  const toProcess = features.slice(0, limit);
  for (let i = 0; i < toProcess.length; i++) {
    const house = parseFeature(toProcess[i]);
    if (!house) { errors++; continue; }
    // Check if exists
    if (await houseExists(house.osmId)) { skipped++; continue; }
    const success = await insertHouse(house);
    if (success) imported++; else errors++;
    if (verbose && i % 20 === 0) process.stdout.write(`\r   Progress: ${i + 1}/${toProcess.length} (imported: ${imported})`);
  }
  const duration = Date.now() - startTime;
  console.log('\n\n' + '═'.repeat(50) + '\n📊 IMPORT SUMMARY\n' + '═'.repeat(50));
  console.log(`   ✅ Imported:  ${imported}\n   ⏭️  Skipped:   ${skipped}\n   ❌ Errors:    ${errors}\n   ⏱️  Duration:  ${(duration / 1000).toFixed(2)}s\n` + '═'.repeat(50));
  return { total: features.length, imported, skipped, errors, duration };
}

function parseArgs(): OSMImportOptions {
  const args = process.argv.slice(2);
  let bbox: BBox | null = null, limit = 500;
  for (const arg of args) {
    if (arg.startsWith('--bbox=')) { const p = arg.slice(7).split(',').map(Number); if (p.length === 4) bbox = p as BBox; }
    else if (arg.startsWith('--city=')) {
      const city = arg.slice(7).toLowerCase();
      if (city in CITY_BBOX) { bbox = CITY_BBOX[city]; console.log(`🏙️  City: ${city}`); }
      else { console.error(`❌ Unknown city. Available: ${Object.keys(CITY_BBOX).join(', ')}`); process.exit(1); }
    }
    else if (arg.startsWith('--limit=')) limit = parseInt(arg.slice(8), 10);
    else if (arg === '--help') { console.log('Usage: pnpm osm:import --city=berlin-alex --limit=300'); process.exit(0); }
  }
  if (!bbox) { console.error('❌ Missing --bbox or --city'); process.exit(1); }
  return { bbox, limit, verbose: true, skipExisting: true };
}

async function main() {
  try { await importBuildings(parseArgs()); }
  catch (e) { console.error('\n❌ Import failed:', e); process.exit(1); }
  finally { await prisma.$disconnect(); }
}
main();
