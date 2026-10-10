/* Makes the app installable and usable offline. Network first, so updates always show when online. */
const V = "ibe-v1";
const CORE = ["./", "index.html", "setup.html", "manifest.webmanifest", "assets/style.css", "assets/core.js", "assets/app.js", "assets/setup.js", "assets/config.json",
  "assets/logo.png", "assets/logo-white.png", "assets/ib-myp.png", "assets/cognia.png", "assets/icons/icon-192.png", "assets/icons/icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; if (r.method !== "GET") return;
  const u = new URL(r.url), font = /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname);
  if (u.origin !== location.origin && !font) return;
  e.respondWith(fetch(r).then((res) => { if (res && (res.ok || res.type === "opaque")) { const c = res.clone(); caches.open(V).then((x) => x.put(r, c)); } return res; })
    .catch(() => caches.match(r).then((hit) => hit || (r.mode === "navigate" ? caches.match("index.html") : Response.error()))));
});
