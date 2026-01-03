// ===========================================
// PRICING ENGINE
// Solar Template - lib/pricing.ts
// ===========================================

import { VALAIS_COEFFICIENTS, type PriceCoefficients } from '@/config/coefficients';

// ===========================================
// TYPES
// ===========================================

export interface PriceInput {
  areaSqm: number;
  buildingType?: string;
  region?: string;
  hasGarage?: boolean;
  hasGarden?: boolean;
  hasMountainView?: boolean;
  distanceToTrain?: number;  // meters
  yearBuilt?: number;
}

export interface PriceEstimate {
  price: number;
  priceSqm: number;
  confidence: 'low' | 'medium' | 'high';
  factors: PriceFactor[];
}

export interface PriceFactor {
  name: string;
  coefficient: number;
  impact: number;  // CHF
}

// ===========================================
// CONSTANTS
// ===========================================

const BASE_PRICE_SQM = 7800;  // CHF/m² - Valais average

// ===========================================
// PRICE CALCULATION
// ===========================================

/**
 * Calculate estimated property price
 */
export function calculatePrice(input: PriceInput): PriceEstimate {
  const coefficients = VALAIS_COEFFICIENTS;
  const factors: PriceFactor[] = [];
  
  let basePriceSqm = BASE_PRICE_SQM;
  
  // Building type coefficient
  if (input.buildingType) {
    const typeCoeff = getBuildingTypeCoefficient(input.buildingType, coefficients);
    if (typeCoeff !== 1.0) {
      const impact = basePriceSqm * (typeCoeff - 1);
      factors.push({
        name: `Building type: ${input.buildingType}`,
        coefficient: typeCoeff,
        impact: Math.round(impact * input.areaSqm),
      });
      basePriceSqm *= typeCoeff;
    }
  }
  
  // Mountain view
  if (input.hasMountainView) {
    const coeff = coefficients.mountainView;
    const impact = basePriceSqm * (coeff - 1);
    factors.push({
      name: 'Mountain view',
      coefficient: coeff,
      impact: Math.round(impact * input.areaSqm),
    });
    basePriceSqm *= coeff;
  }
  
  // Train proximity
  if (input.distanceToTrain !== undefined && input.distanceToTrain < 1000) {
    const coeff = coefficients.trainProximity;
    const impact = basePriceSqm * (coeff - 1);
    factors.push({
      name: 'Near train station',
      coefficient: coeff,
      impact: Math.round(impact * input.areaSqm),
    });
    basePriceSqm *= coeff;
  }
  
  // Garage
  if (input.hasGarage) {
    const coeff = coefficients.garage;
    const impact = basePriceSqm * (coeff - 1);
    factors.push({
      name: 'Garage',
      coefficient: coeff,
      impact: Math.round(impact * input.areaSqm),
    });
    basePriceSqm *= coeff;
  }
  
  // Garden
  if (input.hasGarden) {
    const coeff = coefficients.garden;
    const impact = basePriceSqm * (coeff - 1);
    factors.push({
      name: 'Garden',
      coefficient: coeff,
      impact: Math.round(impact * input.areaSqm),
    });
    basePriceSqm *= coeff;
  }
  
  // Calculate final price
  const priceSqm = Math.round(basePriceSqm);
  const price = Math.round(priceSqm * input.areaSqm);
  
  // Determine confidence
  const confidence = getConfidence(input, factors.length);
  
  return {
    price,
    priceSqm,
    confidence,
    factors,
  };
}

// ===========================================
// HELPERS
// ===========================================

function getBuildingTypeCoefficient(
  type: string,
  coefficients: PriceCoefficients
): number {
  const lower = type.toLowerCase();
  
  if (lower.includes('apartment') || lower === 'apartments') {
    return 1.0;
  }
  if (lower.includes('house') || lower === 'residential') {
    return 1.1;
  }
  if (lower.includes('commercial') || lower === 'retail') {
    return coefficients.commercial;
  }
  if (lower.includes('industrial')) {
    return coefficients.industrial;
  }
  
  return 1.0;
}

function getConfidence(
  input: PriceInput,
  factorCount: number
): 'low' | 'medium' | 'high' {
  // More data = higher confidence
  let score = 0;
  
  if (input.areaSqm > 0) score += 2;
  if (input.buildingType) score += 1;
  if (input.region) score += 1;
  if (factorCount >= 2) score += 1;
  if (factorCount >= 4) score += 1;
  
  if (score >= 5) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
}

// ===========================================
// FORMATTING
// ===========================================

/**
 * Format price in Swiss style: 7'800
 */
export function formatSwissPrice(price: number): string {
  return new Intl.NumberFormat('de-CH', {
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format as CHF with symbol
 */
export function formatCHF(price: number): string {
  return `CHF ${formatSwissPrice(price)}`;
}

/**
 * Format as CHF per m²
 */
export function formatPriceSqm(priceSqm: number): string {
  return `CHF ${formatSwissPrice(priceSqm)}/m²`;
}
