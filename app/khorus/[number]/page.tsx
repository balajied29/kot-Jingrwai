import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllKhorus, getKhorus } from '@/lib/hymns';
import Header from '@/components/layout/Header';
import VerseBlock from '@/components/hymn/VerseBlock';
import FontSizeControl from '@/components/hymn/FontSizeControl';
import FontSizeSync from '@/components/hymn/FontSizeSync';

interface Props {
  params: Promise<{ number: string }>;
}

export async function generateStaticParams() {
  const khorusList = await getAllKhorus();
  return khorusList.map(k => ({ number: String(k.number) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { number } = await params;
  const k = await getKhorus(Number(number));
  if (!k) return {};
  return { title: k.section_heading ?? `Khoros ${number}` };
}

export default async function KhorusPage({ params }: Props) {
  const { number } = await params;
  const k = await getKhorus(Number(number));
  if (!k) notFound();

  return (
    <>
      <FontSizeSync />
      <Header title={`Khoros ${k.number}`} back="/khorus" />

      <main style={{ padding: '20px 20px 40px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: 32, fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
            {k.number}
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-lora), Georgia, serif',
          fontSize: 20, fontWeight: 600, color: 'var(--text)',
          lineHeight: 1.35, marginBottom: 20,
        }}>
          {k.section_heading ?? `Khoros ${k.number}`}
        </h1>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
          <FontSizeControl />
        </div>

        <div style={{ height: 1, background: 'var(--border)', marginBottom: 28 }} />

        {k.verses.map((verse, i) => (
          <VerseBlock key={i} verse={verse} index={i} />
        ))}
      </main>
    </>
  );
}
