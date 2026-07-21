'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CompanyData } from '@/types/company';
import { YearTabs } from './year-tabs';
import { RealtimeCounter } from './realtime-counter';
import { RevenueChart } from './revenue-chart';
import { LiquidGlassCard } from './liquid-glass-card';
import { useCurrency } from './currency-provider';
import { formatYoY, yoyChange } from '@/lib/calculate-per-second';
import { CompanyLogo } from './company-logo';

export function CompanyDetailClient({ company }: { company: CompanyData }) {
  const { formatCompact, formatFull } = useCurrency();

  const latestYearData = company.yearlyData[0];

  // Default tab is the latest fiscal year (e.g. '2025') as per user request
  const [activeTab, setActiveTab] = useState<string>(latestYearData.fiscalYear.toString());
  const [isRealtimeRunning, setIsRealtimeRunning] = useState<boolean>(false);

  const selectedYearData =
    activeTab === 'realtime'
      ? latestYearData
      : company.yearlyData.find((y) => y.fiscalYear.toString() === activeTab) ||
        latestYearData;

  // Find previous year data for YoY calculations
  const selectedYearIndex = company.yearlyData.findIndex(
    (y) => y.fiscalYear === selectedYearData.fiscalYear
  );
  const prevYearData =
    selectedYearIndex >= 0 && selectedYearIndex < company.yearlyData.length - 1
      ? company.yearlyData[selectedYearIndex + 1]
      : null;

  const revYoY = prevYearData
    ? yoyChange(selectedYearData.revenue, prevYearData.revenue)
    : null;
  const profitYoY = prevYearData
    ? yoyChange(selectedYearData.netIncome, prevYearData.netIncome)
    : null;

  const toggleRealtimeRunning = () => {
    setIsRealtimeRunning((prev) => !prev);
  };

  const slug = company.slug || (company.ticker.toLowerCase() === 'brk-b' ? 'berkshire-hathaway' : company.ticker.toLowerCase() === 'googl' ? 'alphabet' : company.ticker.toLowerCase() === 'amzn' ? 'amazon' : company.ticker.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
      {/* Breadcrumb / Top Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/companies"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors bg-white/80 px-4 py-2 rounded-full border border-neutral-200 shadow-xs self-start"
        >
          &larr; Back to 50 Companies
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
          <span>Sector: <strong className="text-neutral-900">{company.sector}</strong></span>
          <span>&bull;</span>
          <span>Last Updated: <strong className="text-neutral-900">{company.lastUpdated}</strong></span>
        </div>
      </div>

      {/* Main Header Card */}
      <LiquidGlassCard hoverEffect={false} className="p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200/90 p-2.5 flex items-center justify-center shadow-xs shrink-0 overflow-hidden">
              <CompanyLogo slug={slug} ticker={company.ticker} name={company.name} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-serif font-black text-3xl sm:text-4xl text-neutral-900">
                  {company.name}
                </h1>
                <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-mono font-bold">
                  {company.ticker}
                </span>
              </div>
              <p className="text-xs font-sans text-neutral-500">
                Official SEC Filings &bull; Base Currency: {company.currency}
              </p>
            </div>
          </div>

          {/* Quick Velocity Pill */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 p-4 rounded-2xl bg-white/90 border border-neutral-200/80 shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Per Second Rate
            </span>
            <div className="text-right">
              <span className="font-serif font-bold text-2xl text-neutral-900 block">
                {formatCompact(company.latest.revenuePerSecond)} / sec
              </span>
              <span className="text-xs text-emerald-600 font-bold">
                Profit: {formatCompact(company.latest.profitPerSecond)} / sec
              </span>
            </div>
          </div>
        </div>
      </LiquidGlassCard>

      {/* Analytical Navigation Tabs (Default: FY2025) */}
      <div className="mb-8">
        <YearTabs
          yearlyData={company.yearlyData}
          activeTab={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            if (tab !== 'realtime') setIsRealtimeRunning(false);
          }}
        />
      </div>

      {/* Dynamic Screen Content */}
      {activeTab === 'realtime' ? (
        /* REALTIME MODE SCREEN */
        <div className="space-y-8 mb-12">
          {!isRealtimeRunning && (
            <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-emerald-950">
                  Realtime Extrapolation Mode
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  Click <strong>Continue</strong> to start live per-second summation based on FY{latestYearData.fiscalYear} filings.
                </p>
              </div>
              <button
                onClick={toggleRealtimeRunning}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all whitespace-nowrap"
              >
                ▶ Click Continue to Start
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LiquidGlassCard borderBeam hoverEffect={false} className="p-8">
              <RealtimeCounter
                annualAmountUSD={latestYearData.revenue}
                label="Realtime Revenue"
                sublabel={`FY${latestYearData.fiscalYear} Annual: ${formatCompact(latestYearData.revenue)}`}
                isRunning={isRealtimeRunning}
                onToggleRun={toggleRealtimeRunning}
              />
            </LiquidGlassCard>

            <LiquidGlassCard borderBeam hoverEffect={false} className="p-8">
              <RealtimeCounter
                annualAmountUSD={latestYearData.netIncome}
                label="Realtime Net Profit"
                sublabel={`FY${latestYearData.fiscalYear} Annual: ${formatCompact(latestYearData.netIncome)}`}
                isRunning={isRealtimeRunning}
                onToggleRun={toggleRealtimeRunning}
              />
            </LiquidGlassCard>
          </div>
        </div>
      ) : (
        /* STATIC YEAR MODE SCREEN (DEFAULT) */
        <div className="space-y-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Total Revenue Card */}
            <LiquidGlassCard hoverEffect={false} className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
                  FY{selectedYearData.fiscalYear} Total Revenue
                </span>
                {revYoY !== null && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                      revYoY >= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    YoY {formatYoY(revYoY)}
                  </span>
                )}
              </div>

              <div className="font-serif font-bold text-4xl sm:text-5xl text-neutral-900 my-2">
                {formatCompact(selectedYearData.revenue)}
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                Exact Amount: {formatFull(selectedYearData.revenue, 0)}
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-200/60 text-xs text-neutral-500 flex justify-between">
                <span>Filing End Date:</span>
                <span className="font-mono font-bold text-neutral-900">{selectedYearData.fiscalYearEnd}</span>
              </div>
            </LiquidGlassCard>

            {/* Net Income Card */}
            <LiquidGlassCard hoverEffect={false} className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
                  FY{selectedYearData.fiscalYear} Net Profit
                </span>
                {profitYoY !== null && (
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                      profitYoY >= 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    YoY {formatYoY(profitYoY)}
                  </span>
                )}
              </div>

              <div className="font-serif font-bold text-4xl sm:text-5xl text-emerald-600 my-2">
                {formatCompact(selectedYearData.netIncome)}
              </div>
              <p className="text-xs text-neutral-500 font-mono">
                Exact Amount: {formatFull(selectedYearData.netIncome, 0)}
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-200/60 text-xs text-neutral-500 flex justify-between">
                <span>Profit Margin:</span>
                <span className="font-mono font-bold text-emerald-700">
                  {((selectedYearData.netIncome / selectedYearData.revenue) * 100).toFixed(1)}%
                </span>
              </div>
            </LiquidGlassCard>
          </div>
        </div>
      )}

      {/* Historical Trend Chart Section */}
      <div className="mt-8">
        <LiquidGlassCard hoverEffect={false} className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif font-bold text-2xl text-neutral-900">
                Multi-Year Performance Trend
              </h3>
              <p className="text-xs text-neutral-500">
                Comparison of reported Revenue vs Net Income across available fiscal years
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-neutral-400">
              {company.yearlyData.length} Annual Filings
            </span>
          </div>

          <RevenueChart yearlyData={company.yearlyData} />
        </LiquidGlassCard>
      </div>
    </div>
  );
}
