'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { HymnIndexEntry } from '@/app/types';

interface Props {
  hymns: HymnIndexEntry[];
  categories: { name: string; count: number }[];
}

export default function HomeClient({ hymns, categories }: Props) {
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = useMemo(
    () => activeCat ? hymns.filter(h => h.cat === activeCat) : hymns,
    [hymns, activeCat],
  );

  return (
    <div>
      {/* ── Category filter strip ── */}
      <div className="scroll-x" style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setActiveCat(null)}
          style={{
            flexShrink: 0, padding: '7px 16px', borderRadius: 100,
            fontSize: 13, fontWeight: activeCat === null ? 600 : 400,
            background: activeCat === null ? 'var(--accent)' : 'var(--bg-card)',
            color: activeCat === null ? '#fff' : 'var(--text-sub)',
            border: `1.5px solid ${activeCat === null ? 'var(--accent)' : 'var(--border)'}`,
            transition: 'all 0.15s', whiteSpace: 'nowrap', touchAction: 'manipulation',
          }}
        >
          All 639
        </button>
        {categories.map(cat => {
          const active = activeCat === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => setActiveCat(active ? null : cat.name)}
              style={{
                flexShrink: 0, padding: '7px 16px', borderRadius: 100,
                fontSize: 13, fontWeight: active ? 600 : 400,
                background: active ? 'var(--accent)' : 'var(--bg-card)',
                color: active ? '#fff' : 'var(--text-sub)',
                border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                transition: 'all 0.15s', whiteSpace: 'nowrap', touchAction: 'manipulation',
              }}
            >
              {cat.name}
              <span style={{ marginLeft: 4, opacity: 0.65, fontSize: 11 }}>{cat.count}</span>
            </button>
          );
        })}
      </div>

      {/* ── Count row ── */}
      <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {filtered.length} {filtered.length === 1 ? 'jingrwai' : 'jingrwai'}
          {activeCat ? ` · ${activeCat}` : ''}
        </p>
      </div>

      {/* ── Hymn list ── */}
      <ul style={{ listStyle: 'none' }}>
        {filtered.map(entry => (
          <li key={entry.n}>
            <Link
              href={`/hymn/${entry.n}`}
              className="row-tap"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 16px',
                borderBottom: '1px solid var(--border)',
              }}
            >
              {/* Number */}
              <span style={{
                flexShrink: 0, width: 40, height: 40, borderRadius: 10,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: entry.n >= 100 ? 11 : 13, fontWeight: 700, color: 'var(--accent)',
              }}>
                {entry.n}
              </span>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 15, fontWeight: 500, color: 'var(--text)', lineHeight: 1.3,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  marginBottom: 2,
                }}>
                  {entry.t || entry.fl}
                </p>
                {entry.cat && (
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{entry.cat}</p>
                )}
              </div>

              {/* Chevron */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
