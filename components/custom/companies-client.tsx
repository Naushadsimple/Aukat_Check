'use client';

import React, { useState, useMemo } from 'react';
import { CompanyIndex } from '@/types/company';
import { CompanyCard } from '@/components/custom/company-card';
import { SearchBar } from '@/components/custom/search-bar';

export function CompaniesClient({ companies }: { companies: CompanyIndex[] }) {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState<'revenue' | 'profit' | 'name'>('revenue');

  // Extract unique sectors
  const sectors = useMemo(() => {
    const set = new Set(companies.map((c) => c.sector));
    return Array.from(set).sort();
  }, [companies]);

  // Filter and sort companies
  const filtered = useMemo(() => {
    return companies
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.ticker.toLowerCase().includes(search.toLowerCase()) ||
          c.sector.toLowerCase().includes(search.toLowerCase());

        const matchesSector =
          selectedSector === 'All' || c.sector === selectedSector;

        return matchesSearch && matchesSector;
      })
      .sort((a, b) => {
        if (sortBy === 'revenue') return b.latestRevenue - a.latestRevenue;
        if (sortBy === 'profit') return b.latestNetIncome - a.latestNetIncome;
        return a.name.localeCompare(b.name);
      });
  }, [companies, search, selectedSector, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="font-serif font-black text-4xl sm:text-5xl text-neutral-900 mb-3">
          Explore Corporate Aukat
        </h1>
        <p className="text-sm text-neutral-600">
          Search and pick any of the 50 top companies to inspect real-time per-second revenue & profit.
        </p>
      </div>

      {/* Search & Sector Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        sectors={sectors}
      />

      {/* Sorting bar & Count */}
      <div className="flex items-center justify-between max-w-4xl mx-auto mb-6 text-xs text-neutral-500 font-medium">
        <span>Showing {filtered.length} of {companies.length} companies</span>

        <div className="flex items-center gap-2">
          <span>Sort by:</span>
          <button
            onClick={() => setSortBy('revenue')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              sortBy === 'revenue' ? 'bg-neutral-900 text-white font-bold' : 'hover:bg-neutral-200'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setSortBy('profit')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              sortBy === 'profit' ? 'bg-neutral-900 text-white font-bold' : 'hover:bg-neutral-200'
            }`}
          >
            Profit
          </button>
          <button
            onClick={() => setSortBy('name')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              sortBy === 'name' ? 'bg-neutral-900 text-white font-bold' : 'hover:bg-neutral-200'
            }`}
          >
            Name
          </button>
        </div>
      </div>

      {/* Company Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((c) => (
            <CompanyCard key={c.ticker} company={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-neutral-200 my-8">
          <p className="font-serif text-xl text-neutral-700 font-bold mb-2">No companies found</p>
          <p className="text-xs text-neutral-500 mb-4">
            Try adjusting your search term or sector filter
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSector('All');
            }}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
