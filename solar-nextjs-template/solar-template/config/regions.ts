// ===========================================
// REGIONS CONFIGURATION
// Solar Template - config/regions.ts
// ===========================================

// ===========================================
// TYPES
// ===========================================

export interface Region {
  id: string;
  name: string;
  canton: string;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  bounds?: {
    minLng: number;
    minLat: number;
    maxLng: number;
    maxLat: number;
  };
}

// ===========================================
// SWISS REGIONS (VALAIS)
// ===========================================

export const REGIONS: Record<string, Region> = {
  monthey: {
    id: 'monthey',
    name: 'Monthey',
    canton: 'VS',
    center: {
      lat: 46.255,
      lng: 6.954,
    },
    zoom: 14,
    bounds: {
      minLng: 6.90,
      minLat: 46.22,
      maxLng: 7.00,
      maxLat: 46.29,
    },
  },
  martigny: {
    id: 'martigny',
    name: 'Martigny',
    canton: 'VS',
    center: {
      lat: 46.102,
      lng: 7.072,
    },
    zoom: 14,
    bounds: {
      minLng: 7.02,
      minLat: 46.07,
      maxLng: 7.12,
      maxLat: 46.14,
    },
  },
  sion: {
    id: 'sion',
    name: 'Sion',
    canton: 'VS',
    center: {
      lat: 46.233,
      lng: 7.360,
    },
    zoom: 14,
    bounds: {
      minLng: 7.30,
      minLat: 46.20,
      maxLng: 7.42,
      maxLat: 46.27,
    },
  },
};

// ===========================================
// DEFAULT REGION
// ===========================================

export const DEFAULT_REGION = REGIONS.monthey;

// ===========================================
// HELPERS
// ===========================================

/**
 * Get region by ID
 */
export function getRegion(id: string): Region | undefined {
  return REGIONS[id.toLowerCase()];
}

/**
 * Get all regions as array
 */
export function getRegionList(): Region[] {
  return Object.values(REGIONS);
}

/**
 * Get region names for dropdown
 */
export function getRegionOptions(): { value: string; label: string }[] {
  return Object.values(REGIONS).map(region => ({
    value: region.id,
    label: `${region.name}, ${region.canton}`,
  }));
}
