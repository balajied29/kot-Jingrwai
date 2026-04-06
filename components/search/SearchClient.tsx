'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { HymnIndex, HymnIndexEntry } from '@/app/types';

/* ── Scoring ── */
function score(e: HymnIndexEntry, q: string): number {
  const ql = q.toLowerCase();
  const ns = String(e.n);
  if (ns === ql) return 100;
  if (ns.startsWith(ql)) return 92;
  if (e.on && String(e.on) === ql) return 88;
  const tl = e.t.toLowerCase();
  const fl = e.fl.toLowerCase();
  if (tl.startsWith(ql)) return 82;
  if (fl.startsWith(ql)) return 78;
  if (tl.includes(ql)) return 62;
  if (fl.includes(ql)) return 54;
  if (e.cat.toLowerCase() === ql) return 48;
  if (e.cat.toLowerCase().includes(ql)) return 32;
  if (e.sec.toLowerCase().includes(ql)) return 22;
  return 0;
}

/* ── Category pills that appear above results ── */
const ALL = 'All';

export default function SearchClient() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<HymnIndex | null>(null);
  const [activeCat, setActiveCat] = useState<string>(ALL);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Load index once */
  useEffect(() => {
    fetch('/hymn-index.json')
      .then(r => r.json())
      .then((d: HymnIndex) => setIndex(d));
  }, []);

  /* Focus input after mount — small delay for iOS keyboard */
  useEffect(() => {
    const id = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(id);
  }, []);

  /* All unique categories from index */
  const cats = useMemo(() => {
    if (!index) return [];
    const set = new Set<string>();
    for (const e of index.hymns) if (e.cat) set.add(e.cat);
    return Array.from(set).sort();
  }, [index]);

  /* Scored + filtered results */
  const results = useMemo(() => {
    if (!index) return [];
    const q = query.trim();
    let pool = index.hymns;

    // Apply category filter
    if (activeCat !== ALL) {
      pool = pool.filter(e => e.cat === activeCat);
    }

    if (!q) {
      // No query: show all in number order (filtered by cat if set)
      return activeCat !== ALL ? pool.slice(0, 100) : [];
    }

    return pool
      .map(e => ({ e, s: score(e, q) }))
      .filter(x => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 80)
      .map(x => x.e);
  }, [query, index, activeCat]);

  const clear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  const isEmpty = !query.trim() && activeCat === ALL;
  const noResults = !isEmpty && results.length === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 60px)' }}>

      {/* ── Sticky search bar ── */}
      <div style={{
        flexShrink: 0,
        padding: '10px 14px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {/* Back */}
        <button
          onClick={() => router.back()}
          aria-label="Back"
          style={{
            flexShrink: 0, width: 38, height: 38, borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--text-sub)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        {/* Input wrapper */}
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg-card)',
          border: '1.5px solid var(--border)',
          borderRadius: 12, padding: '9px 12px',
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Number, title, first line…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, background: 'none', border: 'none', outline: 'none',
              fontSize: 16, color: 'var(--text)',
              /* Keep caret green */
              caretColor: 'var(--accent)',
            }}
          />
          {query && (
            <button
              onClick={clear}
              aria-label="Clear"
              style={{
                flexShrink: 0, lineHeight: 0, padding: 4,
                color: 'var(--text-muted)',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Category pills ── */}
      {cats.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'nowrap', gap: 8,
          overflowX: 'auto', overflowY: 'visible',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          flexShrink: 0,
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
        } as React.CSSProperties}>
          {[ALL, ...cats].map(cat => {
            const active = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  flexShrink: 0, padding: '6px 14px', borderRadius: 100,
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  background: active ? 'var(--accent)' : 'var(--bg-card)',
                  color: active ? '#fff' : 'var(--text-sub)',
                  border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  touchAction: 'manipulation',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* ── Results area ── */}
      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>

        {/* Empty state */}
        {isEmpty && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 14px', opacity: 0.5 }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Search 639 hymns</p>
            <p style={{ fontSize: 13 }}>By number, title, first line, or category</p>
          </div>
        )}

        {/* No results */}
        {noResults && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>No results</p>
            <p style={{ fontSize: 13 }}>Try a different word or hymn number</p>
          </div>
        )}

        {/* Results list */}
        {results.length > 0 && (
          <>
            <p style={{ padding: '8px 16px', fontSize: 12, color: 'var(--text-muted)' }}>
              {results.length} result{results.length !== 1 ? 's' : ''}
              {activeCat !== ALL ? ` · ${activeCat}` : ''}
            </p>
            <ul style={{ listStyle: 'none' }}>
              {results.map(entry => (
                <li key={entry.n}>
                  <Link
                    href={`/hymn/${entry.n}`}
                    className="row-tap"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '13px 16px',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    {/* Number badge */}
                    <span style={{
                      flexShrink: 0, width: 42, height: 42, borderRadius: 11,
                      background: 'var(--accent-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: entry.n >= 100 ? 12 : 14,
                      fontWeight: 700, color: 'var(--accent)',
                    }}>
                      {entry.n}
                    </span>

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontSize: 15, fontWeight: 500, color: 'var(--text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        marginBottom: 2,
                      }}>
                        {entry.t || entry.fl}
                      </p>
                      {entry.fl && entry.t && entry.t !== entry.fl && (
                        <p style={{
                          fontSize: 13, color: 'var(--text-sub)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {entry.fl}
                        </p>
                      )}
                      {entry.cat && (
                        <span className="chip" style={{ marginTop: 4, fontSize: 11, padding: '2px 8px' }}>
                          {entry.cat}
                        </span>
                      )}
                    </div>

                    {/* Chevron */}
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
