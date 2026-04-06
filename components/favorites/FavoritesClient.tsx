'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import type { HymnIndex, HymnIndexEntry } from '@/app/types';

export default function FavoritesClient() {
  const favorites = useAppStore(s => s.favorites);
  const toggleFavorite = useAppStore(s => s.toggleFavorite);
  const [index, setIndex] = useState<HymnIndex | null>(null);

  useEffect(() => {
    fetch('/hymn-index.json')
      .then(r => r.json())
      .then((d: HymnIndex) => setIndex(d));
  }, []);

  const entries: HymnIndexEntry[] = index
    ? index.hymns.filter(e => favorites.includes(e.n))
        .sort((a, b) => a.n - b.n)
    : [];

  if (!index) {
    return (
      <div style={{ padding: '60px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <p>Loading…</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div style={{ padding: '60px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px', opacity: 0.4 }}>
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 6 }}>No saved hymns yet</p>
        <p style={{ fontSize: 13 }}>Tap the bookmark icon on any hymn to save it here.</p>
      </div>
    );
  }

  return (
    <ul style={{ listStyle: 'none' }}>
      {entries.map(entry => (
        <li key={entry.n} style={{ display: 'flex', alignItems: 'center', borderBottom: '1px solid var(--border)' }}>
          <Link
            href={`/hymn/${entry.n}`}
            style={{
              flex: 1, display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '14px 16px', minWidth: 0,
            }}
          >
            <span style={{
              flexShrink: 0, width: 40, height: 40, borderRadius: 10,
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'var(--accent)',
            }}>
              {entry.n}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.t || entry.fl}
              </p>
              {entry.cat && (
                <span className="chip" style={{ marginTop: 4, fontSize: 11 }}>{entry.cat}</span>
              )}
            </div>
          </Link>
          <button
            onClick={() => toggleFavorite(entry.n)}
            aria-label="Remove from saved"
            style={{ padding: '0 16px', color: 'var(--accent)', lineHeight: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
}
