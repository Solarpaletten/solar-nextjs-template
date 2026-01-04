// ============================================================
// GET /api/price?house_id=xxx
// Solar Template - Price Estimation Endpoint
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';  
export const dynamic = 'force-dynamic';

// ============================================================
// TYPES
// ============================================================

interface HouseData {
  id: string;
  areaSqm: number | null;
  buildingType: string;
  buildingLevels: number | null;
  centroidLng: number;
  centroidLat: number;
}

interface PriceEstimate {
  priceSqm: number;
  priceTotal: number | null;
  method: string;
  confidence: number;
}

// ============================================================
// PRICE ENGINE
// ============================================================

const BASE_PRICE = 6500; // €/sqm

const BUILDING_TYPE_MULTIPLIERS: Record<string, number> = {
  residential: 1.0,
  apartments: 1.05,
  commercial: 0.85,
  office: 0.90,
  industrial: 0.60,
  retail: 0.95,
  house: 1.10,
  detached: 1.15,
  yes: 1.0,
};

function calculateEstimate(house: HouseData): PriceEstimate {
  const basePrice = BASE_PRICE;
  
  // Building type multiplier
  const typeMultiplier = BUILDING_TYPE_MULTIPLIERS[house.buildingType] ?? 1.0;
  
  // Floor bonus (+2% per floor above 3)
  const floors = house.buildingLevels ?? 3;
  const floorBonus = floors > 3 ? 1 + (floors - 3) * 0.02 : 1.0;
  
  // Calculate price per sqm
  const priceSqm = Math.round(basePrice * typeMultiplier * floorBonus);
  
  // Total price
  const area = house.areaSqm ?? 100;
  const priceTotal = Math.round(priceSqm * area);
  
  // Confidence based on data completeness
  let confidence = 0.5;
  if (house.areaSqm) confidence += 0.15;
  if (house.buildingLevels) confidence += 0.15;
  if (house.buildingType !== 'yes') confidence += 0.15;
  confidence = Math.min(confidence, 0.95);
  
  return {
    priceSqm,
    priceTotal,
    method: 'aggregated',
    confidence: Math.round(confidence * 100) / 100,
  };
}

// ============================================================
// HELPERS
// ============================================================

async function getHouseData(houseId: string): Promise<HouseData | null> {
  try {
    const result = await prisma.$queryRaw<HouseData[]>`
      SELECT 
        id::text,
        area_sqm as "areaSqm",
        building_type as "buildingType",
        building_levels as "buildingLevels",
        ST_X(centroid::geometry) as "centroidLng",
        ST_Y(centroid::geometry) as "centroidLat"
      FROM houses
      WHERE id = ${houseId}::uuid
    `;
    return result[0] ?? null;
  } catch {
    return null;
  }
}

async function getCachedEstimate(houseId: string): Promise<PriceEstimate | null> {
  try {
    const cached = await prisma.priceEstimate.findUnique({
      where: { houseId },
    });

    if (cached && cached.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000)) {
      return {
        priceSqm: Number(cached.priceSqm),
        priceTotal: cached.price ? Number(cached.price) : null,
        method: 'cached',
        confidence: cached.confidence === 'high' ? 0.9 : cached.confidence === 'medium' ? 0.7 : 0.5,
      };
    }
    return null;
  } catch {
    return null;
  }
}

async function cacheEstimate(houseId: string, estimate: PriceEstimate): Promise<void> {
  try {
    const confidence = estimate.confidence >= 0.8 ? 'high' : estimate.confidence >= 0.6 ? 'medium' : 'low';
    const segment = estimate.priceSqm < 6000 ? 'low' : estimate.priceSqm < 8000 ? 'mid' : estimate.priceSqm < 10000 ? 'upper' : 'premium';

    await prisma.priceEstimate.upsert({
      where: { houseId },
      update: {
        price: estimate.priceTotal ?? 0,
        priceSqm: estimate.priceSqm,
        segment,
        confidence,
      },
      create: {
        houseId,
        price: estimate.priceTotal ?? 0,
        priceSqm: estimate.priceSqm,
        segment,
        confidence,
      },
    });
  } catch {
    console.warn('Could not cache price estimate');
  }
}

// ============================================================
// ROUTE HANDLER
// ============================================================

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const houseId = searchParams.get('house_id');

    // Validate
    if (!houseId) {
      return NextResponse.json(
        { error: 'house_id is required' },
        { status: 400 }
      );
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(houseId)) {
      return NextResponse.json(
        { error: 'Invalid house_id format' },
        { status: 400 }
      );
    }

    // Check cache
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
      return NextResponse.json(
        { error: 'House not found' },
        { status: 404 }
      );
    }

    // Calculate
    const estimate = calculateEstimate(house);

    // Cache (async)
    cacheEstimate(houseId, estimate).catch(() => {});

    return NextResponse.json({
      price_sqm: estimate.priceSqm,
      price_total: estimate.priceTotal,
      method: estimate.method,
      confidence: estimate.confidence,
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
