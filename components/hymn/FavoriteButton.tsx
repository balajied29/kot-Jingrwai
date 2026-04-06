'use client';
import { useAppStore } from '@/store/useAppStore';

export default function FavoriteButton({ number }: { number: number }) {
  const { toggleFavorite, isFavorite } = useAppStore();
  const active = isFavorite(number);

  return (
    <button
      onClick={() => toggleFavorite(number)}
      aria-label={active ? 'Remove from saved' : 'Save hymn'}
      style={{
        width: 40, height: 40, borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: active ? 'var(--accent)' : 'var(--text-muted)',
        transition: 'color 0.18s, transform 0.15s',
        background: active ? 'var(--accent-light)' : 'transparent',
      }}
    >
      <svg
        width="20" height="20" viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor" strokeWidth="1.8"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    </button>
  );
}
