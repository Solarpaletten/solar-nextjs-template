// ===========================================
// GIS UTILITIES
// Solar Template - lib/geo.ts
// ===========================================

// ===========================================
// TYPES
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

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number];  // [lng, lat]
}

export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: [number, number][][];
}

// ===========================================
// DISTANCE CALCULATIONS
// ===========================================

/**
 * Calculate distance between two points (Haversine formula)
 * @returns Distance in meters
 */
export function getDistance(point1: Point, point2: Point): number {
  const R = 6371000; // Earth's radius in meters
  
  const lat1Rad = toRadians(point1.lat);
  const lat2Rad = toRadians(point2.lat);
  const deltaLat = toRadians(point2.lat - point1.lat);
  const deltaLng = toRadians(point2.lng - point1.lng);
  
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

/**
 * Check if a point is within distance of another point
 */
export function isWithinDistance(
  point1: Point,
  point2: Point,
  maxDistance: number
): boolean {
  return getDistance(point1, point2) <= maxDistance;
}

// ===========================================
// BOUNDING BOX
// ===========================================

/**
 * Parse bbox string "minLng,minLat,maxLng,maxLat"
 */
export function parseBbox(bboxString: string): BoundingBox | null {
  const parts = bboxString.split(',').map(Number);
  
  if (parts.length !== 4 || parts.some(isNaN)) {
    return null;
  }
  
  return {
    minLng: parts[0],
    minLat: parts[1],
    maxLng: parts[2],
    maxLat: parts[3],
  };
}

/**
 * Format bbox to string
 */
export function formatBbox(bbox: BoundingBox): string {
  return `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`;
}

/**
 * Check if point is inside bounding box
 */
export function isPointInBbox(point: Point, bbox: BoundingBox): boolean {
  return (
    point.lng >= bbox.minLng &&
    point.lng <= bbox.maxLng &&
    point.lat >= bbox.minLat &&
    point.lat <= bbox.maxLat
  );
}

/**
 * Get center of bounding box
 */
export function getBboxCenter(bbox: BoundingBox): Point {
  return {
    lat: (bbox.minLat + bbox.maxLat) / 2,
    lng: (bbox.minLng + bbox.maxLng) / 2,
  };
}

/**
 * Expand bbox by percentage
 */
export function expandBbox(bbox: BoundingBox, percentage: number): BoundingBox {
  const lngDiff = (bbox.maxLng - bbox.minLng) * (percentage / 100);
  const latDiff = (bbox.maxLat - bbox.minLat) * (percentage / 100);
  
  return {
    minLng: bbox.minLng - lngDiff,
    minLat: bbox.minLat - latDiff,
    maxLng: bbox.maxLng + lngDiff,
    maxLat: bbox.maxLat + latDiff,
  };
}

// ===========================================
// GEOJSON HELPERS
// ===========================================

/**
 * Convert Point to GeoJSON Point
 */
export function toGeoJSONPoint(point: Point): GeoJSONPoint {
  return {
    type: 'Point',
    coordinates: [point.lng, point.lat],
  };
}

/**
 * Convert GeoJSON Point to Point
 */
export function fromGeoJSONPoint(geojson: GeoJSONPoint): Point {
  return {
    lng: geojson.coordinates[0],
    lat: geojson.coordinates[1],
  };
}

/**
 * Convert bbox to GeoJSON Polygon
 */
export function bboxToPolygon(bbox: BoundingBox): GeoJSONPolygon {
  return {
    type: 'Polygon',
    coordinates: [[
      [bbox.minLng, bbox.minLat],
      [bbox.maxLng, bbox.minLat],
      [bbox.maxLng, bbox.maxLat],
      [bbox.minLng, bbox.maxLat],
      [bbox.minLng, bbox.minLat],  // Close the ring
    ]],
  };
}

// ===========================================
// HELPERS
// ===========================================

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Round coordinates to reasonable precision
 */
export function roundCoords(value: number, precision: number = 6): number {
  return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
}
