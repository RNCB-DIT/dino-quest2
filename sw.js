
'use strict';
const VERSION='v2';
const BASE=self.registration.scope;
const PREFIX='dino-expedition:'+BASE+':';
const CACHE=PREFIX+VERSION;
const APP_URL=new URL('./index.html',BASE).href;
const ROOT_URL=new URL('./',BASE).href;
const FILES=['./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./icons/apple-touch-icon.png'].map(p=>new URL(p,BASE).href);
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES.map(url=>new Request(url,{cache:'reload'})));})());});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==new URL(BASE).origin||!url.href.startsWith(BASE))return;
  if(request.mode==='navigate'&&(url.pathname===new URL(ROOT_URL).pathname||url.pathname===new URL(APP_URL).pathname)){
    event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(APP_URL)||fetch(request);})());return;
  }
  if(FILES.includes(url.href))event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(request)||fetch(request);})());
});
