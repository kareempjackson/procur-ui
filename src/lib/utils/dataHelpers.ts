/**
 * Data Helper Utilities
 *
 * Safely handle potentially undefined/null values from API responses
 */

/**
 * Safely convert a value to a number, returning 0 if invalid
 */
export function safeNumber(value: any): number {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? 0 : num;
}

/**
 * Safely get an array, returning empty array if invalid
 */
export function safeArray<T>(value: any): T[] {
  return Array.isArray(value) ? value : [];
}

/**
 * Format a number for display, showing "N/A" if invalid
 */
export function formatNumber(value: any, fallback: string = "N/A"): string {
  const num = safeNumber(value);
  return num === 0 && (value === null || value === undefined)
    ? fallback
    : num.toLocaleString();
}

/**
 * Calculate percentage safely, returning 0 if invalid
 */
export function safePercentage(numerator: any, denominator: any): number {
  const num = safeNumber(numerator);
  const den = safeNumber(denominator);

  if (den === 0) return 0;

  const result = (num / den) * 100;
  return isNaN(result) || !isFinite(result) ? 0 : Math.round(result);
}
