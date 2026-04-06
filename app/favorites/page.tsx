import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import FavoritesClient from '@/components/favorites/FavoritesClient';

export const metadata: Metadata = {
  title: 'Saved Hymns',
};

export default function FavoritesPage() {
  return (
    <>
      <Header title="Saved" />
      <main>
        <FavoritesClient />
      </main>
    </>
  );
}
