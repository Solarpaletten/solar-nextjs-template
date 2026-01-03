// ============================================================
// SWITZERLAND (VALAIS) PRICING COEFFICIENTS
// Units: CHF/m²
// ============================================================

export interface CHCoefficients {
  base: number;  // CHF/m²
  
  // Building type multipliers
  buildingType: Record<string, number>;
  
  // Levels adjustment
  levels: {
    base: number;
    perExtraLevel: number;
    maxBonus: number;
  };
  
  // Proximity bonuses/penalties
  proximity: {
    mountainViewBonus: number;
    trainStationBonus: number;
    industrialPenalty: number;
  };
}

// ============================================================
// MONTHEY COEFFICIENTS (Valais)
// ============================================================

export const MONTHEY_COEFFICIENTS: CHCoefficients = {
  // Base price: CHF 7'800/m² for Monthey area
  base: 7800,
  
  // Building types
  buildingType: {
    'residential': 1.0,
    'house': 1.0,
    'apartments': 1.08,
    'mixed': 1.05,
    'commercial': 1.15,
    'office': 1.12,
    'retail': 1.10,
    'yes': 1.0,  // OSM default
  },
  
  // Floor levels
  levels: {
    base: 1.0,
    perExtraLevel: 0.015,  // +1.5% per floor above 2
    maxBonus: 0.12,        // max +12%
  },
  
  // Location proximity
  proximity: {
    mountainViewBonus: 0.06,    // +6% for mountain view
    trainStationBonus: 0.04,   // +4% near station
    industrialPenalty: -0.10,  // -10% near industrial
  },
};

// ============================================================
// MARTIGNY COEFFICIENTS
// ============================================================

export const MARTIGNY_COEFFICIENTS: CHCoefficients = {
  base: 7200,  // Slightly lower than Monthey
  
  buildingType: {
    'residential': 1.0,
    'house': 1.0,
    'apartments': 1.06,
    'mixed': 1.04,
    'commercial': 1.12,
    'office': 1.10,
    'retail': 1.08,
    'yes': 1.0,
  },
  
  levels: {
    base: 1.0,
    perExtraLevel: 0.012,
    maxBonus: 0.10,
  },
  
  proximity: {
    mountainViewBonus: 0.05,
    trainStationBonus: 0.05,  // Higher - main train hub
    industrialPenalty: -0.08,
  },
};

// ============================================================
// SION COEFFICIENTS (Valais Capital)
// ============================================================

export const SION_COEFFICIENTS: CHCoefficients = {
  base: 8500,  // Higher - capital city
  
  buildingType: {
    'residential': 1.0,
    'house': 1.02,
    'apartments': 1.10,
    'mixed': 1.06,
    'commercial': 1.18,
    'office': 1.15,
    'retail': 1.12,
    'yes': 1.0,
  },
  
  levels: {
    base: 1.0,
    perExtraLevel: 0.018,
    maxBonus: 0.15,
  },
  
  proximity: {
    mountainViewBonus: 0.08,
    trainStationBonus: 0.06,
    industrialPenalty: -0.12,
  },
};

// ============================================================
// COEFFICIENT REGISTRY
// ============================================================

export const CH_COEFFICIENTS: Record<string, CHCoefficients> = {
  'ch-monthey': MONTHEY_COEFFICIENTS,
  'ch-martigny': MARTIGNY_COEFFICIENTS,
  'ch-sion': SION_COEFFICIENTS,
};

export function getCHCoefficients(regionId: string): CHCoefficients | null {
  return CH_COEFFICIENTS[regionId] || null;
}
