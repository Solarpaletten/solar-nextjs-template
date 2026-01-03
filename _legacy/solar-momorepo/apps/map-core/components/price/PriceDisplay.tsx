// ============================================================
// PriceDisplay Component
// Phase 5: Price visualization in map popup
// ============================================================

'use client';

import { formatPrice, formatPriceSqm, getConfidenceColor } from '@solar/pricing';

/**
 * Price estimate data from API
 */
export interface PriceEstimate {
  price_sqm: number;
  price_total: number | null;
  method: 'aggregated' | 'ml' | 'fallback';
  confidence: number;
}

/**
 * Method badge configuration
 */
const METHOD_BADGES = {
  ml: {
    label: 'ML',
    color: 'bg-purple-500',
    description: 'Machine Learning estimate',
  },
  aggregated: {
    label: 'ESTIMATE',
    color: 'bg-blue-500',
    description: 'Based on nearby listings',
  },
  fallback: {
    label: 'APPROX',
    color: 'bg-gray-500',
    description: 'District average',
  },
} as const;

/**
 * Props for PriceDisplay component
 */
interface PriceDisplayProps {
  estimate: PriceEstimate;
  showDetails?: boolean;
}

/**
 * PriceDisplay Component
 *
 * Renders price estimate in map popup with:
 * - Method badge (ML / ESTIMATE / APPROX)
 * - Confidence indicator
 * - Price per m²
 * - Total price (if available)
 */
export function PriceDisplay({ estimate, showDetails = false }: PriceDisplayProps) {
  const badge = METHOD_BADGES[estimate.method];
  const confidenceColor = getConfidenceColor(estimate.confidence);
  const confidencePercent = Math.round(estimate.confidence * 100);

  return (
    <div className="price-estimate space-y-2">
      {/* Method Badge & Confidence */}
      <div className="flex items-center justify-between">
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium text-white ${badge.color}`}
          title={badge.description}
        >
          {badge.label}
        </span>
        <span className={`text-xs ${confidenceColor}`}>
          {confidencePercent}% confidence
        </span>
      </div>

      {/* Price per m² */}
      <div className="text-2xl font-bold text-white">
        {formatPriceSqm(estimate.price_sqm)}
      </div>

      {/* Total Price */}
      {estimate.price_total && (
        <div className="text-lg text-gray-300">
          Total: {formatPrice(estimate.price_total)}
        </div>
      )}

      {/* Details (optional) */}
      {showDetails && (
        <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-600">
          <div>Method: {badge.description}</div>
          <div>Confidence: {confidencePercent}%</div>
        </div>
      )}
    </div>
  );
}

/**
 * Loading state for price display
 */
export function PriceDisplayLoading() {
  return (
    <div className="price-estimate animate-pulse space-y-2">
      <div className="h-4 w-20 bg-gray-600 rounded" />
      <div className="h-8 w-32 bg-gray-600 rounded" />
      <div className="h-6 w-28 bg-gray-600 rounded" />
    </div>
  );
}

/**
 * Error state for price display
 */
export function PriceDisplayError({ message }: { message?: string }) {
  return (
    <div className="price-estimate text-red-400 text-sm">
      <span className="block">Price unavailable</span>
      {message && <span className="text-xs text-gray-500">{message}</span>}
    </div>
  );
}

/**
 * Compact price badge for list views
 */
export function PriceBadge({ priceSqm }: { priceSqm: number }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
      {formatPriceSqm(priceSqm)}
    </span>
  );
}
