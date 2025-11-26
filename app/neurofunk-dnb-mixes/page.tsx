import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/lib/sanitize'
import type { Metadata } from 'next'

export const revalidate = 600

type MixItem = {
  id: string
  slug: string
  title: string
  coverImageUrl?: string | null
  publishedAt?: string | null
}

const siteUrl = 'https://dnbdoctor.com'
const heroImage = '/music-bg.jpeg'

export const metadata: Metadata = {
  title: 'Neurofunk DnB Mixes | Dark Drum & Bass Sets by DnB Doctor',
  description: 'Listen to curated neurofunk DnB mixes packed with rolling basslines and cinematic energy. Fresh “Mixes” drops, artist features, and heavy drum & bass sets.',
  openGraph: {
    title: 'Neurofunk DnB Mixes | Dark Drum & Bass Sets',
    description: 'Curated drum & bass mixes from the DnB Doctor roster with relentless bass pressure.',
    url: `${siteUrl}/neurofunk-dnb-mixes`,
    type: 'website',
    images: [{ url: heroImage, width: 1200, height: 630, alt: 'Neurofunk DnB Mixes' }],
  },
  alternates: { canonical: `${siteUrl}/neurofunk-dnb-mixes` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

function formatDate(date?: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function fetchMixes(): Promise<MixItem[]> {
  try {
    const posts = await prisma.news.findMany({
      where: { categories: { has: 'Mixes' } },
      orderBy: { publishedAt: 'desc' },
      take: 6,
      select: { id: true, slug: true, title: true, coverImageUrl: true, publishedAt: true },
    })
    return posts.map((p) => ({
      ...p,
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    }))
  } catch (error) {
    console.error('Failed to load mixes', error)
    return []
  }
}

export default async function NeurofunkDnBMixesPage() {
  const mixes = await fetchMixes()

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Neurofunk drum and bass visuals"
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-purple-900/30" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.2),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(34,197,94,0.2),transparent_35%)]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Neurofunk DnB Mixes</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Dark, Rolling Drum &amp; Bass Mixes with Cinematic Pressure
            </h1>
            <p className="text-lg text-gray-200">
              Curated sets from the DnB Doctor roster and allies. Expect relentless basslines, halftime detours, and
              warehouse-ready energy. Every mix is tagged under “Mixes” so you can binge the newest drops without digging.
            </p>
            <div className="grid gap-4 md:grid-cols-2 text-sm text-gray-200">
              <div className="bg-white/5 border border-purple-500/30 rounded-xl p-4">
                <p className="text-purple-300 font-semibold mb-1">What you get</p>
                <p>High-impact neurofunk selections, double drops, cinematic intros, and techy rollers for late-night systems.</p>
              </div>
              <div className="bg-white/5 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-300 font-semibold mb-1">Updated often</p>
                <p>Fresh “Mixes” news posts as they land — no stale listings, just the latest sets.</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link
                className="px-5 py-3 rounded-lg bg-purple-600 hover:bg-purple-500 transition-colors text-white font-semibold shadow-[0_10px_40px_rgba(168,85,247,0.35)]"
                href="#mixes"
              >
                Explore Mixes
              </Link>
              <Link
                className="px-5 py-3 rounded-lg border border-purple-400/50 hover:border-purple-300 text-purple-100"
                href="/news"
              >
                All News
              </Link>
            </div>
          </div>

          <div className="relative w-full h-[380px] md:h-[460px]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-black/60 to-green-500/10 rounded-3xl blur-3xl" />
            <div className="relative w-full h-full border border-purple-500/20 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
              <Image
                src="/dnb-mixes.jpeg"
                alt="DnB Doctor mixes visual"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <p className="text-sm uppercase tracking-wide text-purple-200">Now Featuring</p>
                <p className="text-xl font-semibold">Neurofunk DnB Doctor Showcase</p>
                <p className="text-gray-300 text-sm">Live-blended by the roster. 60 minutes of grit.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="mixes" className="relative py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Latest Drops</p>
              <h2 className="text-3xl md:text-4xl font-bold">Fresh Neurofunk Mixes</h2>
            </div>
            <Link
              href="/news"
              className="text-purple-200 hover:text-white text-sm underline underline-offset-4"
            >
              View all news
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {mixes.length > 0 ? (
              mixes.map((mix) => (
                <Link
                  key={mix.id}
                  href={`/news/${mix.slug}`}
                  className="group relative bg-white/5 border border-purple-500/20 rounded-2xl overflow-hidden hover:border-purple-400/60 transition-all"
                >
                  <div className="grid grid-cols-[1.4fr_1fr] min-h-[180px]">
                    <div className="p-5 flex flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-purple-300">Mixes</p>
                        <h3
                          className="text-xl font-semibold mt-2 mb-2 group-hover:text-purple-100 transition-colors"
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(mix.title) }}
                        />
                        <p className="text-sm text-gray-400">{formatDate(mix.publishedAt)}</p>
                      </div>
                      <span className="text-sm text-purple-200 flex items-center gap-2 group-hover:text-white">
                        Listen now
                        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                    <div className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black/40 to-green-500/10" />
                      {mix.coverImageUrl ? (
                        <Image
                          src={mix.coverImageUrl}
                          alt={sanitizeHtml(mix.title)}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 40vw, 30vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                          No image
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 px-6 rounded-xl border border-purple-500/30 bg-purple-500/5 text-gray-300">
                No mixes published yet. Check back soon for fresh neurofunk sets.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
