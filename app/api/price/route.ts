// ============================================================
// GET /api/price?house_id=xxx
// Solar Template - Price Estimation Endpoint
// ============================================================
// Commit marker: app/api/price/.gitkeep
// Reused from: _legacy/solar-momorepo/apps/map-core/app/api/price/estimate/route.ts
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

interface CachedEstimate extends PriceEstimate {}

// ============================================================
// PRICE ENGINE (Simplified from @solar/pricing)
// ============================================================

const BERLIN_BASE_PRICE = 6500; // €/sqm

const BUILDING_TYPE_MULTIPLIERS: Record<string, number> = {
  residential: 1.0,
  apartments: 1.05,
  commercial: 0.85,
  office: 0.90,
  industrial: 0.60,
  retail: 0.95,
  house: 1.10,
  detached: 1.15,
  yes: 1.0, // OSM default
};

function calculateEstimate(house: HouseData): PriceEstimate {
  const basePrice = BERLIN_BASE_PRICE;
  
  // Building type multiplier
  const typeMultiplier = BUILDING_TYPE_MULTIPLIERS[house.buildingType] ?? 1.0;
  
  // Floor bonus (+2% per floor above 3)
  const floors = house.buildingLevels ?? 3;
  const floorBonus = floors > 3 ? 1 + (floors - 3) * 0.02 : 1.0;
  
  // Calculate price per sqm
  const priceSqm = Math.round(basePrice * typeMultiplier * floorBonus);
  
  // Total price if area is known
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
// HELPER FUNCTIONS
// ============================================================

async function getHouseData(houseId: string): Promise<HouseData | null> {
  try {
    const result = await prisma.$queryRaw<HouseData[]>`
      SELECT 
        id::text,
        area_sqm as "areaSqm",
        building_type as "buildingType",
        building_levels as "buildingLevels",
        ST_X(ST_Centroid(geometry)) as "centroidLng",
        ST_Y(ST_Centroid(geometry)) as "centroidLat"
      FROM houses
      WHERE id = ${houseId}::uuid
    `;
    return result[0] ?? null;
  } catch {
    return null;
  }
}

async function getCachedEstimate(houseId: string): Promise<CachedEstimate | null> {
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
  estimate: PriceEstimate
): Promise<void> {
  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h TTL

    await prisma.priceEstimate.upsert({
      where: { houseId },
      update: {
        priceSqm: estimate.priceSqm,
        priceTotal: estimate.priceTotal,
        method: estimate.method,
        confidence: estimate.confidence,
        calculatedAt: new Date(),
        expiresAt,
      },
      create: {
        houseId,
        priceSqm: estimate.priceSqm,
        priceTotal: estimate.priceTotal,
        method: estimate.method,
        confidence: estimate.confidence,
        expiresAt,
      },
    });
  } catch {
    // Table might not exist yet, skip caching
    console.warn('Could not cache price estimate');
  }
}

// ============================================================
// ROUTE HANDLER
// ============================================================

/**
 * GET /api/price?house_id=xxx
 *
 * Returns price estimate for a house
 *
 * Query Parameters:
 *   - house_id: UUID of the house (required)
 *
 * Response:
 * {
 *   price_sqm: 7420,
 *   price_total: 630700,
 *   method: "aggregated",
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
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
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
      return NextResponse.json(
        { error: 'House not found' },
        { status: 404 }
      );
    }

    // Calculate estimate
    const estimate = calculateEstimate(house);

    // Cache result (fire and forget)
    cacheEstimate(houseId, estimate).catch(() => {});

    // Return response
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
