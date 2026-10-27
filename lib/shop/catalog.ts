import { prisma } from '@/lib/prisma'
import { getReleaseImageUrl } from '@/app/utils'
import { stripeConfigured } from './stripe'
import { money } from './emails'

export type BuyOffer = {
  productSlug: string
  title: string
  price: string
  amount: number
  amountCents: number
  currency: string
  type: 'SAMPLE_PACK' | 'TRACK' | 'RELEASE' | string
  image: string | null
  href: string | null
}

export type ReleaseOffers = {
  /** The headline Buy button: a sample pack, an EP/album bundle, or the WAV of a single. */
  main: BuyOffer | null
  /** Individually sold tracks of an EP/album. */
  tracks: BuyOffer[]
}

const NONE: ReleaseOffers = { main: null, tracks: [] }
const MULTI = new Set(["EP's", 'Albums'])

/** What a release page sells — empty until the shop is live, so the page keeps its existing store links. */
export async function offersForRelease(releaseId: string): Promise<ReleaseOffers> {
  if (!stripeConfigured()) return NONE
  try {
    const rows = await prisma.product.findMany({
      where: { releaseId, active: true, fileKey: { not: null } },
      orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
      include: { release: { select: { slug: true, coverImageUrl: true, coverImageKey: true, categories: true } } },
    })
    const offers = rows.map((p) => ({
      productSlug: p.slug,
      title: p.title,
      price: money(p.priceCents, p.currency),
      amount: p.priceCents / 100,
      amountCents: p.priceCents,
      currency: p.currency.toUpperCase(),
      type: p.type,
      image: p.release ? getReleaseImageUrl(p.release) || null : null,
      href: p.release ? `/music/${p.release.slug}` : null,
    }))
    const main = offers.find((o) => o.type !== 'TRACK') ?? null
    const tracks = offers.filter((o) => o.type === 'TRACK')
    // A single's only track is the release itself; EPs/albums list their tracks next to the bundle.
    const multi = rows[0]?.release?.categories.some((c) => MULTI.has(c)) ?? false
    if (!main && tracks.length === 1 && !multi) return { main: tracks[0], tracks: [] }
    return { main, tracks }
  } catch {
    return NONE
  }
}

/** The headline product of a release page, or null. */
export async function offerForRelease(releaseId: string): Promise<BuyOffer | null> {
  return (await offersForRelease(releaseId)).main
}
