import Image from 'next/image'
import Link from 'next/link'
import { FaDownload, FaFileInvoice } from 'react-icons/fa'

export type AccountOrder = {
  id: string
  paidAt: Date | null
  total: string
  refunded: boolean
  invoiceNumber: string | null
  items: { id: string; title: string; file: string; image: string | null; href: string | null }[]
}

const date = (d: Date | null) => d?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) ?? ''
const ref = (id: string) => id.slice(-8).toUpperCase()

/** Purchases grouped by order: every file can be re-downloaded without a limit while signed in. */
export default function OrderList({ orders }: { orders: AccountOrder[] }) {
  return (
    <ul className="space-y-5">
      {orders.map((o) => (
        <li key={o.id} className="border border-white/10 bg-white/[0.02]">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 px-5 py-3 font-mono text-xs uppercase tracking-widest text-gray-400">
            <span>
              Order <span className="text-gray-200">#{ref(o.id)}</span> · {date(o.paidAt)}
            </span>
            <span className="flex items-center gap-3">
              {o.refunded ? (
                <span className="border border-[#ff004d]/60 px-2 py-1 text-[#ff004d]">Refunded</span>
              ) : (
                <span className="border border-[#39ff14]/50 px-2 py-1 text-[#39ff14]">Paid</span>
              )}
              <span className="text-white">{o.total}</span>
            </span>
          </div>

          <div className="divide-y divide-white/10 px-5">
            {o.items.map((i) => (
              <div key={i.id} className="flex flex-wrap items-center gap-4 py-4 sm:flex-nowrap">
                {i.image ? (
                  <Image src={i.image} alt="" width={72} height={72} className="h-[72px] w-[72px] shrink-0 object-cover" />
                ) : (
                  <span className="h-[72px] w-[72px] shrink-0 bg-gradient-to-br from-[#9b5eff]/40 to-[#39ff14]/20" aria-hidden="true" />
                )}
                <div className="min-w-0 flex-1">
                  {i.href ? (
                    <Link href={i.href} className="block text-lg font-bold leading-tight text-white hover:text-[#39ff14]">{i.title}</Link>
                  ) : (
                    <p className="m-0 text-lg font-bold leading-tight text-white">{i.title}</p>
                  )}
                  {i.file && <p className="m-0 mt-1 break-all font-mono text-xs text-gray-400">{i.file}</p>}
                </div>
                {!o.refunded && (
                  <a
                    href={`/api/shop/download?item=${encodeURIComponent(i.id)}`}
                    className="inline-flex w-full items-center justify-center gap-2 bg-[#39ff14] px-4 py-3 font-mono text-sm font-bold uppercase tracking-widest text-black hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-auto"
                  >
                    <FaDownload aria-hidden="true" /> Download
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 px-5 py-3 text-sm">
            {o.invoiceNumber ? (
              <a href={`/api/shop/invoice?order=${encodeURIComponent(o.id)}`} className="inline-flex items-center gap-2 text-[#39ff14] underline-offset-4 hover:underline">
                <FaFileInvoice aria-hidden="true" /> Invoice {o.invoiceNumber} (PDF)
              </a>
            ) : (
              <span className="text-gray-500">Invoice is being prepared, it will appear here shortly.</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  )
}
