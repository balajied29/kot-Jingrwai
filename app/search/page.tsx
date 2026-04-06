import type { Metadata } from 'next';
import SearchClient from '@/components/search/SearchClient';

export const metadata: Metadata = {
  title: 'Search',
};

export default function SearchPage() {
  return (
    <main>
      <SearchClient />
    </main>
  );
}
