const cacheName = 'travel-app-cache-v1';
self.__WB_MANIFEST;

const filesToCache = [
  '/',
  '/index.html',
  // Lista de outros arquivos que você deseja armazenar em cache
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
