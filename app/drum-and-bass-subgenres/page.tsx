import Link from 'next/link'
import Button from '@/app/components/Button'

export default function DrumAndBassSubgenresPage() {
  const pageUrl = 'https://dnbdoctor.com/drum-and-bass-subgenres'
  const pageTitle = 'DnB Subgenres Explained: Liquid, Neurofunk, Jump-Up, Jungle & More'
  const pageDescription =
    'A clear guide to Drum and Bass (DnB) subgenres: what each one sounds like, key traits, who it’s for, and where to start listening.'
  const pageImage = 'https://dnbdoctor.com/music-bg.jpeg'

  type Subgenre = {
    id: string
    name: string
    vibe: string
    traits: string[]
    forWho: string
    link?: string
  }

  const subgenres: Subgenre[] = [
    {
      id: 'liquid',
      name: 'Liquid DnB',
      vibe: 'smooth, melodic, emotional',
      traits: ['lush chords', 'vocals and atmospheres', 'rolling drums'],
      forWho: 'If you like melodic electronic music and want an easy entry point.',
    },
    {
      id: 'neurofunk',
      name: 'Neurofunk',
      vibe: 'dark, futuristic, technical',
      traits: ['sound-design bass', 'precision drums', 'cinematic tension'],
      forWho: 'If you love heavy bass movement and detailed production.',
      link: '/neurofunk-drum-and-bass',
    },
    {
      id: 'jump-up',
      name: 'Jump-Up',
      vibe: 'bouncy, playful, rave-ready',
      traits: ['big hooks', 'crowd energy', 'simple, punchy bass'],
      forWho: 'If you want fast fun and big drops for the dancefloor.',
    },
    {
      id: 'techstep',
      name: 'Techstep',
      vibe: 'minimal, robotic, industrial',
      traits: ['tight drums', 'cold atmospheres', 'driving grooves'],
      forWho: 'If you like darker, stripped-back DnB with a sci-fi edge.',
    },
    {
      id: 'jungle',
      name: 'Jungle',
      vibe: 'raw, breakbeat-driven, rooted in reggae',
      traits: ['chopped breaks', 'bass pressure', 'classic samples'],
      forWho: 'If you want the original DNA and a more raw, organic feel.',
    },
    {
      id: 'halftime',
      name: 'Halftime / 87',
      vibe: 'slower-feeling groove at DnB tempo',
      traits: ['heavy space', 'half-time drums', 'dark weight'],
      forWho: 'If you like heavier, head-nod energy without losing DnB speed.',
    },
  ]

  const faqData = [
    {
      question: 'What are the main Drum and Bass subgenres?',
      answer:
        'Common DnB subgenres include liquid, neurofunk, jump-up, techstep, and jungle. Many modern tracks blend elements from multiple styles.',
    },
    {
      question: 'Which DnB subgenre should I start with?',
      answer:
        'Most beginners start with liquid (melodic) or jump-up (high energy). If you love heavy sound design, start with neurofunk.',
    },
    {
      question: 'Are jungle and DnB the same thing?',
      answer:
        'Jungle is the earlier breakbeat-driven style from the early 90s; Drum and Bass evolved from it and became broader and more production-focused over time.',
    },
  ]

  const jsonLdArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: pageDescription,
    image: [pageImage],
    mainEntityOfPage: pageUrl,
    author: { '@type': 'Organization', name: 'DnB Doctor', url: 'https://dnbdoctor.com' },
    publisher: {
      '@type': 'Organization',
      name: 'DnB Doctor',
      url: 'https://dnbdoctor.com',
      logo: { '@type': 'ImageObject', url: 'https://dnbdoctor.com/logo.png' },
    },
  }

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }

  const jsonLdBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dnbdoctor.com' },
      { '@type': 'ListItem', position: 2, name: 'DnB Subgenres', item: pageUrl },
    ],
  }

  return (
    <div className="min-h-screen bg-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-black to-black" />
        <div className="max-w-5xl mx-auto relative z-10">
          <p className="text-green-400 font-mono text-sm mb-4">Guide</p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Drum and Bass <span className="text-green-500">Subgenres</span> (DnB)
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">
            DnB isn’t one sound — it’s a spectrum. Here’s a clean map of the most common subgenres, what each
            one feels like, and where to start.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Button href="/what-is-drum-and-bass" variant="infected" size="lg">
              New to DnB? Start here
            </Button>
            <Button href="/music" variant="toxic" size="lg">
              Browse releases
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {subgenres.map((g) => (
              <Link
                key={g.id}
                href={`#${g.id}`}
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                {g.name}
              </Link>
            ))}
            <Link href="#faq" className="text-green-400 hover:text-green-300 transition-colors">
              FAQ
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subgenres at a glance</h2>
            <p className="text-gray-300 mb-6">
              Most DnB sits around <strong className="text-green-400">160–180 BPM</strong> (often ~174). The
              difference is the groove, sound palette, and emotional tone.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="py-3 pr-4 text-green-400">Subgenre</th>
                    <th className="py-3 pr-4 text-green-400">Vibe</th>
                    <th className="py-3 text-green-400">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {subgenres.map((g) => (
                    <tr key={g.id} className="border-b border-white/5">
                      <td className="py-3 pr-4 text-gray-200 font-medium">{g.name}</td>
                      <td className="py-3 pr-4 text-gray-400">{g.vibe}</td>
                      <td className="py-3 text-gray-400">{g.forWho}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          {subgenres.map((g) => (
            <div key={g.id} id={g.id} className="bg-black border border-green-500/15 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {g.name} <span className="text-gray-500 font-normal">— {g.vibe}</span>
                  </h2>
                </div>
                {g.link ? (
                  <Link
                    href={g.link}
                    className="text-green-400 hover:text-green-300 transition-colors text-sm"
                  >
                    Read more →
                  </Link>
                ) : null}
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                {g.traits.map((t) => (
                  <div key={t} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <p className="text-gray-200 text-sm">{t}</p>
                  </div>
                ))}
              </div>

              <p className="text-gray-300 mt-5 leading-relaxed">{g.forWho}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">FAQ</h2>
          <div className="space-y-4">
            {faqData.map((faq) => (
              <div key={faq.question} className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-green-400 text-xl font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-sm mt-10 text-center">
            Want the full definition first?{' '}
            <Link
              href="/what-is-drum-and-bass"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              What is Drum and Bass
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  )
}
