// Service Worker for Qissa'25 PWA
const CACHE_NAME = 'qissa25-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/competitions.html',
  '/registration.html',
  '/ambassador.html',
  '/rules/index.html',
  '/assets/css/styles.css',
  '/assets/js/main.js',
  '/assets/img/Qissa Logo NO BG.png',
  '/assets/img/NUML LOGO NO BG.png',
  '/assets/img/Qissa55.png',
  '/assets/data/announcements.json'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
