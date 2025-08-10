import { cookies } from "next/headers"
import ReleasesClient from "./ReleasesClient"

export default async function ReleasesAdminPage({ searchParams }: { searchParams: Promise<{ page?: string; limit?: string; search?: string; category?: string }> }) {
  const sp = await searchParams
  const page = Number(sp.page || 1)
  const limit = Number(sp.limit || 20)
  const search = sp.search || ""
  const category = sp.category || ""

  const params = new URLSearchParams({ page: String(page), limit: String(limit), search, category })
  const cookieStore = await cookies()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/releases?${params.toString()}`, {
    headers: { cookie: cookieStore.toString() },
    cache: "no-store",
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error("Failed to load releases")
  const data = await res.json()
  return <ReleasesClient items={data.items || []} pagination={data.pagination} />
}
