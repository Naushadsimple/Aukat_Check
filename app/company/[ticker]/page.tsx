import { getCompanyBySlug, getAllCompanies } from '@/lib/data';
import { CompanyDetailClient } from '@/components/custom/company-detail-client';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ ticker: string }>;
}

export async function generateStaticParams() {
  const companies = getAllCompanies();
  return companies.map((c) => ({
    ticker: c.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { ticker } = await params;
  const company = getCompanyBySlug(ticker);

  if (!company) {
    return { title: 'Company Not Found — Aukat Check' };
  }

  return {
    title: `${company.name} (${company.ticker}) Realtime Aukat — Aukat Check`,
    description: `Watch ${company.name}'s revenue ($${(company.latest.revenuePerSecond).toFixed(2)}/sec) and net income tick up live in real-time.`,
  };
}

export default async function CompanyPage({ params }: PageProps) {
  const { ticker } = await params;
  const company = getCompanyBySlug(ticker);

  if (!company) {
    notFound();
  }

  return <CompanyDetailClient company={company} />;
}
