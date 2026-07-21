/**
 * Aukat Check — Master Data Loading Utilities
 * Pulls from the single consolidated data/companies.json master file in-memory.
 * Zero disk I/O, zero edge request overhead!
 */

import masterDataRaw from "@/data/companies.json";
import { CompanyData, CompanyIndex, ExchangeRates, MasterDataset } from "@/types/company";

const masterData = masterDataRaw as unknown as MasterDataset;

/**
 * Get all companies from the index manifest.
 * Used by the browse page to list all companies.
 */
export function getAllCompanies(): CompanyIndex[] {
  return masterData.index || [];
}

/**
 * Get detailed data for a single company by its slug.
 * Used by the company detail page.
 */
export function getCompanyBySlug(slug: string): CompanyData | null {
  const match = masterData.companies.find(
    (c) => c.slug.toLowerCase() === slug.toLowerCase()
  );
  return match || null;
}

/**
 * Get detailed data for a company by its ticker symbol.
 */
export function getCompanyByTicker(ticker: string): CompanyData | null {
  const match = masterData.companies.find(
    (c) => c.ticker.toLowerCase() === ticker.toLowerCase()
  );
  return match || null;
}

/**
 * Get all company slugs — used for static path generation.
 */
export function getAllCompanySlugs(): string[] {
  return (masterData.index || []).map((c) => c.slug);
}

/**
 * Get all company tickers — used for static path generation.
 */
export function getAllCompanyTickers(): string[] {
  return (masterData.index || []).map((c) => c.ticker);
}

/**
 * Get exchange rates data.
 */
export function getExchangeRates(): ExchangeRates {
  return masterData.exchangeRates;
}

/**
 * Get featured companies for the homepage (top 4 by revenue).
 */
export function getFeaturedCompanies(): CompanyData[] {
  const sorted = [...masterData.companies].sort(
    (a, b) => (b.yearlyData[0]?.revenue || 0) - (a.yearlyData[0]?.revenue || 0)
  );
  return sorted.slice(0, 4);
}

/**
 * Find a company index entry by slug.
 */
export function findCompanyIndex(slug: string): CompanyIndex | null {
  return (masterData.index || []).find((c) => c.slug === slug) || null;
}
