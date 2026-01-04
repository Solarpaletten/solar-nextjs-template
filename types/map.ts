// ===========================================
// MAP TYPES
// Solar Template - types/map.ts
// ===========================================
// TASK 13.4: Added houseId to cluster properties
// ===========================================

import type { PriceSegment } from '@/lib/segmentation';

// ===========================================
// GEOMETRY
// ===========================================

export interface Point {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

// ===========================================
// HOUSE / BUILDING
// ===========================================

export interface House {
  id: string;
  osmId?: string;
  buildingType?: string;
  areaSqm?: number;
  buildingLevels?: number;
  centroid: Point;
  geometry?: GeoJSON.Geometry;
  createdAt: Date;
  updatedAt: Date;
}

export interface HouseWithPrice extends House {
  price?: number;
  priceSqm?: number;
  segment?: PriceSegment;
}

// ===========================================
// CLUSTER
// ===========================================

export interface ClusterProperties {
  cluster: boolean;
  cluster_id?: number;
  point_count?: number;
  point_count_abbreviated?: string;
  // TASK 13.4: Unified identifier
  houseId?: string | null;  // null for clusters, string for points
  // Legacy support
  listing_id?: string;
  // Price data
  price?: number;
  price_sqm?: number;
  segment?: PriceSegment;
  property_type?: string;
}

export interface ClusterFeature {
  type: 'Feature';
  id: string | number;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: ClusterProperties;
}

export interface ClusterCollection {
  type: 'FeatureCollection';
  features: ClusterFeature[];
}

// ===========================================
// MAP STATE
// ===========================================

export interface MapViewport {
  center: Point;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapState {
  viewport: MapViewport;
  bbox: BoundingBox;
  isLoading: boolean;
  error?: string;
}

// ===========================================
// MAP EVENTS
// ===========================================

export interface MapClickEvent {
  point: Point;
  feature?: ClusterFeature;
}

export interface MapMoveEvent {
  viewport: MapViewport;
  bbox: BoundingBox;
}

// ===========================================
// SYNC EVENTS (TASK 13.4)
// ===========================================

export interface VisibleFeaturesEvent {
  houseIds: string[];
  clusterCount: number;
  pointCount: number;
}
