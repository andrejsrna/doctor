import Button from '@/app/components/Button'
import ArtistCardsGrid from '@/app/artists/ArtistCardsGrid'
import { prisma } from '@/lib/prisma'

const showInternal = process.env.SHOW_INTERNAL_CORE_ARTIST === '1'

export const revalidate = 600

export default async function CoreArtistsPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { createdAt: 'desc' },
    take: 60,
    select: {
      id: true,
      slug: true,
      name: true,
      imageUrl: true,
      soundcloud: true,
      spotify: true,
    },
  })

  return (
    <main className="min-h-screen bg-black">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,0,0.10)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(168,85,247,0.08)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.4),rgba(0,0,0,1))]" />

        <div className="relative max-w-5xl mx-auto px-4 pt-28 pb-14 md:pt-36 md:pb-20">
          <p className="text-green-500/90 uppercase tracking-[0.25em] text-xs font-semibold">
            DnB Doctor
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight">
            CORE ARTISTS
          </h1>
          <p className="mt-6 text-gray-300 text-lg leading-relaxed max-w-3xl">
            DnB Doctor is more than a release platform. It’s a long-term Drum &amp;
            Bass project built on sound, identity, and consistency.
          </p>
          <p className="mt-4 text-gray-400 leading-relaxed max-w-3xl">
            We’re not here to push tracks and disappear. We’re here to build
            artists and catalogs over time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Button href="/submit-demo" variant="toxic" className="justify-center">
              Submit demo
            </Button>
            <Button href="/contact" variant="infected" className="justify-center">
              Contact
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-5xl mx-auto px-4 pb-20 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-black/50 border border-green-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">What Is a CORE ARTIST?</h2>
            <p className="text-gray-300 leading-relaxed">
              A CORE ARTIST is part of the foundation of DnB Doctor.
            </p>
            <div className="mt-5 space-y-2 text-gray-300">
              <p>
                <span className="text-green-500 font-semibold">Not exclusive.</span>{' '}
                Not contractual. But committed.
              </p>
              <p>
                CORE ARTISTS help shape the sound, the image, and the direction
                of the label.
              </p>
            </div>
          </div>

          <div className="bg-black/50 border border-green-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">What We Stand For</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Dark &amp; technical Drum &amp; Bass</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Quality over quantity</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Music made for sound systems, not algorithms</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Strong visuals and clear identity</span>
              </li>
            </ul>
            <p className="mt-5 text-gray-400">
              If your music fits the sound, the mindset has to fit too.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-black/50 border border-green-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">What CORE ARTISTS Get</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Planned releases with a long-term vision</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Promo priority across label channels</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Strong, consistent visual identity</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Regular presence on compilations &amp; showcases</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Direct creative feedback and collaboration</span>
              </li>
            </ul>
            <p className="mt-5 text-gray-400">
              We invest more where the connection is real.
            </p>
          </div>

          <div className="bg-black/50 border border-green-500/20 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">What We Expect</h2>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Clear communication and reliability</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Fair representation of the label</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Respect for the shared direction</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500">✓</span>
                <span>Long-term mindset</span>
              </li>
            </ul>
            <div className="mt-5 text-gray-400 space-y-2">
              <p>No fake hype. No forced loyalty.</p>
              <p>
                DnB Doctor is not for everyone. But if you’re looking for a place
                to grow — this might be it.
              </p>
            </div>
          </div>
        </div>

        {/* Artists cards (same as /artists) */}
        <div className="mt-12">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Artists on DnB Doctor</h2>
              <p className="mt-2 text-gray-400 max-w-2xl">
                Explore the current roster and discover producers shaping the sound.
              </p>
            </div>
            <Button href="/artists" variant="infected" className="justify-center">
              View all artists
            </Button>
          </div>
          <ArtistCardsGrid artists={artists} />
        </div>

        
      </section>
    </main>
  )
}
