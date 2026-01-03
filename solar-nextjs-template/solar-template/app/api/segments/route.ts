// ===========================================
// GET /api/segments
// Solar Template - app/api/segments/route.ts
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { PRICE_SEGMENTS, type PriceSegment } from '@/lib/segmentation';

// ===========================================
// HANDLER
// ===========================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse cluster_id
    const clusterIdParam = searchParams.get('cluster_id');
    if (!clusterIdParam) {
      return NextResponse.json(
        { error: 'cluster_id parameter is required' },
        { status: 400 }
      );
    }
    
    const clusterId = parseInt(clusterIdParam, 10);
    if (isNaN(clusterId)) {
      return NextResponse.json(
        { error: 'Invalid cluster_id' },
        { status: 400 }
      );
    }
    
    // Generate demo segmentation
    // In production, this would query actual data
    const segments = generateDemoSegments();
    
    return NextResponse.json({
      cluster_id: clusterId,
      total: segments.total,
      segments: segments.data,
      center: {
        lat: 46.255,
        lng: 6.954,
      },
      area_name: 'Monthey Center',
    });
    
  } catch (error) {
    console.error('Segments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ===========================================
// DEMO DATA
// ===========================================

function generateDemoSegments() {
  // Random distribution
  const low = Math.floor(Math.random() * 15) + 5;
  const mid = Math.floor(Math.random() * 25) + 15;
  const upper = Math.floor(Math.random() * 15) + 5;
  const premium = Math.floor(Math.random() * 10) + 2;
  const total = low + mid + upper + premium;
  
  const segmentOrder: PriceSegment[] = ['low', 'mid', 'upper', 'premium'];
  const counts = { low, mid, upper, premium };
  
  const data: Record<PriceSegment, any> = {} as any;
  
  for (const segmentId of segmentOrder) {
    const config = PRICE_SEGMENTS[segmentId];
    const count = counts[segmentId];
    
    // Generate price stats
    const minPrice = config.min === 0 ? 4000 : config.min;
    const maxPrice = config.max === Infinity ? 14000 : config.max;
    const avgPrice = Math.round((minPrice + maxPrice) / 2);
    
    data[segmentId] = {
      count,
      color: config.color,
      label: config.label,
      percentage: Math.round((count / total) * 100),
      avg_price: avgPrice,
      min_price: minPrice,
      max_price: maxPrice - 100,
    };
  }
  
  return { total, data };
}
