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
  type: 'SAMPLE_PACK' | 'TRACK' | string
  image: string | null
  href: string | null
}

/** The product a release page may sell, or null — keeps the page on its existing store links until the shop is live. */
export async function offerForRelease(releaseId: string): Promise<BuyOffer | null> {
  if (!stripeConfigured()) return null
  try {
    const p = await prisma.product.findUnique({ where: { releaseId }, include: { release: { select: { slug: true, coverImageUrl: true, coverImageKey: true } } } })
    if (!p || !p.active || !p.fileKey) return null
    return {
      productSlug: p.slug,
      title: p.title,
      price: money(p.priceCents, p.currency),
      amount: p.priceCents / 100,
      amountCents: p.priceCents,
      currency: p.currency.toUpperCase(),
      type: p.type,
      image: p.release ? getReleaseImageUrl(p.release) || null : null,
      href: p.release ? `/music/${p.release.slug}` : null,
    }
  } catch {
    return null
  }
}
