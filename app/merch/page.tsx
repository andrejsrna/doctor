import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { listMerch } from '@/lib/shop/printful'
import type { MerchProduct } from '@/lib/shop/merchShared'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import MerchStore from './MerchStore'
import { MERCH_COPY } from './copy'
import s from './merch.module.css'

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
  ['Which sizes should I pick?', 'Both the hoodie and the tee have a relaxed fit: take your usual size for a loose look, or one size down if you prefer it closer to the body. The tee also runs slightly long. Hats and beanies are one size, the bucket hat comes in S/M and M/L.'],
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
            description: MERCH_COPY[p.slug]?.pitch,
            image: MERCH_COPY[p.slug]?.photos?.length ? MERCH_COPY[p.slug]!.photos!.map((ph) => `https://dnbdoctor.com${ph.src}`) : (p.image ?? undefined),
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

  const art = products.find((p) => p.backImage)?.backImage ?? null
  const from = products.length ? Math.min(...products.map((p) => p.minPriceCents)) : null
  const fromLabel = from != null ? new Intl.NumberFormat('en-IE', { style: 'currency', currency: (products[0].currency || 'eur').toUpperCase(), maximumFractionDigits: 0 }).format(from / 100) : null

  return (
    <main className={`${s.root} ${displayFont.variable} ${monoFont.variable}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

      <header className={`${s.wrap} ${s.hero}`}>
        <div>
          <p className={s.eyebrow}>Rx · 174 BPM · Take loud, repeat nightly</p>
          <h1 className={s.h1}>
            DnB Doctor <span>Merch</span>
          </h1>
          <p className={s.lede}>
            Black, heavy and made for the people who live at 174. A crest on the chest, a heart wired into a speaker across the back, and nothing mass-produced: every piece is printed or embroidered only after you order it.
          </p>
          <div className={s.heroCtas}>
            <a href="#shop" className={s.btn}>
              Shop the drop{fromLabel ? ` · from ${fromLabel}` : ''}
            </a>
            <a href="#merch-faq" className={s.btnGhost}>
              Sizes &amp; shipping
            </a>
          </div>
        </div>

        {art && (
          <figure className={s.script} aria-label="Back print artwork">
            <div className={s.scriptArt}>
              <Image src={art} alt="DnB Doctor back print: an anatomical heart wired into a speaker" fill sizes="(min-width:960px) 30rem, 86vw" priority />
            </div>
            <figcaption className={s.label}>
              <div className={s.labelHead}>
                <span>DnB Doctor · Rx</span>
                <strong>174</strong>
              </div>
              <dl className={s.labelRows}>
                <dt>Patient</dt>
                <dd>The 174 crowd</dd>
                <dt>Dose</dt>
                <dd>One piece, worn loud</dd>
                <dt>Directions</dt>
                <dd>Repeat nightly</dd>
              </dl>
              <svg className={s.ecg} viewBox="0 0 260 26" aria-hidden="true">
                <path d="M0 14h70l6-9 7 18 6-22 6 13h40l6-9 7 18 6-22 6 13h93" />
              </svg>
            </figcaption>
          </figure>
        )}
      </header>

      <div className={s.wrap}>
        <ul className={s.facts}>
          <li><strong>Made to order</strong>Printed only after you buy, zero dead stock</li>
          <li><strong>Shipping up front</strong>Exact price and delivery time before you pay</li>
          <li><strong>Ships worldwide</strong>EU, UK, US, Canada, Australia, Japan and more</li>
          <li><strong>Secure checkout</strong>Card payment by Stripe</li>
        </ul>
      </div>

      {products.length > 0 ? (
        <MerchStore products={products} />
      ) : (
        <div className={`${s.wrap} ${s.section}`}>
          <p id="shop" className={s.empty}>
            The merch store is being restocked. Check back soon, or follow <a href="https://www.instagram.com/dnbdoctor/">@dnbdoctor</a> for the next drop.
          </p>
        </div>
      )}

      <section aria-labelledby="merch-faq" className={`${s.wrap} ${s.section}`}>
        <div className={s.sectionHead}>
          <div>
            <p className={s.eyebrow}>Before you order</p>
            <h2 id="merch-faq" className={s.h2}>Shipping, sizes &amp; returns</h2>
          </div>
        </div>
        <div className={s.faq}>
          {FAQ.map(([q, a], i) => (
            <details key={q} open={i === 0}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <p className={s.more}>
          Producing yourself? Grab the <Link href="/sample-packs">free neurofunk sample pack</Link> or a full <Link href="/music-packs">music pack</Link> from the label.
        </p>
      </section>
    </main>
  )
}
