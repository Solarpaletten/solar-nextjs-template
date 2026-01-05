// ============================================================
// GET /api/clusters
// Solar Template - Cluster API with Supercluster
// ============================================================
// TASK 14: Switzerland Only - No hardcoded coordinates
// Uses database data or generates dynamic demo points in bbox
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import Supercluster from 'supercluster';
import { prisma } from '@/lib/db';
import { getSegment, type PriceSegment } from '@/lib/segmentation';

// Force dynamic rendering (uses request.url)
export const dynamic = 'force-dynamic';

// ============================================================
// TYPES
// ============================================================

interface ClusterPoint {
  id: string;
  lat: number;
  lng: number;
  priceSqm: number;
  segment: PriceSegment;
  propertyType: string;
}

interface BBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

interface HouseRow {
  id: string;
  centroid_lng: number;
  centroid_lat: number;
  area_sqm: number | null;
  building_type: string | null;
}

// ============================================================
// DATA FETCHING
// ============================================================

async function fetchPoints(bbox: BBox): Promise<ClusterPoint[]> {
  try {
    // Try database first
    const houses = await prisma.$queryRaw<Array<HouseRow>>`
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
      return houses.map((house: HouseRow) => {
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
  
  // Fallback: generate demo points DYNAMICALLY within bbox (no hardcoded coords)
  return generateDemoPoints(bbox, 50);
}

// ============================================================
// DEMO DATA GENERATION (Dynamic - within bbox)
// ============================================================

function generateDemoPoints(bbox: BBox, count: number): ClusterPoint[] {
  const points: ClusterPoint[] = [];
  
  for (let i = 0; i < count; i++) {
    // Generate random point WITHIN the requested bbox
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

// ============================================================
// HELPERS
// ============================================================

function generatePriceSqm(buildingType: string | null): number {
  const basePrice = 7800; // CHF/m² (Valais average)
  
  switch (buildingType?.toLowerCase()) {
    case 'residential':
    case 'house':
      return basePrice * (0.9 + Math.random() * 0.3);
    case 'apartments':
    case 'apartment':
      return basePrice * (0.85 + Math.random() * 0.35);
    case 'commercial':
    case 'retail':
      return basePrice * (0.7 + Math.random() * 0.4);
    case 'industrial':
      return basePrice * (0.5 + Math.random() * 0.3);
    default:
      return basePrice * (0.8 + Math.random() * 0.4);
  }
}

function mapBuildingType(type: string | null): string {
  if (!type) return 'residential';
  const lower = type.toLowerCase();
  if (lower.includes('apartment')) return 'apartment';
  if (lower.includes('house') || lower === 'residential') return 'house';
  if (lower.includes('commercial') || lower.includes('retail')) return 'commercial';
  if (lower.includes('industrial')) return 'industrial';
  return 'residential';
}

// ============================================================
// CLUSTERING
// ============================================================

function clusterPoints(points: ClusterPoint[], zoom: number, bbox: BBox) {
  const index = new Supercluster({
    radius: 60,
    maxZoom: 16,
    minPoints: 2,
  });
  
  const features = points.map(point => ({
    type: 'Feature' as const,
    id: point.id,
    geometry: {
      type: 'Point' as const,
      coordinates: [point.lng, point.lat] as [number, number],
    },
    properties: {
      cluster: false,
      houseId: point.id,
      listing_id: point.id,
      price_sqm: point.priceSqm,
      segment: point.segment,
      property_type: point.propertyType,
    },
  }));
  
  index.load(features);
  
  const clusters = index.getClusters(
    [bbox.minLng, bbox.minLat, bbox.maxLng, bbox.maxLat],
    zoom
  );
  
  return clusters.map((cluster: any) => {
    if (cluster.properties.cluster) {
      return {
        type: 'Feature',
        id: `cluster_${cluster.properties.cluster_id}`,
        geometry: cluster.geometry,
        properties: {
          cluster: true,
          cluster_id: cluster.properties.cluster_id,
          point_count: cluster.properties.point_count,
          point_count_abbreviated: formatCount(cluster.properties.point_count),
          houseId: null,
        },
      };
    }
    
    return {
      type: 'Feature',
      id: cluster.properties.houseId || cluster.id,
      geometry: cluster.geometry,
      properties: {
        cluster: false,
        houseId: cluster.properties.houseId || cluster.properties.listing_id,
        listing_id: cluster.properties.listing_id,
        price_sqm: cluster.properties.price_sqm,
        segment: cluster.properties.segment,
        property_type: cluster.properties.property_type,
      },
    };
  });
}

function formatCount(count: number): string {
  if (count >= 1000) return `${Math.round(count / 1000)}k`;
  return String(count);
}

// ============================================================
// ROUTE HANDLER
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bboxParam = searchParams.get('bbox');
    const zoomParam = searchParams.get('zoom');

    // Validate bbox
    if (!bboxParam) {
      return NextResponse.json(
        { error: 'bbox parameter is required (minLng,minLat,maxLng,maxLat)' },
        { status: 400 }
      );
    }

    const bboxParts = bboxParam.split(',').map(Number);
    if (bboxParts.length !== 4 || bboxParts.some(isNaN)) {
      return NextResponse.json(
        { error: 'Invalid bbox format. Expected: minLng,minLat,maxLng,maxLat' },
        { status: 400 }
      );
    }

    const [minLng, minLat, maxLng, maxLat] = bboxParts;
    const bbox: BBox = { minLng, minLat, maxLng, maxLat };

    // Validate zoom
    const zoom = zoomParam ? parseInt(zoomParam, 10) : 14;
    if (isNaN(zoom) || zoom < 0 || zoom > 22) {
      return NextResponse.json(
        { error: 'Invalid zoom. Expected: 0-22' },
        { status: 400 }
      );
    }

    // Fetch points from database or generate demo
    const points = await fetchPoints(bbox);
    
    // Cluster points
    const features = clusterPoints(points, zoom, bbox);

    return NextResponse.json({
      type: 'FeatureCollection',
      features,
      meta: {
        total_features: features.length,
        total_clusters: features.filter((f: any) => f.properties.cluster).length,
        total_points: features.filter((f: any) => !f.properties.cluster).length,
        zoom,
        bbox: bboxParts,
      }
    });

  } catch (error) {
    console.error('Clusters API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
