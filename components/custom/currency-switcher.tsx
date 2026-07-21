'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from './currency-provider';
import { CURRENCIES } from '@/lib/currency';
import { CurrencyCode } from '@/types/company';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeInfo = CURRENCIES[currency] || CURRENCIES.USD;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-black/10 backdrop-blur-md text-xs font-semibold text-neutral-900 hover:bg-white hover:border-black/20 transition-all shadow-xs"
        aria-label="Select Currency"
      >
        <span className="font-mono text-black font-extrabold">{activeInfo.symbol}</span>
        <span>{activeInfo.code}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-black/10 shadow-xl py-2 z-50 max-h-64 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-neutral-400">
            Select Currency
          </div>
          {Object.values(CURRENCIES).map((info) => (
            <button
              key={info.code}
              onClick={() => {
                setCurrency(info.code as CurrencyCode);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors ${
                currency === info.code
                  ? 'bg-black text-white font-semibold'
                  : 'text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-5 font-mono font-bold text-center">{info.symbol}</span>
                <span>{info.name}</span>
              </div>
              <span className="text-[10px] opacity-70 font-mono">{info.code}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
