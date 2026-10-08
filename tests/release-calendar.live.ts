import 'dotenv/config'
import assert from 'node:assert/strict'
import { createHmac, randomUUID } from 'node:crypto'
import { prisma } from '../lib/prisma'

async function main() {
  const base = 'https://dnbdoctor.com'
  const token = randomUUID()
  const user = await prisma.user.create({ data: { name: 'Calendar smoke test', email: `calendar-test-${randomUUID()}@example.invalid`, role: 'ADMIN' } })
  let entryId: string | undefined
  try {
    await prisma.session.create({ data: { userId: user.id, token, expiresAt: new Date(Date.now() + 600000) } })
    const secret = process.env.BETTER_AUTH_SECRET
    assert(secret, 'Auth secret required; never printed')
    const value = encodeURIComponent(`${token}.${createHmac('sha256', secret).update(token).digest('base64')}`)
    const headers = { cookie: `__Secure-better-auth.session_token=${value}`, origin: base, 'content-type': 'application/json', 'sec-fetch-site': 'same-origin' }
    const get = await fetch(`${base}/api/admin/calendar?month=2026-10`, { headers })
    assert.equal(get.status, 200, 'Real temporary admin session must be accepted')
    console.log('Live authenticated GET:', get.status)
    const probe = await fetch(`${base}/api/admin/calendar`, { method: 'POST', headers, body: JSON.stringify({ title: '', releaseDate: '2026-10-09' }) })
    console.log('Live same-origin POST validation:', probe.status, await probe.text())
    if (process.argv.includes('--expect-blocked')) { assert.equal(probe.status, 403); return }
    assert.equal(probe.status, 400, 'Same-origin request must reach payload validation, not fail CSRF')
    const create = await fetch(`${base}/api/admin/calendar`, { method: 'POST', headers, body: JSON.stringify({ title: 'Calendar live smoke test', releaseDate: '2026-10-09' }) })
    assert.equal(create.status, 201)
    entryId = (await create.json()).item.id
    const listed = await (await fetch(`${base}/api/admin/calendar?month=2026-10`, { headers })).json()
    assert(listed.items.some((item: { id: string }) => item.id === entryId))
    const update = await fetch(`${base}/api/admin/calendar`, { method: 'PATCH', headers, body: JSON.stringify({ id: entryId, title: 'Calendar live smoke test moved', releaseDate: '2026-11-03' }) })
    assert.equal(update.status, 200)
    const moved = await (await fetch(`${base}/api/admin/calendar?month=2026-11`, { headers })).json()
    assert(moved.items.some((item: { id: string }) => item.id === entryId))
    const crossSite = await fetch(`${base}/api/admin/calendar`, { method: 'POST', headers: { ...headers, origin: 'https://other.invalid' }, body: JSON.stringify({ title: 'Must not save', releaseDate: '2026-10-09' }) })
    assert.equal(crossSite.status, 403)
    const remove = await fetch(`${base}/api/admin/calendar?id=${entryId}`, { method: 'DELETE', headers })
    assert.equal(remove.status, 200)
    assert.equal(await prisma.releaseCalendarEntry.findUnique({ where: { id: entryId } }), null)
    entryId = undefined
    console.log('PASS: live real admin auth, create/read/move/delete, cross-origin rejection. All smoke-test data cleaned up.')
  } finally {
    if (entryId) await prisma.releaseCalendarEntry.deleteMany({ where: { id: entryId } })
    await prisma.user.delete({ where: { id: user.id } })
    await prisma.$disconnect()
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1 })
