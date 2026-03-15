const CACHE_NAME = "farmledger-static-v3";

const STATIC_ASSETS = [
  "./css/style.css",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];


/* ---------------- INSTALL ---------------- */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((err) => {
        console.error("SW install cache failed:", err);
      })
  );

  self.skipWaiting();
});


/* ---------------- ACTIVATE ---------------- */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});


/* ---------------- FETCH ---------------- */

self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  /* NEVER cache HTML pages */
  if (event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(fetch(event.request));
    return;
  }

  /* Cache-first for static files */
  if (
    url.pathname.includes(".css") ||
    url.pathname.includes(".js") ||
    url.pathname.includes("/icons/") ||
    url.pathname.includes("manifest")
  ) {

    event.respondWith(
      caches.match(event.request).then((cached) => {

        if (cached) return cached;

        return fetch(event.request).then((response) => {

          const clone = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });

          return response;

        });

      })
    );

  }

});