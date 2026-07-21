'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { YearlyData } from '@/types/company';
import { useCurrency } from './currency-provider';

interface RevenueChartProps {
  yearlyData: YearlyData[];
}

export function RevenueChart({ yearlyData }: RevenueChartProps) {
  const { convert, currency, rates } = useCurrency();

  const symbol = rates?.rates ? (currency === 'INR' ? '₹' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$') : '$';

  // Sort chronological (oldest to newest for chart left-to-right)
  const sortedData = [...yearlyData].sort((a, b) => a.fiscalYear - b.fiscalYear);

  const chartData = sortedData.map((d) => ({
    year: `FY${d.fiscalYear}`,
    Revenue: Number((convert(d.revenue) / 1e9).toFixed(2)),
    NetIncome: Number((convert(d.netIncome) / 1e9).toFixed(2)),
    rawRev: d.revenue,
    rawIncome: d.netIncome,
  }));

  const formatBillion = (val: number) => `${symbol}${val}B`;

  return (
    <div className="w-full h-72 sm:h-80 md:h-96 pt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="year"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={formatBillion}
            tick={{ fill: '#94A3B8', fontSize: 11 }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-neutral-200 shadow-xl text-xs font-sans">
                    <p className="font-bold text-neutral-900 mb-1.5">{label}</p>
                    {payload.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between gap-4 py-0.5">
                        <span
                          className="font-medium"
                          style={{ color: item.color }}
                        >
                          {item.name === 'Revenue' ? 'Revenue' : 'Net Profit'}:
                        </span>
                        <span className="font-mono font-bold text-neutral-900">
                          {symbol}{item.value} Billion
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
            formatter={(value) => (
              <span className="text-neutral-700 font-medium ml-1">
                {value === 'Revenue' ? 'Total Revenue' : 'Net Income'}
              </span>
            )}
          />
          <Bar
            dataKey="Revenue"
            fill="#0A0A0A"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
          />
          <Bar
            dataKey="NetIncome"
            fill="#38BDF8"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
