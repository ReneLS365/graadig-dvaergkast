const CACHE_NAME = 'graadig-v12-cache';
const ASSETS = [
  './',
  './index.html',
  './dist/app.bundle.js',
  './src/styles/main.css',
  './src/game/main.js',
  './src/pwa/manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
      return resp;
    }).catch(() => cached))
  );
});
