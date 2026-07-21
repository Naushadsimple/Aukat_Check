"""
Aukat Check — Company List
Top ~50 companies by market cap, hardcoded and easily editable.
Each entry: (ticker, name, sector, slug)
"""

COMPANIES = [
    # Tech Giants
    ("AAPL", "Apple Inc.", "Technology", "apple"),
    ("MSFT", "Microsoft Corporation", "Technology", "microsoft"),
    ("GOOGL", "Alphabet Inc.", "Technology", "alphabet"),
    ("AMZN", "Amazon.com Inc.", "Technology", "amazon"),
    ("NVDA", "NVIDIA Corporation", "Technology", "nvidia"),
    ("META", "Meta Platforms Inc.", "Technology", "meta"),
    ("TSLA", "Tesla Inc.", "Technology", "tesla"),
    ("AVGO", "Broadcom Inc.", "Technology", "broadcom"),
    ("ORCL", "Oracle Corporation", "Technology", "oracle"),
    ("CRM", "Salesforce Inc.", "Technology", "salesforce"),
    ("ADBE", "Adobe Inc.", "Technology", "adobe"),
    ("CSCO", "Cisco Systems Inc.", "Technology", "cisco"),
    ("AMD", "Advanced Micro Devices Inc.", "Technology", "amd"),
    ("NFLX", "Netflix Inc.", "Technology", "netflix"),
    ("INTC", "Intel Corporation", "Technology", "intel"),
    ("QCOM", "Qualcomm Inc.", "Technology", "qualcomm"),
    ("TXN", "Texas Instruments Inc.", "Technology", "texas-instruments"),

    # Finance
    ("BRK-B", "Berkshire Hathaway Inc.", "Finance", "berkshire-hathaway"),
    ("JPM", "JPMorgan Chase & Co.", "Finance", "jpmorgan"),
    ("V", "Visa Inc.", "Finance", "visa"),
    ("MA", "Mastercard Inc.", "Finance", "mastercard"),
    ("GS", "Goldman Sachs Group Inc.", "Finance", "goldman-sachs"),

    # Healthcare
    ("UNH", "UnitedHealth Group Inc.", "Healthcare", "unitedhealth"),
    ("JNJ", "Johnson & Johnson", "Healthcare", "johnson-johnson"),
    ("MRK", "Merck & Co. Inc.", "Healthcare", "merck"),
    ("ABBV", "AbbVie Inc.", "Healthcare", "abbvie"),
    ("TMO", "Thermo Fisher Scientific Inc.", "Healthcare", "thermo-fisher"),
    ("ABT", "Abbott Laboratories", "Healthcare", "abbott"),
    ("DHR", "Danaher Corporation", "Healthcare", "danaher"),
    ("AMGN", "Amgen Inc.", "Healthcare", "amgen"),
    ("ISRG", "Intuitive Surgical Inc.", "Healthcare", "intuitive-surgical"),

    # Consumer
    ("WMT", "Walmart Inc.", "Consumer", "walmart"),
    ("PG", "Procter & Gamble Co.", "Consumer", "procter-gamble"),
    ("HD", "The Home Depot Inc.", "Consumer", "home-depot"),
    ("COST", "Costco Wholesale Corporation", "Consumer", "costco"),
    ("KO", "The Coca-Cola Company", "Consumer", "coca-cola"),
    ("PEP", "PepsiCo Inc.", "Consumer", "pepsico"),
    ("MCD", "McDonald's Corporation", "Consumer", "mcdonalds"),
    ("LOW", "Lowe's Companies Inc.", "Consumer", "lowes"),
    ("DIS", "The Walt Disney Company", "Consumer", "disney"),

    # Energy
    ("XOM", "Exxon Mobil Corporation", "Energy", "exxon-mobil"),

    # Industrial
    ("LIN", "Linde plc", "Industrial", "linde"),
    ("HON", "Honeywell International Inc.", "Industrial", "honeywell"),
    ("BA", "The Boeing Company", "Industrial", "boeing"),
    ("CAT", "Caterpillar Inc.", "Industrial", "caterpillar"),
    ("RTX", "RTX Corporation", "Industrial", "rtx"),
    ("ACN", "Accenture plc", "Industrial", "accenture"),

    # Utilities
    ("NEE", "NextEra Energy Inc.", "Utilities", "nextera-energy"),

    # Tobacco
    ("PM", "Philip Morris International Inc.", "Consumer", "philip-morris"),

    # Telecom
    ("CMCSA", "Comcast Corporation", "Telecom", "comcast"),
]
