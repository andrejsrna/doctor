import { cookies } from "next/headers"
import ArtistsClient from "./ArtistsClient"

export default async function ArtistsAdminPage({ searchParams }: { searchParams: Promise<{ page?: string; limit?: string; search?: string }> }) {
  const sp = await searchParams
  const page = Number(sp.page || 1)
  const limit = Number(sp.limit || 20)
  const search = sp.search || ""
  const params = new URLSearchParams({ page: String(page), limit: String(limit), search })
  const cookieStore = await cookies()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/artists?${params.toString()}`, {
    headers: { cookie: cookieStore.toString() },
    cache: 'no-store',
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error('Failed to load artists')
  const data = await res.json()
  return <ArtistsClient items={data.items || []} pagination={data.pagination} />
}
