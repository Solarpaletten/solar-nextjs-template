// ============================================================
// UNIT CONVERSIONS & FORMATTING - SWITZERLAND
// ============================================================

// Conversion constants
export const SQFT_PER_SQM = 10.7639;
export const SQM_PER_SQFT = 0.092903;

// ============================================================
// AREA CONVERSIONS
// ============================================================

export function sqmToSqft(sqm: number): number {
  return Math.round(sqm * SQFT_PER_SQM);
}

export function sqftToSqm(sqft: number): number {
  return Math.round(sqft * SQM_PER_SQFT);
}

// ============================================================
// FORMATTING
// ============================================================

export function formatCurrency(
  value: number,
  currency: 'EUR' | 'USD' | 'CHF',
  locale: string = 'de-CH'
): string {
  // Swiss formatting: CHF 7'800 (apostrophe as thousands separator)
  if (currency === 'CHF') {
    const formatted = new Intl.NumberFormat('de-CH', {
      maximumFractionDigits: 0,
    }).format(value);
    return `CHF ${formatted}`;
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatArea(
  value: number,
  unit: 'sqm' | 'sqft',
  locale: string = 'de-CH'
): string {
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(value);
  
  const unitLabel = unit === 'sqm' ? 'm²' : 'sqft';
  return `${formatted} ${unitLabel}`;
}

export function formatPricePerUnit(
  value: number,
  currency: 'EUR' | 'USD' | 'CHF',
  areaUnit: 'sqm' | 'sqft',
  locale: string = 'de-CH'
): string {
  const priceFormatted = formatCurrency(value, currency, locale);
  const unitLabel = areaUnit === 'sqm' ? 'm²' : 'sqft';
  return `${priceFormatted}/${unitLabel}`;
}

// ============================================================
// DISPLAY HELPERS
// ============================================================

export function getCurrencySymbol(currency: 'EUR' | 'USD' | 'CHF'): string {
  switch (currency) {
    case 'EUR': return '€';
    case 'USD': return '$';
    case 'CHF': return 'CHF';
  }
}

export function getAreaUnitLabel(unit: 'sqm' | 'sqft'): string {
  return unit === 'sqm' ? 'm²' : 'sqft';
}

// ============================================================
// SWISS-SPECIFIC FORMATTING
// ============================================================

/**
 * Format price Swiss-style with apostrophes
 * Example: 7800 → "7'800"
 */
export function formatSwissNumber(value: number): string {
  return new Intl.NumberFormat('de-CH', {
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format Swiss price per m²
 * Example: 7800 → "CHF 7'800/m²"
 */
export function formatSwissPriceSqm(value: number): string {
  return `CHF ${formatSwissNumber(value)}/m²`;
}
