/* 227 — service worker : mise en cache pour la lecture hors-ligne.
   Ne collecte rien, ne contacte aucun serveur tiers. */
const V = 'a227-2026-08-26';
const CORE = ["./","./atlas/","./registre/","./audit/","./brol/","./brol/graph/","./doctrine/","./chantier/","./methode/","./assets/style.css","./assets/app.js","./assets/atlas.js","./assets/graph.js","./favicon.svg","./manifest.webmanifest"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()).catch(() => {}));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => {
      const copy = res.clone();
      caches.open(V).then(c => c.put(r, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(r).then(m => m || caches.match('./')))
  );
});