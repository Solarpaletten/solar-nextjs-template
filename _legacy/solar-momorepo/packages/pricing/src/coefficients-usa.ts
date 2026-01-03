// ============================================================
// USA (FLORIDA) PRICING COEFFICIENTS
// Units: $/sqft
// ============================================================

export interface USACoefficients {
  base: number;  // $/sqft
  
  // Property type multipliers
  propertyType: Record<string, number>;
  
  // Waterfront multipliers
  waterfront: Record<string, number>;
  
  // Per-mile adjustment for beach proximity
  beachProximityPerMile: number;
  
  // Zip code multipliers (optional, for fine-tuning)
  zipCodes?: Record<string, number>;
}

// ============================================================
// SARASOTA COEFFICIENTS
// ============================================================

export const SARASOTA_COEFFICIENTS: USACoefficients = {
  // Base price: ~$350/sqft for average property
  base: 350,
  
  // Property types
  propertyType: {
    'condo': 1.0,
    'apartments': 0.95,
    'single_family': 1.15,
    'house': 1.15,
    'townhouse': 1.05,
    'multi_family': 0.85,
    'commercial': 0.70,
    'office': 0.80,
    'industrial': 0.50,
    'residential': 1.0,  // default
  },
  
  // Waterfront premium
  waterfront: {
    'gulf': 1.80,       // Gulf of Mexico direct
    'beach': 1.70,      // Beach access
    'bay': 1.50,        // Sarasota Bay
    'intracoastal': 1.40,
    'canal': 1.25,
    'lake': 1.15,
    'pond': 1.05,
    'none': 1.0,
  },
  
  // -2% per mile from beach
  beachProximityPerMile: -0.02,
  
  // Premium zip codes in Sarasota
  zipCodes: {
    '34236': 1.45,  // St. Armands Circle, Bird Key (luxury)
    '34242': 1.40,  // Siesta Key
    '34228': 1.35,  // Longboat Key
    '34243': 1.10,  // Sarasota-Bradenton (north)
    '34231': 1.00,  // Central Sarasota
    '34232': 0.95,  // East Sarasota
    '34234': 0.90,  // North Sarasota
    '34237': 0.95,  // Sarasota Springs
    '34238': 1.05,  // Palmer Ranch
    '34239': 1.15,  // Southgate
    '34240': 0.90,  // Fruitville
  },
};

// ============================================================
// TAMPA COEFFICIENTS
// ============================================================

export const TAMPA_COEFFICIENTS: USACoefficients = {
  // Base price: ~$280/sqft for average property
  base: 280,
  
  // Property types
  propertyType: {
    'condo': 1.0,
    'apartments': 0.90,
    'single_family': 1.10,
    'house': 1.10,
    'townhouse': 1.00,
    'multi_family': 0.80,
    'commercial': 0.65,
    'office': 0.75,
    'industrial': 0.45,
    'residential': 1.0,
  },
  
  // Waterfront premium
  waterfront: {
    'bay': 1.60,        // Tampa Bay
    'river': 1.35,      // Hillsborough River
    'intracoastal': 1.30,
    'canal': 1.20,
    'lake': 1.10,
    'none': 1.0,
  },
  
  // -1.5% per mile from water
  beachProximityPerMile: -0.015,
  
  // Premium zip codes in Tampa
  zipCodes: {
    '33606': 1.55,  // Hyde Park, Davis Islands (luxury)
    '33629': 1.45,  // Palma Ceia
    '33609': 1.35,  // South Tampa
    '33602': 1.30,  // Downtown Tampa
    '33611': 1.20,  // Ballast Point
    '33607': 1.10,  // West Tampa
    '33610': 0.85,  // East Tampa
    '33612': 0.80,  // North Tampa
    '33614': 0.90,  // Town 'n' Country
    '33616': 1.15,  // Bayshore
  },
};

// ============================================================
// COEFFICIENT REGISTRY
// ============================================================

export const USA_COEFFICIENTS: Record<string, USACoefficients> = {
  'us-fl-sarasota': SARASOTA_COEFFICIENTS,
  'us-fl-tampa': TAMPA_COEFFICIENTS,
};

export function getUSACoefficients(regionId: string): USACoefficients | null {
  return USA_COEFFICIENTS[regionId] || null;
}
