const CACHE_VERSION = 'jera-static-v1';
const STATIC_CACHE = `${CACHE_VERSION}-assets`;
const PRECACHE_URLS = [
  '/offline',
  '/pwa/icon-192.png',
  '/pwa/icon-512.png',
  '/pwa/icon-maskable-512.png',
  '/brand/jera-mark-reference.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith('jera-static-') && key !== STATIC_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/offline')));
    return;
  }

  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/brand/') ||
    url.pathname.startsWith('/pwa/') ||
    ['font', 'image', 'script', 'style'].includes(request.destination);

  if (!isStaticAsset) return;

  event.respondWith(
    caches.match(request).then(async (cached) => {
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(STATIC_CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    }),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
