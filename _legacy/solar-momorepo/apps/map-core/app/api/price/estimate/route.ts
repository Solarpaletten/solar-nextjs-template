// ============================================================
// GET /api/price/estimate
// Phase 5: Price Estimation API
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@solar/db';
import { PriceEngine } from '@solar/pricing';

/**
 * GET /api/price/estimate?house_id=xxx
 *
 * Returns price estimate for a house
 *
 * Response:
 * {
 *   price_sqm: 7420,
 *   price_total: 630700,
 *   method: "aggregated" | "ml" | "fallback",
 *   confidence: 0.78,
 *   cached: boolean,
 *   response_time_ms: number
 * }
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const houseId = searchParams.get('house_id');

    // Validate input
    if (!houseId) {
      return NextResponse.json(
        { error: 'house_id is required' },
        { status: 400 }
      );
    }

    // UUID format validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(houseId)) {
      return NextResponse.json(
        { error: 'Invalid house_id format' },
        { status: 400 }
      );
    }

    // Check cache first
    const cached = await getCachedEstimate(houseId);
    if (cached) {
      return NextResponse.json({
        price_sqm: cached.priceSqm,
        price_total: cached.priceTotal,
        method: cached.method,
        confidence: cached.confidence,
        cached: true,
        response_time_ms: Date.now() - startTime,
      });
    }

    // Get house data
    const house = await getHouseData(houseId);
    if (!house) {
      return NextResponse.json({ error: 'House not found' }, { status: 404 });
    }

    // Calculate estimate
    const engine = new PriceEngine();
    const estimate = await engine.estimate({
      houseId: house.id,
      areaSqm: house.areaSqm,
      buildingType: house.buildingType,
      buildingLevels: house.buildingLevels,
      centroid: [house.centroidLng, house.centroidLat],
    });

    // Cache result
    await cacheEstimate(houseId, estimate);

    // Return response
    return NextResponse.json({
      price_sqm: estimate.priceSqm,
      price_total: estimate.priceTotal,
      method: estimate.method,
      confidence: estimate.confidence,
      details: estimate.details,
      cached: false,
      response_time_ms: Date.now() - startTime,
    });
  } catch (error) {
    console.error('Price estimate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

interface HouseData {
  id: string;
  areaSqm: number | null;
  buildingType: string;
  buildingLevels: number | null;
  centroidLng: number;
  centroidLat: number;
}

async function getHouseData(houseId: string): Promise<HouseData | null> {
  const result = await prisma.$queryRaw<HouseData[]>`
    SELECT 
      id,
      area_sqm as "areaSqm",
      building_type as "buildingType",
      building_levels as "buildingLevels",
      ST_X(ST_Centroid(geometry)) as "centroidLng",
      ST_Y(ST_Centroid(geometry)) as "centroidLat"
    FROM houses
    WHERE id = ${houseId}::uuid
  `;

  return result[0] ?? null;
}

interface CachedEstimate {
  priceSqm: number;
  priceTotal: number | null;
  method: string;
  confidence: number;
}

async function getCachedEstimate(
  houseId: string
): Promise<CachedEstimate | null> {
  try {
    const cached = await prisma.priceEstimate.findUnique({
      where: { houseId },
    });

    if (cached && cached.expiresAt > new Date()) {
      return {
        priceSqm: Number(cached.priceSqm),
        priceTotal: cached.priceTotal ? Number(cached.priceTotal) : null,
        method: cached.method,
        confidence: Number(cached.confidence),
      };
    }

    return null;
  } catch {
    // Table might not exist yet
    return null;
  }
}

async function cacheEstimate(
  houseId: string,
  estimate: {
    priceSqm: number;
    priceTotal: number | null;
    method: string;
    confidence: number;
    details: Record<string, unknown>;
  }
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

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
    // Table might not exist yet, skip caching
    console.warn('Could not cache estimate');
  }
}
