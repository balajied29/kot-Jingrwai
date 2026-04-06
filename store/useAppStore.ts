'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  fontSize: number;        // in px, 14–26
  favorites: number[];     // hymn numbers
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  toggleFavorite: (n: number) => void;
  isFavorite: (n: number) => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      fontSize: 17,
      favorites: [],

      increaseFontSize: () =>
        set(s => ({ fontSize: Math.min(s.fontSize + 1, 26) })),

      decreaseFontSize: () =>
        set(s => ({ fontSize: Math.max(s.fontSize - 1, 14) })),

      toggleFavorite: (n: number) =>
        set(s => ({
          favorites: s.favorites.includes(n)
            ? s.favorites.filter(x => x !== n)
            : [...s.favorites, n],
        })),

      isFavorite: (n: number) => get().favorites.includes(n),
    }),
    {
      name: 'kot-jingrwai',
      partialize: (s) => ({ fontSize: s.fontSize, favorites: s.favorites }),
    },
  ),
);
