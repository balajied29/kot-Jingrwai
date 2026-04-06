import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllHymns, getHymn } from '@/lib/hymns';
import VerseBlock from '@/components/hymn/VerseBlock';
import FavoriteButton from '@/components/hymn/FavoriteButton';
import FontSizeControl from '@/components/hymn/FontSizeControl';
import FontSizeSync from '@/components/hymn/FontSizeSync';

interface Props {
  params: Promise<{ number: string }>;
}

export async function generateStaticParams() {
  const hymns = await getAllHymns();
  return hymns.map(h => ({ number: String(h.number) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  const hymn = await getHymn(Number(number));
  if (!hymn) return {};
  const title = hymn.db_name?.replace(/^\d+\.\s*/, '') ?? hymn.sub_title ?? `Hymn ${hymn.number}`;
  return {
    title: `${hymn.number}. ${title}`,
    description: hymn.verses[0]?.lines[0] ?? '',
  };
}

export default async function HymnPage({ params }: Props) {
  const { number } = await params;
  const hymn = await getHymn(Number(number));
  if (!hymn) notFound();

  const title = hymn.db_name?.replace(/^\d+\.\s*/, '') ?? hymn.sub_title ?? `Jingrwai ${hymn.number}`;
  const prev = hymn.number > 1 ? hymn.number - 1 : null;
  const next = hymn.number < 639 ? hymn.number + 1 : null;

  return (
    <>
      <FontSizeSync />

      {/* ── Sticky header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        display: 'flex', alignItems: 'center',
        padding: '0 4px',
        minHeight: 52,
        background: 'rgba(250,250,248,0.93)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Back */}
        <Link href="/" style={{
          width: 48, height: 48, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent)',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </Link>

        {/* Title */}
        <div style={{ flex: 1, textAlign: 'center', minWidth: 0, padding: '0 4px' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Jingrwai
          </p>
          <p style={{ fontSize: 17, fontWeight: 700, color: 'var(--text)', lineHeight: 1.1 }}>
            {hymn.number}
          </p>
        </div>

        {/* Favorite */}
        <div style={{ width: 48, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
          <FavoriteButton number={hymn.number} />
        </div>
      </header>

      {/* ── Content ── extra bottom padding for the fixed toolbar ── */}
      <main style={{
        padding: '20px 20px 24px',
        maxWidth: 680, margin: '0 auto',
        /* Extra space for fixed bottom toolbar */
        paddingBottom: 'calc(80px + var(--sab))',
      }}>
        {/* Section label */}
        {hymn.section_heading && (
          <p style={{
            fontSize: 10, fontWeight: 600, color: 'var(--text-muted)',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10,
          }}>
            {hymn.section_heading}
            {hymn.sub_section ? ` · ${hymn.sub_section}` : ''}
          </p>
        )}

        {/* Number + old number */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', lineHeight: 1 }}>
            {hymn.number}
          </span>
          {hymn.old_number && hymn.old_number !== hymn.number && (
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>({hymn.old_number})</span>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: 'var(--font-lora), Georgia, serif',
          fontSize: 21, fontWeight: 600, color: 'var(--text)',
          lineHeight: 1.3, marginBottom: hymn.sub_title && hymn.sub_title !== title ? 6 : 10,
        }}>
          {title}
        </h1>

        {/* Sub-title */}
        {hymn.sub_title && hymn.sub_title !== title && (
          <p style={{
            fontFamily: 'var(--font-lora), Georgia, serif',
            fontSize: 15, fontStyle: 'italic', color: 'var(--text-sub)', marginBottom: 10,
          }}>
            {hymn.sub_title}
          </p>
        )}

        {/* Tune */}
        {hymn.tune && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12, letterSpacing: '0.02em' }}>
            {hymn.tune}
          </p>
        )}

        {/* Category */}
        {hymn.category && (
          <span className="chip" style={{ marginBottom: 24, display: 'inline-flex' }}>
            {hymn.category}
          </span>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border)', margin: '4px 0 28px' }} />

        {/* Verses */}
        {hymn.verses.map((verse, i) => (
          <VerseBlock key={i} verse={verse} index={i} />
        ))}

        {/* Author */}
        {hymn.author && (
          <p style={{
            fontSize: 13, color: 'var(--text-muted)', textAlign: 'right',
            marginTop: 4, fontStyle: 'italic',
          }}>
            — {hymn.author}
          </p>
        )}
      </main>

      {/* ── Fixed bottom toolbar ── */}
      <div style={{
        position: 'fixed',
        bottom: 'var(--nav-h)', left: 0, right: 0,
        zIndex: 90,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px',
        background: 'rgba(250,250,248,0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border)',
      }}>
        {/* Prev */}
        {prev ? (
          <Link href={`/hymn/${prev}`} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 14px', borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            fontSize: 13, fontWeight: 500, color: 'var(--text-sub)',
            minWidth: 72,
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            {prev}
          </Link>
        ) : <div style={{ width: 72 }} />}

        {/* Font size control — centre */}
        <FontSizeControl />

        {/* Next */}
        {next ? (
          <Link href={`/hymn/${next}`} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6,
            padding: '9px 14px', borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            fontSize: 13, fontWeight: 500, color: 'var(--text-sub)',
            minWidth: 72,
          }}>
            {next}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </Link>
        ) : <div style={{ width: 72 }} />}
      </div>
    </>
  );
}
