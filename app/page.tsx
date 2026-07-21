import Link from 'next/link';
import { getFeaturedCompanies, getAllCompanies } from '@/lib/data';
import { MiniTicker } from '@/components/custom/mini-ticker';
import { LiquidGlassCard } from '@/components/custom/liquid-glass-card';

export default function HomePage() {
  const featured = getFeaturedCompanies();
  const allCompanies = getAllCompanies();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto py-12 md:py-20 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-white text-xs font-mono font-semibold mb-6 shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Realtime Corporate Extrapolator
        </div>

        <h1 className="font-serif font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-neutral-900 tracking-tight leading-none mb-6">
          Aukat Check
        </h1>

        <p className="font-serif italic text-2xl sm:text-3xl text-neutral-700 font-normal mb-8">
          &ldquo;Kitni hai unki asli Aukat &mdash; that too, per second.&rdquo;
        </p>

        <p className="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed mb-10">
          Not a financial tool, a vibe. Watch revenue & net income tick up live every second, extrapolated from official filings of top global corporations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/companies"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-neutral-950 text-white font-bold text-base hover:bg-neutral-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
          >
            Browse All 50 Companies &rarr;
          </Link>
          <Link
            href="/company/apple"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/80 border border-neutral-200 text-neutral-900 font-bold text-base hover:bg-white transition-all shadow-xs"
          >
            Check Apple Live 
          </Link>
        </div>
      </section>

      {/* Featured Companies Live Tickers */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-neutral-900">
              Live Top Earners
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Real-time revenue counting right now from latest FY filings
            </p>
          </div>
          <Link
            href="/companies"
            className="text-xs font-bold text-sky-600 hover:text-sky-800 transition-colors"
          >
            View all 50 &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((company) => (
            <MiniTicker key={company.ticker} company={company} />
          ))}
        </div>
      </section>

      {/* Quick Stats Grid */}
      <section className="mt-20">
        <LiquidGlassCard hoverEffect={false} className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Dataset Size
              </span>
              <div className="font-serif font-black text-4xl sm:text-5xl text-neutral-900">
                50 Tech & Market Giants
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Apple, Microsoft, NVIDIA, Amazon, Berkshire & 45 more
              </p>
            </div>

            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Update Precision
              </span>
              <div className="font-serif font-black text-4xl sm:text-5xl text-neutral-900">
                1/60th Sec
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Smooth 60 FPS counter updates driven by requestAnimationFrame
              </p>
            </div>

            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                Multi-Currency
              </span>
              <div className="font-serif font-black text-4xl sm:text-5xl text-emerald-600">
                Auto-Detected
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                INR (₹), USD ($), EUR (€), GBP (£) and 17 more supported
              </p>
            </div>
          </div>
        </LiquidGlassCard>
      </section>
    </div>
  );
}
