import assert from 'node:assert/strict'
import test from 'node:test'
import { flatHits, searchSite } from '../app/lib/catalog-search'

const payload = {
  q: 'Damo',
  artists: [{ slug: 'damo', name: 'Damo', image: null }],
  releases: [{ slug: 'damo-cobra-clutch', artist: 'Damo', title: 'Cobra Clutch', cover: 'c.jpg', type: 'Single', date: '2026-10-16' }],
  news: [{ slug: 'introducing-damo', title: 'Introducing Damo', cover: null, kind: 'News', date: '2026-01-01' }],
}

test('site search hits one endpoint and maps groups in artist → release → news order', async (t) => {
  const urls: string[] = []
  t.mock.method(globalThis, 'fetch', async (url: string) => {
    urls.push(url)
    return new Response(JSON.stringify(payload), { status: 200 })
  })
  const groups = await searchSite(' Damo ', 10)
  assert.deepEqual(urls, ['/api/search?q=Damo&limit=10'])
  const hits = flatHits(groups)
  assert.deepEqual(hits.map((h) => h.kind), ['artist', 'release', 'news'])
  assert.deepEqual(hits.map((h) => h.href), ['/artists/damo', '/music/damo-cobra-clutch', '/news/introducing-damo'])
  assert.equal(hits[1].sub, 'Damo')
  assert.equal(hits[1].tag, 'Single')
})

test('site search reports API failures rather than an empty success', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 503 }))
  await assert.rejects(searchSite('Damo'), /Search is unavailable/)
})

test('site search encodes query text and skips queries under 2 characters', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async (url: string) => {
    assert.match(url, /q=A%26B/)
    return new Response(JSON.stringify({ q: 'A&B', artists: [], releases: [], news: [] }), { status: 200 })
  })
  assert.deepEqual(flatHits(await searchSite('A&B')), [])
  assert.deepEqual(flatHits(await searchSite('a')), [])
  assert.equal(fetchMock.mock.callCount(), 1)
})
