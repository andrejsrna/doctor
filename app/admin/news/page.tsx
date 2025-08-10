import { cookies } from "next/headers"
import NewsClient from "./NewsClient"

export default async function NewsAdminPage({ searchParams }: { searchParams: Promise<{ page?: string; limit?: string; search?: string }> }) {
  const sp = await searchParams
  const page = Number(sp.page || 1)
  const limit = Number(sp.limit || 20)
  const search = sp.search || ""
  const params = new URLSearchParams({ page: String(page), limit: String(limit), search })
  const cookieStore = await cookies()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/news?${params.toString()}`, {
    headers: { cookie: cookieStore.toString() },
    cache: 'no-store',
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error('Failed to load news')
  const data = await res.json()
  return <NewsClient items={data.items || []} pagination={data.pagination} />
}
