// Service worker: cachea el shell de la app (HTML/CSS/JS/datos) para que
// funcione sin conexion. Los tiles del mapa (OpenStreetMap) necesitan
// internet siempre, pero la lista de campings y los popups funcionan offline.
const CACHE = "campings-shell-v22";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/i18n.js",
  "./data/campings.js",
  "./data/spots.js",
  "./data/patrimonio.js",
  "./icons/logo.png",
  "./icons/logo-192.png",
  "./icons/logo-512.png",
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

// Red primero para el shell (HTML/JS/CSS): asi siempre se sirve la version
// mas reciente cuando hay conexion, y solo cae a la cache (para poder usar
// la app sin conexion) si la red falla. Cache-first causaba que los cambios
// de codigo tardaran en verse reflejados aunque se subiera el ?v= del script.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
