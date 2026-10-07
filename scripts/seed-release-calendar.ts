import 'dotenv/config'
import assert from 'node:assert/strict'
import { prisma } from '../lib/prisma'

const schedule = [
  ['DNBDOC146', '2026-10-09', 'OTT (UK) - Morning Glory', 1],
  ['DNBDOC158', '2026-10-13', 'ZleeSyn - Run', 1],
  ['DNBDOC149', '2026-10-16', 'Damo - Cobra Clutch', 1],
  ['DNBDOC161', '2026-10-20', 'D.M.D - Blind Descent', 1],
  ['DNBDOC150', '2026-10-23', 'The Smell of Males - Burn the System EP', 2],
  ['DNBDOC160', '2026-10-27', 'Corbix - Tribe', 1],
  ['DNBDOC151', '2026-10-30', 'Dispectable - Bang Bang EP', 2],
  ['DNBDOC162', '2026-11-03', 'Atrox - Dead Signal', 1],
  ['DNBDOC153', '2026-11-06', 'CiDiaH - Mental Sound', 1],
  ['DNBDOC157', '2026-11-10', '5already - Clankers', 1],
  ['DNBDOC154', '2026-11-13', 'CrisHim - Wake Up Call', 1],
  ['DNBDOC156', '2026-11-27', 'EMGEN - Face Your End', 1],
  ['DNBDOC159', '2026-12-04', "N.Ghost - I Won't Wait You Anymore", 1],
  ['DNBDOC155', '2026-12-11', 'CPTL PNSHMNT feat. Aiokai - The Fall', null],
] as const

async function main() {
  const releases = await prisma.release.findMany({ select: { id: true, title: true } })
  const publicDates = await prisma.release.findMany({ select: { id: true, publishedAt: true }, orderBy: { id: 'asc' } })
  const normalize = (value: string) => value.toLowerCase().replace(/[–—]/g, '-').trim()
  await prisma.$transaction(async tx => {
    for (const [catalogueNumber, date, title, tracks] of schedule) {
      const matches = releases.filter(release => normalize(release.title) === normalize(title))
      const data = { title, releaseDate: new Date(`${date}T00:00:00Z`), catalogueNumber, releaseId: matches.length === 1 ? matches[0].id : null, notes: `Distributor status: Final${tracks === null ? '' : `\nTracks: ${tracks}`}` }
      await tx.releaseCalendarEntry.upsert({ where: { catalogueNumber }, create: data, update: data })
    }
  })
  const actual = await prisma.releaseCalendarEntry.findMany({ where: { catalogueNumber: { in: schedule.map(row => row[0]) } }, orderBy: { releaseDate: 'asc' } })
  assert.equal(actual.length, schedule.length)
  for (const [catalogueNumber, date, title] of schedule) {
    const entry = actual.find(item => item.catalogueNumber === catalogueNumber)!
    assert.equal(entry.title, title)
    assert.equal(entry.releaseDate.toISOString().slice(0, 10), date)
  }
  assert.deepEqual(await prisma.release.findMany({ select: { id: true, publishedAt: true }, orderBy: { id: 'asc' } }), publicDates)
  console.log(`Verified ${actual.length} schedule entries; public release dates unchanged.`)
  console.table(actual.map(item => ({ catalogue: item.catalogueNumber, date: item.releaseDate.toISOString().slice(0, 10), title: item.title })))
}
main().catch(error => { console.error(error.message); process.exitCode = 1 }).finally(() => prisma.$disconnect())
