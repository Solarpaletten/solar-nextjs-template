// ============================================================
// OSM DATA TYPES FOR IMPORT
// ============================================================

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];
}
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}
export interface GeoJSONMultiPolygon {
  type: 'MultiPolygon';
  coordinates: number[][][][];
}
export type GeoJSONGeometry = GeoJSONPoint | GeoJSONPolygon | GeoJSONMultiPolygon;

export interface OSMBuildingTags {
  building?: string;
  'building:levels'?: string;
  'addr:street'?: string;
  'addr:housenumber'?: string;
  'addr:city'?: string;
  'addr:postcode'?: string;
  name?: string;
  [key: string]: string | undefined;
}

export interface OSMFeature {
  type: 'Feature';
  id: string;
  properties: OSMBuildingTags & {
    '@id'?: string;
    id?: number | string;
  };
  geometry: GeoJSONGeometry;
}

export interface OverpassGeoJSONResponse {
  type: 'FeatureCollection';
  features: OSMFeature[];
}

export type BBox = [number, number, number, number];

export interface OSMImportOptions {
  bbox: BBox;
  limit?: number;
  skipExisting?: boolean;
  verbose?: boolean;
}

export interface OSMImportResult {
  total: number;
  imported: number;
  skipped: number;
  errors: number;
  duration: number;
}

export interface ParsedHouse {
  osmId: bigint;
  geometry: string;
  buildingType: string | null;
  buildingLevels: number | null;
  addressStreet: string | null;
  addressNumber: string | null;
  addressCity: string | null;
  addressPostcode: string | null;
}

/**
 * Predefined city bounding boxes
 */
export const CITY_BBOX: Record<string, BBox> = {
  // ==================== SWITZERLAND (VALAIS) ====================
  // Monthey - Main target
  'monthey': [6.93, 46.24, 6.98, 46.27],
  'monthey-center': [6.945, 46.250, 6.965, 46.260],
  'monthey-full': [6.90, 46.22, 7.00, 46.29],
  
  // Martigny
  'martigny': [7.06, 46.09, 7.09, 46.11],
  'martigny-center': [7.068, 46.098, 7.078, 46.106],
  'martigny-full': [7.04, 46.08, 7.10, 46.12],
  
  // Sion (Capital of Valais)
  'sion': [7.34, 46.22, 7.38, 46.24],
  'sion-center': [7.355, 46.228, 7.370, 46.238],
  'sion-full': [7.32, 46.21, 7.40, 46.26],
  
  // ==================== MAJOR SWISS CITIES (FUTURE) ====================
  // Geneva
  'geneva': [6.12, 46.18, 6.18, 46.22],
  'geneva-center': [6.135, 46.195, 6.155, 46.205],
  
  // Zurich
  'zurich': [8.50, 47.35, 8.58, 47.40],
  'zurich-center': [8.535, 47.368, 8.550, 47.378],
  
  // Lausanne
  'lausanne': [6.60, 46.51, 6.66, 46.54],
  'lausanne-center': [6.625, 46.518, 6.640, 46.528],
  
  // Basel
  'basel': [7.57, 47.54, 7.62, 47.58],
  'basel-center': [7.585, 47.555, 7.600, 47.565],
};
