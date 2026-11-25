import { prisma } from '@/lib/prisma'
import { getReleaseImageUrl } from '@/app/utils'
import { primaryArtist } from '@/app/components/hero/releaseMeta'
import { money } from './emails'

export type More = { slug: string; title: string; artist: string; image: string | null; from: string }
export type MoreToBuy = { heading: string; list: More[] }

/** Up to 3 other releases sold here for a paid order: same artist first, else the newest ones. */
export async function moreForOrder(orderId: string): Promise<MoreToBuy | null> {
  try {
    const items = await prisma.orderItem.findMany({ where: { orderId }, select: { product: { select: { release: { select: { id: true, artistName: true } } } } } })
    const rel = items.map((i) => i.product.release).filter((x): x is { id: string; artistName: string | null } => !!x)
    const releaseIds = [...new Set(rel.map((x) => x.id))]
    const artists = [...new Set(rel.map((x) => (x.artistName ? primaryArtist(x.artistName) : '')).filter(Boolean))]

    const pick = (where: object) =>
      prisma.release.findMany({
        where: { id: { notIn: releaseIds }, publishedAt: { lte: new Date() }, products: { some: { active: true, fileKey: { not: null } } }, ...where },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: { slug: true, title: true, artistName: true, coverImageUrl: true, coverImageKey: true, products: { where: { active: true }, select: { priceCents: true, currency: true } } },
      })
    const same = artists.length ? await pick({ OR: artists.map((a) => ({ artistName: { contains: a, mode: 'insensitive' as const } })) }) : []
    const rows = same.length ? same : await pick({})
    const list = rows.map((r) => {
      const low = r.products.reduce((m, p) => (p.priceCents < m.priceCents ? p : m), r.products[0])
      return { slug: r.slug, title: r.title, artist: r.artistName ?? '', image: getReleaseImageUrl(r) || null, from: low ? money(low.priceCents, low.currency) : '' }
    })
    return list.length ? { heading: same.length ? `More from ${artists[0]}` : 'Fresh on DnB Doctor', list } : null
  } catch {
    return null
  }
}
