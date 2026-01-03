// ===========================================
// MAP TYPES
// Solar Template - types/map.ts
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
  floors?: number;
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
  // For individual points
  listing_id?: string;
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
