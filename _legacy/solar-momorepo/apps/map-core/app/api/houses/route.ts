
import { NextRequest, NextResponse } from 'next/server';
import { getHousesInBounds, type BBox } from '@solar/geo';

/**
 * GET /api/houses?bbox=west,south,east,north
 * 
 * Returns GeoJSON FeatureCollection of houses in viewport
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bboxParam = searchParams.get('bbox');
    const limitParam = searchParams.get('limit');

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
        { error: 'Invalid bbox format. Expected: west,south,east,north' },
        { status: 400 }
      );
    }

    const bbox: BBox = [bboxParts[0], bboxParts[1], bboxParts[2], bboxParts[3]];
    
    // Validate bbox bounds
    const [west, south, east, north] = bbox;
    if (west >= east || south >= north) {
      return NextResponse.json(
        { error: 'Invalid bbox: west must be < east, south must be < north' },
        { status: 400 }
      );
    }

    // Parse limit (default 1000, max 5000)
    let limit = 1000;
    if (limitParam) {
      const parsedLimit = parseInt(limitParam, 10);
      if (!isNaN(parsedLimit) && parsedLimit > 0) {
        limit = Math.min(parsedLimit, 5000);
      }
    }

    // Query database (Prisma $queryRaw inside)
    const featureCollection = await getHousesInBounds(bbox, limit);

    return NextResponse.json(featureCollection, {
      headers: {
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error) {
    console.error('Error fetching houses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
