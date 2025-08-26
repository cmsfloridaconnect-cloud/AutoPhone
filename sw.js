const CACHE = 'autodialer-pwa-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => (k===CACHE)?null:caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Only handle same-origin GET requests. Without this check, the service
  // worker attempts to cache cross-origin requests which can cause errors
  // for opaque responses or unnecessarily bloat the cache.
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      return cached || fetch(e.request).then(resp => {
        // Avoid caching error responses (e.g. 404s)
        if (!resp || !resp.ok) return resp;
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return resp;
      }).catch(()=> cached);
    })
  );
});
