// 麺帳 Service Worker — オフライン対応
// データ(localStorage/IndexedDB)には触れない。アプリ本体(HTML/CSS/フォント)のみキャッシュ。
const CACHE = 'mencho-v11'
const ASSETS = ['./','index.html','stats.html','wiki.html','trophy.html','achievements.js','manifest.webmanifest','icon.svg']

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const req = e.request
  if (req.method !== 'GET') return
  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')

  if (isHTML) {
    // HTML はネット優先（更新を即反映）→ 失敗時キャッシュ → 最終的に index.html
    e.respondWith(
      fetch(req).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res })
        .catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    )
  } else {
    // その他(フォント等)はキャッシュ優先＋裏で取得
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => {
        const cp = res.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return res
      }).catch(() => r))
    )
  }
})
