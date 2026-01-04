// ===========================================
// GET /api/house/[id]
// Solar Template - app/api/house/[id]/route.ts
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// ===========================================
// TYPES
// ===========================================

interface RouteParams {
  params: Promise<{ id: string }>;
}

// ===========================================
// GET /api/house/[id]
// ===========================================

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    
    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: 'Invalid house ID format. Expected UUID.' },
        { status: 400 }
      );
    }
    
    // Fetch house with centroid via PostGIS
    const houses = await prisma.$queryRaw<Array<{
      id: string;
      osm_id: string | null;
      building_type: string | null;
      area_sqm: number | null;
      building_levels: number | null;
      centroid_lng: number | null;
      centroid_lat: number | null;
      created_at: Date;
      updated_at: Date;
    }>>`
      SELECT 
        id,
        osm_id,
        building_type,
        area_sqm,
        building_levels,
        ST_X(centroid::geometry) as centroid_lng,
        ST_Y(centroid::geometry) as centroid_lat,
        created_at,
        updated_at
      FROM houses
      WHERE id = ${id}::uuid
      LIMIT 1
    `;
    
    // Not found
    if (!houses || houses.length === 0) {
      return NextResponse.json(
        { error: 'House not found' },
        { status: 404 }
      );
    }
    
    const house = houses[0];
    
    // Fetch price estimate if exists
    const priceEstimate = await prisma.priceEstimate.findUnique({
      where: { houseId: id },
    });
    
    // Format response
    const response = {
      id: house.id,
      osm_id: house.osm_id,
      building_type: house.building_type,
      area_sqm: house.area_sqm,
      building_levels: house.building_levels,
      centroid: house.centroid_lng && house.centroid_lat
        ? { lat: house.centroid_lat, lng: house.centroid_lng }
        : null,
      price_estimate: priceEstimate
        ? {
          price_total: priceEstimate.priceTotal,
          price_sqm: priceEstimate.priceSqm,
          method: priceEstimate.method,
          confidence: Number(priceEstimate.confidence),
        }
        : null,
      created_at: house.created_at,
      updated_at: house.updated_at,
    };
    
    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    });
    
  } catch (error) {
    console.error('GET /api/house/[id] error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
