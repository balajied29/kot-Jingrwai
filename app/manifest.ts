import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kot Jingrwai',
    short_name: 'Jingrwai',
    description: 'Ka kot jingrwai — Khasi Hymnbook',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAFAF8',
    theme_color: '#2D5A27',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
