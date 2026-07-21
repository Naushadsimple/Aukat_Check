/**
 * Aukat Check — Currency Utilities
 * Auto-detect user locale, convert between currencies, and format values.
 */

import { CurrencyCode, CurrencyInfo, ExchangeRates } from "@/types/company";

/** Map of currency codes to display info */
export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  INR: { code: "INR", symbol: "\u20b9", name: "Indian Rupee" },
  EUR: { code: "EUR", symbol: "\u20ac", name: "Euro" },
  GBP: { code: "GBP", symbol: "\u00a3", name: "British Pound" },
  JPY: { code: "JPY", symbol: "\u00a5", name: "Japanese Yen" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  CHF: { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  CNY: { code: "CNY", symbol: "\u00a5", name: "Chinese Yuan" },
  KRW: { code: "KRW", symbol: "\u20a9", name: "South Korean Won" },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  MXN: { code: "MXN", symbol: "$", name: "Mexican Peso" },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  HKD: { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  SEK: { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  NOK: { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  DKK: { code: "DKK", symbol: "kr", name: "Danish Krone" },
  NZD: { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand" },
  AED: { code: "AED", symbol: "AED", name: "UAE Dirham" },
  SAR: { code: "SAR", symbol: "SAR", name: "Saudi Riyal" },
};

/** Map browser locale to currency code */
const LOCALE_TO_CURRENCY: Record<string, CurrencyCode> = {
  "en-US": "USD",
  "en-IN": "INR",
  "hi-IN": "INR",
  "en-GB": "GBP",
  "en-AU": "AUD",
  "en-CA": "CAD",
  "en-NZ": "NZD",
  "en-SG": "SGD",
  "en-HK": "HKD",
  "en-ZA": "ZAR",
  "de-DE": "EUR",
  "fr-FR": "EUR",
  "es-ES": "EUR",
  "it-IT": "EUR",
  "nl-NL": "EUR",
  "pt-BR": "BRL",
  "es-MX": "MXN",
  "ja-JP": "JPY",
  "ko-KR": "KRW",
  "zh-CN": "CNY",
  "sv-SE": "SEK",
  "nb-NO": "NOK",
  "da-DK": "DKK",
  "de-CH": "CHF",
  "fr-CH": "CHF",
  "ar-AE": "AED",
  "ar-SA": "SAR",
};

/**
 * Detect user's preferred currency from browser locale.
 * Falls back to USD if locale is not recognized.
 */
export function detectCurrency(): CurrencyCode {
  if (typeof navigator === "undefined") return "USD";

  const locale = navigator.language;

  // Direct locale match
  if (LOCALE_TO_CURRENCY[locale]) {
    return LOCALE_TO_CURRENCY[locale];
  }

  // Try matching just the country code (e.g., "en-IN" -> "IN")
  const parts = locale.split("-");
  if (parts.length >= 2) {
    const country = parts[1].toUpperCase();
    // Check if country code matches a currency code
    if (CURRENCIES[country]) {
      return country as CurrencyCode;
    }
  }

  return "USD";
}

/**
 * Convert a USD amount to the target currency.
 */
export function convertCurrency(
  amountUSD: number,
  targetCurrency: CurrencyCode,
  rates: ExchangeRates
): number {
  const rate = rates.rates[targetCurrency];
  if (!rate) return amountUSD; // Fallback to USD
  return amountUSD * rate;
}

/**
 * Format a number in compact notation (e.g., $391.0B, 12.4K)
 */
export function formatCompact(
  value: number,
  currencyCode: CurrencyCode = "USD"
): string {
  const info = CURRENCIES[currencyCode];
  const symbol = info?.symbol || "$";

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (absValue >= 1e12) {
    return `${sign}${symbol}${(absValue / 1e12).toFixed(1)}T`;
  }
  if (absValue >= 1e9) {
    return `${sign}${symbol}${(absValue / 1e9).toFixed(1)}B`;
  }
  if (absValue >= 1e6) {
    return `${sign}${symbol}${(absValue / 1e6).toFixed(1)}M`;
  }
  if (absValue >= 1e3) {
    return `${sign}${symbol}${(absValue / 1e3).toFixed(1)}K`;
  }
  return `${sign}${symbol}${absValue.toFixed(2)}`;
}

/**
 * Format a number with full precision and commas (for real-time counter display).
 * e.g., $1,234,567.89
 */
export function formatFull(
  value: number,
  currencyCode: CurrencyCode = "USD",
  decimals: number = 2
): string {
  const info = CURRENCIES[currencyCode];
  const symbol = info?.symbol || "$";

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${symbol}${formatted}`;
}

/**
 * Format per-second rate for display.
 * e.g., "$12,398.70/sec"
 */
export function formatPerSecond(
  ratePerSecond: number,
  currencyCode: CurrencyCode = "USD"
): string {
  return `${formatFull(ratePerSecond, currencyCode)}/sec`;
}
