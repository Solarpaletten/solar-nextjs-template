// ============================================================
// @solar/pricing - Main Exports
// Phase 5: Price Estimation Package
// ============================================================

// Types
export type {
    AggregatorInput,
    AggregatorOutput,
    AppliedFactor, BuildingType, CachedEstimate, DistrictCoefficients, EstimateInput,
    EstimateOutput, EstimationMethod, MLFeatures, PriceEngineOptions
} from './types.js';

// Coefficients
export {
    BERLIN_ALEX_COEFFICIENTS,
    BERLIN_MITTE_COEFFICIENTS, COEFFICIENTS_SOURCE,
    COEFFICIENTS_UPDATED, COEFFICIENTS_VERSION, DEFAULT_COEFFICIENTS, getAvailableDistricts, getCoefficients
} from './coefficients.js';

// Aggregator (Stage A)
export { PriceAggregator } from './aggregator.js';

// Engine (Orchestrator)
export { PriceEngine } from './engine.js';

// Color Scale (UI)
export {
    PRICE_COLORS, PRICE_RANGE, formatPrice,
    formatPriceSqm, getConfidenceColor, getMapboxPriceExpression,
    getPriceCategory, getPriceColor,
    getPriceColorRGB,
    getPriceColorRGBA
} from './colorScale.js';

// ML (Stage B)
export { extractFeatures, getFeatureNames } from './ml/features.js';
export { MLPredictor } from './ml/predict.js';

// USA Pricing
export { USAPriceAggregator, USA_LEGEND_ITEMS, getUSAPriceColor } from './aggregator-usa.js';
export { USA_COEFFICIENTS, getUSACoefficients } from './coefficients-usa.js';

