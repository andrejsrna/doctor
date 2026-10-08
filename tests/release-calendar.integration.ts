import 'dotenv/config'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { auth } from '../app/lib/auth'
import { prisma } from '../lib/prisma'
import { GET, POST, PATCH, DELETE } from '../app/api/admin/calendar/route'

async function main() {
  // Only the session provider is stubbed; handlers and PostgreSQL operations are real.
  const original = auth.api.getSession
  let role: string | null = null
  Object.assign(auth.api, { getSession: async () => role ? { user: { id: 'calendar-integration-test', role } } : null })
  let id: string | undefined
  const request = (method: string, path = '', body?: object, origin = 'http://localhost:3018') => new NextRequest(`http://localhost:3018/api/admin/calendar${path}`, { method, headers: { origin, 'content-type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) })
  try {
    assert.equal((await GET(request('GET', '?month=2026-10'))).status, 401)
    role = 'ARTIST'
    assert.equal((await POST(request('POST', '', { title: 'Test', releaseDate: '2026-10-09' }))).status, 403)
    role = 'ADMIN'
    assert.equal((await POST(request('POST', '', { title: 'Test', releaseDate: '2026-10-09' }, 'https://other.invalid'))).status, 403)
    const proxied = new NextRequest('http://0.0.0.0:3000/api/admin/calendar', { method: 'POST', headers: { origin: 'https://dnbdoctor.com', host: 'dnbdoctor.com', 'x-forwarded-proto': 'https', 'sec-fetch-site': 'same-origin', 'content-type': 'application/json' }, body: JSON.stringify({ title: '', releaseDate: '2026-10-09' }) })
    assert.equal((await POST(proxied)).status, 400, 'Public HTTPS origin behind the reverse proxy must reach validation')
    const spoofed = new NextRequest('http://0.0.0.0:3000/api/admin/calendar', { method: 'POST', headers: { origin: 'https://other.invalid', 'x-forwarded-host': 'other.invalid', 'x-forwarded-proto': 'https', 'content-type': 'application/json' }, body: JSON.stringify({ title: 'Must not save', releaseDate: '2026-10-09' }) })
    assert.equal((await POST(spoofed)).status, 403, 'Do not trust arbitrary forwarded hosts')
    assert.equal((await GET(request('GET', '?month=2026-99'))).status, 400)
    assert.equal((await POST(request('POST', '', { title: 'Test', releaseDate: '2026-02-31' }))).status, 400)
    assert.equal((await POST(request('POST', '', { title: 'Test', releaseDate: '2026-10-09', releaseId: 'non-existent-test-release' }))).status, 400)
    const response = await POST(request('POST', '', { title: 'Calendar integration test', releaseDate: '2026-10-09', catalogueNumber: 'CALENDAR-TEST-' + Date.now() }))
    assert.equal(response.status, 201)
    const created = (await response.json()).item
    id = created.id
    const initial = await (await GET(request('GET', '?month=2026-10'))).json()
    assert(initial.items.some((item: { id: string }) => item.id === id))
    const moved = await PATCH(request('PATCH', '', { id, title: 'Calendar integration test moved', releaseDate: '2026-11-03', catalogueNumber: created.catalogueNumber }))
    assert.equal(moved.status, 200)
    const october = await (await GET(request('GET', '?month=2026-10'))).json()
    assert(!october.items.some((item: { id: string }) => item.id === id))
    const november = await (await GET(request('GET', '?month=2026-11'))).json()
    assert(november.items.some((item: { id: string; title: string }) => item.id === id && item.title === 'Calendar integration test moved'))
    assert.equal((await DELETE(request('DELETE', `?id=${id}`))).status, 200)
    assert.equal(await prisma.releaseCalendarEntry.findUnique({ where: { id } }), null)
    id = undefined
    console.log('PASS: unauthenticated 401, non-admin 403, cross-origin 403, invalid month/date/link 400; PostgreSQL create, read, move, delete verified.')
  } finally {
    Object.assign(auth.api, { getSession: original })
    if (id) await prisma.releaseCalendarEntry.deleteMany({ where: { id } })
    await prisma.$disconnect()
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
