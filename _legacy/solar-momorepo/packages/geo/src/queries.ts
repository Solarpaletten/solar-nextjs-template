import { Prisma } from '@solar/db';
import { prisma } from '@solar/db';
import type { BBox, HouseFeature, HouseFeatureCollection, HouseProperties } from './types';

// ============================================================
// RAW QUERY RESULT TYPE
// ============================================================

interface HouseRow {
  id: string;
  osm_id: bigint | null;
  address_street: string | null;
  address_number: string | null;
  address_city: string | null;
  address_postcode: string | null;
  building_type: string | null;
  building_levels: number | null;
  area_sqm: Prisma.Decimal | null;
  geojson: string;
}

// ============================================================
// GET HOUSES IN BOUNDING BOX
// ============================================================

/**
 * Get all houses within a bounding box as GeoJSON FeatureCollection
 * 
 * @param bbox - Bounding box [west, south, east, north]
 * @param limit - Max number of results (default 1000)
 */
export async function getHousesInBounds(
  bbox: BBox,
  limit: number = 1000
): Promise<HouseFeatureCollection> {
  const [west, south, east, north] = bbox;
  
  const rows = await prisma.$queryRaw<HouseRow[]>`
    SELECT 
      id,
      osm_id,
      address_street,
      address_number,
      address_city,
      address_postcode,
      building_type,
      building_levels,
      area_sqm,
      ST_AsGeoJSON(geometry) as geojson
    FROM houses
    WHERE geometry && ST_MakeEnvelope(${west}, ${south}, ${east}, ${north}, 4326)
    LIMIT ${limit}
  `;

  const features: HouseFeature[] = rows.map(row => ({
    type: 'Feature',
    geometry: JSON.parse(row.geojson),
    properties: mapRowToProperties(row),
  }));

  return {
    type: 'FeatureCollection',
    features,
  };
}

// ============================================================
// GET HOUSE BY POINT (click on map)
// ============================================================

/**
 * Find house that contains the given point
 * 
 * @param lat - Latitude
 * @param lng - Longitude
 */
export async function getHouseByPoint(
  lat: number,
  lng: number
): Promise<HouseFeature | null> {
  const rows = await prisma.$queryRaw<HouseRow[]>`
    SELECT 
      id,
      osm_id,
      address_street,
      address_number,
      address_city,
      address_postcode,
      building_type,
      building_levels,
      area_sqm,
      ST_AsGeoJSON(geometry) as geojson
    FROM houses
    WHERE ST_Contains(geometry, ST_SetSRID(ST_Point(${lng}, ${lat}), 4326))
    LIMIT 1
  `;

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    type: 'Feature',
    geometry: JSON.parse(row.geojson),
    properties: mapRowToProperties(row),
  };
}

// ============================================================
// GET HOUSE BY ID
// ============================================================

/**
 * Get house by UUID
 */
export async function getHouseById(
  id: string
): Promise<HouseFeature | null> {
  const rows = await prisma.$queryRaw<HouseRow[]>`
    SELECT 
      id,
      osm_id,
      address_street,
      address_number,
      address_city,
      address_postcode,
      building_type,
      building_levels,
      area_sqm,
      ST_AsGeoJSON(geometry) as geojson
    FROM houses
    WHERE id = ${id}::uuid
    LIMIT 1
  `;

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];
  return {
    type: 'Feature',
    geometry: JSON.parse(row.geojson),
    properties: mapRowToProperties(row),
  };
}

// ============================================================
// HELPERS
// ============================================================

function mapRowToProperties(row: HouseRow): HouseProperties {
  return {
    id: row.id,
    osmId: row.osm_id ? Number(row.osm_id) : null,
    address: {
      street: row.address_street,
      number: row.address_number,
      city: row.address_city,
      postcode: row.address_postcode,
    },
    building: {
      type: row.building_type,
      levels: row.building_levels,
      areaSqm: row.area_sqm ? Number(row.area_sqm) : null,
    },
  };
}
