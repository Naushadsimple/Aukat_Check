import yfinance as yf
import pandas as pd


def get_financials(ticker_symbol):
    ticker = yf.Ticker(ticker_symbol)

    try:
        # Income Statement
        income_stmt = ticker.financials

        if income_stmt.empty:
            print(f"\nNo financial data found for {ticker_symbol}")
            return

        print("=" * 70)
        print(f"{ticker_symbol}")
        print("=" * 70)

        # Revenue Row
        revenue_keywords = [
            "Total Revenue",
            "Operating Revenue",
            "Revenue"
        ]

        # Net Income Row
        profit_keywords = [
            "Net Income",
            "Net Income Common Stockholders"
        ]

        revenue = None
        profit = None

        for key in revenue_keywords:
            if key in income_stmt.index:
                revenue = income_stmt.loc[key]
                break

        for key in profit_keywords:
            if key in income_stmt.index:
                profit = income_stmt.loc[key]
                break

        if revenue is not None:
            print("\nAnnual Revenue\n")
            print((revenue / 1e9).round(2).astype(str) + " Billion USD")
        else:
            print("\nRevenue data not found.")

        if profit is not None:
            print("\nAnnual Net Profit\n")
            print((profit / 1e9).round(2).astype(str) + " Billion USD")
        else:
            print("\nProfit data not found.")

    except Exception as e:
        print(f"Error: {e}")


companies = {
    "Apple": "AAPL",
    "Microsoft": "MSFT",
    "NVIDIA": "NVDA"
}

for company, ticker in companies.items():
    print(f"\n\nCompany : {company}")
    get_financials(ticker)