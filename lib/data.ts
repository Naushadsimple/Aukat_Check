/**
 * Aukat Check — Data Loading Utilities
 * Functions to load company JSON data at build time (server-side).
 */

import fs from "fs";
import path from "path";
import { CompanyData, CompanyIndex, ExchangeRates } from "@/types/company";

const DATA_DIR = path.join(process.cwd(), "data", "companies");

/**
 * Get all companies from the index manifest.
 * Used by the browse page to list all companies.
 */
export function getAllCompanies(): CompanyIndex[] {
  const indexPath = path.join(DATA_DIR, "index.json");
  const raw = fs.readFileSync(indexPath, "utf-8");
  return JSON.parse(raw) as CompanyIndex[];
}

/**
 * Get detailed data for a single company by its slug.
 * Used by the company detail page.
 */
export function getCompanyBySlug(slug: string): CompanyData | null {
  const filePath = path.join(DATA_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw) as CompanyData;
  return { ...data, slug };
}

/**
 * Get detailed data for a company by its ticker symbol.
 */
export function getCompanyByTicker(ticker: string): CompanyData | null {
  const companies = getAllCompanies();
  const match = companies.find(
    (c) => c.ticker.toLowerCase() === ticker.toLowerCase()
  );
  if (!match) return null;
  return getCompanyBySlug(match.slug);
}

/**
 * Get all company slugs — used for static path generation.
 */
export function getAllCompanySlugs(): string[] {
  const companies = getAllCompanies();
  return companies.map((c) => c.slug);
}

/**
 * Get all company tickers — used for static path generation.
 */
export function getAllCompanyTickers(): string[] {
  const companies = getAllCompanies();
  return companies.map((c) => c.ticker);
}

/**
 * Get exchange rates data.
 */
export function getExchangeRates(): ExchangeRates {
  const ratesPath = path.join(DATA_DIR, "exchange_rates.json");
  const raw = fs.readFileSync(ratesPath, "utf-8");
  return JSON.parse(raw) as ExchangeRates;
}

/**
 * Get featured companies for the homepage (top 4 by revenue).
 */
export function getFeaturedCompanies(): CompanyData[] {
  const companies = getAllCompanies();
  // Sort by latest revenue descending, take top 4
  const featured = companies
    .sort((a, b) => b.latestRevenue - a.latestRevenue)
    .slice(0, 4);

  return featured
    .map((c) => getCompanyBySlug(c.slug))
    .filter((c): c is CompanyData => c !== null);
}

/**
 * Find a company index entry by slug.
 */
export function findCompanyIndex(slug: string): CompanyIndex | null {
  const companies = getAllCompanies();
  return companies.find((c) => c.slug === slug) || null;
}
