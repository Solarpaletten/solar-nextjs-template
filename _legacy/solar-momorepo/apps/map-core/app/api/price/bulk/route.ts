// ============================================================
// GET /api/price/bulk
// Phase 5B: Bulk Price Estimation for City Overlay
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@solar/db';
import { PriceAggregator, getPriceColor } from '@solar/pricing';

// Maximum buildings per request (performance constraint)
const MAX_BUILDINGS = 500;

// Cache TTL in minutes
const CACHE_TTL_MINUTES = 15;

/**
 * GET /api/price/bulk?bbox=minLng,minLat,maxLng,maxLat
 *
 * Returns price estimates for all buildings in viewport
 * Optimized for map overlay rendering
 */
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const bboxParam = searchParams.get('bbox');

    // Validate bbox
    if (!bboxParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: bbox' },
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

    // Validate bbox bounds
    if (minLng >= maxLng || minLat >= maxLat) {
      return NextResponse.json(
        { error: 'Invalid bbox: min must be < max' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `bulk:${bboxParam}`;
    const cached = await getCachedBulkPrices(cacheKey);
    
    if (cached) {
      return NextResponse.json({
        ...cached,
        cached: true,
        response_time_ms: Date.now() - startTime,
      });
    }

    // Fetch houses in bbox with their data
    const houses = await prisma.$queryRaw<Array<{
      id: string;
      area_sqm: number | null;
      building_type: string;
      building_levels: number | null;
      centroid_lng: number;
      centroid_lat: number;
    }>>`
      SELECT 
        id,
        area_sqm,
        building_type,
        building_levels,
        ST_X(ST_Centroid(geometry)) as centroid_lng,
        ST_Y(ST_Centroid(geometry)) as centroid_lat
      FROM houses
      WHERE ST_Intersects(
        geometry,
        ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326)
      )
      LIMIT ${MAX_BUILDINGS}
    `;

    if (houses.length === 0) {
      return NextResponse.json({
        bbox: [minLng, minLat, maxLng, maxLat],
        prices: [],
        count: 0,
        method: 'none',
        cached: false,
        response_time_ms: Date.now() - startTime,
      });
    }

    // Check for existing cached estimates
    const houseIds = houses.map(h => h.id);
    const existingEstimates = await getExistingEstimates(houseIds);

    // Calculate prices for houses without cached estimates
    const aggregator = new PriceAggregator();
    const prices: Array<{
      house_id: string;
      price_sqm: number;
      confidence: number;
      color: string;
    }> = [];

    for (const house of houses) {
      let priceSqm: number;
      let confidence: number;

      // Check if we have a cached estimate
      const existing = existingEstimates.get(house.id);
      
      if (existing) {
        priceSqm = existing.priceSqm;
        confidence = existing.confidence;
      } else {
        // Calculate new estimate
        const estimate = await aggregator.estimate({
          houseId: house.id,
          areaSqm: house.area_sqm,
          buildingType: house.building_type,
          buildingLevels: house.building_levels,
          centroid: [house.centroid_lng, house.centroid_lat],
        });
        
        priceSqm = estimate.priceSqm;
        confidence = estimate.confidence;

        // Cache this estimate (fire and forget)
        cacheEstimate(house.id, estimate).catch(() => {});
      }

      prices.push({
        house_id: house.id,
        price_sqm: priceSqm,
        confidence: confidence,
        color: getPriceColor(priceSqm),
      });
    }

    const response = {
      bbox: [minLng, minLat, maxLng, maxLat],
      prices,
      count: prices.length,
      method: 'aggregated',
      cached: false,
    };

    // Cache the response
    cacheBulkPrices(cacheKey, response).catch(() => {});

    return NextResponse.json({
      ...response,
      response_time_ms: Date.now() - startTime,
    });

  } catch (error) {
    console.error('Bulk price error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

interface CachedEstimate {
  priceSqm: number;
  confidence: number;
}

async function getExistingEstimates(
  houseIds: string[]
): Promise<Map<string, CachedEstimate>> {
  const map = new Map<string, CachedEstimate>();

  try {
    const estimates = await prisma.priceEstimate.findMany({
      where: {
        houseId: { in: houseIds },
        expiresAt: { gt: new Date() },
      },
      select: {
        houseId: true,
        priceSqm: true,
        confidence: true,
      },
    });

    for (const e of estimates) {
      map.set(e.houseId, {
        priceSqm: Number(e.priceSqm),
        confidence: Number(e.confidence),
      });
    }
  } catch {
    // Table might not exist
  }

  return map;
}

async function cacheEstimate(
  houseId: string,
  estimate: { priceSqm: number; priceTotal: number | null; method: string; confidence: number; details: object }
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.priceEstimate.upsert({
      where: { houseId },
      update: {
        priceSqm: estimate.priceSqm,
        priceTotal: estimate.priceTotal,
        method: estimate.method,
        confidence: estimate.confidence,
        details: estimate.details as object,
        calculatedAt: new Date(),
        expiresAt,
      },
      create: {
        houseId,
        priceSqm: estimate.priceSqm,
        priceTotal: estimate.priceTotal,
        method: estimate.method,
        confidence: estimate.confidence,
        details: estimate.details as object,
        expiresAt,
      },
    });
  } catch {
    // Ignore cache errors
  }
}

// Simple in-memory cache for bulk responses
const bulkCache = new Map<string, { data: object; expiresAt: number }>();

async function getCachedBulkPrices(key: string): Promise<object | null> {
  const cached = bulkCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }
  bulkCache.delete(key);
  return null;
}

async function cacheBulkPrices(key: string, data: object): Promise<void> {
  const expiresAt = Date.now() + CACHE_TTL_MINUTES * 60 * 1000;
  bulkCache.set(key, { data, expiresAt });

  // Cleanup old entries (max 100 cached viewports)
  if (bulkCache.size > 100) {
    const now = Date.now();
    for (const [k, v] of Array.from(bulkCache.entries())) {
      if (v.expiresAt < now) {
        bulkCache.delete(k);
      }
    }
  }
}
