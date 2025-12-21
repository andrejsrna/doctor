'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export default function BuyButton({
  shopId,
  productId,
  variantId,
  quantity = 1,
  country,
  className,
}: {
  shopId?: number | null
  productId: string
  variantId: number
  quantity?: number
  country: string
  className?: string
}) {
  const [loading, setLoading] = useState(false)

  const startCheckout = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId: shopId || undefined, productId, variantId, quantity, country }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || 'Checkout failed')
      if (!data?.url) throw new Error('Missing Stripe URL')
      window.location.href = data.url
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Checkout failed')
      setLoading(false)
    }
  }

  return (
    <button
      disabled={loading}
      onClick={startCheckout}
      className={
        className ||
        'px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-colors text-white font-semibold'
      }
    >
      {loading ? 'Redirecting…' : 'Buy'}
    </button>
  )
}
