'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaShoppingCart, FaTimes } from 'react-icons/fa'
import { CART_OPEN, cartTotal, formatMoney, removeFromCart } from '@/lib/shop/cart'
import { useCart } from './AddToCartButton'
import { DeliveryConsent } from './BuyButton'

/** Header cart button + slide-in cart with one Stripe checkout for everything in it. */
export default function CartDrawer({ buttonClassName }: { buttonClassName?: string }) {
  const titleId = useId()
  const ref = useRef<HTMLDialogElement>(null)
  const items = useCart()
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const open = useCallback(() => {
    const d = ref.current
    if (d && !d.open) d.showModal()
  }, [])

  useEffect(() => {
    const d = ref.current
    const reset = () => { setBusy(false); setError('') }
    d?.addEventListener('close', reset)
    window.addEventListener(CART_OPEN, open)
    // Back from Stripe (cancel_url ?cart=open, or bfcache restore) brings the buyer straight back to the cart.
    const onShow = (e: PageTransitionEvent) => e.persisted && setBusy(false)
    window.addEventListener('pageshow', onShow)
    const url = new URL(window.location.href)
    if (url.searchParams.get('cart') === 'open') {
      url.searchParams.delete('cart')
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
      open()
    }
    return () => {
      d?.removeEventListener('close', reset)
      window.removeEventListener(CART_OPEN, open)
      window.removeEventListener('pageshow', onShow)
    }
  }, [open])

  const currency = items[0]?.currency ?? 'eur'
  const total = formatMoney(cartTotal(items), currency)

  async function checkout() {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/shop/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: items.map((i) => i.slug), consent }),
      })
      const data = await res.json().catch(() => ({}))
      if (Array.isArray(data.invalid) && data.invalid.length) removeFromCart(data.invalid)
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout is temporarily unavailable')
      window.location.assign(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout is temporarily unavailable')
      setBusy(false)
    }
  }

  return (
    <>
      <button type="button" className={buttonClassName} onClick={open} aria-label={`Cart, ${items.length} ${items.length === 1 ? 'item' : 'items'}`} data-count={items.length || undefined}>
        <FaShoppingCart size={15} aria-hidden="true" />
        {items.length > 0 && (
          <span aria-hidden="true" className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#ff004d] px-1 font-mono text-[10px] font-bold leading-none text-white">
            {items.length}
          </span>
        )}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        className="pointer-events-auto fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-[min(100vw,28rem)] max-w-none border-l border-white/15 bg-[#0b0b0f] p-0 text-[#e8e8ec] backdrop:bg-black/70"
        onClick={(e) => e.target === ref.current && !busy && ref.current?.close()}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#39ff14]">Digital downloads</p>
              <h2 id={titleId} className="mt-1 text-2xl font-bold uppercase leading-none text-white">Your cart</h2>
            </div>
            <button type="button" onClick={() => ref.current?.close()} disabled={busy} aria-label="Close cart" className="grid h-10 w-10 place-items-center border border-white/20 hover:bg-white/5 disabled:opacity-40">
              <FaTimes aria-hidden="true" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 space-y-4 px-6 py-8">
              <p className="text-lg text-white">Your cart is empty.</p>
              <p className="text-sm text-gray-400">Sample packs and tracks you add will wait here until you check out.</p>
              <Link href="/sample-packs" onClick={() => ref.current?.close()} className="inline-block border border-white/20 px-5 py-3 font-mono text-sm uppercase tracking-widest hover:bg-white/5">
                Browse sample packs
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 divide-y divide-white/10 overflow-y-auto px-6">
                {items.map((i) => (
                  <li key={i.slug} className="flex items-center gap-4 py-4">
                    {i.image ? (
                      <Image src={i.image} alt="" width={64} height={64} className="h-16 w-16 shrink-0 object-cover" />
                    ) : (
                      <span className="h-16 w-16 shrink-0 bg-white/5" aria-hidden="true" />
                    )}
                    <div className="min-w-0 flex-1">
                      {i.href ? (
                        <Link href={i.href} onClick={() => ref.current?.close()} className="block truncate font-bold text-white hover:text-[#39ff14]">{i.title}</Link>
                      ) : (
                        <p className="m-0 truncate font-bold text-white">{i.title}</p>
                      )}
                      <p className="m-0 font-mono text-sm text-gray-300">{i.price}</p>
                    </div>
                    <button type="button" onClick={() => removeFromCart([i.slug])} disabled={busy} className="font-mono text-xs uppercase tracking-widest text-gray-400 underline-offset-4 hover:text-[#ff004d] hover:underline disabled:opacity-40">
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <div className="space-y-4 border-t border-white/10 px-6 py-5">
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-gray-400">Total · final price</span>
                  <span className="text-2xl font-bold text-white">{total}</span>
                </div>
                <DeliveryConsent checked={consent} onChange={setConsent} disabled={busy} />
                {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
                <button
                  type="button"
                  onClick={checkout}
                  disabled={!consent || busy}
                  className="w-full bg-[#39ff14] px-5 py-4 font-mono text-sm font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {busy ? 'Opening checkout...' : `Checkout · ${total}`}
                </button>
                <p className="text-center text-xs text-gray-400">Secure card payment by Stripe. Download links by email and in My account.</p>
              </div>
            </>
          )}
        </div>
      </dialog>
    </>
  )
}
