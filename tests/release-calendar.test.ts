import assert from 'node:assert/strict'
import test from 'node:test'
import { calendarDays, calendarPayload, validCalendarDate } from '../lib/release-calendar'

test('calendar dates reject rollover and accept leap dates', () => {
  assert.equal(validCalendarDate('2026-02-29'), false)
  assert.equal(validCalendarDate('2028-02-29'), true)
  assert.equal(validCalendarDate('2026-13-01'), false)
  assert.equal(validCalendarDate('09/10/2026'), false)
})
test('Monday-first calendar aligns Tuesday and Friday without timezone shifts', () => {
  const days = calendarDays('2026-10')
  assert.equal(days.indexOf('2026-10-09') % 7, 4)
  assert.equal(days.indexOf('2026-10-13') % 7, 1)
  assert.equal(days.filter(Boolean).length, 31)
  assert.equal(days.length % 7, 0)
  assert.deepEqual(calendarDays('2026-99'), [])
})
test('payload validates title, date and limits; preserves catalogue identifiers', () => {
  assert.throws(() => calendarPayload({ title: '', releaseDate: '2026-10-09' }))
  assert.throws(() => calendarPayload({ title: 'Test', releaseDate: '2026-02-31' }))
  assert.throws(() => calendarPayload({ title: 'Test', releaseDate: '2026-10-09', notes: 'x'.repeat(5001) }))
  const data = calendarPayload({ title: ' ZleeSyn - Run ', releaseDate: '2026-10-13', catalogueNumber: 'DNBDOC158' })
  assert.equal(data.title, 'ZleeSyn - Run')
  assert.equal(data.catalogueNumber, 'DNBDOC158')
  assert.equal(data.releaseDate.toISOString(), '2026-10-13T00:00:00.000Z')
  assert.equal(data.releaseId, null)
})
