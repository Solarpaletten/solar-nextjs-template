// ===========================================
// GET/POST /api/houses
// Solar Template - app/api/houses/route.ts
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { parseBbox } from '@/lib/geo';
import { API_DEFAULT_LIMIT, API_MAX_LIMIT } from '@/config/constants';

// ===========================================
// GET /api/houses
// ===========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse pagination
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(API_DEFAULT_LIMIT), 10),
      API_MAX_LIMIT
    );
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // Validate
    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be positive integer.' },
        { status: 400 }
      );
    }
    if (isNaN(offset) || offset < 0) {
      return NextResponse.json(
        { error: 'Invalid offset. Must be non-negative integer.' },
        { status: 400 }
      );
    }
    
    // Optional bbox filter
    const bboxParam = searchParams.get('bbox');
    const bbox = bboxParam ? parseBbox(bboxParam) : null;
    
    let houses;
    let total;
    
    if (bbox) {
      // Spatial query with PostGIS
      houses = await prisma.$queryRaw<Array<{
        id: string;
        osm_id: string | null;
        building_type: string | null;
        area_sqm: number | null;
        floors: number | null;
        centroid_lng: number;
        centroid_lat: number;
      }>>`
        SELECT 
          id,
          osm_id,
          building_type,
          area_sqm,
          floors,
          ST_X(centroid::geometry) as centroid_lng,
          ST_Y(centroid::geometry) as centroid_lat
        FROM houses
        WHERE ST_Intersects(
          centroid,
          ST_MakeEnvelope(${bbox.minLng}, ${bbox.minLat}, ${bbox.maxLng}, ${bbox.maxLat}, 4326)
        )
        ORDER BY created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
      
      const countResult = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM houses
        WHERE ST_Intersects(
          centroid,
          ST_MakeEnvelope(${bbox.minLng}, ${bbox.minLat}, ${bbox.maxLng}, ${bbox.maxLat}, 4326)
        )
      `;
      total = Number(countResult[0].count);
    } else {
      // Standard query without spatial filter
      [houses, total] = await Promise.all([
        prisma.house.findMany({
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.house.count(),
      ]);
    }
    
    // Format response
    const formattedHouses = (houses as any[]).map(house => ({
      id: house.id,
      osm_id: house.osm_id ?? house.osmId ?? null,
      building_type: house.building_type ?? house.buildingType ?? null,
      area_sqm: house.area_sqm ?? house.areaSqm ?? null,
      floors: house.floors ?? null,
      centroid: house.centroid_lng && house.centroid_lat
        ? { lat: house.centroid_lat, lng: house.centroid_lng }
        : null,
    }));
    
    return NextResponse.json({
      houses: formattedHouses,
      meta: {
        total,
        limit,
        offset,
        has_more: offset + formattedHouses.length < total,
      },
    });
    
  } catch (error) {
    console.error('GET /api/houses error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ===========================================
// POST /api/houses
// ===========================================

interface CreateHouseBody {
  osm_id?: string;
  building_type?: string;
  area_sqm?: number;
  floors?: number;
  centroid?: {
    lat: number;
    lng: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateHouseBody = await request.json();
    
    // Validation
    if (body.area_sqm !== undefined) {
      if (typeof body.area_sqm !== 'number' || body.area_sqm <= 0) {
        return NextResponse.json(
          { error: 'area_sqm must be a positive number' },
          { status: 400 }
        );
      }
    }
    
    if (body.floors !== undefined) {
      if (typeof body.floors !== 'number' || body.floors < 1 || !Number.isInteger(body.floors)) {
        return NextResponse.json(
          { error: 'floors must be a positive integer' },
          { status: 400 }
        );
      }
    }
    
    if (body.centroid) {
      const { lat, lng } = body.centroid;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return NextResponse.json(
          { error: 'centroid must have valid lat and lng numbers' },
          { status: 400 }
        );
      }
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return NextResponse.json(
          { error: 'centroid coordinates out of range' },
          { status: 400 }
        );
      }
    }
    
    // Create house
    const house = await prisma.house.create({
      data: {
        osmId: body.osm_id,
        buildingType: body.building_type,
        areaSqm: body.area_sqm,
        floors: body.floors,
      },
    });
    
    // Update centroid with PostGIS if provided
    if (body.centroid) {
      await prisma.$executeRaw`
        UPDATE houses 
        SET centroid = ST_SetSRID(ST_MakePoint(${body.centroid.lng}, ${body.centroid.lat}), 4326)
        WHERE id = ${house.id}
      `;
    }
    
    // Return created house
    return NextResponse.json({
      id: house.id,
      osm_id: house.osmId,
      building_type: house.buildingType,
      area_sqm: house.areaSqm,
      floors: house.floors,
      centroid: body.centroid ?? null,
    }, { status: 201 });
    
  } catch (error) {
    console.error('POST /api/houses error:', error);
    
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
