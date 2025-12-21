'use client'

import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter, useSearchParams } from 'next/navigation'
import { FaSearch } from 'react-icons/fa'
import NiceSelect from '@/app/components/NiceSelect'
import { useDebounce } from '@/app/hooks/useDebounce'

type OrderItem = {
  id: string
  status: string
  createdAt: string
  currency: string
  amountTotal: number | null
  customerEmail: string | null
  customerName: string | null
  printifyShopId: number | null
  printifyProductId: string
  printifyVariantId: number
  quantity: number
  stripeSessionId: string
  stripePaymentIntentId: string | null
  printifyOrderId: string | null
}

type Pagination = { page: number; limit: number; total: number; pages: number }

const STATUS_OPTIONS = ['', 'PENDING', 'PAID', 'CANCELED', 'PRINTIFY_CREATED', 'PRINTIFY_FAILED']

function formatMoney(currency: string, amountTotal?: number | null) {
  if (!amountTotal) return '-'
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(amountTotal / 100)
  } catch {
    return `${amountTotal / 100} ${currency}`
  }
}

export default function OrdersClient({ items, pagination }: { items: OrderItem[]; pagination: Pagination }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const debouncedSearch = useDebounce(search, 250)

  const pushParams = (next: URLSearchParams) => {
    router.push(`/admin/orders?${next.toString()}`)
  }

  const updateQuery = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams.toString())
    if (value) next.set(key, value)
    else next.delete(key)
    next.set('page', '1')
    pushParams(next)
  }

  useMemo(() => {
    const current = searchParams.get('search') || ''
    if (debouncedSearch !== current) updateQuery('search', debouncedSearch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  const createPrintify = async (id: string) => {
    if (!confirm('Create a Printify draft order for this paid order?')) return
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/printify`, { method: 'POST' })
    const data = await res.json().catch(() => null)
    if (res.ok) {
      toast.success('Printify order created')
      router.refresh()
    } else {
      toast.error(data?.error || 'Failed to create Printify order')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search session id or email"
            className="w-full pl-9 pr-3 py-2 bg-black/50 border border-purple-500/30 rounded"
          />
        </div>
        <div className="w-56">
          <NiceSelect
            value={status}
            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s ? s : 'All statuses' }))}
            onChange={(v) => {
              setStatus(v)
              updateQuery('status', v)
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((o) => (
          <div key={o.id} className="border border-purple-500/20 rounded-lg p-4 bg-black/40 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-semibold">{o.customerEmail || o.customerName || 'Customer'}</div>
                <div className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2 py-1 rounded border border-purple-500/30 text-purple-300">{o.status}</span>
                <span className="text-xs px-2 py-1 rounded border border-green-500/30 text-green-200">
                  {formatMoney(o.currency, o.amountTotal)}
                </span>
              </div>
            </div>

            <div className="text-xs text-gray-400 break-all">
              Stripe session: {o.stripeSessionId}
              {o.stripePaymentIntentId ? ` • PI: ${o.stripePaymentIntentId}` : ''}
            </div>
            <div className="text-xs text-gray-400 break-all">
              Printify: {o.printifyProductId} / {o.printifyVariantId} × {o.quantity}
              {o.printifyOrderId ? ` • Order: ${o.printifyOrderId}` : ''}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                disabled={o.status !== 'PAID' && o.status !== 'PRINTIFY_FAILED'}
                onClick={() => createPrintify(o.id)}
                className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 transition-colors text-white text-sm font-semibold"
              >
                Create Printify Draft
              </button>
            </div>
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={pagination.page === 1}
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString())
              next.set('page', String(Math.max(1, pagination.page - 1)))
              pushParams(next)
            }}
            className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div className="text-gray-400">
            {pagination.page} / {pagination.pages}
          </div>
          <button
            disabled={pagination.page === pagination.pages}
            onClick={() => {
              const next = new URLSearchParams(searchParams.toString())
              next.set('page', String(Math.min(pagination.pages, pagination.page + 1)))
              pushParams(next)
            }}
            className="px-3 py-1 border border-purple-500/30 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

