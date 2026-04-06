'use client';
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

/** Mount this once to sync stored font size to the CSS variable on initial load. */
export default function FontSizeSync() {
  const fontSize = useAppStore(s => s.fontSize);
  useEffect(() => {
    document.documentElement.style.setProperty('--hymn-font-size', `${fontSize}px`);
  }, [fontSize]);
  return null;
}
