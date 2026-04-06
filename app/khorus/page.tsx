import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllKhorus } from '@/lib/hymns';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Ki Khoros',
};

export default async function KhorusPage() {
  const khorusList = await getAllKhorus();

  return (
    <>
      <Header title="Ki Khoros" />
      <main>
        <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {khorusList.length} khoros collections (nos. 700–709)
          </p>
        </div>

        <ul style={{ listStyle: 'none' }}>
          {khorusList.map(k => {
            const firstLine = k.verses[0]?.lines[0] ?? '';
            const verseCount = k.verses.length;
            return (
              <li key={k.number}>
                <Link
                  href={`/khorus/${k.number}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px', borderBottom: '1px solid var(--border)',
                    transition: 'background 0.12s',
                  }}
                >
                  <span style={{
                    flexShrink: 0, width: 44, height: 44, borderRadius: 10,
                    background: 'var(--accent-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 700, color: 'var(--accent)',
                  }}>
                    {k.number}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: 15, fontWeight: 500, color: 'var(--text)', marginBottom: 2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {k.section_heading || `Khoros ${k.number}`}
                    </p>
                    {firstLine && (
                      <p style={{
                        fontSize: 13, color: 'var(--text-sub)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {firstLine}
                      </p>
                    )}
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      {verseCount} {verseCount === 1 ? 'verse' : 'verses'}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
