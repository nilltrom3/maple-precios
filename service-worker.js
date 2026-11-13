const CACHE = 'maple-precios-v17';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.url.includes('prices.json') || e.request.url.includes('drops.json') || e.request.url.includes('icons.json') || e.request.url.includes('mobs.json') || e.request.url.includes('locations.json') || e.request.url.includes('quests.json') || e.request.url.includes('maps.json')) {
    e.respondWith(fetch(e.request).then(r => { const cl = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); return r; }).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(m => m || fetch(e.request)));
  }
});
