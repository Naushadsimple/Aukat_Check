'use client';

import React from 'react';
import Link from 'next/link';
import { CompanyIndex } from '@/types/company';
import { LiquidGlassCard } from './liquid-glass-card';
import { useCurrency } from './currency-provider';
import { CompanyLogo } from './company-logo';

interface CompanyCardProps {
  company: CompanyIndex;
}

export function CompanyCard({ company }: CompanyCardProps) {
  const { formatCompact } = useCurrency();

  const revFormatted = formatCompact(company.latestRevenue);
  const profitFormatted = formatCompact(company.latestNetIncome);

  return (
    <Link href={`/company/${company.slug}`} className="block">
      <LiquidGlassCard borderBeam hoverEffect className="h-full flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200/90 shadow-xs p-2 flex items-center justify-center shrink-0 overflow-hidden">
                <CompanyLogo slug={company.slug} ticker={company.ticker} name={company.name} />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 text-base leading-snug group-hover:text-black transition-colors">
                  {company.name}
                </h3>
                <span className="font-mono text-xs font-bold text-neutral-400">
                  {company.ticker}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-sky-100/80 text-sky-800 text-[10px] font-bold tracking-wider uppercase border border-sky-200/50">
              {company.sector}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-200/60 mt-2">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 block mb-0.5">
                FY{company.latestFiscalYear} Revenue
              </span>
              <span className="font-serif font-bold text-xl text-neutral-900">
                {revFormatted}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 block mb-0.5">
                FY{company.latestFiscalYear} Profit
              </span>
              <span className="font-serif font-bold text-xl text-emerald-600">
                {profitFormatted}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between text-xs text-sky-600 font-semibold group-hover:translate-x-1 transition-transform">
          <span>Check Realtime Aukat &rarr;</span>
        </div>
      </LiquidGlassCard>
    </Link>
  );
}
