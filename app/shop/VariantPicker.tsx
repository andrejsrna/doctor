'use client'

import { useEffect, useMemo, useState } from 'react'
import NiceSelect from '@/app/components/NiceSelect'
import BuyButton from '@/app/shop/BuyButton'

type Variant = {
  id: number
  title: string
  price: number
}

function formatPriceCents(cents?: number | null): string {
  if (cents === undefined || cents === null || !Number.isFinite(cents)) return '—'
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

const COUNTRY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'DE', label: 'Germany' },
  { value: 'AT', label: 'Austria' },
  { value: 'SK', label: 'Slovakia' },
  { value: 'CZ', label: 'Czechia' },
  { value: 'PL', label: 'Poland' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'FR', label: 'France' },
  { value: 'ES', label: 'Spain' },
  { value: 'IT', label: 'Italy' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
]

export default function VariantPicker({
  shopId,
  productId,
  variants,
}: {
  shopId: number
  productId: string
  variants: Variant[]
}) {
  const [selectedId, setSelectedId] = useState<string>(() => String(variants[0]?.id || ''))
  const [quantity, setQuantity] = useState(1)
  const [country, setCountry] = useState('DE')
  const [shippingCents, setShippingCents] = useState<number | null>(null)
  const [shippingLoading, setShippingLoading] = useState(false)

  const options = useMemo(
    () =>
      variants.map((v) => ({
        value: String(v.id),
        label: `${v.title} — ${formatPriceCents(v.price)}`,
      })),
    [variants],
  )

  const selected = variants.find((v) => String(v.id) === selectedId) || variants[0]

  useEffect(() => {
    const variantId = Number(selectedId)
    const qty = quantity
    const c = country.toUpperCase()
    if (!Number.isFinite(variantId) || variantId <= 0) return

    let cancelled = false
    ;(async () => {
      try {
        setShippingLoading(true)
        const params = new URLSearchParams({
          shopId: String(shopId),
          productId,
          variantId: String(variantId),
          quantity: String(qty),
          country: c,
        })
        const res = await fetch(`/api/printify/shipping?${params.toString()}`, { cache: 'no-store' })
        const data = await res.json().catch(() => null)
        if (!res.ok) throw new Error(data?.error || 'Failed to load shipping')
        if (!cancelled) setShippingCents(typeof data?.standardCents === 'number' ? data.standardCents : null)
      } catch {
        if (!cancelled) setShippingCents(null)
      } finally {
        if (!cancelled) setShippingLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [shopId, productId, selectedId, quantity, country])

  if (!selected) {
    return <p className="text-sm text-gray-300">No enabled variants on this product.</p>
  }

  const total = (selected.price || 0) * quantity + (shippingCents || 0)

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-purple-300">From</p>
          <p className="text-2xl font-bold text-white">{formatPriceCents(selected.price)}</p>
        </div>
        <div className="text-right text-xs text-gray-300">Secure checkout</div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
        <div className="space-y-2">
          <p className="text-sm text-gray-200">Choose a variant</p>
          <NiceSelect
            value={selectedId}
            options={options}
            onChange={(v) => {
              setSelectedId(v)
            }}
            placeholder="Select a variant"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-200">Qty</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-3 rounded-lg border border-white/10 bg-white/5 hover:border-purple-400/60"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              value={quantity}
              onChange={(e) => {
                const n = Number(e.target.value)
                if (!Number.isFinite(n)) return
                const nextQty = Math.min(10, Math.max(1, Math.floor(n)))
                setQuantity(nextQty)
              }}
              inputMode="numeric"
              className="w-16 text-center px-3 py-3 rounded-lg bg-black/50 border border-purple-500/30 text-white"
            />
            <button
              type="button"
              onClick={() => {
                setQuantity((q) => {
                  const nextQty = Math.min(10, q + 1)
                  return nextQty
                })
              }}
              className="px-3 py-3 rounded-lg border border-white/10 bg-white/5 hover:border-purple-400/60"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto] items-end">
        <div className="space-y-2">
          <p className="text-sm text-gray-200">Ship to</p>
          <NiceSelect
            value={country}
            options={COUNTRY_OPTIONS}
            onChange={(v) => {
              setCountry(v)
            }}
          />
        </div>
        <div className="text-sm text-gray-200 sm:text-right">
          <div className="text-xs text-gray-400">Shipping</div>
          <div className="font-semibold">
            {shippingLoading ? 'Calculating…' : shippingCents !== null ? formatPriceCents(shippingCents) : '—'}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-200">
        <span className="text-gray-300">Total</span>
        <span className="font-semibold text-white">{shippingLoading ? '—' : formatPriceCents(total)}</span>
      </div>

      <BuyButton
        shopId={shopId}
        productId={productId}
        variantId={selected.id}
        quantity={quantity}
        country={country}
        className="w-full px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-colors text-white font-semibold"
      />

      <p className="text-xs text-gray-400">
        Printed on demand. Shipping is estimated for the selected country and charged at checkout.
      </p>
    </div>
  )
}
