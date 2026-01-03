// ===========================================
// API TYPES
// Solar Template - types/api.ts
// ===========================================

import type { PriceSegment } from '@/lib/segmentation';
import type { ClusterFeature } from '@/types/map';

// ===========================================
// COMMON
// ===========================================

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

export interface ApiMeta {
  total?: number;
  limit?: number;
  offset?: number;
  has_more?: boolean;
}

// ===========================================
// GET /api/houses
// ===========================================

export interface HousesRequest {
  bbox: string;           // "minLng,minLat,maxLng,maxLat"
  limit?: number;
  offset?: number;
}

export interface HouseResponse {
  id: string;
  osm_id?: string;
  building_type?: string;
  area_sqm?: number;
  floors?: number;
  centroid: {
    lat: number;
    lng: number;
  };
  price_estimate?: {
    price: number;
    price_sqm: number;
    segment: PriceSegment;
  };
}

export interface HousesResponse {
  houses: HouseResponse[];
  meta: ApiMeta & {
    bbox: [number, number, number, number];
  };
}

// ===========================================
// GET /api/clusters
// ===========================================

export interface ClustersRequest {
  bbox: string;           // "minLng,minLat,maxLng,maxLat"
  zoom: number;
}

export interface ClustersResponse {
  type: 'FeatureCollection';
  features: ClusterFeature[];
  meta: {
    total_features: number;
    total_clusters: number;
    total_points: number;
    zoom: number;
    bbox: [number, number, number, number];
  };
}

// ===========================================
// GET /api/segments
// ===========================================

export interface SegmentsRequest {
  cluster_id: number;
  bbox?: string;
}

export interface SegmentData {
  count: number;
  color: string;
  label: string;
  percentage: number;
  avg_price: number;
  min_price: number;
  max_price: number;
}

export interface SegmentsResponse {
  cluster_id: number;
  total: number;
  segments: Record<PriceSegment, SegmentData>;
  center: {
    lat: number;
    lng: number;
  };
  area_name?: string;
}

// ===========================================
// GET /api/price/estimate
// ===========================================

export interface PriceEstimateRequest {
  area_sqm: number;
  building_type?: string;
  region?: string;
  has_mountain_view?: boolean;
  has_garage?: boolean;
  has_garden?: boolean;
  distance_to_train?: number;
}

export interface PriceEstimateResponse {
  price: number;
  price_sqm: number;
  confidence: 'low' | 'medium' | 'high';
  segment: PriceSegment;
  factors: Array<{
    name: string;
    coefficient: number;
    impact: number;
  }>;
}
