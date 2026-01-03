// ============================================================
// @solar/pricing - Price Aggregator
// Phase 5: Stage A - Rule-based Aggregation
// ============================================================

import { prisma } from '@solar/db';
import type {
  DistrictCoefficients,
  AggregatorInput,
  AggregatorOutput,
  AppliedFactor,
} from './types.js';
import { BERLIN_ALEX_COEFFICIENTS } from './coefficients.js';

/**
 * Price Aggregator - Stage A
 *
 * Calculates price estimates using:
 * 1. Nearby listings median (if available)
 * 2. District base price (fallback)
 * 3. Building type coefficient
 * 4. Floor level coefficient
 * 5. Proximity coefficient
 */
export class PriceAggregator {
  private coefficients: DistrictCoefficients;
  private searchRadiusM: number;

  constructor(
    coefficients: DistrictCoefficients = BERLIN_ALEX_COEFFICIENTS,
    searchRadiusM: number = 500
  ) {
    this.coefficients = coefficients;
    this.searchRadiusM = searchRadiusM;
  }

  /**
   * Main estimation method
   */
  async estimate(input: AggregatorInput): Promise<AggregatorOutput> {
    const factors: AppliedFactor[] = [];

    // 1. Get nearby listings
    const nearbyListings = await this.getNearbyListings(input.centroid);
    const listingsMedian = this.calculateMedian(nearbyListings);

    // 2. Determine base price and method
    let basePriceSqm: number;
    let method: 'aggregated' | 'fallback';

    if (listingsMedian !== null && nearbyListings.length >= 3) {
      // Enough data - use aggregation
      basePriceSqm = listingsMedian;
      method = 'aggregated';
    } else {
      // Fallback to district coefficient
      basePriceSqm = this.coefficients.basePriceSqm;
      method = 'fallback';
    }

    // 3. Apply building type factor
    const typeFactor = this.getBuildingTypeFactor(input.buildingType);
    const typeImpact = basePriceSqm * (typeFactor - 1);
    factors.push({
      name: 'building_type',
      value: typeFactor,
      applied: Math.round(typeImpact),
    });

    // 4. Apply levels factor
    const levelsFactor = this.getLevelsFactor(input.buildingLevels);
    const levelsImpact = basePriceSqm * typeFactor * (levelsFactor - 1);
    factors.push({
      name: 'levels',
      value: levelsFactor,
      applied: Math.round(levelsImpact),
    });

    // 5. Apply proximity factor
    const proximityFactor = this.getProximityFactor(input.centroid);
    const proximityImpact =
      basePriceSqm * typeFactor * levelsFactor * (proximityFactor - 1);
    factors.push({
      name: 'proximity',
      value: proximityFactor,
      applied: Math.round(proximityImpact),
    });

    // 6. Calculate final price
    const finalPriceSqm = Math.round(
      basePriceSqm * typeFactor * levelsFactor * proximityFactor
    );

    const priceTotal =
      input.areaSqm !== null
        ? Math.round(finalPriceSqm * input.areaSqm)
        : null;

    // 7. Calculate confidence score
    const confidence = this.calculateConfidence(
      method,
      nearbyListings.length,
      input.areaSqm !== null
    );

    return {
      priceSqm: finalPriceSqm,
      priceTotal,
      method,
      confidence,
      details: {
        basePriceSqm,
        factors,
        nearbyListings: nearbyListings.length,
        listingsMedian,
      },
    };
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  /**
   * Get price/sqm from nearby listings using PostGIS
   */
  private async getNearbyListings(
    centroid: [number, number]
  ): Promise<number[]> {
    const [lng, lat] = centroid;

    try {
      const listings = await prisma.$queryRaw<Array<{ price_sqm: number }>>`
        SELECT 
          CASE 
            WHEN area_sqm > 0 THEN price / area_sqm 
            ELSE NULL 
          END as price_sqm
        FROM light_listings
        WHERE is_active = true
          AND expires_at > NOW()
          AND ST_DWithin(
            geometry::geography,
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)::geography,
            ${this.searchRadiusM}
          )
          AND price > 0
          AND area_sqm > 0
      `;

      return listings
        .map((l: any) => l.price_sqm)
        .filter((p: any): p is number => p !== null && p > 0);
    } catch (error) {
      // If listings table doesn't exist or query fails, return empty
      console.warn('Could not fetch nearby listings:', error);
      return [];
    }
  }

  /**
   * Calculate median of values
   */
  private calculateMedian(values: number[]): number | null {
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 !== 0
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  /**
   * Get coefficient for building type
   */
  private getBuildingTypeFactor(type: string): number {
    const normalized = type.toLowerCase();
    const types = this.coefficients.buildingType;

    if (normalized in types) {
      return types[normalized as keyof typeof types];
    }

    return types.default;
  }

  /**
   * Get coefficient for building levels
   * Bonus for buildings > 3 floors
   */
  private getLevelsFactor(levels: number | null): number {
    if (levels === null || levels <= 3) {
      return this.coefficients.levels.base;
    }

    const extraLevels = levels - 3;
    const bonus = extraLevels * this.coefficients.levels.perExtraLevel;

    return 1 + Math.min(bonus, this.coefficients.levels.maxBonus);
  }

  /**
   * Get coefficient for proximity to center
   */
  private getProximityFactor(centroid: [number, number]): number {
    const [lng, lat] = centroid;
    const [centerLng, centerLat] = this.coefficients.proximity.centerPoint;

    // Simple distance calculation (Haversine would be more accurate)
    // At Berlin latitude: 1° lng ≈ 85km, 1° lat ≈ 111km
    const kmFromCenter = Math.sqrt(
      Math.pow((lng - centerLng) * 85, 2) +
        Math.pow((lat - centerLat) * 111, 2)
    );

    const distanceFactor =
      1 + kmFromCenter * this.coefficients.proximity.perKmFromCenter;

    // TODO: Add waterBonus and parkBonus when water/park layers available

    // Minimum factor is 50% to prevent extreme penalties
    return Math.max(0.5, distanceFactor);
  }

  /**
   * Calculate confidence score (0-1)
   */
  private calculateConfidence(
    method: 'aggregated' | 'fallback',
    listingsCount: number,
    hasArea: boolean
  ): number {
    let confidence = 0.5; // base confidence

    // Method bonus
    if (method === 'aggregated') {
      confidence += 0.2;
      // More listings = more confidence (up to +15%)
      confidence += Math.min(listingsCount * 0.02, 0.15);
    }

    // Area known bonus
    if (hasArea) {
      confidence += 0.1;
    }

    // Cap at 95%
    return Math.min(confidence, 0.95);
  }
}
