// 觀棋心徑 PWA Service Worker (v5 — fully local).
//
// Now that all dependencies (React, Tailwind, fonts) are vendored under
// /vendor/, every request is same-origin. The SW is mostly belt-and-braces
// for the PWA case — inside the Capacitor APK, files are already bundled.
//
// ⚠️ 部署規則:每次修改 index.html / app.js / 此檔本身,都把版本號 +1。

const CACHE_VERSION = 'guanqi-v5';

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './vendor/js/tailwindcss.js',
  './vendor/js/react.production.min.js',
  './vendor/js/react-dom.production.min.js',
  './vendor/js/app.js',
  './vendor/css/noto-serif-tc.css',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await Promise.all(PRECACHE.map(async (url) => {
      try {
        const res = await fetch(url, { cache: 'reload' });
        if (res && res.ok) await cache.put(url, res);
      } catch (_) { /* tolerate; runtime cache will fill in later */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)));
    await self.clients.claim();
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    clients.forEach(c => c.postMessage({ type: 'SW_ACTIVATED', version: CACHE_VERSION }));
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Same-origin only — anything cross-origin (e.g. the Line QR image in the
  // donate / booking modal) bypasses the SW and goes straight to the network.
  if (url.origin !== self.location.origin) return;

  // Navigation (top-level page loads): network-first with cache fallback.
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(event.request);
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(event.request, copy)).catch(() => {});
        return res;
      } catch (_) {
        const cached = await caches.match(event.request);
        return cached
          || (await caches.match('./index.html'))
          || new Response('Offline', { status: 503 });
      }
    })());
    return;
  }

  // Static assets: cache-first; refill in background on cache miss.
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    try {
      const res = await fetch(event.request);
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE_VERSION).then(c => c.put(event.request, copy)).catch(() => {});
      }
      return res;
    } catch (_) {
      return new Response('Offline and not cached', { status: 503 });
    }
  })());
});
