'use client';

import React, { useState } from 'react';
import domainMap from '@/lib/domain-map.json';

interface CompanyLogoProps {
  slug: string;
  ticker: string;
  name: string;
  className?: string;
}

export function CompanyLogo({ slug, ticker, name, className = 'w-full h-full object-contain' }: CompanyLogoProps) {
  const [level, setLevel] = useState(0);

  const cleanTicker = ticker.toLowerCase().replace(/[^a-z0-9]/g, '');

  const info = (domainMap as Record<string, { domain: string; simpleIcon: string }>)[slug] || {
    domain: `${slug}.com`,
    simpleIcon: slug.replace(/-/g, ''),
  };

  const domain = info.domain;

  // Local static SVG assets load INSTANTLY on first visit (0ms delay)
  // External APIs are used as secondary fallbacks
  const sources = [
    `/logos/${slug}.svg`,
    `/logos/${cleanTicker}.svg`,
    `https://logo.clearbit.com/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];

  if (level >= sources.length) {
    return (
      <div className="w-full h-full bg-neutral-900 text-white font-mono font-extrabold text-sm flex items-center justify-center rounded-xl">
        {ticker[0]}
      </div>
    );
  }

  return (
    <img
      src={sources[level]}
      alt={`${name} logo`}
      className={className}
      onError={() => setLevel((prev) => prev + 1)}
    />
  );
}
