'use client'

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { FaShoppingBag, FaTimes } from 'react-icons/fa'
import { MERCH_COUNTRIES, MERCH_MAX_QTY, variantLabel, type MerchLine, type MerchProduct } from '@/lib/shop/merchShared'
import { MERCH_COPY } from './copy'
import s from './merch.module.css'

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
  // Garments with a back print get a full-width spread; everything else (headwear) goes in the grid.
  const garments = products.filter((p) => p.backImage)
  const rest = products.filter((p) => !p.backImage)
  return (
    <>
      {garments.length > 0 && (
        <section id="shop" aria-labelledby="merch-garments" className={`${s.wrap} ${s.section}`}>
          <div className={s.sectionHead}>
            <div>
              <p className={s.eyebrow}>Front crest · back artwork</p>
              <h2 id="merch-garments" className={s.h2}>The garments</h2>
            </div>
            <p className={s.sectionNote}>Tap Back print to see the full artwork. Both pieces carry the same heart-speaker design, so you can match the crew.</p>
          </div>
          {garments.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i === 0} onAdd={add} layout="feature" />
          ))}
        </section>
      )}
      {rest.length > 0 && (
        <section id={garments.length ? 'headwear' : 'shop'} aria-labelledby="merch-headwear" className={`${s.wrap} ${s.section}`}>
          <div className={s.sectionHead}>
            <div>
              <p className={s.eyebrow}>Crest up front</p>
              <h2 id="merch-headwear" className={s.h2}>Headwear</h2>
            </div>
            <p className={s.sectionNote}>Three ways to wear the crest, from the open-air bucket to the winter beanie.</p>
          </div>
          <div className={s.grid}>
            {rest.map((p) => (
              <ProductCard key={p.id} product={p} priority={false} onAdd={add} layout="card" />
            ))}
          </div>
        </section>
      )}
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

function ProductCard({ product: p, priority, onAdd, layout }: { product: MerchProduct; priority: boolean; onAdd: (v: number) => void; layout: 'feature' | 'card' }) {
  const single = p.variants.length === 1
  const [selected, setSelected] = useState<number | null>(single ? p.variants[0].id : null)
  const copy = MERCH_COPY[p.slug]
  const [side, setSide] = useState<'photo' | 'front' | 'back'>(copy?.photo ? 'photo' : 'front')
  const [hint, setHint] = useState(false)
  const variant = p.variants.find((v) => v.id === selected) ?? null
  const price = variant?.priceCents ?? p.minPriceCents
  const varies = p.variants.some((v) => v.priceCents !== p.minPriceCents)
  const img = side === 'photo' && copy?.photo ? copy.photo.src : side === 'back' && p.backImage ? p.backImage : p.image
  const views = [...(copy?.photo ? (['photo'] as const) : []), 'front' as const, ...(p.backImage ? (['back'] as const) : [])]
  const blank = p.blank?.replace(/\s*\|.*$/, '')
  const feature = layout === 'feature'

  return (
    <article id={p.slug} className={feature ? s.feature : s.card}>
      <div className={s.media} data-side={side}>
        {img && (
          <Image
            src={img}
            alt={side === 'photo' && copy?.photo ? copy.photo.alt : `${p.name}, ${side === 'back' ? 'back print' : 'front'} view`}
            fill
            sizes={feature ? '(min-width:960px) 55vw, 100vw' : '(min-width:960px) 33vw, 100vw'}
            priority={priority}
          />
        )}
        {copy && <span className={s.code}>{copy.code}</span>}
        {views.length > 1 && (
          <div className={s.views} role="group" aria-label="Product view">
            {views.map((v) => (
              <button key={v} type="button" onClick={() => setSide(v)} aria-pressed={side === v}>
                {v === 'back' ? 'Back print' : v === 'photo' ? 'Worn' : 'Front'}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={s.info}>
        {feature && blank && <p className={s.eyebrow}>{blank}</p>}
        <h3 className={s.name}>{p.name}</h3>
        {copy && <p className={s.tagline}>{copy.tagline}</p>}
        {copy && <p className={s.pitch}>{copy.pitch}</p>}
        {(copy || p.details.length > 0) && (
          <ul className={s.specs}>
            {copy && <li>{copy.print}</li>}
            {(feature ? p.details : p.details.slice(0, 3)).map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}

        <div className={s.buy}>
          <div className={s.priceRow}>
            <p className={s.price}>
              {!variant && varies && <small>from</small>}
              {money(price, p.currency)}
            </p>
            {!feature && blank && <p className={s.blank}>{blank}</p>}
          </div>
          {!single && (
            <fieldset className={s.sizes}>
              <legend>Size</legend>
              <div className={s.sizeList}>
                {p.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    className={s.size}
                    disabled={!v.available}
                    onClick={() => {
                      setSelected(v.id)
                      setHint(false)
                    }}
                    aria-pressed={selected === v.id}
                  >
                    {v.size ?? variantLabel(v)}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <button type="button" className={s.add} onClick={() => (selected ? onAdd(selected) : setHint(true))}>
            Add to bag{variant && !single ? ` · ${variant.size ?? variantLabel(variant)}` : ''}
          </button>
          {hint && (
            <p role="alert" className={s.hint}>
              Choose a size first.
            </p>
          )}
        </div>
      </div>
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
  const pending = loading || Boolean(country && !shipping && !error)
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
                  <dd className="font-mono text-white">{pending ? '…' : shipping ? money(shipping.cents, currency) : '—'}</dd>
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
                disabled={busy || pending || !country || !shipping}
                className="w-full bg-[#39ff14] px-5 py-4 font-mono text-sm font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {busy ? 'Opening checkout...' : !country ? 'Choose country to continue' : pending ? 'Calculating shipping…' : `Checkout · ${money(total, currency)}`}
              </button>
              <p className="text-center text-xs text-gray-400">Secure card payment by Stripe. Made to order, ships in 2–5 business days plus delivery.</p>
            </div>
          </>
        )}
      </div>
    </dialog>
  )
}
