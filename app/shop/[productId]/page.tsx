import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPrintifyProduct, resolvePrintifyShopId, type PrintifyProduct } from '@/lib/printify'
import ProductGallery from '@/app/shop/ProductGallery'
import { sanitizeHtml } from '@/lib/sanitize'
import VariantPicker from '@/app/shop/VariantPicker'
import TrustBadges from '@/app/shop/TrustBadges'
import { isShopEnabled } from '@/app/utils/shop'

export const revalidate = 300

function pickCover(product: PrintifyProduct): string | null {
  return product.images?.find((i) => i.is_default)?.src || product.images?.[0]?.src || null
}

function listImages(product: PrintifyProduct): string[] {
  const cover = pickCover(product)
  const rest = (product.images || []).map((i) => i.src).filter(Boolean)
  return cover ? [cover, ...rest] : rest
}

function stripHtml(input: string): string {
  return input
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function minEnabledVariantPriceCents(product: PrintifyProduct): number | null {
  const enabled = (product.variants || []).filter((v) => v.is_enabled)
  if (enabled.length === 0) return null
  return enabled.reduce((acc, v) => (v.price < acc ? v.price : acc), enabled[0]!.price)
}

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://dnbdoctor.com'
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>
  searchParams: Promise<{ shopId?: string }>
}): Promise<Metadata> {
  if (!isShopEnabled()) {
    return {
      title: 'Shop | DnB Doctor',
      description: 'DnB Doctor merch — printed on demand and shipped to you.',
      robots: { index: false, follow: false },
    }
  }
  const { productId } = await params
  const sp = await searchParams

  try {
    const shopId = await resolvePrintifyShopId(sp.shopId ? Number(sp.shopId) : null)
    const product = await getPrintifyProduct(shopId, productId)

    const title = `${product.title} | DnB Doctor Shop`
    const rawDescription = product.description ? stripHtml(product.description) : ''
    const description = rawDescription ? (rawDescription.length > 155 ? `${rawDescription.slice(0, 155)}…` : rawDescription) : 'DnB Doctor merch — printed on demand and shipped to you.'
    const images = listImages(product).slice(0, 4)
    const url = `${getSiteUrl()}/shop/${productId}`

    return {
      title,
      description,
      alternates: { canonical: url },
      openGraph: {
        type: 'website',
        title,
        description,
        url,
        images: images.map((src) => ({ url: src })),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images,
      },
      robots: { index: true, follow: true },
    }
  } catch {
    return {
      title: 'Product | DnB Doctor Shop',
      description: 'DnB Doctor merch — printed on demand and shipped to you.',
      robots: { index: false, follow: true },
    }
  }
}

export default async function ShopProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ productId: string }>
  searchParams: Promise<{ shopId?: string }>
}) {
  if (!isShopEnabled()) notFound()
  const { productId } = await params
  const sp = await searchParams
  const shopId = await resolvePrintifyShopId(sp.shopId ? Number(sp.shopId) : null)
  const product = await getPrintifyProduct(shopId, productId)
  const images = listImages(product)
  const enabledVariants = (product.variants || []).filter((v) => v.is_enabled)
  const minPriceCents = minEnabledVariantPriceCents(product)
  const productUrl = `${getSiteUrl()}/shop/${productId}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ? stripHtml(product.description) : undefined,
    image: images.length ? images : undefined,
    brand: { '@type': 'Brand', name: 'DnB Doctor' },
    url: productUrl,
    offers: minPriceCents
      ? {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: (minPriceCents / 100).toFixed(2),
          availability: 'https://schema.org/InStock',
          url: productUrl,
        }
      : undefined,
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="max-w-6xl mx-auto px-4 pt-28 pb-8 relative z-10">
        <Link href={shopId ? `/shop?shopId=${shopId}` : '/shop'} className="text-sm text-purple-200 hover:text-white">
          ← Back to shop
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="self-start lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-auto lg:pr-2">
          <ProductGallery images={images} alt={product.title} />
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Product</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mt-2">{product.title}</h1>
            {product.description && (
              <div
                className="prose prose-invert max-w-none mt-4 prose-p:text-gray-200 prose-li:text-gray-200 prose-strong:text-white prose-headings:text-white prose-a:text-purple-200"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }}
              />
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
            <p className="font-semibold">Options</p>
            <VariantPicker
              shopId={shopId}
              productId={productId}
              variants={enabledVariants.map((v) => ({ id: v.id, title: v.title, price: v.price }))}
            />
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-5">
            <p className="font-semibold">Shipping &amp; Returns</p>
            <p className="text-sm text-gray-200 mt-2">
              This item is printed on demand. Production usually takes 2–5 business days, then shipping time depends on your
              location.
            </p>
            <p className="text-sm text-gray-200 mt-3">
              If anything arrives damaged or wrong, contact us and we’ll make it right.
            </p>
            <p className="text-sm text-gray-200 mt-3">
              Artwork note: illustrations for this design were created with AI.
            </p>
            <div className="flex gap-4 flex-wrap mt-4 text-sm">
              <Link href="/contact" className="text-purple-200 hover:text-white underline underline-offset-4">
                Contact support
              </Link>
              <Link href="/terms" className="text-purple-200 hover:text-white underline underline-offset-4">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-24">
        <TrustBadges />
      </section>
    </div>
  )
}
