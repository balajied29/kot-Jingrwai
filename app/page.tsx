import Link from 'next/link';
import { getAllHymns, getCategories } from '@/lib/hymns';
import HomeClient from '@/components/home/HomeClient';
import type { HymnIndexEntry } from './types';

export const metadata = {
  title: 'Kot Jingrwai',
};

export default async function HomePage() {
  const [hymns, categories] = await Promise.all([
    getAllHymns(),
    getCategories(),
  ]);

  const entries: HymnIndexEntry[] = hymns.map(h => {
    let title = '';
    if (h.db_name) {
      title = h.db_name.replace(/^\d+\.\s*/, '').trim();
    } else if (h.sub_title) {
      title = h.sub_title;
    }
    const firstLine = h.verses[0]?.lines[0] ?? '';
    return {
      n: h.number,
      on: h.old_number ?? undefined,
      t: title,
      fl: firstLine,
      cat: h.category ?? '',
      sec: h.section_heading?.split('.').slice(1).join('.').trim() ?? '',
    };
  });

  return (
    <main>
      {/* ── App bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250,250,248,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 16px 10px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Kot Jingrwai
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
              639 jingrwai · Khasi Hymnbook
            </p>
          </div>
        </div>

        {/* Search bar — tappable, routes to /search */}
        <Link href="/search" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: 14,
          padding: '11px 14px',
          color: 'var(--text-muted)',
          transition: 'border-color 0.15s',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <span style={{ fontSize: 15, flex: 1 }}>Search by number, title, first line…</span>
        </Link>
      </div>

      <HomeClient hymns={entries} categories={categories} />
    </main>
  );
}
