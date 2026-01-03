// ============================================================
// SWITZERLAND PRICE AGGREGATOR
// Stage A: Rule-based estimation for Valais
// Units: CHF/m²
// ============================================================

import { getCHCoefficients, CHCoefficients } from './coefficients-ch';

// ============================================================
// TYPES
// ============================================================

export interface CHPriceInput {
  regionId: string;
  areaSqm?: number | null;
  buildingType?: string;
  buildingLevels?: number | null;
  centroid?: [number, number];  // [lng, lat]
  hasMountainView?: boolean;
  nearTrainStation?: boolean;
  nearIndustrial?: boolean;
}

export interface CHPriceEstimate {
  priceSqm: number;
  totalPrice: number | null;
  currency: 'CHF';
  unit: 'm²';
  confidence: number;
  method: 'aggregated' | 'fallback';
  breakdown: {
    base: number;
    typeMultiplier: number;
    levelAdjustment: number;
    proximityAdjustment: number;
  };
}

// ============================================================
// AGGREGATOR CLASS
// ============================================================

export class CHPriceAggregator {
  private defaultCoefficients: CHCoefficients = {
    base: 7500,
    buildingType: { 'residential': 1.0 },
    levels: { base: 1.0, perExtraLevel: 0.015, maxBonus: 0.12 },
    proximity: { mountainViewBonus: 0.05, trainStationBonus: 0.04, industrialPenalty: -0.08 },
  };

  /**
   * Estimate price for a Swiss property
   */
  estimate(input: CHPriceInput): CHPriceEstimate {
    const coef = getCHCoefficients(input.regionId) || this.defaultCoefficients;
    
    // Start with base price
    let price = coef.base;
    
    // Building type multiplier
    const typeMultiplier = this.getTypeMultiplier(coef, input.buildingType);
    price *= typeMultiplier;
    
    // Level adjustment
    const levelAdjustment = this.getLevelAdjustment(coef, input.buildingLevels);
    price *= levelAdjustment;
    
    // Proximity adjustment
    const proximityAdjustment = this.getProximityAdjustment(coef, input);
    price *= proximityAdjustment;
    
    // Round to nearest 10 CHF
    const priceSqm = Math.round(price / 10) * 10;
    
    // Calculate total if area provided
    const totalPrice = input.areaSqm ? Math.round(priceSqm * input.areaSqm) : null;
    
    return {
      priceSqm,
      totalPrice,
      currency: 'CHF',
      unit: 'm²',
      confidence: this.calculateConfidence(input),
      method: 'aggregated',
      breakdown: {
        base: coef.base,
        typeMultiplier,
        levelAdjustment,
        proximityAdjustment,
      },
    };
  }

  // ============================================================
  // MULTIPLIER CALCULATIONS
  // ============================================================

  private getTypeMultiplier(coef: CHCoefficients, buildingType?: string): number {
    if (!buildingType) return 1.0;
    const normalized = buildingType.toLowerCase().replace(/[^a-z]/g, '');
    return coef.buildingType[normalized] || coef.buildingType['residential'] || 1.0;
  }

  private getLevelAdjustment(coef: CHCoefficients, levels?: number | null): number {
    if (!levels || levels <= 2) return coef.levels.base;
    
    // +perExtraLevel per floor above 2, capped at maxBonus
    const extraLevels = levels - 2;
    const bonus = Math.min(extraLevels * coef.levels.perExtraLevel, coef.levels.maxBonus);
    return coef.levels.base + bonus;
  }

  private getProximityAdjustment(coef: CHCoefficients, input: CHPriceInput): number {
    let adjustment = 1.0;
    
    if (input.hasMountainView) {
      adjustment += coef.proximity.mountainViewBonus;
    }
    
    if (input.nearTrainStation) {
      adjustment += coef.proximity.trainStationBonus;
    }
    
    if (input.nearIndustrial) {
      adjustment += coef.proximity.industrialPenalty;  // negative value
    }
    
    return Math.max(0.7, Math.min(1.3, adjustment));  // Cap between 0.7 and 1.3
  }

  // ============================================================
  // CONFIDENCE CALCULATION
  // ============================================================

  private calculateConfidence(input: CHPriceInput): number {
    let confidence = 0.55;  // Base confidence
    
    if (input.buildingType) confidence += 0.10;
    if (input.areaSqm) confidence += 0.10;
    if (input.buildingLevels) confidence += 0.05;
    if (input.hasMountainView !== undefined) confidence += 0.05;
    if (input.nearTrainStation !== undefined) confidence += 0.05;
    
    return Math.min(0.90, confidence);
  }
}

// ============================================================
// COLOR SCALE FOR SWITZERLAND (CHF/m²)
// ============================================================

export const CH_PRICE_RANGES = {
  budget: 6000,      // < 6'000 CHF/m² (blue)
  average: 8000,     // 6'000-8'000 (green)
  aboveAvg: 10000,   // 8'000-10'000 (yellow)
  premium: 12000,    // 10'000-12'000 (orange)
  luxury: 12000,     // > 12'000 (red)
};

export function getCHPriceColor(priceSqm: number): string {
  if (priceSqm < CH_PRICE_RANGES.budget) return '#3b82f6';   // blue
  if (priceSqm < CH_PRICE_RANGES.average) return '#22c55e';  // green
  if (priceSqm < CH_PRICE_RANGES.aboveAvg) return '#eab308'; // yellow
  if (priceSqm < CH_PRICE_RANGES.premium) return '#f97316';  // orange
  return '#ef4444';  // red
}

export const CH_LEGEND_ITEMS = [
  { color: '#3b82f6', label: "< CHF 6'000/m²", category: 'Budget' },
  { color: '#22c55e', label: "CHF 6'000-8'000", category: 'Average' },
  { color: '#eab308', label: "CHF 8'000-10'000", category: 'Above avg' },
  { color: '#f97316', label: "CHF 10'000-12'000", category: 'Premium' },
  { color: '#ef4444', label: "> CHF 12'000/m²", category: 'Luxury' },
];
