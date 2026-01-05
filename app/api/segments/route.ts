// ============================================================
// GET /api/segments
// Solar Template - Segment breakdown for clusters
// ============================================================
// TASK 14: Switzerland Only - Monthey coordinates
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_REGION } from '@/config/regions';

// Force dynamic rendering (uses request.url)
export const dynamic = 'force-dynamic';

// ============================================================
// TYPES
// ============================================================

interface SegmentData {
  count: number;
  color: string;
  label: string;
  percentage: number;
  avg_price: number;
  min_price: number;
  max_price: number;
}

interface SegmentsResponse {
  cluster_id: number;
  total: number;
  segments: {
    low: SegmentData;
    mid: SegmentData;
    upper: SegmentData;
    premium: SegmentData;
  };
  center: {
    lat: number;
    lng: number;
  };
  area_name: string;
}

// ============================================================
// DEMO DATA - MONTHEY, SWITZERLAND
// ============================================================

const DEMO_SEGMENTS: Record<number, SegmentsResponse> = {
  1: {
    cluster_id: 1,
    total: 25,
    segments: {
      low: { count: 5, color: '#22c55e', label: '< CHF 6\'000/m²', percentage: 20, avg_price: 5200, min_price: 4000, max_price: 5900 },
      mid: { count: 12, color: '#3b82f6', label: 'CHF 6\'000-8\'000', percentage: 48, avg_price: 7100, min_price: 6000, max_price: 7900 },
      upper: { count: 6, color: '#f97316', label: 'CHF 8\'000-10\'000', percentage: 24, avg_price: 8800, min_price: 8000, max_price: 9900 },
      premium: { count: 2, color: '#ef4444', label: '> CHF 10\'000/m²', percentage: 8, avg_price: 11500, min_price: 10000, max_price: 13000 },
    },
    center: { lat: 46.255, lng: 6.954 }, // Monthey center
    area_name: 'Monthey Centre',
  },
  2: {
    cluster_id: 2,
    total: 18,
    segments: {
      low: { count: 3, color: '#22c55e', label: '< CHF 6\'000/m²', percentage: 17, avg_price: 5400, min_price: 4500, max_price: 5800 },
      mid: { count: 9, color: '#3b82f6', label: 'CHF 6\'000-8\'000', percentage: 50, avg_price: 7200, min_price: 6100, max_price: 7800 },
      upper: { count: 4, color: '#f97316', label: 'CHF 8\'000-10\'000', percentage: 22, avg_price: 8600, min_price: 8100, max_price: 9500 },
      premium: { count: 2, color: '#ef4444', label: '> CHF 10\'000/m²', percentage: 11, avg_price: 10800, min_price: 10200, max_price: 11500 },
    },
    center: { lat: 46.258, lng: 6.948 }, // Monthey - Avenue de la Gare area
    area_name: 'Monthey Gare',
  },
  3: {
    cluster_id: 3,
    total: 12,
    segments: {
      low: { count: 2, color: '#22c55e', label: '< CHF 6\'000/m²', percentage: 17, avg_price: 5100, min_price: 4200, max_price: 5700 },
      mid: { count: 5, color: '#3b82f6', label: 'CHF 6\'000-8\'000', percentage: 42, avg_price: 6800, min_price: 6200, max_price: 7500 },
      upper: { count: 3, color: '#f97316', label: 'CHF 8\'000-10\'000', percentage: 25, avg_price: 8900, min_price: 8200, max_price: 9800 },
      premium: { count: 2, color: '#ef4444', label: '> CHF 10\'000/m²', percentage: 16, avg_price: 11200, min_price: 10500, max_price: 12000 },
    },
    center: { lat: 46.252, lng: 6.960 }, // Monthey - Chemin des Vignes area
    area_name: 'Monthey Vignes',
  },
};

// ============================================================
// ROUTE HANDLER
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clusterIdParam = searchParams.get('cluster_id');

    // Validate
    if (!clusterIdParam) {
      return NextResponse.json(
        { error: 'cluster_id parameter is required' },
        { status: 400 }
      );
    }

    const clusterId = parseInt(clusterIdParam, 10);
    if (isNaN(clusterId)) {
      return NextResponse.json(
        { error: 'Invalid cluster_id format' },
        { status: 400 }
      );
    }

    // Get segments (demo data or generate with Monthey fallback)
    const segments = DEMO_SEGMENTS[clusterId] || {
      cluster_id: clusterId,
      total: 10,
      segments: {
        low: { count: 2, color: '#22c55e', label: '< CHF 6\'000/m²', percentage: 20, avg_price: 5000, min_price: 4500, max_price: 5500 },
        mid: { count: 5, color: '#3b82f6', label: 'CHF 6\'000-8\'000', percentage: 50, avg_price: 7000, min_price: 6000, max_price: 8000 },
        upper: { count: 2, color: '#f97316', label: 'CHF 8\'000-10\'000', percentage: 20, avg_price: 9000, min_price: 8000, max_price: 10000 },
        premium: { count: 1, color: '#ef4444', label: '> CHF 10\'000/m²', percentage: 10, avg_price: 12000, min_price: 10000, max_price: 14000 },
      },
      center: DEFAULT_REGION.center, // Monthey as fallback
      area_name: 'Monthey Area',
    };

    return NextResponse.json(segments);

  } catch (error) {
    console.error('Segments API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
