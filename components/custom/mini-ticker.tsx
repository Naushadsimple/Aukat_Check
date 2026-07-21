'use client';

import React from 'react';
import Link from 'next/link';
import { CompanyData } from '@/types/company';
import { useCurrency } from './currency-provider';
import { LiquidGlassCard } from './liquid-glass-card';
import { CompanyLogo } from './company-logo';

interface MiniTickerProps {
  company: CompanyData;
}

export function MiniTicker({ company }: MiniTickerProps) {
  const { formatCompact, formatPerSecond } = useCurrency();

  const latestYear = company.yearlyData[0];
  const revFormatted = formatCompact(latestYear.revenue);
  const profitFormatted = formatCompact(latestYear.netIncome);
  const perSecFormatted = formatPerSecond(company.latest.revenuePerSecond);

  const slug = company.slug || company.ticker.toLowerCase();

  return (
    <Link href={`/company/${slug}`} className="block">
      <LiquidGlassCard borderBeam hoverEffect className="p-5 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200/90 p-1.5 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                <CompanyLogo slug={slug} ticker={company.ticker} name={company.name} />
              </div>
              <div>
                <h4 className="font-bold text-neutral-900 text-sm leading-tight">{company.name}</h4>
                <span className="font-mono text-[10px] text-neutral-400 font-bold">{company.ticker}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-mono font-bold">
              FY{latestYear.fiscalYear}
            </span>
          </div>

          <div className="space-y-2 my-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                Annual Revenue
              </span>
              <span className="font-serif font-bold text-2xl text-neutral-900">
                {revFormatted}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                Annual Profit
              </span>
              <span className="font-serif font-bold text-lg text-emerald-600">
                {profitFormatted}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs font-semibold text-neutral-700">
          <span className="font-mono text-[11px] text-neutral-500">{perSecFormatted}</span>
          <span className="text-sky-600 font-bold group-hover:translate-x-1 transition-transform">
            Start Live &rarr;
          </span>
        </div>
      </LiquidGlassCard>
    </Link>
  );
}
