import assert from 'node:assert/strict'
import test from 'node:test'
import { searchCatalog } from '../app/lib/catalog-search'

test('catalogue search uses native APIs and ranks exact matches first', async (t) => {
  const urls: string[] = []
  t.mock.method(globalThis, 'fetch', async (url: string) => {
    urls.push(url)
    const items = url.startsWith('/api/artists')
      ? [{ id: 'artist', name: 'Damo', slug: 'damo' }]
      : url.startsWith('/api/news')
        ? [{ id: 'news', title: 'Introducing Damo', slug: 'introducing-damo', publishedAt: '2026-01-01' }]
        : [{ id: 'release', title: 'Damo - Cobra Clutch', slug: 'damo-cobra-clutch', publishedAt: '2026-10-16' }]
    return new Response(JSON.stringify({ items }), { status: 200 })
  })
  const results = await searchCatalog(' Damo ', 10)
  assert.deepEqual(urls, [
    '/api/releases?search=Damo&limit=10',
    '/api/news?search=Damo&limit=10',
    '/api/artists?search=Damo&limit=10',
  ])
  assert.deepEqual(results.map(result => result.type), ['artist', 'post', 'news'])
  assert.equal(results[0].title.rendered, 'Damo')
  assert.equal(results[0].date, '')
})

test('catalogue search reports API failures rather than an empty success', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 503 }))
  await assert.rejects(searchCatalog('Damo'), /Search is unavailable/)
})

test('catalogue search encodes query text and supports empty results', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url: string) => {
    assert.match(url, /search=A%26B/)
    return new Response(JSON.stringify({ items: [] }), { status: 200 })
  })
  assert.deepEqual(await searchCatalog('A&B'), [])
})
