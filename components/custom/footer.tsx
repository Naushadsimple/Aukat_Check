import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200/60 bg-white/40 backdrop-blur-md py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="font-serif font-bold text-base text-neutral-900">Aukat Check</span>
            <span className="text-xs text-neutral-400 font-mono">• Kitni hai unki asli Aukat</span>
          </div>
          <p className="text-xs text-neutral-500 max-w-md">
            Extrapolating corporate annual filings into live per-second counters. For entertainment and vibe purposes. Not financial advice.
          </p>
          <p className="text-xs font-medium text-neutral-700 mt-1">
            Made by{' '}
            <a
              href="https://naushadwork.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-black underline underline-offset-4 hover:text-sky-600 transition-colors"
            >
              Shaikh Naushad Ibrahim
            </a>
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-bold text-neutral-600">
          <Link href="/companies" className="hover:text-black transition-colors">
            All Companies
          </Link>
          <Link href="/company/apple" className="hover:text-black transition-colors">
            Apple
          </Link>
          <Link href="/company/nvidia" className="hover:text-black transition-colors">
            NVIDIA
          </Link>
          <Link href="/company/microsoft" className="hover:text-black transition-colors">
            Microsoft
          </Link>
        </div>
      </div>
    </footer>
  );
}
