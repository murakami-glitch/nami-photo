const VERSION = "2026-08-17T1907";
const CACHE_NAME = `npu-${VERSION}`;
const APP_URL = "./";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.add(APP_URL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("npu-") && key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.mode !== "navigate" || requestUrl.hostname.endsWith("googleapis.com")) return;
  event.respondWith(
    caches.match(APP_URL).then((cached) => cached || fetch(event.request))
  );
});
