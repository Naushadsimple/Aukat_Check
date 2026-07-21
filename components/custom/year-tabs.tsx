'use client';

import React from 'react';
import { motion } from 'motion/react';
import { YearlyData } from '@/types/company';

interface YearTabsProps {
  yearlyData: YearlyData[];
  activeTab: string; // 'realtime' or fiscalYear string (e.g. '2025')
  onChange: (tab: string) => void;
}

export function YearTabs({ yearlyData, activeTab, onChange }: YearTabsProps) {
  // Sort descending (latest year first)
  const sortedYears = [...yearlyData].sort((a, b) => b.fiscalYear - a.fiscalYear);

  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2 border-b border-neutral-200">
      {/* Segmented Tab Control */}
      <div className="flex items-center gap-1 p-1 rounded-2xl bg-neutral-100 border border-neutral-200/80 w-full sm:w-auto">
        {/* Static Fiscal Years First */}
        {sortedYears.map((y) => {
          const tabKey = y.fiscalYear.toString();
          const isActive = activeTab === tabKey;
          return (
            <button
              key={y.fiscalYear}
              onClick={() => onChange(tabKey)}
              className={`relative flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-white rounded-xl shadow-xs border border-black/5"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">FY{y.fiscalYear}</span>
            </button>
          );
        })}

        {/* Realtime Tab */}
        <button
          onClick={() => onChange('realtime')}
          className={`relative flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'realtime'
              ? 'text-white shadow-xs'
              : 'text-emerald-700 hover:text-emerald-900 hover:bg-emerald-500/10'
          }`}
        >
          {activeTab === 'realtime' && (
            <motion.div
              layoutId="activeTabPill"
              className="absolute inset-0 bg-emerald-700 rounded-xl"
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${activeTab === 'realtime' ? 'bg-emerald-300 animate-pulse' : 'bg-emerald-500'}`} />
            Realtime Live
          </span>
        </button>
      </div>

      <div className="text-[11px] font-mono text-neutral-400 font-medium">
        Select Fiscal Year filing or Realtime Live Extrapolation
      </div>
    </div>
  );
}
