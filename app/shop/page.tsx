import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { listPrintifyProducts, listPrintifyShops, resolvePrintifyShopId, type PrintifyProduct } from '@/lib/printify'
import TrustBadges from '@/app/shop/TrustBadges'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Shop | DnB Doctor',
  description: 'DnB Doctor merch — printed on demand and shipped to you.',
  robots: { index: true, follow: true },
}

function pickCover(product: PrintifyProduct): string | null {
  return product.images?.find((i) => i.is_default)?.src || product.images?.[0]?.src || null
}

function formatPriceCents(cents?: number | null): string | null {
  if (cents === undefined || cents === null || !Number.isFinite(cents)) return null
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
}

function minEnabledVariantPrice(product: PrintifyProduct): string | null {
  const enabled = product.variants?.filter((v) => v.is_enabled) || []
  if (enabled.length === 0) return null
  const min = enabled.reduce((acc, v) => (v.price < acc ? v.price : acc), enabled[0]!.price)
  return formatPriceCents(min)
}

function stripHtml(input: string): string {
  return input
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ shopId?: string }> }) {
  const sp = await searchParams
  const requestedShopId = sp.shopId ? Number(sp.shopId) : null

  let shopId: number | null = null
  let products: PrintifyProduct[] = []
  let shops: Awaited<ReturnType<typeof listPrintifyShops>> = []
  let errorMessage: string | null = null

  try {
    shops = await listPrintifyShops()
    shopId = await resolvePrintifyShopId(requestedShopId)
    const result = await listPrintifyProducts(shopId, { page: 1, limit: 24 })
    products = result.data || []
  } catch (e) {
    errorMessage = e instanceof Error ? e.message : 'Failed to load products'
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden pt-24 pb-14">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(168,85,247,0.28),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.22),transparent_40%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-white/5 px-3 py-1 text-xs text-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400" aria-hidden="true" />
            Official merch
          </div>

          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
            <div className="space-y-5">
              <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Shop</p>
              <h1 className="text-4xl md:text-6xl font-bold leading-[1.05]">
                DnB Doctor Merch
                <span className="block text-purple-200/90 mt-2 text-xl md:text-2xl font-semibold">
                  Printed on demand. Made for late-night systems.
                </span>
              </h1>
              <p className="text-gray-200 max-w-2xl">
                Pick a design, choose your variant, and checkout securely. We print your item after purchase and ship it to you.
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-200">
                  Secure checkout
                </span>
                <span className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-200">
                  Print-on-demand
                </span>
                <span className="text-xs px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-200">
                  New drops
                </span>
              </div>
            </div>

            <div className="rounded-3xl border border-purple-500/20 bg-white/5 p-5 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white">Good to know</p>
              <div className="mt-3 grid gap-3 text-sm text-gray-200">
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-green-400/80" aria-hidden="true" />
                  <p>Production starts after purchase (no overstock).</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-400/80" aria-hidden="true" />
                  <p>Choose your variant and quantity on the product page.</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white/50" aria-hidden="true" />
                  <p>Need help? Reach us via the contact form.</p>
                </div>
              </div>
              <Link
                href="/contact"
                className="inline-flex mt-4 text-sm text-purple-200 hover:text-white underline underline-offset-4"
              >
                Contact support
              </Link>
            </div>
          </div>

          {shops.length > 1 && (
            <div className="flex flex-wrap gap-2 pt-8">
              {shops.map((s) => (
                <Link
                  key={s.id}
                  href={`/shop?shopId=${s.id}`}
                  className={[
                    'px-3 py-2 rounded-lg text-sm border transition-colors',
                    s.id === shopId ? 'border-purple-400 bg-purple-500/10 text-white' : 'border-white/10 hover:border-purple-400/60',
                  ].join(' ')}
                >
                  {s.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {errorMessage ? (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-100">
              <p className="font-semibold">Shop is temporarily unavailable</p>
              <p className="text-sm opacity-90 mt-1">{errorMessage}</p>
              <p className="text-sm opacity-90 mt-3">
                Please try again in a bit.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/10 p-6 text-gray-200">
              No products available right now. Check back soon.
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Catalog</p>
                  <h2 className="text-2xl md:text-3xl font-bold">Available now</h2>
                </div>
                <p className="text-sm text-gray-300">{products.length} items</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const cover = pickCover(product)
                  const minPrice = minEnabledVariantPrice(product)
                  const description = product.description ? stripHtml(product.description) : ''
                  return (
                    <Link
                      key={product.id}
                      href={`/shop/${product.id}${shopId ? `?shopId=${shopId}` : ''}`}
                      className="group relative bg-white/5 border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-400/60 transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                    >
                    <div className="relative aspect-[4/3]">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black/40 to-green-500/10" />
                      {cover ? (
                        <Image
                          src={cover}
                          alt={product.title}
                          fill
                          className="object-contain bg-black transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-lg font-semibold leading-snug group-hover:text-purple-100 transition-colors">
                          {product.title}
                        </h2>
                        {minPrice && (
                          <span className="shrink-0 text-sm text-green-200 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-md">
                            From {minPrice}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300">
                        {description ? (description.length > 160 ? `${description.slice(0, 160)}…` : description) : ' '}
                      </p>
                      <span className="text-sm text-purple-200 flex items-center gap-2 group-hover:text-white">
                        View product <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                    </Link>
                  )
                })}
              </div>
            </>
          )}

          <TrustBadges className="mt-12" />
        </div>
      </section>
    </div>
  )
}
