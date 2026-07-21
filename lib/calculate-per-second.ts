/**
 * Aukat Check — Per-Second Calculation Utilities
 */

export const SECONDS_IN_YEAR = 365 * 24 * 60 * 60; // 31,536,000

/**
 * Calculate revenue per second from annual revenue.
 */
export function revenuePerSecond(annualRevenue: number): number {
  return annualRevenue / SECONDS_IN_YEAR;
}

/**
 * Calculate profit per second from annual net income.
 */
export function profitPerSecond(annualNetIncome: number): number {
  return annualNetIncome / SECONDS_IN_YEAR;
}

/**
 * Calculate YoY (Year-over-Year) percentage change.
 */
export function yoyChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
}

/**
 * Format YoY change for display with + or - prefix.
 * e.g., "+12.3%" or "-5.7%"
 */
export function formatYoY(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}
