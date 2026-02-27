/// <reference lib="webworker" />
// Service Worker — Sistema de Comidas
const CACHE_NAME = "comidas-v5";

const ARCHIVOS_CACHE = [
  "/",
  "/index.html",
  "/estilo.css",
  "/firebase-config.js",
  "/manifest.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
  "/PAGES/registro.html",
  "/PAGES/conteo.html",
  "/PAGES/admin.html",
  "/PAGES/menu_admin.html",
  "/PAGES/personal.html",
  "/PAGES/lista_personal.html",
  "/PAGES/otros.html",
  "/PAGES/panel_supervisor.html",
  "/PAGES/panel_admin.html",
  "/PAGES/extras.html"
];

// Instalar: guardar archivos en caché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS_CACHE))
  );
  self.skipWaiting();
});

// Activar: limpiar cachés viejos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Network First — Firebase siempre usa la red, el resto cacheable
self.addEventListener("fetch", (event) => {
  // No interceptar peticiones a Firebase ni a las librerías externas
  if (
    event.request.url.includes("firebaseio.com") ||
    event.request.url.includes("gstatic.com") ||
    event.request.url.includes("firebasejs")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copia = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copia));
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || caches.match("/index.html"))
      )
  );
});
