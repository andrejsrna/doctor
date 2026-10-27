import { prisma } from '@/lib/prisma'
import { stripeConfigured } from './stripe'
import { money } from './emails'

export type BuyOffer = { productSlug: string; title: string; price: string; amount: number; currency: string; type: 'SAMPLE_PACK' | 'TRACK' | string }

/** The product a release page may sell, or null — keeps the page on its existing store links until the shop is live. */
export async function offerForRelease(releaseId: string): Promise<BuyOffer | null> {
  if (!stripeConfigured()) return null
  try {
    const p = await prisma.product.findUnique({ where: { releaseId } })
    if (!p || !p.active || !p.fileKey) return null
    return { productSlug: p.slug, title: p.title, price: money(p.priceCents, p.currency), amount: p.priceCents / 100, currency: p.currency.toUpperCase(), type: p.type }
  } catch {
    return null
  }
}
