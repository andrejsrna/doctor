'use client'

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { FaShoppingBag, FaTimes } from 'react-icons/fa'
import { MERCH_COUNTRIES, MERCH_MAX_QTY, variantLabel, type MerchLine, type MerchProduct } from '@/lib/shop/merchShared'

// Merch bag: its own localStorage key (physical goods + shipping can't share a Stripe session with downloads).
const KEY = 'dnbd-merch-bag'
const COUNTRY_KEY = 'dnbd-merch-country'
const EVENT = 'dnbd-merch-bag'
const EMPTY: MerchLine[] = []

let cache: { raw: string | null; lines: MerchLine[] } = { raw: null, lines: EMPTY }
function read(): MerchLine[] {
  const raw = localStorage.getItem(KEY)
  if (raw === cache.raw) return cache.lines
  let lines: MerchLine[] = EMPTY
  try {
    const parsed = JSON.parse(raw || '[]')
    if (Array.isArray(parsed)) lines = parsed.filter((l) => Number.isSafeInteger(l?.v) && Number.isInteger(l?.q) && l.q > 0).slice(0, 20)
  } catch {}
  cache = { raw, lines }
  return lines
}
function write(lines: MerchLine[]) {
  localStorage.setItem(KEY, JSON.stringify(lines))
  window.dispatchEvent(new Event(EVENT))
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener('storage', cb)
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener('storage', cb)
  }
}
const useBag = () => useSyncExternalStore(subscribe, read, () => EMPTY)

const money = (cents: number, currency: string) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: currency.toUpperCase() }).format(cents / 100)

type Quote = {
  country: string | null
  currency: string
  invalid: number[]
  itemsCents: number
  shipping: { name: string; cents: number; minDays: number | null; maxDays: number | null } | null
  totalCents: number
}

export default function MerchStore({ products }: { products: MerchProduct[] }) {
  const bag = useBag()
  const dialog = useRef<HTMLDialogElement>(null)
  const openBag = useCallback(() => {
    const d = dialog.current
    if (d && !d.open) d.showModal()
  }, [])

  function add(variantId: number) {
    const lines = read()
    const hit = lines.find((l) => l.v === variantId)
    write(hit ? lines.map((l) => (l.v === variantId ? { ...l, q: Math.min(MERCH_MAX_QTY, l.q + 1) } : l)) : [...lines, { v: variantId, q: 1 }])
    openBag()
  }

  const count = bag.reduce((s, l) => s + l.q, 0)
  return (
    <>
      <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p, i) => (
          <ProductCard key={p.id} product={p} priority={i < 3} onAdd={add} />
        ))}
      </div>
      <button
        type="button"
        onClick={openBag}
        aria-label={`Open bag, ${count} ${count === 1 ? 'item' : 'items'}`}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-3 bg-[#39ff14] px-5 py-4 font-mono text-sm font-bold uppercase tracking-widest text-black shadow-[0_10px_40px_rgba(0,0,0,.6)] hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <FaShoppingBag aria-hidden="true" /> Bag{count > 0 ? ` · ${count}` : ''}
      </button>
      <Bag dialogRef={dialog} products={products} lines={bag} openBag={openBag} />
    </>
  )
}

function ProductCard({ product: p, priority, onAdd }: { product: MerchProduct; priority: boolean; onAdd: (v: number) => void }) {
  const single = p.variants.length === 1
  const [selected, setSelected] = useState<number | null>(single ? p.variants[0].id : null)
  const [side, setSide] = useState<'front' | 'back'>('front')
  const [hint, setHint] = useState(false)
  const variant = p.variants.find((v) => v.id === selected) ?? null
  const price = variant?.priceCents ?? p.minPriceCents
  const varies = p.variants.some((v) => v.priceCents !== p.minPriceCents)
  const img = side === 'back' && p.backImage ? p.backImage : p.image
  const sizeGroup = useId()

  return (
    <article id={p.slug} className="scroll-mt-32">
      <div className="relative aspect-square overflow-hidden border border-white/10 bg-[#15151b]">
        {img && <Image src={img} alt={`${p.name}, ${side} view`} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className={side === 'back' ? 'object-contain px-6 pb-16 pt-6' : 'object-cover'} priority={priority} />}
        {p.backImage && (
          <div className="absolute bottom-3 left-3 flex border border-white/20 bg-black/70 font-mono text-[11px] uppercase tracking-widest backdrop-blur" role="group" aria-label="Product view">
            {(['front', 'back'] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSide(s)} aria-pressed={side === s} className={`px-3 py-2 ${side === s ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}>
                {s === 'back' ? 'Back print' : 'Front'}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-bold uppercase leading-tight text-white">{p.name}</h2>
        <p className="shrink-0 font-mono text-lg text-white">{!variant && varies ? 'from ' : ''}{money(price, p.currency)}</p>
      </div>
      {p.blank && <p className="mt-1 text-sm text-gray-400">{p.blank.replace(/\s*\|.*$/, '')}</p>}

      {!single && (
        <fieldset className="mt-4">
          <legend id={sizeGroup} className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Size</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {p.variants.map((v) => (
              <button
                key={v.id}
                type="button"
                disabled={!v.available}
                onClick={() => {
                  setSelected(v.id)
                  setHint(false)
                }}
                aria-pressed={selected === v.id}
                className={`min-w-12 border px-3 py-2 font-mono text-sm ${selected === v.id ? 'border-[#39ff14] bg-[#39ff14] text-black' : 'border-white/25 text-white hover:border-white'} disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through`}
              >
                {v.size ?? variantLabel(v)}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      <button
        type="button"
        onClick={() => (selected ? onAdd(selected) : setHint(true))}
        className="mt-4 w-full border border-[#39ff14] px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-[#39ff14] transition-colors hover:bg-[#39ff14] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Add to bag
      </button>
      {hint && <p role="alert" className="mt-2 text-sm text-[#ff004d]">Choose a size first.</p>}
      {p.details.length > 0 && (
        <details className="mt-4 text-sm text-gray-300">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white">Material &amp; fit</summary>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {p.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </details>
      )}
    </article>
  )
}

function Bag({ dialogRef, products, lines, openBag }: { dialogRef: React.RefObject<HTMLDialogElement | null>; products: MerchProduct[]; lines: MerchLine[]; openBag: () => void }) {
  const titleId = useId()
  const [country, setCountry] = useState('')
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const byVariant = new Map(products.flatMap((p) => p.variants.map((v) => [v.id, { p, v }] as const)))
  const known = lines.filter((l) => byVariant.has(l.v))
  const currency = products[0]?.currency ?? 'eur'
  const itemsCents = known.reduce((s, l) => s + byVariant.get(l.v)!.v.priceCents * l.q, 0)
  const cartKey = known.map((l) => `${l.v}x${l.q}`).join(',')

  useEffect(() => {
    setCountry(localStorage.getItem(COUNTRY_KEY) || '')
    // Drop bag lines for products that were removed from the store.
    const stale = read().filter((l) => !byVariant.has(l.v))
    if (stale.length) write(read().filter((l) => byVariant.has(l.v)))
    const d = dialogRef.current
    const onShow = (e: PageTransitionEvent) => e.persisted && setBusy(false)
    window.addEventListener('pageshow', onShow)
    const url = new URL(window.location.href)
    if (url.searchParams.get('cart') === 'open') {
      url.searchParams.delete('cart')
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
      openBag()
    }
    const reset = () => setError('')
    d?.addEventListener('close', reset)
    return () => {
      window.removeEventListener('pageshow', onShow)
      d?.removeEventListener('close', reset)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Shipping quote from Printful for the current bag + country (debounced; the server also suggests a country).
  useEffect(() => {
    if (!cartKey) {
      setQuote(null)
      return
    }
    const ctrl = new AbortController()
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/merch/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: known, country: country || undefined }),
          signal: ctrl.signal,
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Shipping quote is temporarily unavailable')
        setQuote(data)
        if (!country && data.country) setCountry(data.country)
        if (data.invalid?.length) write(read().filter((l) => !data.invalid.includes(l.v)))
        setError('')
      } catch (e) {
        if (!ctrl.signal.aborted) {
          setQuote(null)
          setError(e instanceof Error ? e.message : 'Shipping quote is temporarily unavailable')
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false)
      }
    }, 250)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey, country])

  function setQty(v: number, q: number) {
    write(q <= 0 ? read().filter((l) => l.v !== v) : read().map((l) => (l.v === v ? { ...l, q: Math.min(MERCH_MAX_QTY, q) } : l)))
  }

  async function checkout() {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/merch/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: known, country }) })
      const data = await res.json().catch(() => ({}))
      if (Array.isArray(data.invalid) && data.invalid.length) write(read().filter((l) => !data.invalid.includes(l.v)))
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout is temporarily unavailable')
      window.location.assign(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout is temporarily unavailable')
      setBusy(false)
    }
  }

  const shipping = quote && quote.country === country ? quote.shipping : null
  const total = itemsCents + (shipping?.cents ?? 0)
  const eta = shipping?.minDays && shipping.maxDays ? `${shipping.minDays}–${shipping.maxDays} days after production` : null

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      className="pointer-events-auto fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-[min(100vw,28rem)] max-w-none border-l border-white/15 bg-[#0b0b0f] p-0 text-[#e8e8ec] backdrop:bg-black/70"
      onClick={(e) => e.target === dialogRef.current && !busy && dialogRef.current?.close()}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#39ff14]">Merch · printed to order</p>
            <h2 id={titleId} className="mt-1 text-2xl font-bold uppercase leading-none text-white">Your bag</h2>
          </div>
          <button type="button" onClick={() => dialogRef.current?.close()} disabled={busy} aria-label="Close bag" className="grid h-10 w-10 place-items-center border border-white/20 hover:bg-white/5 disabled:opacity-40">
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        {known.length === 0 ? (
          <div className="flex-1 space-y-4 px-6 py-8">
            <p className="text-lg text-white">Your bag is empty.</p>
            <p className="text-sm text-gray-400">Pick a size and add a piece; it waits here until you check out.</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-6">
              {known.map((l) => {
                const { p, v } = byVariant.get(l.v)!
                return (
                  <li key={l.v} className="flex items-center gap-4 py-4">
                    {p.image ? <Image src={p.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0 object-cover" /> : <span className="h-16 w-16 shrink-0 bg-white/5" aria-hidden="true" />}
                    <div className="min-w-0 flex-1">
                      <p className="m-0 truncate font-bold text-white">{p.name}</p>
                      <p className="m-0 text-sm text-gray-400">{variantLabel(v)}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center border border-white/20 font-mono text-sm">
                          <button type="button" onClick={() => setQty(l.v, l.q - 1)} disabled={busy} aria-label={`One less ${p.name}`} className="h-8 w-8 hover:bg-white/10 disabled:opacity-40">−</button>
                          <span className="w-7 text-center" aria-label="Quantity">{l.q}</span>
                          <button type="button" onClick={() => setQty(l.v, l.q + 1)} disabled={busy || l.q >= MERCH_MAX_QTY} aria-label={`One more ${p.name}`} className="h-8 w-8 hover:bg-white/10 disabled:opacity-40">+</button>
                        </div>
                        <button type="button" onClick={() => setQty(l.v, 0)} disabled={busy} className="font-mono text-xs uppercase tracking-widest text-gray-400 underline-offset-4 hover:text-[#ff004d] hover:underline disabled:opacity-40">
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="m-0 shrink-0 font-mono text-sm text-white">{money(v.priceCents * l.q, p.currency)}</p>
                  </li>
                )
              })}
            </ul>
            <div className="space-y-3 border-t border-white/10 px-6 py-5">
              <label className="block">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Ship to</span>
                <select
                  value={country}
                  disabled={busy}
                  onChange={(e) => {
                    setCountry(e.target.value)
                    localStorage.setItem(COUNTRY_KEY, e.target.value)
                  }}
                  className="mt-1 w-full border border-white/20 bg-[#0b0b0f] px-3 py-3 text-white"
                >
                  <option value="">Choose country…</option>
                  {MERCH_COUNTRIES.map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </label>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-gray-400">Items</dt><dd className="font-mono text-white">{money(itemsCents, currency)}</dd></div>
                <div className="flex justify-between">
                  <dt className="text-gray-400">Shipping{eta ? <span className="block text-xs text-gray-500">{eta}</span> : null}</dt>
                  <dd className="font-mono text-white">{loading ? '…' : shipping ? money(shipping.cents, currency) : '—'}</dd>
                </div>
                <div className="flex items-baseline justify-between pt-2">
                  <dt className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Total</dt>
                  <dd className="text-2xl font-bold text-white">{money(total, currency)}</dd>
                </div>
              </dl>
              {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
              <button
                type="button"
                onClick={checkout}
                disabled={busy || loading || !country || !shipping}
                className="w-full bg-[#39ff14] px-5 py-4 font-mono text-sm font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {busy ? 'Opening checkout...' : !country ? 'Choose country to continue' : `Checkout · ${money(total, currency)}`}
              </button>
              <p className="text-center text-xs text-gray-400">Secure card payment by Stripe. Made to order, ships in 2–5 business days plus delivery.</p>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
