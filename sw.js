// Service Worker for Qissa'25 PWA
const CACHE_NAME = 'qissa25-v2';
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
  self.skipWaiting(); // Allow new service worker to activate immediately
});

// Fetch event - Network first strategy (always get fresh content)
self.addEventListener('fetch', event => {
  // Never cache the service worker file itself - always fetch fresh
  if (event.request.url.includes('/sw.js')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Network request succeeded - cache it and return fresh response
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // Network request failed - fallback to cache for offline support
        return caches.match(event.request);
      })
  );
});

// Activate event - Clean up old caches
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
  return self.clients.claim(); // Take control of all pages immediately
});
