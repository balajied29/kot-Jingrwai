import Link from 'next/link';

interface HeaderProps {
  title: string;
  back?: string;
  right?: React.ReactNode;
}

export default function Header({ title, back, right }: HeaderProps) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      display: 'flex', alignItems: 'center',
      padding: '0 4px',
      minHeight: 56,
      background: 'rgba(250,250,248,0.9)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      {back ? (
        <Link href={back} style={{
          width: 44, height: 44,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent)', borderRadius: 10, flexShrink: 0,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </Link>
      ) : (
        <div style={{ width: 44, flexShrink: 0 }} />
      )}

      <h1 style={{
        flex: 1, textAlign: 'center',
        fontSize: 16, fontWeight: 600,
        color: 'var(--text)', letterSpacing: '-0.01em',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {title}
      </h1>

      <div style={{ width: 44, flexShrink: 0, display: 'flex', justifyContent: 'flex-end' }}>
        {right}
      </div>
    </header>
  );
}
