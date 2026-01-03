// ===========================================
// UTILITY FUNCTIONS
// Solar Template - lib/utils.ts
// ===========================================

import { type ClassValue, clsx } from 'clsx';

// ===========================================
// CLASSNAME HELPERS
// ===========================================

/**
 * Merge class names (for Tailwind)
 * Simple implementation without twMerge
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// ===========================================
// NUMBER FORMATTING (SWISS)
// ===========================================

/**
 * Format number in Swiss style: 7'800
 */
export function formatSwissNumber(value: number, decimals: number = 0): string {
  return new Intl.NumberFormat('de-CH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format area in m²
 */
export function formatArea(sqm: number): string {
  return `${formatSwissNumber(sqm, 0)} m²`;
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${formatSwissNumber(value * 100, decimals)}%`;
}

// ===========================================
// DATE FORMATTING
// ===========================================

/**
 * Format date in Swiss style: 03.01.2026
 */
export function formatSwissDate(date: Date): string {
  return new Intl.DateTimeFormat('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Format datetime
 */
export function formatSwissDateTime(date: Date): string {
  return new Intl.DateTimeFormat('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// ===========================================
// STRING HELPERS
// ===========================================

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate slug from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ===========================================
// VALIDATION
// ===========================================

/**
 * Check if value is a valid number
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Check if value is a non-empty string
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

// ===========================================
// ARRAY HELPERS
// ===========================================

/**
 * Group array by key
 */
export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<K, T[]>);
}

/**
 * Get unique values
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

// ===========================================
// ASYNC HELPERS
// ===========================================

/**
 * Sleep for ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  ms: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  
  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}
