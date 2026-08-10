// Service worker: cachea el shell de la app (HTML/CSS/JS/datos) para que
// funcione sin conexion. Los tiles del mapa (OpenStreetMap) necesitan
// internet siempre, pero la lista de campings y los popups funcionan offline.
const CACHE = "campings-shell-v2";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/i18n.js",
  "./data/campings.js",
  "./icons/icon.svg",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first para el shell; red con fallback a cache para el resto
// (tiles del mapa, etc, que no queremos cachear indefinidamente).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
