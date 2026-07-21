"""
Aukat Check -- Data Fetcher
Fetches financial data for all companies via yfinance and writes per-company JSON files.
Also generates an index.json manifest and exchange_rates.json for currency conversion.

Usage: python scripts/fetch_data.py
"""

import json
import os
import sys
import time
from datetime import datetime, date

import yfinance as yf

# Add scripts dir to path so we can import companies_list
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from companies_list import COMPANIES


# Constants
SECONDS_IN_YEAR = 365 * 24 * 60 * 60  # 31,536,000
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "companies")
DELAY_BETWEEN_TICKERS = 1.5  # seconds, to avoid Yahoo rate-limiting


def fetch_company_data(ticker_symbol: str, name: str, sector: str) -> dict | None:
    """Fetch financial data for a single company."""
    try:
        ticker = yf.Ticker(ticker_symbol)
        income_stmt = ticker.financials

        if income_stmt is None or income_stmt.empty:
            print(f"  [WARN] No financial data found for {ticker_symbol}")
            return None

        # Find revenue row
        revenue_row = None
        for key in ["Total Revenue", "Operating Revenue", "Revenue"]:
            if key in income_stmt.index:
                revenue_row = income_stmt.loc[key]
                break

        # Find net income row
        profit_row = None
        for key in ["Net Income", "Net Income Common Stockholders"]:
            if key in income_stmt.index:
                profit_row = income_stmt.loc[key]
                break

        if revenue_row is None or profit_row is None:
            print(f"  [WARN] Missing revenue or profit data for {ticker_symbol}")
            return None

        # Build yearly data (columns are dates, newest first)
        yearly_data = []
        for col in income_stmt.columns:
            fiscal_year_end = col
            if hasattr(fiscal_year_end, 'strftime'):
                fy_end_str = fiscal_year_end.strftime("%Y-%m-%d")
                fiscal_year = fiscal_year_end.year
            else:
                fy_end_str = str(fiscal_year_end)
                fiscal_year = int(str(fiscal_year_end)[:4])

            rev = revenue_row[col]
            ni = profit_row[col]

            # Skip if NaN
            if rev != rev or ni != ni:  # NaN check
                continue

            yearly_data.append({
                "fiscalYear": fiscal_year,
                "fiscalYearEnd": fy_end_str,
                "revenue": int(rev),
                "netIncome": int(ni),
            })

        if not yearly_data:
            print(f"  [WARN] No valid yearly data for {ticker_symbol}")
            return None

        # Sort by fiscal year descending (newest first)
        yearly_data.sort(key=lambda x: x["fiscalYear"], reverse=True)

        # Compute per-second rates from latest year
        latest = yearly_data[0]
        revenue_per_second = round(latest["revenue"] / SECONDS_IN_YEAR, 2)
        profit_per_second = round(latest["netIncome"] / SECONDS_IN_YEAR, 2)

        # Get currency info from ticker info
        try:
            info = ticker.info
            currency = info.get("currency", "USD")
        except Exception:
            currency = "USD"

        return {
            "ticker": ticker_symbol,
            "name": name,
            "sector": sector,
            "currency": currency,
            "lastUpdated": date.today().isoformat(),
            "yearlyData": yearly_data,
            "latest": {
                "fiscalYear": latest["fiscalYear"],
                "revenuePerSecond": revenue_per_second,
                "profitPerSecond": profit_per_second,
            }
        }

    except Exception as e:
        print(f"  [FAIL] Error fetching {ticker_symbol}: {e}")
        return None


def fetch_exchange_rates() -> dict:
    """
    Fetch approximate exchange rates from USD to major currencies.
    Uses a static set of approximate rates since we don't want live API calls.
    These can be manually updated periodically.
    """
    # Approximate rates as of mid-2026 (update manually)
    return {
        "baseCurrency": "USD",
        "lastUpdated": date.today().isoformat(),
        "rates": {
            "USD": 1.0,
            "INR": 84.5,
            "EUR": 0.92,
            "GBP": 0.79,
            "JPY": 157.5,
            "CAD": 1.37,
            "AUD": 1.53,
            "CHF": 0.88,
            "CNY": 7.25,
            "KRW": 1380.0,
            "BRL": 5.15,
            "MXN": 17.2,
            "SGD": 1.34,
            "HKD": 7.82,
            "SEK": 10.5,
            "NOK": 10.7,
            "DKK": 6.85,
            "NZD": 1.63,
            "ZAR": 18.5,
            "AED": 3.67,
            "SAR": 3.75,
        }
    }


def main():
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print("=" * 60)
    print("  Aukat Check -- Data Pipeline")
    print(f"  Fetching data for {len(COMPANIES)} companies")
    print("=" * 60)
    print()

    index = []
    success_count = 0
    fail_count = 0

    for i, (ticker, name, sector, slug) in enumerate(COMPANIES):
        print(f"[{i+1}/{len(COMPANIES)}] {name} ({ticker})...")

        data = fetch_company_data(ticker, name, sector)

        if data:
            # Write individual company JSON
            filepath = os.path.join(OUTPUT_DIR, f"{slug}.json")
            with open(filepath, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)

            # Add to index
            latest = data["yearlyData"][0] if data["yearlyData"] else {}
            index.append({
                "ticker": ticker,
                "name": name,
                "sector": sector,
                "slug": slug,
                "currency": data["currency"],
                "latestRevenue": latest.get("revenue", 0),
                "latestNetIncome": latest.get("netIncome", 0),
                "latestFiscalYear": latest.get("fiscalYear", 0),
            })

            print(f"  [OK] Saved -> {slug}.json ({len(data['yearlyData'])} years)")
            success_count += 1
        else:
            fail_count += 1

        # Delay to avoid rate limiting (skip on last one)
        if i < len(COMPANIES) - 1:
            time.sleep(DELAY_BETWEEN_TICKERS)

    # Write index.json
    index_path = os.path.join(OUTPUT_DIR, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    print(f"\n[OK] Index written -> index.json ({len(index)} companies)")

    # Write exchange rates
    rates = fetch_exchange_rates()
    rates_path = os.path.join(OUTPUT_DIR, "exchange_rates.json")
    with open(rates_path, "w", encoding="utf-8") as f:
        json.dump(rates, f, indent=2, ensure_ascii=False)
    print(f"[OK] Exchange rates written -> exchange_rates.json")

    # Summary
    print()
    print("=" * 60)
    print(f"  Done! {success_count} succeeded, {fail_count} failed")
    print(f"  Output: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
