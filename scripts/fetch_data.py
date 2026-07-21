"""
Aukat Check -- Data Fetcher
Fetches financial data for all companies via yfinance and writes a single consolidated data/companies.json file.

Usage: python scripts/fetch_data.py
"""

import json
import os
import sys
import time
from datetime import date

import yfinance as yf

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from companies_list import COMPANIES

SECONDS_IN_YEAR = 365 * 24 * 60 * 60  # 31,536,000
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
OUTPUT_FILE = os.path.join(DATA_DIR, "companies.json")
DELAY_BETWEEN_TICKERS = 1.5


def fetch_company_data(ticker_symbol: str, name: str, sector: str, slug: str) -> dict | None:
    try:
        ticker = yf.Ticker(ticker_symbol)
        income_stmt = ticker.financials

        if income_stmt is None or income_stmt.empty:
            print(f"  [WARN] No financial data found for {ticker_symbol}")
            return None

        revenue_row = None
        for key in ["Total Revenue", "Operating Revenue", "Revenue"]:
            if key in income_stmt.index:
                revenue_row = income_stmt.loc[key]
                break

        profit_row = None
        for key in ["Net Income", "Net Income Common Stockholders"]:
            if key in income_stmt.index:
                profit_row = income_stmt.loc[key]
                break

        if revenue_row is None or profit_row is None:
            print(f"  [WARN] Missing revenue or profit data for {ticker_symbol}")
            return None

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

            if rev != rev or ni != ni:
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

        yearly_data.sort(key=lambda x: x["fiscalYear"], reverse=True)

        latest = yearly_data[0]
        revenue_per_second = round(latest["revenue"] / SECONDS_IN_YEAR, 2)
        profit_per_second = round(latest["netIncome"] / SECONDS_IN_YEAR, 2)

        try:
            info = ticker.info
            currency = info.get("currency", "USD")
        except Exception:
            currency = "USD"

        return {
            "ticker": ticker_symbol,
            "slug": slug,
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
    os.makedirs(DATA_DIR, exist_ok=True)

    print("=" * 60)
    print("  Aukat Check -- Single Master Data Pipeline")
    print(f"  Fetching data for {len(COMPANIES)} companies")
    print("=" * 60)
    print()

    companies_data = []
    index_manifest = []
    success_count = 0
    fail_count = 0

    for i, (ticker, name, sector, slug) in enumerate(COMPANIES):
        print(f"[{i+1}/{len(COMPANIES)}] {name} ({ticker})...")

        data = fetch_company_data(ticker, name, sector, slug)

        if data:
            companies_data.append(data)
            latest = data["yearlyData"][0] if data["yearlyData"] else {}
            index_manifest.append({
                "ticker": ticker,
                "name": name,
                "sector": sector,
                "slug": slug,
                "currency": data["currency"],
                "latestRevenue": latest.get("revenue", 0),
                "latestNetIncome": latest.get("netIncome", 0),
                "latestFiscalYear": latest.get("fiscalYear", 0),
            })
            print(f"  [OK] Fetched {name} ({len(data['yearlyData'])} years)")
            success_count += 1
        else:
            fail_count += 1

        if i < len(COMPANIES) - 1:
            time.sleep(DELAY_BETWEEN_TICKERS)

    master_data = {
        "lastUpdated": date.today().isoformat(),
        "exchangeRates": fetch_exchange_rates(),
        "index": index_manifest,
        "companies": companies_data
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(master_data, f, indent=2, ensure_ascii=False)

    print(f"\n[OK] Single master JSON written -> {OUTPUT_FILE} ({success_count} companies)")


if __name__ == "__main__":
    main()
