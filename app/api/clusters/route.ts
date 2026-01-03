// ===========================================
// GET /api/clusters
// Solar Template - app/api/clusters/route.ts
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSegment } from '@/lib/segmentation';
import { parseBbox } from '@/lib/geo';
import {
  createClusterIndex,
  loadPoints,
  getClusters,
  type ClusterPoint,
} from '@/lib/clustering';

// ===========================================
// HANDLER
// ===========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse bbox
    const bboxParam = searchParams.get('bbox');
    if (!bboxParam) {
      return NextResponse.json(
        { error: 'bbox parameter is required' },
        { status: 400 }
      );
    }
    
    const bbox = parseBbox(bboxParam);
    if (!bbox) {
      return NextResponse.json(
        { error: 'Invalid bbox format. Use: minLng,minLat,maxLng,maxLat' },
        { status: 400 }
      );
    }
    
    // Parse zoom
    const zoom = parseInt(searchParams.get('zoom') || '14', 10);
    if (isNaN(zoom) || zoom < 1 || zoom > 20) {
      return NextResponse.json(
        { error: 'Invalid zoom. Must be 1-20' },
        { status: 400 }
      );
    }
    
    // Fetch data
    const points = await fetchPoints(bbox);
    
    // Create cluster index
    const index = createClusterIndex();
    loadPoints(index, points);
    
    // Get clusters
    const bboxArray: [number, number, number, number] = [
      bbox.minLng,
      bbox.minLat,
      bbox.maxLng,
      bbox.maxLat,
    ];
    const features = getClusters(index, bboxArray, zoom);
    
    // Count
    const clusterCount = features.filter(f => f.properties.cluster).length;
    const pointCount = features.filter(f => !f.properties.cluster).length;
    
    return NextResponse.json({
      type: 'FeatureCollection',
      features,
      meta: {
        total_features: features.length,
        total_clusters: clusterCount,
        total_points: pointCount,
        zoom,
        bbox: bboxArray,
      },
    });
    
  } catch (error) {
    console.error('Clusters API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ===========================================
// DATA FETCHING
// ===========================================

interface BBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

async function fetchPoints(bbox: BBox): Promise<ClusterPoint[]> {
  try {
    // Try database first
    const houses = await prisma.$queryRaw<Array<{
      id: string;
      centroid_lng: number;
      centroid_lat: number;
      area_sqm: number | null;
      building_type: string | null;
    }>>`
      SELECT 
        id,
        ST_X(centroid::geometry) as centroid_lng,
        ST_Y(centroid::geometry) as centroid_lat,
        area_sqm,
        building_type
      FROM houses
      WHERE ST_Intersects(
        centroid,
        ST_MakeEnvelope(${bbox.minLng}, ${bbox.minLat}, ${bbox.maxLng}, ${bbox.maxLat}, 4326)
      )
      LIMIT 1000
    `;
    
    if (houses.length > 0) {
      return houses.map(house => {
        const priceSqm = generatePriceSqm(house.building_type);
        return {
          id: house.id,
          lat: house.centroid_lat,
          lng: house.centroid_lng,
          priceSqm,
          segment: getSegment(priceSqm),
          propertyType: mapBuildingType(house.building_type),
        };
      });
    }
  } catch (error) {
    console.warn('Database query failed, using demo data:', error);
  }
  
  // Fallback: demo data
  return generateDemoPoints(bbox, 50);
}

// ===========================================
// DEMO DATA
// ===========================================

function generateDemoPoints(bbox: BBox, count: number): ClusterPoint[] {
  const points: ClusterPoint[] = [];
  
  for (let i = 0; i < count; i++) {
    const lat = bbox.minLat + Math.random() * (bbox.maxLat - bbox.minLat);
    const lng = bbox.minLng + Math.random() * (bbox.maxLng - bbox.minLng);
    
    // Segment distribution: 25% low, 40% mid, 25% upper, 10% premium
    const rand = Math.random();
    let priceSqm: number;
    if (rand < 0.25) {
      priceSqm = 4000 + Math.random() * 2000;
    } else if (rand < 0.65) {
      priceSqm = 6000 + Math.random() * 2000;
    } else if (rand < 0.90) {
      priceSqm = 8000 + Math.random() * 2000;
    } else {
      priceSqm = 10000 + Math.random() * 4000;
    }
    
    points.push({
      id: `demo_${i}`,
      lat,
      lng,
      priceSqm: Math.round(priceSqm),
      segment: getSegment(priceSqm),
      propertyType: Math.random() > 0.3 ? 'apartment' : 'house',
    });
  }
  
  return points;
}

function generatePriceSqm(buildingType: string | null): number {
  const base = 7800;
  const multipliers: Record<string, number> = {
    residential: 1.0,
    apartments: 1.05,
    house: 1.1,
    commercial: 0.85,
    industrial: 0.65,
  };
  
  const mult = multipliers[buildingType?.toLowerCase() || 'residential'] || 1.0;
  const variation = 0.8 + Math.random() * 0.4;
  
  return Math.round(base * mult * variation);
}

function mapBuildingType(type: string | null): string {
  if (!type) return 'apartment';
  const lower = type.toLowerCase();
  if (lower.includes('house') || lower === 'residential') return 'house';
  return 'apartment';
}
