'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

type ProductType = 'TRACK' | 'RELEASE' | 'SAMPLE_PACK'
type Product = {
  id: string; slug: string; type: ProductType; title: string; priceCents: number; active: boolean; position: number
  fileKey: string | null; fileName: string | null; fileSize: number | null; _count: { orderItems: number }
}
type Uploaded = { fileKey: string; fileName: string; fileSize: number }
type Row = { title: string; price: string; active: boolean; position: string; file?: Uploaded }
type Match = { key: string; size: number; lastModified: string | null; sameSize: boolean; sameName: boolean; usedBy: string[] }
type Found = { file: File; matches: Match[]; apply: (u: Uploaded) => void }

const TYPES: { value: ProductType; label: string; price: string }[] = [
  { value: 'TRACK', label: 'Track (WAV)', price: '1.50' },
  { value: 'RELEASE', label: 'EP / album (ZIP)', price: '3.00' },
  { value: 'SAMPLE_PACK', label: 'Sample pack (ZIP)', price: '10.00' },
]
const input = 'w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500'
const btn = 'rounded-lg border border-gray-700 px-3 py-2 text-sm hover:bg-gray-800 disabled:opacity-50'
const mb = (b?: number | null) => (b ? (b > 1024 ** 3 ? `${(b / 1024 ** 3).toFixed(2)} GB` : `${(b / 1024 ** 2).toFixed(1)} MB`) : '')
const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const toRow = (p: Product): Row => ({ title: p.title, price: (p.priceCents / 100).toFixed(2), active: p.active, position: String(p.position) })

async function post(payload: Record<string, unknown>) {
  const res = await fetch('/api/admin/shop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

/** Straight browser → R2 upload through a presigned URL (no size limit from the app server). */
async function uploadFile(file: File, onProgress: (pct: number) => void): Promise<Uploaded> {
  const { uploadUrl, key, fileName, size } = await post({ action: 'presign', name: file.name, size: file.size })
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)))
    xhr.onerror = () => reject(new Error('Upload failed (network)'))
    xhr.send(file)
  })
  return { fileKey: key, fileName, fileSize: size }
}

function FoundPanel({ found, busy, onUse, onUpload, onCancel }: { found: Found; busy: boolean; onUse: (key: string) => void; onUpload: () => void; onCancel: () => void }) {
  return (
    <div className="mt-2 rounded-lg border border-yellow-500/40 bg-yellow-500/5 p-3 text-sm" role="status">
      <p className="mb-2 font-semibold text-yellow-200">“{found.file.name}” ({mb(found.file.size)}) may already be on R2:</p>
      <ul className="space-y-2">
        {found.matches.map((m) => (
          <li key={m.key} className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-800 bg-black/40 px-3 py-2">
            <span className="min-w-0 flex-1">
              <span className="block break-all font-mono text-xs text-gray-200">{m.key}</span>
              <span className="text-xs text-gray-400">
                {mb(m.size)}{m.lastModified ? ` · ${m.lastModified.slice(0, 10)}` : ''} · {m.sameSize && m.sameName ? 'same name and size' : m.sameSize ? 'same size' : 'same name, different size'}
                {m.usedBy.length > 0 && ` · used by: ${m.usedBy.join(', ')}`}
              </span>
            </span>
            <button type="button" className={`${btn} border-green-600 text-green-300`} disabled={busy} onClick={() => onUse(m.key)}>Use this file</button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" className={btn} disabled={busy} onClick={onUpload}>Upload anyway</button>
        <button type="button" className={btn} disabled={busy} onClick={onCancel}>Cancel</button>
      </div>
    </div>
  )
}

function DropZone({ label, accept, disabled, progress, onFile }: { label: string; accept: string; disabled?: boolean; progress: number | null; onFile: (f: File) => void }) {
  const ref = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => !disabled && ref.current?.click()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && !disabled && ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files[0]; if (f && !disabled) onFile(f) }}
      className={`cursor-pointer rounded-lg border border-dashed px-3 py-3 text-center text-sm transition ${over ? 'border-green-400 bg-green-400/10' : 'border-gray-600 hover:border-gray-400'} ${disabled ? 'opacity-50' : ''}`}
    >
      {progress !== null ? (
        <span className="block">
          Uploading {progress}%
          <span className="mt-2 block h-1.5 overflow-hidden rounded bg-gray-800"><span className="block h-full bg-green-400" style={{ width: `${progress}%` }} /></span>
        </span>
      ) : label}
      <input ref={ref} type="file" accept={accept} hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); e.target.value = '' }} />
    </div>
  )
}

export default function ReleaseShopPanel({ releaseId, releaseSlug, releaseTitle }: { releaseId: string; releaseSlug: string; releaseTitle: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [rows, setRows] = useState<Record<string, Row>>({})
  const [stripe, setStripe] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [progress, setProgress] = useState<Record<string, number | null>>({})
  const [found, setFound] = useState<Record<string, Found | null>>({})
  const [checking, setChecking] = useState<string | null>(null)
  const [type, setType] = useState<ProductType>('TRACK')
  const [draft, setDraft] = useState<Row>({ title: '', price: '1.50', active: true, position: '' })

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/shop?releaseId=${encodeURIComponent(releaseId)}`, { cache: 'no-store' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Could not load products')
    setProducts(data.products)
    setRows(Object.fromEntries(data.products.map((p: Product) => [p.id, toRow(p)])))
    setStripe(Boolean(data.config?.stripe))
  }, [releaseId])

  useEffect(() => { load().catch((e) => toast.error(e.message)) }, [load])

  const clean = releaseTitle.replace(/&#8211;|–|—/g, '-').replace(/\s+/g, ' ').trim()

  function pickType(t: ProductType) {
    setType(t)
    const def = TYPES.find((x) => x.value === t)!
    setDraft((d) => ({ ...d, price: def.price, title: t === 'TRACK' ? (d.file ? d.title : '') : `${clean} (${t === 'RELEASE' ? 'WAV' : 'Sample pack'})` }))
  }

  async function upload(id: string, file: File, apply: (u: Uploaded) => void) {
    const audio = /\.(wav|aiff?|flac|mp3)$/i.test(file.name)
    if (!/\.(zip|rar|7z|wav|aiff?|flac|mp3)$/i.test(file.name)) return toast.error('Upload a WAV/AIFF/FLAC or ZIP file')
    if (type === 'TRACK' && id === 'new' && !audio) toast('A ZIP for a single track? Pick “EP / album” if it is the whole release.')
    setFound((f) => ({ ...f, [id]: null }))
    setChecking(id)
    try {
      const { matches } = await post({ action: 'findExisting', name: file.name, size: file.size })
      if (matches?.length) return setFound((f) => ({ ...f, [id]: { file, matches, apply } }))
    } catch (e) { toast.error(e instanceof Error ? `R2 check failed: ${e.message}` : 'R2 check failed') }
    finally { setChecking(null) }
    await send(id, file, apply)
  }

  async function pickExisting(id: string, key: string) {
    const f = found[id]
    if (!f) return
    setChecking(id)
    try {
      const u: Uploaded = await post({ action: 'useExisting', key })
      f.apply(u)
      setFound((s) => ({ ...s, [id]: null }))
      toast.success(`Using ${u.fileName} from R2 (${mb(u.fileSize)}), no upload needed`)
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not use that file') }
    finally { setChecking(null) }
  }

  async function send(id: string, file: File, apply: (u: Uploaded) => void) {
    setFound((f) => ({ ...f, [id]: null }))
    setProgress((p) => ({ ...p, [id]: 0 }))
    try {
      const u = await uploadFile(file, (pct) => setProgress((p) => ({ ...p, [id]: pct })))
      apply(u)
      toast.success(`${u.fileName} uploaded (${mb(u.fileSize)})`)
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Upload failed') }
    finally { setProgress((p) => ({ ...p, [id]: null })) }
  }

  async function saveRow(p: Product) {
    const r = rows[p.id]
    setBusy(p.id)
    try {
      await post({ action: 'saveProduct', id: p.id, slug: p.slug, type: p.type, releaseId, title: r.title, price: r.price, active: r.active, position: Number(r.position) || 0, ...(r.file ?? {}) })
      await load(); toast.success('Product saved')
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Save failed') }
    finally { setBusy(null) }
  }

  async function remove(p: Product) {
    if (!confirm(`Delete “${p.title}”?`)) return
    setBusy(p.id)
    try { await post({ action: 'deleteProduct', id: p.id }); await load(); toast.success('Product deleted') }
    catch (e) { toast.error(e instanceof Error ? e.message : 'Delete failed') }
    finally { setBusy(null) }
  }

  async function add() {
    if (!draft.file) return toast.error('Upload the file first')
    if (!draft.title.trim()) return toast.error('Title is required')
    const base = type === 'RELEASE' ? `ep-${releaseSlug}` : type === 'SAMPLE_PACK' ? `pack-${releaseSlug}` : `wav-${releaseSlug}-${slugify(draft.title.replace(/\(wav\)/i, '').split(' - ').slice(1).join(' ') || draft.title)}`
    const taken = new Set(products.map((p) => p.slug))
    let slug = base.slice(0, 76).replace(/-$/, '')
    for (let i = 2; taken.has(slug); i++) slug = `${base.slice(0, 73)}-${i}`
    const position = draft.position !== '' ? Number(draft.position) : type === 'TRACK' ? products.filter((p) => p.type === 'TRACK').length + 1 : 0
    setBusy('new')
    try {
      await post({ action: 'saveProduct', slug, type, releaseId, title: draft.title.trim(), price: draft.price, active: draft.active, position, ...draft.file })
      setDraft({ title: type === 'TRACK' ? '' : draft.title, price: draft.price, active: true, position: '' })
      await load(); toast.success('Product added')
    } catch (e) { toast.error(e instanceof Error ? e.message : 'Could not add product') }
    finally { setBusy(null) }
  }

  const setRow = (id: string, patch: Partial<Row>) => setRows((r) => ({ ...r, [id]: { ...r[id], ...patch } }))

  return (
    <section className="rounded-xl border border-green-500/30 bg-black/40 p-4" aria-labelledby="shop-panel-title">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="shop-panel-title" className="text-lg font-semibold">Shop · WAV / ZIP downloads</h2>
        <span className="text-xs text-gray-400">Track 1.50 € · EP/album 3 € · files go straight to R2 (up to 5 GB)</span>
      </div>
      {!stripe && <p className="mb-3 text-sm text-yellow-300">Stripe is not configured, so Buy buttons stay hidden on the site.</p>}

      {products.length > 0 && (
        <ul className="mb-4 space-y-3">
          {products.map((p) => {
            const r = rows[p.id]
            if (!r) return null
            return (
              <li key={p.id} className="rounded-lg border border-gray-800 bg-gray-950/60 p-3">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                  <span className="rounded bg-gray-800 px-2 py-0.5 uppercase tracking-wide text-gray-200">{TYPES.find((t) => t.value === p.type)?.label ?? p.type}</span>
                  <span>{p._count.orderItems} sold</span>
                  <span className="truncate">{r.file ? `New file: ${r.file.fileName} (${mb(r.file.fileSize)}), save to apply` : p.fileName ? `${p.fileName} · ${mb(p.fileSize)}` : 'No file yet'}</span>
                </div>
                <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_6rem_4.5rem]">
                  <label className="text-xs text-gray-400">Title<input className={input} value={r.title} onChange={(e) => setRow(p.id, { title: e.target.value })} /></label>
                  <label className="text-xs text-gray-400">Price €<input className={input} inputMode="decimal" value={r.price} onChange={(e) => setRow(p.id, { price: e.target.value.replace(',', '.') })} /></label>
                  <label className="text-xs text-gray-400">Order<input className={input} inputMode="numeric" value={r.position} onChange={(e) => setRow(p.id, { position: e.target.value.replace(/\D/g, '') })} /></label>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <DropZone label={checking === p.id ? 'Checking R2 for this file…' : 'Replace file: drop or click'} accept=".wav,.aif,.aiff,.flac,.zip" disabled={busy !== null || checking !== null} progress={progress[p.id] ?? null} onFile={(f) => upload(p.id, f, (u) => setRow(p.id, { file: u }))} />
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={r.active} onChange={(e) => setRow(p.id, { active: e.target.checked })} /> Active</label>
                    <button type="button" className={`${btn} border-green-600 text-green-300`} disabled={busy !== null} onClick={() => saveRow(p)}>{busy === p.id ? 'Saving…' : 'Save'}</button>
                    <button type="button" className={`${btn} text-red-300`} disabled={busy !== null || p._count.orderItems > 0} title={p._count.orderItems > 0 ? 'Sold products can only be deactivated' : undefined} onClick={() => remove(p)}>Delete</button>
                  </div>
                </div>
                {found[p.id] && (
                  <FoundPanel found={found[p.id]!} busy={checking !== null} onUse={(key) => pickExisting(p.id, key)} onUpload={() => send(p.id, found[p.id]!.file, found[p.id]!.apply)} onCancel={() => setFound((f) => ({ ...f, [p.id]: null }))} />
                )}
              </li>
            )
          })}
        </ul>
      )}

      <div className="rounded-lg border border-gray-800 p-3">
        <p className="mb-2 text-sm font-semibold">Add product</p>
        <div className="grid gap-2 sm:grid-cols-[11rem_minmax(0,1fr)_6rem]">
          <label className="text-xs text-gray-400">Type
            <select className={input} value={type} onChange={(e) => pickType(e.target.value as ProductType)}>
              {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label className="text-xs text-gray-400">Title<input className={input} placeholder={type === 'TRACK' ? 'Artist - Track (WAV)' : ''} value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} /></label>
          <label className="text-xs text-gray-400">Price €<input className={input} inputMode="decimal" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value.replace(',', '.') }))} /></label>
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <DropZone
            label={checking === 'new' ? 'Checking R2 for this file…' : draft.file ? `${draft.file.fileName} · ${mb(draft.file.fileSize)} (drop another to replace)` : type === 'TRACK' ? 'Drop the WAV here or click to choose' : 'Drop the ZIP here or click to choose'}
            accept={type === 'TRACK' ? '.wav,.aif,.aiff,.flac' : '.zip,.rar,.7z'}
            disabled={busy !== null || checking !== null}
            progress={progress.new ?? null}
            onFile={(f) => upload('new', f, (u) => setDraft((d) => ({ ...d, file: u, title: d.title || (type === 'TRACK' ? `${f.name.replace(/\.[^.]+$/, '').replace(/_/g, ' ')} (WAV)` : d.title) })))}
          />
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.active} onChange={(e) => setDraft((d) => ({ ...d, active: e.target.checked }))} /> Active</label>
            <button type="button" className={`${btn} border-green-600 text-green-300`} disabled={busy !== null || !draft.file || progress.new != null} onClick={add}>{busy === 'new' ? 'Adding…' : 'Add product'}</button>
          </div>
        </div>
        {found.new && (
          <FoundPanel found={found.new} busy={checking !== null} onUse={(key) => pickExisting('new', key)} onUpload={() => send('new', found.new!.file, found.new!.apply)} onCancel={() => setFound((f) => ({ ...f, new: null }))} />
        )}
        <p className="mt-2 text-xs text-gray-500">Tracks of an EP/album are listed under the bundle on the release page; a single with one track shows “Buy WAV”.</p>
      </div>
    </section>
  )
}
