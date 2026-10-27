'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { FaShoppingCart } from 'react-icons/fa'

export type BuyOffer = { productSlug: string; title: string; price: string; amount?: number; amountCents?: number; currency?: string; type?: string; image?: string | null; href?: string | null }

/** EU digital content consent; shared by Buy now and the cart. */
export function DeliveryConsent({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className="flex cursor-pointer gap-3 text-sm leading-snug">
      <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-[#39ff14]" checked={checked} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
      <span>
        I want the download delivered immediately and acknowledge that I lose my 14-day right of withdrawal once delivery begins. I agree to the{' '}
        <Link href="/terms#digital-products" className="text-[#39ff14] underline" target="_blank">terms and sample licence</Link>.
      </span>
    </label>
  )
}

/** Buy trigger + consent dialog. EU law requires express consent to immediate delivery of digital content before checkout. */
export default function BuyButton({ offer, className, label }: { offer: BuyOffer; className?: string; label?: string }) {
  const titleId = useId()
  const ref = useRef<HTMLDialogElement>(null)
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const d = ref.current
    const reset = () => { setBusy(false); setError('') }
    d?.addEventListener('close', reset)
    // Back-button from Stripe restores the page from bfcache with the dialog still busy.
    const onShow = (e: PageTransitionEvent) => e.persisted && setBusy(false)
    window.addEventListener('pageshow', onShow)
    return () => { d?.removeEventListener('close', reset); window.removeEventListener('pageshow', onShow) }
  }, [])

  async function checkout() {
    setBusy(true); setError('')
    try {
      const res = await fetch('/api/shop/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product: offer.productSlug, consent }) })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout is temporarily unavailable')
      window.location.assign(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout is temporarily unavailable')
      setBusy(false)
    }
  }

  return (
    <>
      <button type="button" className={className} onClick={() => ref.current?.showModal()}>
        <FaShoppingCart aria-hidden="true" /> {label ?? `Buy · ${offer.price}`}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        // pointer-events-auto: the release hero sets pointer-events:none and the dialog would inherit it (checkbox unclickable).
        className="pointer-events-auto m-auto w-[min(92vw,30rem)] border border-white/15 bg-[#0b0b0f] p-0 text-[#e8e8ec] backdrop:bg-black/80"
        onClick={(e) => e.target === ref.current && !busy && ref.current?.close()}
      >
        <div className="space-y-5 p-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#39ff14]">Digital download</p>
            <h2 id={titleId} className="mt-2 text-2xl font-bold uppercase leading-tight text-white">{offer.title}</h2>
            <p className="mt-1 text-lg text-white">{offer.price}</p>
          </div>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>Instant download after payment, link sent by email</li>
            <li>Re-download any time from My account</li>
            <li>Invoice emailed automatically</li>
            <li>No account needed. Secure card payment by Stripe</li>
          </ul>
          <DeliveryConsent checked={consent} onChange={setConsent} disabled={busy} />
          {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={checkout}
              disabled={!consent || busy}
              className="bg-[#39ff14] px-5 py-3 font-mono text-sm font-bold uppercase tracking-widest text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {busy ? 'Opening checkout...' : `Pay ${offer.price}`}
            </button>
            <button type="button" onClick={() => ref.current?.close()} disabled={busy} className="border border-white/20 px-5 py-3 font-mono text-sm uppercase tracking-widest hover:bg-white/5 disabled:opacity-40">
              Cancel
            </button>
          </div>
        </div>
      </dialog>
    </>
  )
}
