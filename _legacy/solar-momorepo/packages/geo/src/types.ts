import type { Feature, FeatureCollection, Polygon, Point } from 'geojson';

// ============================================================
// BOUNDING BOX
// ============================================================

/**
 * Bounding box as [west, south, east, north]
 * Also known as [minLon, minLat, maxLon, maxLat]
 */
export type BBox = [number, number, number, number];

export interface BBoxObject {
  west: number;  // minLon
  south: number; // minLat
  east: number;  // maxLon
  north: number; // maxLat
}

// ============================================================
// HOUSE GEOJSON
// ============================================================

export interface HouseProperties {
  id: string;
  osmId: number | null;
  address: {
    street: string | null;
    number: string | null;
    city: string | null;
    postcode: string | null;
  };
  building: {
    type: string | null;
    levels: number | null;
    areaSqm: number | null;
  };
}

export type HouseFeature = Feature<Polygon, HouseProperties>;
export type HouseFeatureCollection = FeatureCollection<Polygon, HouseProperties>;

// ============================================================
// HOUSE WITH CENTROID (for markers)
// ============================================================

export interface HouseMarkerProperties extends HouseProperties {
  // Additional fields for marker display
}

export type HouseMarkerFeature = Feature<Point, HouseMarkerProperties>;
export type HouseMarkerCollection = FeatureCollection<Point, HouseMarkerProperties>;

// ============================================================
// OSM IMPORT
// ============================================================

export interface OsmBuilding {
  type: 'Feature';
  id: string;
  properties: {
    '@id': string;
    building?: string;
    'building:levels'?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    'addr:city'?: string;
    'addr:postcode'?: string;
    [key: string]: string | undefined;
  };
  geometry: Polygon;
}

export interface OsmGeoJson {
  type: 'FeatureCollection';
  features: OsmBuilding[];
}
