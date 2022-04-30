const  CACHE_NAME ="my-site-cache-v1";
const DATA_CACHE_NAME ="data-cache-v1";

const FILES_TO_CACHE =[
"./index.js",
"./css/styles.css",
"./js/idb.js",
"./js/index.js",
"./manifest.json",
"./icons/icon-72x72.png",
"./icons/icon-96x96.png",
"./icons/icon-128x128.png",
"./icons/icon-144x144.png",
"./icons/icon-152x152.png",
"./icons/icon-192x192.png",
"./icons/icon-384x384.png",
"./icons/icon-512x512.png"
];

// CASGE RESOURCES /// 

self.addEventListener("install", function (event) {
    event.waitUntil (
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('installing cache :' + CACHE_NAME)
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// RESPOND TO CACHEEE /// 
self.addEventListener("fetch", function (event){
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                .then(response => {
                    // if the response was good, clone it and store it// 
                    if (response.status === 200 ){
                        cache.put(event.request.url, response.clone ());
                    }
                    return response;
                })
                .catch (err => {
                    // network request failed, try and get it from cache// 
                    return cache.match(event.request);
                });
            }).catch(err => console.log(err))
        );
        return;
    }
event.respondWith(
    fetch(event.request).catch(function() {
        return caches.match(event.request).then(function(response){
            if (response) {
                return response;
            } else if (event.request.headers.get("accept").includes("text/html")) {
                return caches.match("/");
            }
        });
    })
);
})

