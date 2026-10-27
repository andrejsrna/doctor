'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

type Product = {
  id: string; slug: string; type: 'SAMPLE_PACK' | 'TRACK'; title: string; priceCents: number; active: boolean
  fileKey: string | null; fileName: string | null; fileSize: number | null; releaseId: string | null
  release: { title: string; slug: string } | null; _count: { orderItems: number }
}
type Order = {
  id: string; status: string; email: string | null; customerName: string | null; amountTotal: number; currency: string; createdAt: string; paidAt: string | null
  emailSentAt: string | null; invoiceState: string; invoiceNumber: string | null; invoiceError: string | null
  items: { title: string; downloadCount: number }[]
}
type Release = { id: string; title: string; slug: string; categories: string[] }
type Form = { id?: string; title: string; slug: string; price: string; type: 'SAMPLE_PACK' | 'TRACK'; active: boolean; releaseId: string; fileKey?: string; fileName?: string; fileSize?: number; currentFile?: string | null }

const emptyForm: Form = { title: '', slug: '', price: '10', type: 'SAMPLE_PACK', active: false, releaseId: '' }
const inputStyle = 'w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500'
const buttonStyle = 'rounded-lg border border-gray-700 px-3 py-2 text-sm hover:bg-gray-800 disabled:opacity-50 focus-visible:outline focus-visible:outline-green-400'
const eur = (cents: number) => new Intl.NumberFormat('sk-SK', { style: 'currency', currency: 'EUR' }).format(cents / 100)
const mb = (bytes?: number | null) => (bytes ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : '')
const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function ShopAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [releases, setReleases] = useState<Release[]>([])
  const [config, setConfig] = useState({ stripe: false, scrm: false })
  const [form, setForm] = useState<Form>(emptyForm)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/shop', { cache: 'no-store' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Could not load shop')
    setProducts(data.products); setOrders(data.orders); setReleases(data.releases); setConfig(data.config)
  }, [])

  useEffect(() => { load().catch(e => setError(e.message)).finally(() => setLoading(false)) }, [load])

  async function post(payload: Record<string, unknown>) {
    const res = await fetch('/api/admin/shop', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Request failed')
    return data
  }

  async function upload(file: File) {
    setError(''); setNotice(''); setBusy(true); setProgress(0)
    try {
      const { uploadUrl, key, fileName, size } = await post({ action: 'presign', name: file.name, size: file.size })
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', uploadUrl)
        xhr.setRequestHeader('Content-Type', 'application/octet-stream')
        xhr.upload.onprogress = e => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100))
        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)))
        xhr.onerror = () => reject(new Error('Upload failed'))
        xhr.send(file)
      })
      setForm(f => ({ ...f, fileKey: key, fileName, fileSize: size }))
      setNotice(`${fileName} uploaded. Save the product to use it.`)
    } catch (e) { setError(e instanceof Error ? e.message : 'Upload failed') }
    finally { setBusy(false); setProgress(null) }
  }

  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    try {
      await post({ action: 'saveProduct', ...form })
      await load(); setForm(emptyForm); setNotice('Product saved.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save') }
    finally { setBusy(false) }
  }

  async function orderAction(action: 'resendEmail' | 'issueInvoice', orderId: string) {
    setBusy(true); setError(''); setNotice('')
    try {
      const r = await post({ action, orderId })
      await load()
      setNotice(action === 'resendEmail' ? (r.ok ? 'Download email sent.' : 'Email could not be sent.') : r.ok ? `Invoice ${r.number} issued and emailed.` : `Invoice failed: ${r.error}`)
    } catch (e) { setError(e instanceof Error ? e.message : 'Action failed') }
    finally { setBusy(false) }
  }

  const edit = (p: Product) => setForm({ id: p.id, title: p.title, slug: p.slug, price: String(p.priceCents / 100), type: p.type, active: p.active, releaseId: p.releaseId || '', currentFile: p.fileName ? `${p.fileName} ${mb(p.fileSize)}` : null })
  const releaseOptions = [...releases].sort((a, b) => Number(b.categories.includes('Sample Packs')) - Number(a.categories.includes('Sample Packs')))
  const paid = orders.filter(o => o.status === 'PAID')

  return <div className="mx-auto max-w-6xl space-y-6 px-3 py-8 text-white sm:px-6">
    <div><Link href="/admin" className="text-sm text-gray-400 hover:text-white">Back to admin</Link>
      <h1 className="mt-3 text-3xl font-bold">Shop</h1>
      <p className="mt-2 text-sm text-gray-400">Sample packs and tracks sold through Stripe. Invoices (doklad o predaji) are issued by SCRM for Andrej Srna.</p></div>

    <div className="flex flex-wrap gap-2 text-xs">
      <span className={`rounded-full px-3 py-1 ${config.stripe ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>Stripe {config.stripe ? 'connected' : 'not configured: buy buttons hidden'}</span>
      <span className={`rounded-full px-3 py-1 ${config.scrm ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>SCRM invoices {config.scrm ? 'connected' : 'not configured'}</span>
      {paid.length > 0 && <span className="rounded-full bg-gray-800 px-3 py-1 text-gray-200">{paid.length} paid · {eur(paid.reduce((s, o) => s + o.amountTotal, 0))}</span>}
    </div>

    {error && <div role="alert" className="rounded-lg border border-red-500/40 p-4 text-red-300">{error}</div>}
    {notice && <p role="status" className="text-green-300">{notice}</p>}

    <section className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-gray-800 bg-gray-950/70 p-5">
        <h2 className="text-lg font-semibold">Products</h2>
        {loading ? <p className="mt-4 text-gray-400">Loading...</p> : products.length === 0 ? <p className="mt-4 text-gray-400">No products yet. Add the first one on the right.</p> :
          <ul className="mt-4 divide-y divide-gray-800">{products.map(p => <li key={p.id} className="flex items-start justify-between gap-3 py-4">
            <div className="min-w-0"><h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-400">{eur(p.priceCents)} · {p.type === 'TRACK' ? 'Track' : 'Sample pack'} · {p._count.orderItems} sold</p>
              <p className="truncate text-xs text-gray-500">{p.release ? `Shown on /music/${p.release.slug}` : 'Not linked to a release page'}{p.fileName ? ` · ${p.fileName} ${mb(p.fileSize)}` : ' · no file'}</p></div>
            <div className="flex shrink-0 items-center gap-2"><span className={`rounded px-2 py-1 text-xs ${p.active ? 'bg-green-900 text-green-200' : 'bg-gray-800 text-gray-300'}`}>{p.active ? 'On sale' : 'Hidden'}</span><button className={buttonStyle} disabled={busy} onClick={() => edit(p)}>Edit</button></div>
          </li>)}</ul>}
      </div>

      <form onSubmit={save} className="space-y-4 rounded-xl border border-gray-800 bg-gray-950/70 p-5">
        <h2 className="text-lg font-semibold">{form.id ? 'Edit product' : 'Add product'}</h2>
        <label className="block text-sm">Release page<select className={inputStyle + ' mt-2'} value={form.releaseId} disabled={busy} onChange={e => {
          const r = releases.find(x => x.id === e.target.value)
          setForm(f => ({ ...f, releaseId: e.target.value, ...(r && !f.id ? { title: f.title || r.title, slug: f.slug || r.slug } : {}) }))
        }}><option value="">Not linked</option>{releaseOptions.map(r => <option key={r.id} value={r.id}>{r.title}{r.categories.includes('Sample Packs') ? ' (sample pack)' : ''}</option>)}</select>
          <span className="mt-1 block text-xs text-gray-500">The Buy button appears on this release page.</span></label>
        <label className="block text-sm">Title<input required maxLength={200} className={inputStyle + ' mt-2'} value={form.title} disabled={busy} onChange={e => setForm(f => ({ ...f, title: e.target.value, slug: f.id ? f.slug : slugify(e.target.value) }))} /></label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block text-sm sm:col-span-2">Slug<input required pattern="[a-z0-9-]{3,80}" className={inputStyle + ' mt-2'} value={form.slug} disabled={busy} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} /></label>
          <label className="block text-sm">Price (EUR)<input required type="number" min="1" max="1000" step="0.01" className={inputStyle + ' mt-2'} value={form.price} disabled={busy} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} /></label>
        </div>
        <label className="block text-sm">Type<select className={inputStyle + ' mt-2'} value={form.type} disabled={busy} onChange={e => setForm(f => ({ ...f, type: e.target.value as Form['type'] }))}><option value="SAMPLE_PACK">Sample pack</option><option value="TRACK">Track</option></select></label>

        <div onDragOver={e => { e.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) upload(f) }}
          className={`rounded-lg border-2 border-dashed p-5 text-center text-sm ${dragging ? 'border-green-400 bg-green-950/40' : 'border-gray-700'}`}>
          {progress !== null ? <p>Uploading... {progress}%</p> : form.fileName ? <p className="text-green-300">New file: {form.fileName} {mb(form.fileSize)}</p> : form.currentFile ? <p className="text-gray-300">Current file: {form.currentFile}</p> : <p className="text-gray-400">Drop the .zip here</p>}
          <label className="mt-3 inline-block cursor-pointer text-green-300 underline">{form.fileName || form.currentFile ? 'Replace file' : 'or choose a file'}<input type="file" className="sr-only" accept=".zip,.rar,.7z,.wav,.aif,.aiff,.flac,.mp3" disabled={busy} onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = '' }} /></label>
          <p className="mt-2 text-xs text-gray-500">Stored privately. Buyers only get it after payment.</p>
        </div>

        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} disabled={busy} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} /> On sale (shows the Buy button)</label>
        <div className="flex gap-2"><button disabled={busy} className="rounded-lg bg-green-700 px-4 py-2 font-medium hover:bg-green-600 disabled:opacity-50">{busy ? 'Working...' : form.id ? 'Save changes' : 'Add product'}</button>{form.id && <button type="button" className={buttonStyle} disabled={busy} onClick={() => setForm(emptyForm)}>Cancel</button>}</div>
      </form>
    </section>

    <section className="rounded-xl border border-gray-800 bg-gray-950/70 p-5">
      <h2 className="text-lg font-semibold">Orders</h2>
      {loading ? <p className="mt-4 text-gray-400">Loading...</p> : orders.length === 0 ? <p className="mt-4 text-gray-400">No orders yet.</p> :
        <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase text-gray-400"><tr><th className="py-2">Date</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Invoice</th><th /></tr></thead>
          <tbody className="divide-y divide-gray-800">{orders.map(o => <tr key={o.id} className="align-top">
            <td className="py-3 pr-3 text-gray-300">{new Date(o.paidAt || o.createdAt).toLocaleString('sk-SK')}</td>
            <td className="pr-3">{o.customerName || '—'}<div className="text-xs text-gray-500">{o.email || ''}</div></td>
            <td className="pr-3">{o.items.map(i => <div key={i.title}>{i.title} <span className="text-xs text-gray-500">({i.downloadCount}× downloaded)</span></div>)}</td>
            <td className="pr-3">{eur(o.amountTotal)}</td>
            <td className="pr-3"><span className={o.status === 'PAID' ? 'text-green-300' : o.status === 'REFUNDED' ? 'text-yellow-300' : 'text-gray-400'}>{o.status}</span>{o.status === 'PAID' && !o.emailSentAt && <div className="text-xs text-red-300">email not sent</div>}</td>
            <td className="pr-3">{o.invoiceNumber || <span className={o.invoiceState === 'FAILED' ? 'text-red-300' : 'text-gray-400'} title={o.invoiceError || ''}>{o.status === 'PAID' || o.status === 'REFUNDED' ? o.invoiceState : '—'}</span>}</td>
            <td className="space-x-2 whitespace-nowrap text-right">{o.status === 'PAID' && <button className={buttonStyle} disabled={busy} onClick={() => orderAction('resendEmail', o.id)}>Resend email</button>}{(o.status === 'PAID' || o.status === 'REFUNDED') && !o.invoiceNumber && <button className={buttonStyle} disabled={busy || !config.scrm} onClick={() => orderAction('issueInvoice', o.id)}>Issue invoice</button>}</td>
          </tr>)}</tbody></table></div>}
    </section>
  </div>
}
