import type { Verse } from '@/app/types';

interface VerseBlockProps {
  verse: Verse;
  index: number;
}

export default function VerseBlock({ verse, index }: VerseBlockProps) {
  const label = verse.number !== null ? verse.number : null;

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Verse lines */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {label !== null && (
          <span style={{
            fontSize: 13, fontWeight: 600, color: 'var(--accent)',
            minWidth: 20, paddingTop: 3, lineHeight: 1,
          }}>
            {label}
          </span>
        )}
        <div style={{ flex: 1 }}>
          {verse.lines.map((line, i) => (
            <div key={i} className="hymn-text" style={{ marginBottom: 2 }}>
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Chorus / refrain — indented, italic */}
      {verse.chorus && verse.chorus.length > 0 && (
        <div style={{
          marginTop: 10,
          paddingLeft: 36,
          paddingTop: 8,
          borderLeft: '2px solid var(--accent-light)',
        }}>
          {verse.chorus.map((line, i) => (
            <div
              key={i}
              className="hymn-text"
              style={{ fontStyle: 'italic', color: 'var(--text-sub)', marginBottom: 2 }}
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
