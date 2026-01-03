// ===========================================
// PRICE SEGMENTATION
// Solar Template - lib/segmentation.ts
// ===========================================

// ===========================================
// TYPES
// ===========================================

export type PriceSegment = 'low' | 'mid' | 'upper' | 'premium';

export interface SegmentConfig {
  id: PriceSegment;
  label: string;
  labelShort: string;
  color: string;
  colorLight: string;
  min: number;      // CHF/m² inclusive
  max: number;      // CHF/m² exclusive
  description: string;
}

// ===========================================
// SEGMENT DEFINITIONS (CHF/m²)
// ===========================================

export const PRICE_SEGMENTS: Record<PriceSegment, SegmentConfig> = {
  low: {
    id: 'low',
    label: "< CHF 6'000/m²",
    labelShort: 'Budget',
    color: '#22c55e',       // green-500
    colorLight: '#86efac',  // green-300
    min: 0,
    max: 6000,
    description: 'Affordable housing - social segment',
  },
  mid: {
    id: 'mid',
    label: "CHF 6'000-8'000",
    labelShort: 'Average',
    color: '#3b82f6',       // blue-500
    colorLight: '#93c5fd',  // blue-300
    min: 6000,
    max: 8000,
    description: 'Middle market - typical family housing',
  },
  upper: {
    id: 'upper',
    label: "CHF 8'000-10'000",
    labelShort: 'Above Avg',
    color: '#f97316',       // orange-500
    colorLight: '#fdba74',  // orange-300
    min: 8000,
    max: 10000,
    description: 'Upper middle - quality locations',
  },
  premium: {
    id: 'premium',
    label: "> CHF 10'000/m²",
    labelShort: 'Premium',
    color: '#ef4444',       // red-500
    colorLight: '#fca5a5',  // red-300
    min: 10000,
    max: Infinity,
    description: 'Luxury segment - prime locations',
  },
};

// ===========================================
// SEGMENT FUNCTIONS
// ===========================================

/**
 * Get segment for a given price per m²
 */
export function getSegment(priceSqm: number): PriceSegment {
  if (priceSqm < PRICE_SEGMENTS.low.max) return 'low';
  if (priceSqm < PRICE_SEGMENTS.mid.max) return 'mid';
  if (priceSqm < PRICE_SEGMENTS.upper.max) return 'upper';
  return 'premium';
}

/**
 * Get segment config for a given price
 */
export function getSegmentConfig(priceSqm: number): SegmentConfig {
  return PRICE_SEGMENTS[getSegment(priceSqm)];
}

/**
 * Get color for a given price
 */
export function getSegmentColor(priceSqm: number): string {
  return getSegmentConfig(priceSqm).color;
}

/**
 * Get all segments as array (for legends)
 */
export function getSegmentList(): SegmentConfig[] {
  return Object.values(PRICE_SEGMENTS);
}

// ===========================================
// CLUSTER SEGMENTATION
// ===========================================

export interface ListingPoint {
  id: string;
  lat: number;
  lng: number;
  price: number;
  priceSqm: number;
}

export interface SegmentCount {
  segment: PriceSegment;
  count: number;
  color: string;
  label: string;
  percentage: number;
  avgPrice: number;
}

export interface ClusterSegmentation {
  total: number;
  segments: Record<PriceSegment, SegmentCount>;
  dominantSegment: PriceSegment;
}

/**
 * Calculate segmentation for a cluster of listings
 */
export function segmentCluster(listings: ListingPoint[]): ClusterSegmentation {
  const total = listings.length;
  
  // Initialize
  const segmentData: Record<PriceSegment, ListingPoint[]> = {
    low: [],
    mid: [],
    upper: [],
    premium: [],
  };
  
  // Categorize
  for (const listing of listings) {
    const segment = getSegment(listing.priceSqm);
    segmentData[segment].push(listing);
  }
  
  // Calculate stats
  const segments: Record<PriceSegment, SegmentCount> = {} as any;
  let dominantSegment: PriceSegment = 'mid';
  let maxCount = 0;
  
  for (const [segmentId, segmentListings] of Object.entries(segmentData)) {
    const segment = segmentId as PriceSegment;
    const config = PRICE_SEGMENTS[segment];
    const count = segmentListings.length;
    
    if (count > maxCount) {
      maxCount = count;
      dominantSegment = segment;
    }
    
    const prices = segmentListings.map(l => l.priceSqm);
    const avgPrice = prices.length > 0 
      ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
      : 0;
    
    segments[segment] = {
      segment,
      count,
      color: config.color,
      label: config.label,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      avgPrice,
    };
  }
  
  return { total, segments, dominantSegment };
}

// ===========================================
// COLOR SCALE FOR MAP
// ===========================================

/**
 * Get color based on price for map visualization
 */
export function getPriceColor(priceSqm: number): string {
  return getSegmentColor(priceSqm);
}

/**
 * Legend items for map
 */
export const LEGEND_ITEMS = [
  { label: "< 6'000", color: PRICE_SEGMENTS.low.color },
  { label: "6'000-8'000", color: PRICE_SEGMENTS.mid.color },
  { label: "8'000-10'000", color: PRICE_SEGMENTS.upper.color },
  { label: "> 10'000", color: PRICE_SEGMENTS.premium.color },
];
