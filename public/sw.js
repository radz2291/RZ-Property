// public/sw.js

// This is a simple service worker that can help with performance
// by caching assets and API responses

// Set a unique cache version - update this whenever you make changes to the service worker
const CACHE_NAME = 'rz-property-cache-v1.1';
const RUNTIME_CACHE = 'rz-property-runtime-v1.1';

// Resources we want to cache on install
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/hero-bg.webp'
];

// Log an emoji message to make it easier to see service worker logs
const log = (emoji, message) => {
  console.log(`${emoji} Service Worker: ${message}`);
};

// Install event - precache critical resources
self.addEventListener('install', (event) => {
  log('🛠️', 'Installing');
  
  // Skip waiting to activate this service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        log('📦', 'Precaching resources');
        return cache.addAll(PRECACHE_RESOURCES);
      })
      .then(() => {
        log('✅', 'Installation complete');
      })
  );
});

// Activation event - clean up old caches
self.addEventListener('activate', (event) => {
  log('🚀', 'Activating');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('rz-property-') && 
                 cacheName !== CACHE_NAME &&
                 cacheName !== RUNTIME_CACHE;
        }).map((cacheName) => {
          log('🧹', `Deleting old cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => {
      log('✅', 'Service Worker activated');
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Strategic caching for different types of requests
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests, non-GET requests, and certain dynamic endpoints
  if (
    event.request.method !== 'GET' ||
    event.request.url.includes('supabase.co') ||
    event.request.url.includes('/api/') ||
    event.request.url.includes('/_next/webpack-hmr') // Skip Next.js hot module reloading
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
          log('🖼️', `Serving cached image: ${new URL(event.request.url).pathname}`);
          return cachedResponse;
        }
        
        return caches.open(RUNTIME_CACHE).then((cache) => {
          return fetch(event.request).then((response) => {
            // Store the valid response in cache
            if (response.ok && response.status === 200) {
              cache.put(event.request, response.clone());
              log('📥', `Cached new image: ${new URL(event.request.url).pathname}`);
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
      fetch(event.request)
        .then(response => {
          log('📄', `Fetched page from network: ${new URL(event.request.url).pathname}`);
          return response;
        })
        .catch(() => {
          log('📄', `Serving cached page: ${new URL(event.request.url).pathname}`);
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

// Additional event for background syncing (if needed later)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    log('⏩', 'Skip waiting and activating immediately');
  }
});

