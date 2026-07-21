import { getAllCompanies } from '@/lib/data';
import { CompaniesClient } from '@/components/custom/companies-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse All 50 Companies — Aukat Check',
  description: 'Search and filter 50 top market cap companies to inspect annual revenue and real-time per-second earnings.',
};

export default function CompaniesPage() {
  const companies = getAllCompanies();

  return <CompaniesClient companies={companies} />;
}
