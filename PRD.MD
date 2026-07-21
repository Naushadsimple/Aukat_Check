# Aukat Check — PRD

**Tagline:** *Kitni hai unki asli Aukat — that too, per second.*

A cool/funny data-viz site: pick a company, pick a year — or hit **Realtime** and watch its revenue & profit tick up live, extrapolated from last year's actual numbers. Not a finance tool, a vibe.

---

## 1. Scope

**In (v1)**
- Browse ~50 major companies, see revenue/profit for available fiscal years
- **Realtime mode**: live per-second counter based on last reported fiscal year
- Premium, aesthetic UI: liquid glass cards, custom cursor, parallax, animated counters
- Data pre-fetched via a Python script (yfinance) → static JSON, refreshed monthly/manually — **no live API calls from the app itself**

**Out (v1)** — company comparison tool, user accounts, mobile app, dark mode. Note for later, not built now.

**Assumptions I'm locking in** (flag if you want these changed):
- Stack = Next.js + TypeScript + Tailwind + shadcn/ui + Magic UI (implied by the smooth-cursor snippet you shared)
- No database — static JSON is enough since data updates monthly at most
- "Top 50" = large-cap, primarily US-listed companies (most reliable with yfinance)
- Historical window = **last 4 fiscal years**, not 5 (see §6.1 — yfinance's free tier only exposes ~4 annual periods; getting a genuine 5th year needs a second data source, which I'd treat as a v2 nice-to-have, not a v1 blocker)

---

## 2. Core Features

### Company Detail Page (the core screen)
- Tabs: `2026` `2025` `2024` `2023` `Realtime` — years generated from whatever data exists, latest first
- **Static year tab** → big Revenue + Net Income numbers, plus a trend chart across available years
- **Realtime tab** → two counters (Revenue, Profit) that count up continuously from 0 at `latestAnnualValue ÷ secondsInYear`, animated via `requestAnimationFrame`
- Small disclaimer chip under the counters: *"Based on FY{year} filings, extrapolated per second"* — keeps it fun without misleading anyone
- Small print near the year tabs: fiscal year ≠ calendar year for some companies (e.g. Apple's FY ends in September) — show the actual fiscal-year-end date on hover so numbers aren't confusing

### Browse / Search
- Grid of company cards (logo, name, ticker, sector), simple client-side search — dataset is small enough to not need real search infra

### Homepage
- Hero + 3–4 featured companies with **mini live tickers running right on the homepage** — the "whoa" moment before the user even clicks in

---

## 3. Design System

Avoiding the generic-AI-site look (default Inter font, purple gradients, flat cards) — going for a refined fintech-premium feel with a wink, since the whole brand is a joke about corporate "aukat."

| Element | Direction |
|---|---|
| Palette | Dominant: soft sky-blue (`#EAF2FF`→`#DCEEFF`) + off-white (`#FAFBFF`); one sharp accent: solid black (`#0A0A0A`) for buttons & hero numbers; small green/red for YoY movement |
| Display font (big numbers/headlines) | Something with real character — e.g. **Fraunces** (variable serif, great numeral shapes for hero digits) — skip Inter/Arial |
| Body/UI font | Clean grotesk — e.g. **Geist** or **General Sans** |
| Numerals | `font-variant-numeric: tabular-nums` on every counter — stops digits jittering in width while ticking up |
| Cursor | Magic UI **Smooth Cursor**, global `cursor: none !important` (exactly the snippet you pasted) |
| Buttons | Solid black, Magic UI **Shimmer Button** / **Shiny Button** re-themed black+white |
| Cards | Custom **Liquid Glass** card (no off-the-shelf package exists for this exact effect) — `backdrop-filter: blur() saturate()`, faint grain texture behind the glass, animated edge-light borrowed from Magic UI **Border Beam** / **Shine Border** |
| Scroll | Framer Motion parallax — hero + section depth layers |
| Charts | shadcn **Chart** (Recharts-based) — grouped bar or area, one accent color per series, tooltip with exact ₹/$ + YoY % |

---

## 4. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Components | shadcn/ui + Magic UI |
| Animation | Framer Motion |
| Charts | shadcn Chart (Recharts) |
| Data | Static JSON, no DB, no env vars/API keys needed |
| Data pipeline | Python 3 + yfinance (offline script, not called by the live app) |
| Hosting | Vercel |

---

## 5. Real-Time Calculation Logic

```
secondsInYear      = 365 * 24 * 60 * 60        // 31,536,000
revenuePerSecond    = latestAnnualRevenue  / secondsInYear
profitPerSecond     = latestAnnualNetIncome / secondsInYear

// per animation frame on the client:
counter += ratePerSecond * (deltaTimeMs / 1000)
```
Counter resets to 0 each time the Realtime tab is opened — it's a "watch it grow" effect, not a running-since-forever total.

---

## 6. Data Pipeline (Python)

### 6.1 The yfinance reality check
`Ticker.income_stmt` / `.financials` only returns **the last ~4 annual periods** on the free tier — Yahoo doesn't expose a clean 5th year through this endpoint. Plan builds around **4 years** as the honest default. If you truly want a 5th year later, that means a second source (manual backfill from somewhere like stockanalysis.com, or a paid data provider) — worth flagging as a v2 item rather than blocking launch on it.

### 6.2 `scripts/fetch_data.py`
For each ticker in the default list:
1. Pull `Total Revenue` + `Net Income` from the annual income statement
2. Compute `revenuePerSecond` / `profitPerSecond` from the latest year
3. Write `data/companies/{slug}.json`
4. Log + skip (don't crash) on failures — some tickers delist/rename
5. Small delay (~1s) between tickers to avoid Yahoo rate-limiting on a 50-ticker run

### 6.3 JSON schema — one file per company
```json
{
  "ticker": "AAPL",
  "name": "Apple Inc.",
  "sector": "Technology",
  "currency": "USD",
  "lastUpdated": "2026-07-01",
  "yearlyData": [
    { "fiscalYear": 2025, "fiscalYearEnd": "2025-09-27", "revenue": 391035000000, "netIncome": 93736000000 },
    { "fiscalYear": 2024, "fiscalYearEnd": "2024-09-28", "revenue": 383285000000, "netIncome": 96995000000 }
  ],
  "latest": { "fiscalYear": 2025, "revenuePerSecond": 12398.7, "profitPerSecond": 2971.3 }
}
```

### 6.4 Default company list
Top 50 by market cap, hardcoded (and easily editable) in `scripts/companies_list.py` — e.g. `AAPL, MSFT, GOOGL, AMZN, NVDA, META, TSLA, BRK-B, JPM, V, WMT, MA, UNH, XOM …` (full 50 lives in that file, not worth listing all here).

### 6.5 Refresh cadence
Manual run (`python scripts/fetch_data.py`) whenever — monthly is already overkill since annual filings barely move.

---

## 7. Project Structure

```
aukat-check/
├── app/
│   ├── page.tsx                    # Home — hero + featured live tickers
│   ├── companies/page.tsx          # Browse all
│   ├── company/[ticker]/page.tsx   # Detail: year tabs + Realtime
│   └── layout.tsx
├── components/
│   ├── ui/                         # shadcn primitives
│   ├── magicui/                    # smooth-cursor, number-ticker, shimmer-button, border-beam...
│   └── custom/
│       ├── liquid-glass-card.tsx
│       ├── realtime-counter.tsx
│       ├── revenue-chart.tsx
│       └── year-tabs.tsx
├── lib/
│   ├── calculate-per-second.ts
│   └── companies-meta.ts           # display names, logos, sectors
├── data/companies/                 # apple.json, microsoft.json, nvidia.json ...
├── scripts/
│   ├── fetch_data.py
│   ├── companies_list.py
│   └── requirements.txt
└── types/company.ts
```

---

## 8. Page Map

| Route | Purpose |
|---|---|
| `/` | Hero, tagline, 3–4 live featured tickers, browse CTA |
| `/companies` | Full searchable grid |
| `/company/[ticker]` | Year tabs, Realtime tab, trend chart, glass cards |

---

## 9. Build Order

1. Python pipeline first — get real JSON for all 50 companies before touching UI
2. Static shell — theme tokens, layout, shadcn install
3. Custom components — glass card, cursor, counters, chart
4. Company detail page + Realtime logic
5. Homepage polish + parallax
6. Deploy to Vercel

---

## 10. Later, Not Now
- Compare two companies side by side
- True 5-year history via a second data source
- Dark mode
- Share-a-card (export a company's realtime card as an image)