import type { Metadata } from 'next'
import Link from 'next/link'
import { listMerch } from '@/lib/shop/printful'
import type { MerchProduct } from '@/lib/shop/merchShared'
import MerchStore from './MerchStore'

export const revalidate = 600

const URL = 'https://dnbdoctor.com/merch'
const TITLE = 'DnB Doctor Merch: Neurofunk Hoodies, Tees & Hats'
const DESCRIPTION =
  'Official DnB Doctor merch: heavyweight hoodies, tees, beanies and hats for the neurofunk and drum & bass crowd. Printed to order in Europe and shipped worldwide.'

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'DnB Doctor',
    type: 'website',
    images: [{ url: 'https://dnbdoctor.com/og-image.jpg', width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: 'summary_large_image', images: ['https://dnbdoctor.com/og-image.jpg'] },
}

const FAQ = [
  ['How long does delivery take?', 'Every piece is printed to order. Production usually takes 2 to 5 business days, then the parcel ships from the production centre closest to you. The exact shipping price and delivery estimate are shown in the bag before you pay.'],
  ['Which sizes should I pick?', 'The hoodie has a relaxed, oversized fit; take your usual size for a loose look or one size down for a regular fit. The tee is a relaxed sports jersey. Hats and beanies are one size, the bucket hat comes in S/M and M/L.'],
  ['Can I return or exchange an item?', 'Because each item is made to order for you, we don\'t accept returns for a wrong size. If something arrives damaged or misprinted, email info@dnbdoctor.com within 14 days with a photo and we will replace it free of charge.'],
  ['Where do you ship?', 'Across the EU, the UK, Switzerland and Norway, plus the US, Canada, Australia, New Zealand and Japan. Prices are final, no VAT is added at checkout; orders outside the EU may be charged import duties by your country.'],
] as const

export default async function MerchPage() {
  let products: MerchProduct[] = []
  try {
    products = await listMerch(600)
  } catch (e) {
    console.error('[merch] catalogue failed', e instanceof Error ? e.message : e)
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: 'DnB Doctor merch',
        itemListElement: products.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: p.name,
            image: p.image ?? undefined,
            brand: { '@type': 'Brand', name: 'DnB Doctor' },
            offers: {
              '@type': 'AggregateOffer',
              priceCurrency: p.currency.toUpperCase(),
              lowPrice: (p.minPriceCents / 100).toFixed(2),
              highPrice: (Math.max(...p.variants.map((v) => v.priceCents)) / 100).toFixed(2),
              offerCount: p.variants.length,
              availability: 'https://schema.org/InStock',
              url: `${URL}#${p.slug}`,
            },
          },
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 pt-32 text-[#e8e8ec] md:pt-40">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#39ff14]">Rx · 174 BPM · Take loud, repeat nightly</p>
        <h1 className="mt-3 text-5xl font-bold uppercase leading-[0.9] text-white md:text-7xl">DnB Doctor merch</h1>
        <p className="mt-6 text-lg leading-relaxed text-gray-300">
          Heavyweight black pieces for the people who live at 174. Each one is printed or embroidered to order in Europe, so nothing sits in a warehouse and nothing goes to waste. Pick a size, add it to the bag and see the exact shipping price for your country before you pay.
        </p>
      </header>

      {products.length > 0 ? (
        <MerchStore products={products} />
      ) : (
        <p className="mt-14 border border-white/15 p-6 text-lg">
          The merch store is being restocked. Check back soon, or follow{' '}
          <a href="https://www.instagram.com/dnbdoctor/" className="text-[#39ff14] underline underline-offset-4">@dnbdoctor</a> for the next drop.
        </p>
      )}

      <section aria-labelledby="merch-faq" className="mt-20 max-w-3xl">
        <h2 id="merch-faq" className="text-3xl font-bold uppercase text-white">Shipping, sizes &amp; returns</h2>
        <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-4">
              <summary className="cursor-pointer list-none font-bold text-white marker:hidden">
                <span className="mr-3 font-mono text-[#39ff14] group-open:text-[#ff004d]">+</span>
                {q}
              </summary>
              <p className="mt-3 pl-7 leading-relaxed text-gray-300">{a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-gray-300">
          Producing yourself? Grab the <Link href="/sample-packs" className="text-[#39ff14] underline underline-offset-4">free neurofunk sample pack</Link> or a full <Link href="/music-packs" className="text-[#39ff14] underline underline-offset-4">music pack</Link> from the label.
        </p>
      </section>
    </main>
  )
}
