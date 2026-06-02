import Link from 'next/link'

export const metadata = {
  title: 'Types of DnB: All 6 Drum & Bass Styles Compared (with Examples)',
  description: 'Liquid vs Neurofunk vs Jump-Up vs Jungle — what is each type of DnB really like? Compare all 6 styles with sound examples, BPMs, and artist picks.',
  keywords: ['types of dnb', 'dnb types', 'drum and bass styles', 'dnb subgenres', 'types of drum and bass'],
}

const dnbTypes = [
  {
    id: 'liquid',
    name: 'Liquid DnB',
    slug: 'liquid',
    description: 'Smooth, melodic, and emotional — Liquid DnB focuses on lush chords, atmospheric pads, and often features soulful vocals. It\'s the most accessible type of DnB for newcomers.',
    characteristics: ['Melodic chords and atmospheres', 'Vocals and singing', 'Rolling but gentle drums', 'Warm basslines', 'Often 160-180 BPM'],
    forYouIf: 'You enjoy melodic electronic music, trance, or house and want an easy entry into DnB.',
    listenLink: '/music?category=liquid',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'neurofunk',
    name: 'Neurofunk (Neuro)',
    slug: 'neurofunk',
    description: 'Dark, futuristic, and technical — Neurofunk is defined by intricate sound design, precision basslines, and cinematic tension. It\'s the heaviest type of DnB.',
    characteristics: ['Complex sound design bass', 'Precision drum programming', 'Dark, sci-fi atmospheres', 'Technical production', 'Heavy sub-bass pressure'],
    forYouIf: 'You love heavy bass, detailed sound design, and dark, futuristic vibes.',
    listenLink: '/neurofunk-dnb',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'jump-up',
    name: 'Jump-Up DnB',
    slug: 'jump-up',
    description: 'Bouncy, playful, and high-energy — Jump-Up focuses on big hooks, catchy basslines, and dancefloor-ready drops. It\'s festival-friendly and crowd-pleasing.',
    characteristics: ['Big, bouncy bass hooks', 'High dancefloor energy', 'Simple but effective drops', 'Playful and fun vibes', 'Crowd-friendly structure'],
    forYouIf: 'You want high energy, big festival vibes, and music that makes you move.',
    listenLink: '/music?category=jump-up',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'jungle',
    name: 'Jungle',
    slug: 'jungle',
    description: 'Raw, breakbeat-driven, and rooted in reggae — Jungle is the predecessor to DnB from the early \'90s. It features chopped breaks, dub influences, and organic energy.',
    characteristics: ['Chopped and screwed breaks', 'Reggae and dub influences', 'Raw, organic production', 'Bass pressure and weight', 'Classic samples'],
    forYouIf: 'You want the original sound, raw energy, and the roots of DnB culture.',
    listenLink: '/music?category=jungle',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 'techstep',
    name: 'Techstep',
    slug: 'techstep',
    description: 'Minimal, robotic, and industrial — Techstep strips things back with tight drums, cold atmospheres, and driving sci-fi grooves. It\'s mechanical and precise.',
    characteristics: ['Minimal, stripped-back production', 'Cold, industrial atmospheres', 'Tight, mechanical drums', 'Driving sci-fi grooves', 'Robotic bass sounds'],
    forYouIf: 'You prefer darker, more minimal sounds with an industrial edge.',
    listenLink: '/music?category=techstep',
    color: 'from-gray-500 to-slate-600',
  },
  {
    id: 'halftime',
    name: 'Halftime / 87 BPM',
    slug: 'halftime',
    description: 'Heavy, spacious, and slower-feeling — Halftime keeps the DnB tempo (~174 BPM) but places drums in half-time, creating a heavy, head-nodding groove.',
    characteristics: ['Half-time drum patterns', 'Heavy, spacious grooves', 'Dark atmospheres', 'Slower-feeling at 174 BPM', 'Head-nodding rhythm'],
    forYouIf: 'You like heavy, slower-feeling beats with massive space and weight.',
    listenLink: '/music?category=halftime',
    color: 'from-red-500 to-rose-600',
  },
]

const comparisonTable = [
  { type: 'Liquid', bpm: '174', energy: 'Low-Medium', mood: 'Melodic, Happy', complexity: 'Low', bestFor: 'New listeners' },
  { type: 'Neurofunk', bpm: '174', energy: 'High', mood: 'Dark, Technical', complexity: 'High', bestFor: 'Bass heads' },
  { type: 'Jump-Up', bpm: '174', energy: 'Very High', mood: 'Playful, Bouncy', complexity: 'Low', bestFor: 'Festivals' },
  { type: 'Jungle', bpm: '160-175', energy: 'Medium-High', mood: 'Raw, Organic', complexity: 'Medium', bestFor: 'Purists' },
  { type: 'Techstep', bpm: '170-180', energy: 'Medium-High', mood: 'Cold, Industrial', complexity: 'High', bestFor: 'Minimalists' },
  { type: 'Halftime', bpm: '174', energy: 'Medium', mood: 'Heavy, Dark', complexity: 'Medium', bestFor: 'Head-nodders' },
]

const faqData = [
  {
    question: 'What are the main types of DnB?',
    answer: 'The main types of DnB (Drum and Bass) are: Liquid (melodic), Neurofunk (dark/technical), Jump-Up (bouncy/high-energy), Jungle (raw/breakbeat), Techstep (minimal/industrial), and Halftime (heavy/slow-feeling). Most modern tracks blend elements from multiple types.',
  },
  {
    question: 'Which type of DnB is best for beginners?',
    answer: 'Liquid DnB is generally best for beginners because of its melodic, accessible nature. Jump-Up is also beginner-friendly due to its fun, energetic vibe. If you love heavy bass and sound design, start with Neurofunk.',
  },
  {
    question: 'What\'s the difference between Jungle and DnB?',
    answer: 'Jungle is the earlier style from the early \'90s featuring chopped breakbeats, reggae influences, and raw production. Drum and Bass evolved from Jungle, becoming more polished, production-focused, and expanding into many types like Liquid and Neurofunk.',
  },
  {
    question: 'How many types of drum and bass are there?',
    answer: 'There are 6 main types of Drum and Bass: Liquid, Neurofunk, Jump-Up, Jungle, Techstep, and Halftime. However, many producers blend styles, and sub-subgenres exist (like "intelligent DnB" similar to Liquid, or "darkstep" related to Neurofunk).',
  },
  {
    question: 'What BPM are different types of DnB?',
    answer: 'Most types of DnB run at 160-180 BPM (beats per minute), with 174 BPM being the standard. Jungle can be slightly slower (160-175 BPM), while Halftime maintains 174 BPM but feels slower due to half-time drum patterns.',
  },
]

export default function TypesOfDnbPage() {
  const pageUrl = 'https://dnbdoctor.com/types-of-dnb'
  const pageTitle = 'Types of DnB: Complete Guide to Drum and Bass Styles'
  const pageDescription = 'Discover all types of DnB (Drum and Bass): Liquid, Neurofunk, Jump-Up, Jungle, and more.'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: pageTitle,
    description: pageDescription,
    author: {
      '@type': 'Organization',
      name: 'DNB Doctor',
    },
    publisher: {
      '@type': 'Organization',
      name: 'DNB Doctor',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dnbdoctor.com/logo.png',
      },
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/30 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,_transparent_70%)]" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
            Types of DnB
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Complete guide to all Drum and Bass styles — from melodic Liquid to dark Neurofunk and raw Jungle
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#types"
              className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors"
            >
              Explore DnB Types
            </Link>
            <Link
              href="/drum-and-bass-subgenres"
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors border border-gray-700"
            >
              Compare Subgenres
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Answer for Featured Snippet */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Quick Answer: What are the types of DnB?</h2>
          <p className="text-gray-300 leading-relaxed">
            The 6 main <strong>types of DnB</strong> (Drum and Bass) are: <Link href="#liquid" className="text-purple-400 hover:text-purple-300">Liquid</Link> (melodic), <Link href="#neurofunk" className="text-purple-400 hover:text-purple-300">Neurofunk</Link> (dark/technical), <Link href="#jump-up" className="text-purple-400 hover:text-purple-300">Jump-Up</Link> (bouncy), <Link href="#jungle" className="text-purple-400 hover:text-purple-300">Jungle</Link> (raw/breakbeat), <Link href="#techstep" className="text-purple-400 hover:text-purple-300">Techstep</Link> (minimal), and <Link href="#halftime" className="text-purple-400 hover:text-purple-300">Halftime</Link> (heavy). Most modern tracks blend multiple types.
          </p>
        </div>
      </section>

      {/* DnB Types Sections */}
      <section id="types" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          All Types of Drum and Bass
        </h2>
        
        <div className="space-y-16">
          {dnbTypes.map((type, index) => (
            <div
              key={type.id}
              id={type.slug}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}
            >
              {/* Visual Box */}
              <div className="w-full md:w-1/3">
                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center p-8 shadow-[0_0_60px_rgba(168,85,247,0.3)]`}>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-white text-center drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    {type.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="w-full md:w-2/3 space-y-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-3">{type.name}</h3>
                  <p className="text-gray-300 leading-relaxed">{type.description}</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-gray-200">Key Characteristics:</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {type.characteristics.map((char, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                  <p className="text-gray-300">
                    <span className="font-semibold text-purple-300">Best for you if:</span> {type.forYouIf}
                  </p>
                </div>

                <Link
                  href={type.listenLink}
                  className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${type.color} text-white rounded-xl font-semibold hover:opacity-90 transition-opacity`}
                >
                  Listen to {type.name}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          DnB Types Comparison Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-900/80">
                <th className="border border-gray-700 px-4 py-3 text-left text-purple-300">Type</th>
                <th className="border border-gray-700 px-4 py-3 text-left text-purple-300">BPM</th>
                <th className="border border-gray-700 px-4 py-3 text-left text-purple-300">Energy</th>
                <th className="border border-gray-700 px-4 py-3 text-left text-purple-300">Mood</th>
                <th className="border border-gray-700 px-4 py-3 text-left text-purple-300">Complexity</th>
                <th className="border border-gray-700 px-4 py-3 text-left text-purple-300">Best For</th>
              </tr>
            </thead>
            <tbody>
              {comparisonTable.map((row, i) => (
                <tr key={i} className="hover:bg-gray-900/50 transition-colors">
                  <td className="border border-gray-700 px-4 py-3 font-semibold">{row.type}</td>
                  <td className="border border-gray-700 px-4 py-3">{row.bpm}</td>
                  <td className="border border-gray-700 px-4 py-3">{row.energy}</td>
                  <td className="border border-gray-700 px-4 py-3">{row.mood}</td>
                  <td className="border border-gray-700 px-4 py-3">{row.complexity}</td>
                  <td className="border border-gray-700 px-4 py-3">{row.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section for Featured Snippets */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions About DnB Types
        </h2>
        <div className="space-y-6">
          {faqData.map((faq, i) => (
            <details
              key={i}
              className="bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden group"
            >
              <summary className="px-6 py-4 cursor-pointer font-semibold text-lg hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                <span>{faq.question}</span>
                <span className="text-purple-400 transition-transform group-open:rotate-180">▼</span>
              </summary>
              <div className="px-6 pb-4 text-gray-300 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* Related Links */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Explore More DnB Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/drum-and-bass-subgenres"
            className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-colors"
          >
            <h3 className="text-xl font-bold mb-2">DnB Subgenres Explained</h3>
            <p className="text-gray-400 text-sm">Deep dive into all subgenres with examples</p>
          </Link>
          <Link
            href="/what-is-drum-and-bass"
            className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-colors"
          >
            <h3 className="text-xl font-bold mb-2">What is DnB?</h3>
            <p className="text-gray-400 text-sm">Learn the basics of Drum and Bass</p>
          </Link>
          <Link
            href="/neurofunk-dnb"
            className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-colors"
          >
            <h3 className="text-xl font-bold mb-2">Neurofunk Guide</h3>
            <p className="text-gray-400 text-sm">The darkest type of DnB</p>
          </Link>
        </div>
      </section>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </main>
  )
}
