'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CurrencyCode, ExchangeRates } from '@/types/company';
import { CURRENCIES, detectCurrency, convertCurrency, formatCompact, formatFull, formatPerSecond } from '@/lib/currency';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  convert: (amountUSD: number) => number;
  formatCompact: (amountUSD: number) => string;
  formatFull: (amountUSD: number, decimals?: number) => string;
  formatPerSecond: (ratePerSecondUSD: number) => string;
  rates: ExchangeRates | null;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({
  children,
  initialRates,
}: {
  children: React.ReactNode;
  initialRates: ExchangeRates;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('aukat_currency') as CurrencyCode | null;
    if (saved && CURRENCIES[saved]) {
      setCurrencyState(saved);
    } else {
      const detected = detectCurrency();
      setCurrencyState(detected);
    }
    setIsInitialized(true);
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    localStorage.setItem('aukat_currency', code);
  };

  const convert = (amountUSD: number) => {
    return convertCurrency(amountUSD, currency, initialRates);
  };

  const formatCompactVal = (amountUSD: number) => {
    const converted = convert(amountUSD);
    return formatCompact(converted, currency);
  };

  const formatFullVal = (amountUSD: number, decimals: number = 2) => {
    const converted = convert(amountUSD);
    return formatFull(converted, currency, decimals);
  };

  const formatPerSecondVal = (rateUSD: number) => {
    const converted = convert(rateUSD);
    return formatPerSecond(converted, currency);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convert,
        formatCompact: formatCompactVal,
        formatFull: formatFullVal,
        formatPerSecond: formatPerSecondVal,
        rates: initialRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return ctx;
}
