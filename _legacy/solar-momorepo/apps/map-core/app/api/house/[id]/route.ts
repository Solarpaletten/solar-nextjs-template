
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@solar/db';
import { getHouseById } from '@solar/geo';

// ============================================================
// MOCK PRICE ESTIMATE (placeholder for Phase 2)
// ============================================================

interface PriceEstimate {
  rentMin: number;
  rentMax: number;
  saleMin: number;
  saleMax: number;
  confidence: number;
  calculatedAt: string;
}

function generateMockEstimate(areaSqm: number | null): PriceEstimate {
  // Simple mock based on area (will be replaced with real algorithm)
  const area = areaSqm ?? 100;
  const baseRent = area * 12; // €12/sqm rough estimate
  const baseSale = area * 4000; // €4000/sqm rough estimate

  return {
    rentMin: Math.round(baseRent * 0.8),
    rentMax: Math.round(baseRent * 1.2),
    saleMin: Math.round(baseSale * 0.85),
    saleMax: Math.round(baseSale * 1.15),
    confidence: 0.6,
    calculatedAt: new Date().toISOString(),
  };
}

// ============================================================
// ROUTE HANDLER
// ============================================================

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/house/[id]
 * 
 * Returns house details with price estimate and active listings
 */
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
        { error: 'Invalid house ID format' },
        { status: 400 }
      );
    }

    // Fetch house (Prisma $queryRaw inside)
    const house = await getHouseById(id);

    if (!house) {
      return NextResponse.json(
        { error: 'House not found' },
        { status: 404 }
      );
    }

    // Generate mock estimate (Phase 2 will use real algorithm)
    const estimate = generateMockEstimate(house.properties.building.areaSqm);

    // Fetch active listings for this house
    const listings = await prisma.lightListing.findMany({
      where: {
        houseId: id,
        isActive: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        listingType: true,
        price: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5, // Limit to 5 most recent
    });

    // Response structure (FINAL)
    const response = {
      house,
      estimate,
      listings: listings.map((l: any) => ({
        id: l.id,
        type: l.listingType,
        price: Number(l.price),
        createdAt: l.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Shorter cache for listings
      },
    });
  } catch (error) {
    console.error('Error fetching house:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
