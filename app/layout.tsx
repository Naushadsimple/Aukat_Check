import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { CurrencyProvider } from '@/components/custom/currency-provider';
import { getExchangeRates } from '@/lib/data';
import { Navbar } from '@/components/custom/navbar';
import { Footer } from '@/components/custom/footer';
import { SmoothCursor } from '@/components/custom/smooth-cursor';

export const metadata: Metadata = {
  title: 'Aukat Check — Kitni hai unki asli Aukat per second',
  description:
    'Real-time corporate revenue & net income ticker extrapolated live per second from official annual financial filings. Pick any major company and watch earnings grow in real time.',
  keywords: [
    'Aukat Check',
    'Realtime Revenue Counter',
    'Corporate Earnings Per Second',
    'Company Financial Viz',
    'Apple Revenue Per Second',
    'NVIDIA Profit Per Second',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialRates = getExchangeRates();

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased selection:bg-neutral-900 selection:text-white">
        <CurrencyProvider initialRates={initialRates}>
          <SmoothCursor />
          <div className="min-h-screen flex flex-col justify-between">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CurrencyProvider>
      </body>
    </html>
  );
}
