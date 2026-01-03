// ===========================================
// APP CONSTANTS
// Solar Template - config/constants.ts
// ===========================================

// ===========================================
// APP INFO
// ===========================================

export const APP_NAME = 'SolarHousePrice';
export const APP_DESCRIPTION = 'Swiss Real Estate Visualization Platform';
export const APP_VERSION = '1.0.0';

// ===========================================
// LOCALE
// ===========================================

export const DEFAULT_LOCALE = 'de-CH';
export const CURRENCY = 'CHF';
export const CURRENCY_SYMBOL = 'CHF';

// ===========================================
// MAP DEFAULTS
// ===========================================

export const MAP_STYLE = 'mapbox://styles/mapbox/satellite-streets-v12';

export const MAP_DEFAULT_CENTER: [number, number] = [6.954, 46.255]; // Monthey
export const MAP_DEFAULT_ZOOM = 14;
export const MAP_MIN_ZOOM = 8;
export const MAP_MAX_ZOOM = 18;

// ===========================================
// API LIMITS
// ===========================================

export const API_DEFAULT_LIMIT = 100;
export const API_MAX_LIMIT = 1000;

export const CLUSTER_RADIUS = 60;
export const CLUSTER_MAX_ZOOM = 16;

// ===========================================
// UI CONSTANTS
// ===========================================

export const DEBOUNCE_MS = 300;
export const ANIMATION_DURATION_MS = 200;

// ===========================================
// FEATURE FLAGS
// ===========================================

export const FEATURES = {
  clustering: true,
  segmentation: true,
  priceEstimates: true,
  listings: false,        // Coming in Phase 11
  externalData: false,    // Coming in Phase 12
};
