// ============================================================
// @solar/pricing - Color Scale
// Phase 5: UI Color Gradient for Price Visualization
// ============================================================

/**
 * Price range for Berlin (€/m²)
 */
export const PRICE_RANGE = {
  min: 4000, // budget
  max: 12000, // premium
  average: 6500, // district average
};

/**
 * Color palette for price visualization
 * Cold (blue) → Warm (red)
 * Designed to work with satellite map overlay
 */
export const PRICE_COLORS = {
  veryLow: '#3b82f6', // blue - very cheap
  low: '#22c55e', // green - below average
  average: '#eab308', // yellow - average
  high: '#f97316', // orange - above average
  veryHigh: '#ef4444', // red - premium
};

/**
 * Get color for a given price per square meter
 *
 * @param priceSqm - Price in €/m²
 * @returns Hex color string
 *
 * @example
 * getPriceColor(4000)  // '#3b82f6' (blue)
 * getPriceColor(6500)  // '#eab308' (yellow)
 * getPriceColor(12000) // '#ef4444' (red)
 */
export function getPriceColor(priceSqm: number): string {
  const { min, max } = PRICE_RANGE;

  // Normalize to 0-1 range
  const normalized = Math.max(0, Math.min(1, (priceSqm - min) / (max - min)));

  // Map to color array
  const colors = [
    PRICE_COLORS.veryLow,
    PRICE_COLORS.low,
    PRICE_COLORS.average,
    PRICE_COLORS.high,
    PRICE_COLORS.veryHigh,
  ];

  const index = Math.floor(normalized * (colors.length - 1));
  return colors[Math.min(index, colors.length - 1)];
}

/**
 * Get RGB values for a price (for Mapbox expressions)
 *
 * @param priceSqm - Price in €/m²
 * @returns [r, g, b] array
 */
export function getPriceColorRGB(priceSqm: number): [number, number, number] {
  const hex = getPriceColor(priceSqm);
  return hexToRGB(hex);
}

/**
 * Get color with opacity for a price
 *
 * @param priceSqm - Price in €/m²
 * @param opacity - Opacity 0-1
 * @returns rgba string
 */
export function getPriceColorRGBA(priceSqm: number, opacity: number): string {
  const [r, g, b] = getPriceColorRGB(priceSqm);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Generate Mapbox fill-color expression for price-based coloring
 *
 * @returns Mapbox expression for fill-color property
 */
export function getMapboxPriceExpression(): unknown[] {
  return [
    'interpolate',
    ['linear'],
    ['get', 'price_sqm'],
    PRICE_RANGE.min,
    PRICE_COLORS.veryLow,
    5000,
    PRICE_COLORS.low,
    PRICE_RANGE.average,
    PRICE_COLORS.average,
    9000,
    PRICE_COLORS.high,
    PRICE_RANGE.max,
    PRICE_COLORS.veryHigh,
  ];
}

/**
 * Get price category label
 *
 * @param priceSqm - Price in €/m²
 * @returns Category label
 */
export function getPriceCategory(
  priceSqm: number
): 'budget' | 'affordable' | 'average' | 'premium' | 'luxury' {
  if (priceSqm < 4500) return 'budget';
  if (priceSqm < 5500) return 'affordable';
  if (priceSqm < 7500) return 'average';
  if (priceSqm < 10000) return 'premium';
  return 'luxury';
}

/**
 * Get confidence color
 *
 * @param confidence - Confidence score 0-1
 * @returns Tailwind color class
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.7) return 'text-green-400';
  if (confidence >= 0.5) return 'text-yellow-400';
  return 'text-red-400';
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Convert hex color to RGB array
 */
function hexToRGB(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return [128, 128, 128]; // gray fallback
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/**
 * Format price for display
 *
 * @param price - Price in €
 * @returns Formatted string
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format price per sqm for display
 *
 * @param priceSqm - Price in €/m²
 * @returns Formatted string
 */
export function formatPriceSqm(priceSqm: number): string {
  return `${formatPrice(priceSqm)}/m²`;
}
