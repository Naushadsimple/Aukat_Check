'use client';

import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  sectors: string[];
}

export function SearchBar({
  value,
  onChange,
  selectedSector,
  onSectorChange,
  sectors,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-4xl mx-auto my-6">
      <div className="relative flex-1">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search by company name, ticker (e.g. AAPL, NVDA), or sector..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/80 backdrop-blur-md border border-neutral-200 focus:border-black focus:ring-2 focus:ring-black/10 transition-all text-sm font-sans text-neutral-900 placeholder:text-neutral-400 outline-none shadow-xs"
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-bold"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <button
          onClick={() => onSectorChange('All')}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            selectedSector === 'All'
              ? 'bg-neutral-900 text-white shadow-md'
              : 'bg-white/80 border border-neutral-200 text-neutral-600 hover:bg-white hover:text-neutral-900'
          }`}
        >
          All Sectors
        </button>
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => onSectorChange(sector)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedSector === sector
                ? 'bg-neutral-900 text-white shadow-md'
                : 'bg-white/80 border border-neutral-200 text-neutral-600 hover:bg-white hover:text-neutral-900'
            }`}
          >
            {sector}
          </button>
        ))}
      </div>
    </div>
  );
}
