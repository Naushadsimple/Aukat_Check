/**
 * Aukat Check — Company Data Types
 * TypeScript interfaces matching the JSON schema from the data pipeline.
 */

export interface YearlyData {
  fiscalYear: number;
  fiscalYearEnd: string;
  revenue: number;
  netIncome: number;
}

export interface CompanyLatest {
  fiscalYear: number;
  revenuePerSecond: number;
  profitPerSecond: number;
}

export interface CompanyData {
  ticker: string;
  slug?: string;
  name: string;
  sector: string;
  currency: string;
  lastUpdated: string;
  yearlyData: YearlyData[];
  latest: CompanyLatest;
}

/** Index entry — lightweight listing for the browse page */
export interface CompanyIndex {
  ticker: string;
  name: string;
  sector: string;
  slug: string;
  currency: string;
  latestRevenue: number;
  latestNetIncome: number;
  latestFiscalYear: number;
}

/** Exchange rates data */
export interface ExchangeRates {
  baseCurrency: string;
  lastUpdated: string;
  rates: Record<string, number>;
}

/** Supported currency codes */
export type CurrencyCode = 
  | "USD" | "INR" | "EUR" | "GBP" | "JPY" 
  | "CAD" | "AUD" | "CHF" | "CNY" | "KRW"
  | "BRL" | "MXN" | "SGD" | "HKD" | "SEK"
  | "NOK" | "DKK" | "NZD" | "ZAR" | "AED" | "SAR";

/** Currency display info */
export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
}
