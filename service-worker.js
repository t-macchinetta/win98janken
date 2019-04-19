var CACHE_NAME = 'win98janken';
var urlsToCache = [
    "https://osg-win98janken.netlify.com/",
    "https://osg-win98janken.netlify.com/index.html"
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(
                function (cache) {
                    return cache.addAll(urlsToCache);
                })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(
                function (response) {
                    if (response) {
                        return response;
                    }
                    return fetch(event.request);
                })
    );
});