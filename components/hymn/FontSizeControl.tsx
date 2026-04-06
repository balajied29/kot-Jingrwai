'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function FontSizeControl() {
  const { fontSize, increaseFontSize, decreaseFontSize } = useAppStore();

  useEffect(() => {
    document.documentElement.style.setProperty('--hymn-font-size', `${fontSize}px`);
  }, [fontSize]);

  const btnStyle: React.CSSProperties = {
    width: 40, height: 40, borderRadius: 9,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    color: 'var(--text-sub)', touchAction: 'manipulation',
    flexShrink: 0,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <button onClick={decreaseFontSize} aria-label="Smaller text" style={btnStyle}>
        <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1 }}>A</span>
      </button>
      <span style={{
        minWidth: 30, textAlign: 'center',
        fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
      }}>
        {fontSize}
      </span>
      <button onClick={increaseFontSize} aria-label="Larger text" style={btnStyle}>
        <span style={{ fontSize: 19, fontWeight: 500, lineHeight: 1 }}>A</span>
      </button>
    </div>
  );
}
