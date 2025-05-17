// public/sw.js

// This is a simple service worker that can help with performance
// by caching assets and API responses

const CACHE_NAME = 'rz-property-cache-v1';
const RUNTIME_CACHE = 'rz-property-runtime';

// Resources we want to cache on install
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/hero-bg.webp'
];

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_RESOURCES);
      })
  );
});

// Activation event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('rz-property-') && 
                 cacheName !== CACHE_NAME &&
                 cacheName !== RUNTIME_CACHE;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Strategic caching for different types of requests
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests and supabase API requests
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('supabase.co') ||
    event.request.url.includes('/api/')
  ) {
    return;
  }

  // Images should use cache-first strategy
  if (
    event.request.destination === 'image' ||
    event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return caches.open(RUNTIME_CACHE).then((cache) => {
          return fetch(event.request).then((response) => {
            // Store the valid response in cache
            if (response.ok && response.status === 200) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // For HTML pages - use network-first approach 
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Default: Use network with cache fallback for everything else
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache successful responses
        if (response.ok && response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(event.request, clonedResponse);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
