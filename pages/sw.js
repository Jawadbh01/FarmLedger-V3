const CACHE = 'farmledger-v3-v1';
const BASE  = '/FarmLedger-V3';

// Files to cache for offline use
const STATIC = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/setup.html`,
  `${BASE}/css/style.css`,
  `${BASE}/manifest.json`,
  `${BASE}/images/icon-192.png`,
  `${BASE}/images/icon-512.png`,
  `${BASE}/pages/admin.html`,
  `${BASE}/pages/landlord.html`,
  `${BASE}/pages/manager.html`,
  `${BASE}/pages/farmer.html`,
];

// ── Install: cache all static files ───────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ─────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache first for static, network first for Firebase ──
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Let Firebase/Google APIs go straight to network
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('google') ||
      url.hostname.includes('gstatic') ||
      url.hostname.includes('googleapis') ||
      url.hostname.includes('fonts')) {
    e.respondWith(fetch(e.request).catch(() => new Response('')));
    return;
  }

  // For our static files: cache first, fallback to network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        // Cache new files we encounter
        if (res && res.status === 200 && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => {
        // If offline and not cached, return index.html for navigation
        if (e.request.mode === 'navigate') {
          return caches.match(`${BASE}/index.html`);
        }
      });
    })
  );
});

// ── Background Sync message ────────────────────
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
