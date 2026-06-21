import Image from 'next/image'
import Link from 'next/link'

const articleUrl = 'https://dnbdoctor.com/why-nobody-listens-to-your-neurofunk-tracks'
const articleTitle = 'Why Nobody Listens to Your Neurofunk Tracks — And How to Fix It'
const articleDescription =
  'Finished a heavy neurofunk track but nobody listens? Learn how to fix weak positioning, release strategy, branding, content, playlists, and fan conversion.'

const reasons = [
  {
    title: 'Your track has no clear promise',
    body: 'People do not click because the track exists. They click because the title, artwork, preview, and short description make them expect a specific feeling.',
  },
  {
    title: 'You release once and disappear',
    body: 'A release is not one upload. It is a sequence of signals before, during, and after the track goes live.',
  },
  {
    title: 'Your identity is too generic',
    body: 'If every post looks like “new track out now”, nobody remembers you. Fans follow a recognizable world, not just an audio file.',
  },
  {
    title: 'You do not give listeners a next step',
    body: 'A play becomes a fan only when the listener knows what to do next: follow, save, join, download, watch, or hear the next track.',
  },
]

const contentIdeas = [
  '15-second drop preview with the strongest visual moment',
  'Before/after mixdown comparison',
  'How the main bass was made',
  'Artwork reveal with the release story',
  'Three reference tracks that shaped the release',
  'Studio screenshot with one useful production lesson',
  'DJ-friendly intro preview',
  'Mistake you fixed before the final master',
]

export default function WhyNobodyListensToYourNeurofunkTracksPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articleTitle,
    description: articleDescription,
    image: [`${articleUrl.replace('/why-nobody-listens-to-your-neurofunk-tracks', '')}/articles/why-nobody-listens-neurofunk-tracks.png`],
    author: {
      '@type': 'Organization',
      name: 'DnB Doctor',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DnB Doctor',
    },
    mainEntityOfPage: articleUrl,
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/articles/why-nobody-listens-neurofunk-tracks.png"
            alt="A neurofunk producer turning ignored tracks into real listeners"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/80 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.12)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-5xl flex-col items-center justify-center px-4 py-28 text-center">
          <p className="mb-5 inline-flex rounded-full border border-purple-400/40 bg-purple-500/10 px-4 py-2 font-mono text-sm uppercase tracking-[0.25em] text-purple-300">
            Neurofunk Artist Growth
          </p>
          <h1 className="mb-8 text-4xl font-black tracking-tight md:text-7xl">
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-green-300 bg-clip-text text-transparent">
              Why Nobody Listens to Your Neurofunk Tracks
            </span>
            <span className="mt-4 block text-2xl text-white md:text-4xl">— And How to Fix It</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
            Your track can be heavy, clean, and technically impressive — and still vanish. The problem is usually not only the mixdown. It is positioning, release strategy, and the missing bridge between a random listener and a real fan.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/music-packs"
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-bold text-white transition hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.45)]"
            >
              Explore Music Packs
            </Link>
            <Link
              href="/how-to-produce-neurofunk"
              className="rounded-full border border-green-400/50 px-8 py-4 font-bold text-green-300 transition hover:bg-green-400/10"
            >
              Learn Neurofunk Production
            </Link>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-20">
        <section className="mb-16 rounded-3xl border border-purple-500/25 bg-purple-500/10 p-8">
          <h2 className="mb-4 text-3xl font-bold text-purple-200">The uncomfortable truth</h2>
          <p className="mb-5 text-lg leading-relaxed text-gray-300">
            Most neurofunk producers think the next sound design trick will solve the attention problem. Better growls help. Cleaner drums help. A louder master helps. But none of that matters if the listener never understands why they should press play.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            The modern producer has two jobs: finish strong music and make that music easy to discover, understand, remember, and follow. If nobody listens, do not start by blaming the algorithm. Start by fixing the system around the track.
          </p>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold md:text-4xl">Four reasons your neurofunk tracks get ignored</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {reasons.map((reason, index) => (
              <div key={reason.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <p className="mb-3 font-mono text-sm text-green-300">0{index + 1}</p>
                <h3 className="mb-3 text-xl font-bold text-white">{reason.title}</h3>
                <p className="leading-relaxed text-gray-400">{reason.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 space-y-8">
          <div>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">1. Stop selling “a new track”. Sell a reason to care.</h2>
            <p className="text-lg leading-relaxed text-gray-300">
              “New neurofunk track out now” is not a reason to click. It is a label. Give people a hook: the mood, the world, the problem, the bass idea, the story, or the energy of the drop.
            </p>
          </div>

          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-6">
            <p className="mb-3 font-bold text-green-300">Weak:</p>
            <p className="mb-5 text-gray-300">New neurofunk single is out now.</p>
            <p className="mb-3 font-bold text-green-300">Stronger:</p>
            <p className="text-gray-300">A 174 BPM machine-collapse track built around a distorted Reese bass, a paranoid vocal fragment, and a second drop designed for dark rooms.</p>
          </div>

          <p className="text-lg leading-relaxed text-gray-300">
            Before you publish, write one sentence that makes the track feel specific. If you cannot describe why it matters, listeners will not know why they should care either.
          </p>
        </section>

        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold md:text-4xl">2. Build a release system, not a random upload</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            A proper release is a campaign. It starts before the track is public and continues after release day. Your goal is not one announcement. Your goal is repeated recognition.
          </p>
          <div className="rounded-2xl border border-purple-500/30 bg-black/60 p-6">
            <h3 className="mb-5 text-2xl font-bold text-purple-200">Minimum release system</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• Finish the master and export clean short clips.</li>
              <li>• Create artwork that matches the track’s world.</li>
              <li>• Write a one-paragraph release story.</li>
              <li>• Prepare 3–5 short videos before release day.</li>
              <li>• Pitch playlists and DJs early.</li>
              <li>• Post after release day: breakdowns, reactions, context, reminders.</li>
              <li>• Give every listener a next step: follow, save, join, download, or listen to the next release.</li>
            </ul>
          </div>
        </section>

        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold md:text-4xl">3. Make your artist identity recognizable</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Neurofunk is already dark, technical, and futuristic. That means “dark and heavy” is not enough. You need a sharper identity. Are you cinematic and apocalyptic? Surgical and minimal? Brutal and industrial? Clean and sci-fi? Your visuals, titles, captions, and sound selection should point in the same direction.
          </p>
          <blockquote className="border-l-4 border-pink-500 bg-pink-500/10 p-6 text-xl italic text-gray-200">
            Fans remember patterns. If your sound, artwork, story, and posts repeat the same world, people start recognizing you before they even press play.
          </blockquote>
        </section>

        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold md:text-4xl">4. Turn content into a bridge, not noise</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            Content is not about begging people to stream. It is about giving them more ways to enter the world of the track. Some listeners care about the drop. Producers care about the bass chain. DJs care about the intro and energy. Fans care about the story.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {contentIdeas.map((idea) => (
              <div key={idea} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-gray-300">
                {idea}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 space-y-8">
          <h2 className="text-3xl font-bold md:text-4xl">5. Your first 100 real fans matter more than 10,000 empty plays</h2>
          <p className="text-lg leading-relaxed text-gray-300">
            A random play is not a relationship. A real fan remembers your name, saves the track, follows the project, watches the next clip, tells a friend, or buys your packs and releases. That is the audience worth building.
          </p>
          <p className="text-lg leading-relaxed text-gray-300">
            Do not chase fake numbers. Build a small group of people who understand your sound. Talk to them. Show the process. Release consistently. Make every track another signal in the same universe.
          </p>
        </section>

        <section className="mb-16 rounded-3xl border border-green-500/30 bg-green-500/10 p-8">
          <h2 className="mb-6 text-3xl font-bold text-green-200">DnB Doctor artist growth checklist</h2>
          <ul className="space-y-4 text-lg text-gray-300">
            <li>✓ Can people describe your sound in one sentence?</li>
            <li>✓ Does the track have a clear mood, story, or visual world?</li>
            <li>✓ Do you have at least three short clips ready before release day?</li>
            <li>✓ Did you pitch playlists, DJs, and communities before the release?</li>
            <li>✓ Did you post after release day, not only before?</li>
            <li>✓ Does every listener have a next step?</li>
            <li>✓ Are you building recognition across multiple releases?</li>
          </ul>
        </section>

        <section className="rounded-3xl border border-purple-500/40 bg-gradient-to-br from-purple-950/80 via-black to-green-950/60 p-8 text-center">
          <h2 className="mb-4 text-3xl font-black md:text-4xl">Want to release stronger neurofunk faster?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-300">
            DnB Doctor Music Packs give you production-ready drums, basslines, loops, MIDI, and arrangement ideas built to help producers finish tracks and build a recognizable sound.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/music-packs"
              className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 font-bold text-white transition hover:scale-105"
            >
              Browse Music Packs
            </Link>
            <Link
              href="/sample-packs"
              className="rounded-full border border-white/20 px-8 py-4 font-bold text-white transition hover:bg-white/10"
            >
              Get Free Sample Packs
            </Link>
          </div>
        </section>
      </article>
    </main>
  )
}
