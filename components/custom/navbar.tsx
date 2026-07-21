'use client';

import React from 'react';
import Link from 'next/link';
import { CurrencySwitcher } from './currency-switcher';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 border-b border-neutral-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center text-white font-serif font-black text-lg shadow-md group-hover:scale-105 transition-transform">
            A
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-lg text-neutral-900 tracking-tight leading-tight">
              Aukat Check
            </span>
            <span className="text-[9px] font-mono text-neutral-400 font-bold uppercase tracking-widest -mt-0.5">
              Live Corporate Vibe
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/companies"
            className="text-xs font-bold text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-full hover:bg-neutral-100 transition-colors"
          >
            Browse 50 Companies
          </Link>

          <CurrencySwitcher />
        </nav>
      </div>
    </header>
  );
}
