import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst, NetworkFirst } from "serwist";

declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

// Cache the hymn index for offline search
const hymnIndexCache: import("serwist").RuntimeCaching = {
  matcher: ({ url }) => url.pathname === '/hymn-index.json',
  handler: new CacheFirst({
    cacheName: 'hymn-data',
    plugins: [
      {
        // Cache for 30 days — content is static
        cacheKeyWillBeUsed: async ({ request }) => request,
      },
    ],
  }),
};

// Navigation: network-first, 5s timeout, then cached shell
const navigationHandler: import("serwist").RuntimeCaching = {
  matcher: ({ request }) => request.mode === 'navigate',
  handler: new NetworkFirst({ networkTimeoutSeconds: 5 }),
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [hymnIndexCache, navigationHandler, ...defaultCache],
});

serwist.addEventListeners();
