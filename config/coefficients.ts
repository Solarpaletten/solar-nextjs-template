// ===========================================
// PRICING COEFFICIENTS
// Solar Template - config/coefficients.ts
// ===========================================

// ===========================================
// TYPES
// ===========================================

export interface PriceCoefficients {
  basePrice: number;       // CHF/m²
  mountainView: number;    // multiplier
  trainProximity: number;  // multiplier (< 1km)
  garage: number;          // multiplier
  garden: number;          // multiplier
  commercial: number;      // multiplier
  industrial: number;      // multiplier
  newBuild: number;        // multiplier (< 5 years)
  renovation: number;      // multiplier (needs work)
}

// ===========================================
// VALAIS CANTON COEFFICIENTS
// ===========================================

export const VALAIS_COEFFICIENTS: PriceCoefficients = {
  basePrice: 7800,        // CHF/m² average for Valais
  mountainView: 1.12,     // +12% for mountain view
  trainProximity: 1.08,   // +8% near train station
  garage: 1.05,           // +5% with garage
  garden: 1.04,           // +4% with garden
  commercial: 0.85,       // -15% commercial property
  industrial: 0.65,       // -35% industrial property
  newBuild: 1.15,         // +15% new construction
  renovation: 0.85,       // -15% needs renovation
};

// ===========================================
// REGION-SPECIFIC ADJUSTMENTS
// ===========================================

export const REGION_ADJUSTMENTS: Record<string, number> = {
  monthey: 1.0,           // baseline
  martigny: 0.95,         // -5% vs Monthey
  sion: 1.10,             // +10% (cantonal capital)
};

// ===========================================
// HELPERS
// ===========================================

/**
 * Get coefficients for a region
 */
export function getCoefficients(regionId?: string): PriceCoefficients {
  const regionAdj = regionId ? (REGION_ADJUSTMENTS[regionId] || 1.0) : 1.0;
  
  return {
    ...VALAIS_COEFFICIENTS,
    basePrice: Math.round(VALAIS_COEFFICIENTS.basePrice * regionAdj),
  };
}

/**
 * Apply coefficient to price
 */
export function applyCoefficient(
  basePriceSqm: number,
  coefficient: number
): number {
  return Math.round(basePriceSqm * coefficient);
}
