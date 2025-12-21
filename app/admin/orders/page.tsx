import { cookies } from 'next/headers'
import OrdersClient from './OrdersClient'

export default async function OrdersAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; search?: string; status?: string }>
}) {
  const sp = await searchParams
  const page = Number(sp.page || 1)
  const limit = Number(sp.limit || 20)
  const search = sp.search || ''
  const status = sp.status || ''

  const params = new URLSearchParams({ page: String(page), limit: String(limit), search, status })
  const cookieStore = await cookies()
  const res = await fetch(
    `${process.env.BASE_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/orders?${params.toString()}`,
    {
      headers: { cookie: cookieStore.toString() },
      cache: 'no-store',
      next: { revalidate: 0 },
    },
  )
  if (!res.ok) throw new Error('Failed to load orders')
  const data = await res.json()
  return <OrdersClient items={data.items || []} pagination={data.pagination} />
}

