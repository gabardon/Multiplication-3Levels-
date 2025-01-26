const CACHE_NAME = "Multiplication-3Levels"; // Update the version when changes are made
const urlsToCache = [
  "/", 
  "/index.html", 
  "/styles.css", 
  "/script.js", 
  "/manifest.json", 
  "icon-192x192.png", // Add your image assets
  "icon-512x512.png", // Add your image assets
  "favicon.ico", // Add your image assets
  "correct.mp3", // Add any other required assets
  "wrong.mp3", // Add any other required assets
  "/RobotoMono-Bold.ttf",
];

// Install Event: Cache files
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((error) => {
        console.error("[Service Worker] Failed to cache files:", error);
      });
    })
  );
});




// Activate Event: Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log(`[Service Worker] Deleting old cache: ${cache}`);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Take control of any open pages immediately
});

// Fetch Event: Serve cached files or fetch from network
self.addEventListener("fetch", (event) => {
  console.log(`[Service Worker] Fetching: ${event.request.url}`);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Return the cached response if found
      }
      return fetch(event.request).then((networkResponse) => {
        // Optionally cache new requests here (e.g., dynamically loaded files)
        return networkResponse;
      }).catch(() => {
        // Fallback for offline mode (e.g., custom offline page)
        if (event.request.destination === "document") {
          return caches.match("/index.html"); // Serve the homepage if offline
        }
      });
    })
  );
});
