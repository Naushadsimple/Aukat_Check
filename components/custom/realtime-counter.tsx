'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useCurrency } from './currency-provider';

interface RealtimeCounterProps {
  annualAmountUSD: number;
  label: string;
  sublabel?: string;
  isRunning: boolean;
  onToggleRun: () => void;
}

export function RealtimeCounter({
  annualAmountUSD,
  label,
  sublabel,
  isRunning,
  onToggleRun,
}: RealtimeCounterProps) {
  const { convert, currency, rates } = useCurrency();

  // 1. Calculate per day and per second amounts in selected currency
  const convertedAnnual = convert(annualAmountUSD);
  const perDay = convertedAnnual / 365;
  const perSecond = perDay / 86400; // 365 * 86400 = 31,536,000

  // 2. State for live accumulated counter & elapsed time
  const [accumulatedSum, setAccumulatedSum] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const lastTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimeRef.current = null;
      return;
    }

    const tick = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const deltaMs = time - lastTimeRef.current;
      lastTimeRef.current = time;

      setElapsedSeconds((prev) => prev + deltaMs / 1000);
      setAccumulatedSum((prev) => prev + perSecond * (deltaMs / 1000));

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isRunning, perSecond]);

  const symbol = rates?.rates
    ? currency === 'INR'
      ? '₹'
      : currency === 'EUR'
      ? '€'
      : currency === 'GBP'
      ? '£'
      : '$'
    : '$';

  const formatCurrency = (val: number, decimals = 2) => {
    return `${symbol}${val.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  };

  const handleReset = () => {
    setAccumulatedSum(0);
    setElapsedSeconds(0);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Label and Live Status */}
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-bold tracking-widest text-neutral-400">
          {label}
        </span>
        {isRunning ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE ADDING (+{formatCurrency(perSecond)}/s)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-600 font-mono text-[11px] font-bold">
            PAUSED
          </span>
        )}
      </div>

      {/* Breakdown Metrics */}
      <div className="grid grid-cols-2 gap-3 py-2 px-3 rounded-2xl bg-white/60 border border-neutral-200/80 text-xs">
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
            Per Day Earnings
          </span>
          <span className="font-mono font-bold text-neutral-900">
            {formatCurrency(perDay, 0)} / day
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-neutral-400 block">
            Per Second Addition
          </span>
          <span className="font-mono font-bold text-emerald-600">
            {formatCurrency(perSecond, 2)} / sec
          </span>
        </div>
      </div>

      {/* Main Counter Display */}
      <div className="font-serif font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-neutral-900 tabular-nums my-1">
        {formatCurrency(accumulatedSum, 2)}
      </div>

      {/* Controls & Sublabel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="text-xs text-neutral-500">
          <p>{sublabel}</p>
          {isRunning && (
            <p className="font-mono text-[11px] text-neutral-400 mt-0.5">
              Ticking for {elapsedSeconds.toFixed(1)} seconds
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {accumulatedSum > 0 && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-neutral-300 text-neutral-600 hover:text-neutral-900 text-xs font-bold transition-all"
            >
              Reset
            </button>
          )}
          <button
            onClick={onToggleRun}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
              isRunning
                ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'
            }`}
          >
            {isRunning ? (
              <>⏸ Pause Counter</>
            ) : accumulatedSum > 0 ? (
              <>▶ Continue Ticking</>
            ) : (
              <>▶ Continue (Start Counter)</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
