'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { calendarDays } from '@/lib/release-calendar'

type Entry = { id: string; title: string; releaseDate: string; catalogueNumber: string | null; releaseId: string | null; notes: string | null }
type Release = { id: string; title: string }
const emptyForm = { title: '', catalogueNumber: '', releaseId: '', notes: '', releaseDate: '' }
const inputStyle = 'w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
const buttonStyle = 'rounded-lg border border-gray-700 px-3 py-2 text-sm hover:bg-gray-800 disabled:opacity-50 focus-visible:outline focus-visible:outline-green-400'
function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
function label(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }

export default function CalendarPage() {
  const [month, setMonth] = useState('')
  const [selected, setSelected] = useState('')
  const [today, setToday] = useState('')
  const [items, setItems] = useState<Entry[]>([])
  const [releases, setReleases] = useState<Release[]>([])
  const [query, setQuery] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const date = localDate(new Date())
    setToday(date); setMonth(date.slice(0, 7)); setSelected(date)
    setForm({ ...emptyForm, releaseDate: date })
  }, [])

  const load = useCallback(async (currentMonth: string, signal?: AbortSignal) => {
    const response = await fetch(`/api/admin/calendar?month=${currentMonth}`, { cache: 'no-store', signal })
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'Could not load calendar')
    return data as { items: Entry[]; releases: Release[] }
  }, [])

  useEffect(() => {
    if (!month) return
    const controller = new AbortController()
    setLoading(true); setError('')
    load(month, controller.signal).then(data => { setItems(data.items); setReleases(data.releases) })
      .catch(error => { if (!controller.signal.aborted) setError(error.message) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [month, load, retry])

  function select(date: string) {
    setSelected(date); setEditing(null); setQuery(''); setNotice('')
    setForm({ ...emptyForm, releaseDate: date })
  }
  function moveMonth(delta: number) {
    const date = new Date(`${month}-01T12:00:00`)
    date.setMonth(date.getMonth() + delta)
    const next = localDate(date).slice(0, 7)
    setMonth(next); select(`${next}-01`)
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    try {
      const response = await fetch('/api/admin/calendar', { method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: editing }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not save entry')
      // Read back the exact month after saving, rather than trusting optimistic state.
      const nextMonth = form.releaseDate.slice(0, 7)
      const refreshed = await load(nextMonth)
      setItems(refreshed.items); setReleases(refreshed.releases)
      setMonth(nextMonth); select(form.releaseDate); setNotice('Release saved.')
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not save entry') }
    finally { setBusy(false) }
  }
  async function remove(item: Entry) {
    if (!window.confirm(`Remove ${item.title} from the calendar? This does not delete the release.`)) return
    setBusy(true); setError(''); setNotice('')
    try {
      const response = await fetch(`/api/admin/calendar?id=${encodeURIComponent(item.id)}`, { method: 'DELETE' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Could not delete entry')
      const refreshed = await load(month)
      setItems(refreshed.items)
      if (editing === item.id) select(selected)
      setNotice('Entry removed.')
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not delete entry') }
    finally { setBusy(false) }
  }
  const selectedItems = items.filter(item => item.releaseDate.slice(0, 10) === selected)
  const candidates = query.trim() ? releases.filter(release => release.title.toLowerCase().includes(query.toLowerCase())).slice(0, 12) : []

  return <div className="mx-auto max-w-6xl space-y-6 px-3 py-8 text-white sm:px-6">
    <div><Link href="/admin" className="text-sm text-gray-400 hover:text-white">Back to admin</Link>
      <h1 className="mt-3 text-3xl font-bold">Release Calendar</h1>
      <p className="mt-2 text-sm text-gray-400">Plan your releases. Tuesdays and Fridays are highlighted. Calendar changes do not modify public release dates.</p></div>
    {error && <div role="alert" className="rounded-lg border border-red-500/40 p-4 text-red-300">{error} <button className={buttonStyle + ' ml-3'} onClick={() => setRetry(value => value + 1)}>Retry</button></div>}
    {notice && <p role="status" className="text-green-300">{notice}</p>}
    <section className="rounded-xl border border-gray-800 bg-gray-950/70 p-3 sm:p-5" aria-label="Monthly release calendar">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{month && new Date(`${month}-01T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h2>
        <div className="flex gap-2"><button aria-label="Previous month" disabled={!month || busy} className={buttonStyle} onClick={() => moveMonth(-1)}>Previous</button><button disabled={!today || busy} className={buttonStyle} onClick={() => { setMonth(today.slice(0, 7)); select(today) }}>Today</button><button aria-label="Next month" disabled={!month || busy} className={buttonStyle} onClick={() => moveMonth(1)}>Next</button></div>
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => <div key={day} className={`py-2 text-center text-xs font-semibold sm:text-sm ${index === 1 || index === 4 ? 'text-green-300' : 'text-gray-400'}`}>{day}</div>)}
        {calendarDays(month).map((date, index) => {
          const dayItems = date ? items.filter(item => item.releaseDate.slice(0, 10) === date) : []
          const releaseDay = index % 7 === 1 || index % 7 === 4
          return date ? <button key={date} disabled={busy || loading} onClick={() => select(date)} aria-pressed={selected === date} aria-label={`${label(date)}, ${dayItems.length} releases${releaseDay ? ', release day' : ''}`} className={`min-h-24 min-w-0 rounded-lg border p-1.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-300 sm:min-h-32 sm:p-3 ${selected === date ? 'border-green-400 bg-green-950/60' : releaseDay ? 'border-green-800/50 bg-green-950/20 hover:bg-green-950/40' : 'border-gray-800 hover:bg-gray-800/50'}`}>
            <span className={`text-sm ${date === today ? 'font-bold text-green-300 underline underline-offset-4' : ''}`}>{Number(date.slice(-2))}</span>
            {releaseDay && <span className="mt-1 hidden text-[10px] uppercase tracking-wide text-green-500 sm:block">Release day</span>}
            {loading ? <div className="mt-2 h-3 animate-pulse rounded bg-gray-800" /> : <div className="mt-2 space-y-1">{dayItems.slice(0, 2).map(item => <div key={item.id} className="truncate rounded bg-gray-800/90 px-1 py-1 text-[10px] sm:text-xs" title={item.title}>{item.title}</div>)}{dayItems.length > 2 && <span className="text-xs text-gray-400">+{dayItems.length - 2} more</span>}</div>}
          </button> : <div key={`blank-${index}`} aria-hidden="true" />
        })}
      </div>
      {!loading && !error && items.length === 0 && <p className="mt-5 text-sm text-gray-400">No releases scheduled this month. Select a date to add one.</p>}
    </section>
    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-5"><h2 className="text-lg font-semibold">{selected ? label(selected) : 'Select a day'}</h2>
        {loading ? <p className="mt-4 text-gray-400">Loading schedule...</p> : selectedItems.length === 0 ? <p className="mt-4 text-gray-400">No releases on this day.</p> : <ul className="mt-4 divide-y divide-gray-800">{selectedItems.map(item => <li key={item.id} className="space-y-2 py-4"><h3 className="font-semibold">{item.title}</h3>{item.catalogueNumber && <p className="text-xs text-green-300">{item.catalogueNumber}</p>}{item.notes && <p className="whitespace-pre-wrap text-sm text-gray-400">{item.notes}</p>}<div className="flex gap-2"><button disabled={busy} className={buttonStyle} onClick={() => { setEditing(item.id); setQuery(''); setForm({ title: item.title, releaseDate: item.releaseDate.slice(0, 10), catalogueNumber: item.catalogueNumber || '', releaseId: item.releaseId || '', notes: item.notes || '' }) }}>Edit / move</button><button disabled={busy} className={buttonStyle + ' text-red-300'} onClick={() => remove(item)}>Remove</button></div></li>)}</ul>}
      </div>
      <form onSubmit={save} className="space-y-4 rounded-xl border border-gray-800 bg-gray-950/70 p-5">
        <h2 className="text-lg font-semibold">{editing ? 'Edit scheduled release' : 'Add release to selected day'}</h2>
        <label className="block text-sm">Search existing releases<input className={inputStyle + ' mt-2'} value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by artist or title" disabled={busy} /></label>
        {query.trim() && <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-800">{candidates.length ? candidates.map(release => <button className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-800" type="button" key={release.id} onClick={() => { setForm({ ...form, releaseId: release.id, title: release.title }); setQuery('') }}>{release.title}</button>) : <p className="p-3 text-sm text-gray-400">No matches. Enter an upcoming release below.</p>}</div>}
        {form.releaseId && <p className="text-xs text-green-300">Linked to catalogue. <button type="button" className="underline" onClick={() => setForm({ ...form, releaseId: '' })}>Unlink</button></p>}
        <label className="block text-sm">Release title<input required maxLength={300} className={inputStyle + ' mt-2'} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="Artist - Release" disabled={busy} /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm">Release date<input required type="date" className={inputStyle + ' mt-2'} value={form.releaseDate} onChange={event => setForm({ ...form, releaseDate: event.target.value })} disabled={busy} /></label><label className="block text-sm">Catalogue number (optional)<input maxLength={60} className={inputStyle + ' mt-2'} value={form.catalogueNumber} onChange={event => setForm({ ...form, catalogueNumber: event.target.value })} placeholder="DNBDOC..." disabled={busy} /></label></div>
        <label className="block text-sm">Notes (optional)<textarea rows={3} maxLength={5000} className={inputStyle + ' mt-2'} value={form.notes} onChange={event => setForm({ ...form, notes: event.target.value })} disabled={busy} /></label>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <div className="flex gap-2"><button disabled={busy || loading || !selected} className="rounded-lg bg-green-700 px-4 py-2 font-medium hover:bg-green-600 disabled:opacity-50 focus-visible:outline focus-visible:outline-green-300">{busy ? 'Saving...' : editing ? 'Save changes' : 'Add release'}</button>{editing && <button type="button" className={buttonStyle} disabled={busy} onClick={() => select(selected)}>Cancel</button>}</div>
      </form>
    </section>
  </div>
}
