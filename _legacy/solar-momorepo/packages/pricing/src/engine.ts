// ============================================================
// @solar/pricing - Price Engine
// Phase 5: Orchestrator for Stage A & B
// ============================================================

import { PriceAggregator } from './aggregator.js';
import { MLPredictor } from './ml/predict.js';
import { extractFeatures } from './ml/features.js';
import { BERLIN_ALEX_COEFFICIENTS } from './coefficients.js';
import type {
  EstimateInput,
  EstimateOutput,
  PriceEngineOptions,
  DistrictCoefficients,
} from './types.js';

/**
 * Default engine options
 */
const DEFAULT_OPTIONS: PriceEngineOptions = {
  useML: false, // ML disabled by default until trained
  cacheEnabled: true,
  cacheTTLHours: 24,
  searchRadiusM: 500,
};

/**
 * Price Engine - Main orchestrator
 *
 * Combines:
 * - Stage A: Aggregation (rule-based)
 * - Stage B: ML prediction (when enabled)
 *
 * Automatically falls back to simpler methods
 * if more sophisticated ones fail.
 */
export class PriceEngine {
  private options: PriceEngineOptions;
  private aggregator: PriceAggregator;
  private mlPredictor: MLPredictor | null = null;

  constructor(
    options: Partial<PriceEngineOptions> = {},
    coefficients: DistrictCoefficients = BERLIN_ALEX_COEFFICIENTS
  ) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.aggregator = new PriceAggregator(
      coefficients,
      this.options.searchRadiusM
    );

    // Initialize ML predictor if enabled
    if (this.options.useML) {
      try {
        this.mlPredictor = new MLPredictor();
      } catch (error) {
        console.warn('ML predictor not available:', error);
        this.mlPredictor = null;
      }
    }
  }

  /**
   * Estimate price for a single house
   */
  async estimate(input: EstimateInput): Promise<EstimateOutput> {
    // Stage A: Always run aggregation first
    const aggregated = await this.aggregator.estimate(input);

    // Stage B: Try ML if enabled and available
    if (this.options.useML && this.mlPredictor) {
      try {
        const mlResult = await this.estimateWithML(input, aggregated);
        if (mlResult) {
          return mlResult;
        }
      } catch (error) {
        console.warn('ML estimation failed, using aggregation:', error);
      }
    }

    // Return aggregation result
    return {
      priceSqm: aggregated.priceSqm,
      priceTotal: aggregated.priceTotal,
      method: aggregated.method,
      confidence: aggregated.confidence,
      details: aggregated.details,
    };
  }

  /**
   * Estimate prices for multiple houses
   */
  async estimateBulk(inputs: EstimateInput[]): Promise<EstimateOutput[]> {
    // Process in parallel with concurrency limit
    const BATCH_SIZE = 10;
    const results: EstimateOutput[] = [];

    for (let i = 0; i < inputs.length; i += BATCH_SIZE) {
      const batch = inputs.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((input) => this.estimate(input))
      );
      results.push(...batchResults);
    }

    return results;
  }

  /**
   * ML estimation (Stage B)
   */
  private async estimateWithML(
    input: EstimateInput,
    aggregated: Awaited<ReturnType<PriceAggregator['estimate']>>
  ): Promise<EstimateOutput | null> {
    if (!this.mlPredictor) return null;

    // Extract features
    const features = extractFeatures(
      {
        areaSqm: input.areaSqm,
        buildingType: input.buildingType,
        buildingLevels: input.buildingLevels,
        centroid: input.centroid,
      },
      aggregated
    );

    // Get ML prediction
    const mlPriceSqm = this.mlPredictor.predict(features);
    const mlConfidence = this.mlPredictor.getConfidence(features);

    // Sanity check: ML price should be within reasonable range
    const ratio = mlPriceSqm / aggregated.priceSqm;
    if (ratio < 0.5 || ratio > 2.0) {
      console.warn('ML prediction out of range, falling back to aggregation');
      return null;
    }

    const priceTotal =
      input.areaSqm !== null
        ? Math.round(mlPriceSqm * input.areaSqm)
        : null;

    return {
      priceSqm: mlPriceSqm,
      priceTotal,
      method: 'ml',
      confidence: mlConfidence,
      details: {
        ...aggregated.details,
        mlFeatures: features,
        aggregatedPriceSqm: aggregated.priceSqm,
      },
    };
  }

  /**
   * Get current configuration
   */
  getOptions(): PriceEngineOptions {
    return { ...this.options };
  }

  /**
   * Check if ML is available
   */
  isMLAvailable(): boolean {
    return this.mlPredictor !== null;
  }
}
