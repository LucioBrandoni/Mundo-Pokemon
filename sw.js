const APP_CACHE = 'mundo-pokemon-app-v1';
const RUNTIME_CACHE = 'mundo-pokemon-runtime-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/main.js',
  './js/battle.js',
  './js/storage.js',
  './js/data.js',
  './js/dom.js',
  './js/ui.js',
  './js/audio.js',
  './js/achievements.js',
  './assets/alf-faku.svg',
  './assets/bulbasaur.png',
  './assets/charmander.png',
  './assets/squirtle.png',
  './assets/pokeball.png',
  './assets/pokeball-icon.svg',
];

function crearRespuestaOffline(mensaje) {
  return new Response(mensaje, {
    status: 503,
    statusText: 'Service Unavailable',
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![APP_CACHE, RUNTIME_CACHE].includes(key))
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

function guardarEnCacheSiCorresponde(request, response) {
  if (!response || (response.type !== 'opaque' && !response.ok)) {
    return response;
  }

  const copia = response.clone();
  caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copia));
  return response;
}

async function responderAppShell(request) {
  const cache = await caches.open(APP_CACHE);
  const cacheado = await cache.match(request);
  if (cacheado) return cacheado;

  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    if (request.mode === 'navigate') {
      return cache.match('./index.html');
    }
    return crearRespuestaOffline(`No hay respuesta en caché disponible para ${request.url}.`);
  }
}

async function responderRuntime(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    const response = await fetch(request);
    return guardarEnCacheSiCorresponde(request, response);
  } catch {
    const cacheado = await cache.match(request);
    if (cacheado) return cacheado;
    return crearRespuestaOffline(`No hay respuesta dinámica en caché disponible para ${request.url}.`);
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const esMismoOrigen = url.origin === self.location.origin;

  if (esMismoOrigen) {
    event.respondWith(responderAppShell(request));
    return;
  }

  const origenCacheable = [
    'https://pokeapi.co',
    'https://raw.githubusercontent.com',
    'https://cdn.jsdelivr.net',
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ].some((origen) => url.origin === origen);

  if (origenCacheable) {
    event.respondWith(responderRuntime(request));
  }
});
