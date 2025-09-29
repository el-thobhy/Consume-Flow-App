const CACHE_NAME = 'consumption-app-static-v1';
const STATIC_ASSETS = [
    
    '/sw.js',
    '/manifest.json'
];

// Cache static files on install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
    );
    console.log("Service Worker: Installed & Static Assets Cached");
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    console.log("Service Worker: Activated");
});

// Serve cached static files
self.addEventListener('fetch', event => {
    if (STATIC_ASSETS.includes(new URL(event.request.url).pathname)) {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
    // Otherwise, let the request go to the network
});