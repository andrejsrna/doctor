'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Script from 'next/script'
import Button from '@/app/components/Button'
import LatestMusic from '@/app/components/LatestMusic'
import EngagementCTA from '@/app/components/EngagementCTA'
import SpotifyPlaylistsSection from '@/app/components/SpotifyPlaylistsSection'
import { dnbDoctorSpotifyPlaylists } from '@/app/components/data/spotifyPlaylists'
import { FaSpotify, FaYoutube, FaInstagram } from 'react-icons/fa'

const faqs = [
  {
    question: 'What is neurofunk drum & bass?',
    answer:
      'Neurofunk is a late-90s evolution of techstep drum & bass that blends 172–175 BPM drums with heavily modulated bass design, cinematic tension, and sci-fi atmospheres.',
    bullets: [
      'Born from techstep pioneers like Ed Rush & Optical and Matrix & Futurebound.',
      'Focuses on resampling, precise mixdowns, and controlled aggression.',
    ],
  },
  {
    question: 'How is neurofunk different from classic drum & bass?',
    answer:
      'Where liquid or jungle lean on melody and swing, neurofunk prioritizes mechanical groove, evolving basslines, and surgical sound design built for high-energy dancefloors.',
    bullets: [
      'Tighter drum programming with relentless drive.',
      'Bass layers are constantly automated for movement.',
    ],
  },
  {
    question: 'Which neurofunk labels should I follow in 2025?',
    answer:
      'Start with Eatbrain, Blackout, and Darkshire, then dive into DnB Doctor, Bass Rabbit, and other independent crews pushing the underground forward.',
    bullets: [
      'See our full breakdown on the Neurofunk Labels page.',
      'Follow local Prague, Brno, and Vienna collectives for fresh signings.',
    ],
  },
  {
    question: 'How can I get my neurofunk demo signed?',
    answer:
      'Focus on unique bass narratives, clean mixdowns, and memorable intros. Share finished versions, artwork notes, and links (not file attachments) when sending demos.',
    bullets: [
      'Reference releases from the target label so the A&R hears the fit.',
      'Include private streaming links plus socials and recent DJ support.',
    ],
  },
]

export default function NeurofunkDnbPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${faq.answer} ${faq.bullets?.join(' ') ?? ''}`.trim(),
      },
    })),
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/music-bg.jpeg"
            alt="Neurofunk DnB Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-black/80 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h2 
              className="text-green-500 font-mono text-xl mb-6 inline-block"
              animate={{ textShadow: ['0 0 8px rgb(0,255,0)', '0 0 12px rgb(0,255,0)', '0 0 8px rgb(0,255,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              The Dark Energy of Drum and Bass
            </motion.h2>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-purple-500 to-pink-500">
                Neurofunk DnB
              </span>
            </h1>

            <motion.p 
              className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Our 2025 Neurofunk DnB guide dives into fresh DnB Doctor releases, a curated Spotify playlist, and sound design tactics inspired by Prague&apos;s bass scene.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-6"
            >
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  href="/music"
                  variant="toxic"
                  size="lg"
                  className="group"
                >
                  Explore Releases
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="ml-2"
                  >
                    →
                  </motion.span>
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  href="/neurofunk-spotify"
                  variant="infected"
                  size="lg"
                >
                  Get the Playlist
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  href="/submit-demo"
                  variant="decayed"
                  size="lg"
                >
                  Submit Your Track
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What Is Neurofunk Drum and Bass Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            What Is <span className="text-green-500">Neurofunk</span> Drum and Bass
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Neurofunk is a subgenre of drum and bass that emerged in the late 1990s as a darker, more technical evolution of techstep.
              It&apos;s defined by deep synthetic basslines, complex drum programming, and a futuristic, cinematic energy that feels like the soundtrack of a dystopian world.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              Producers like <strong className="text-green-400">Ed Rush & Optical</strong>, <strong className="text-green-400">Noisia</strong>, <strong className="text-green-400">Phace</strong>, and <strong className="text-green-400">Black Sun Empire</strong> shaped the foundation of the sound — pushing the boundaries of production and sound design with surgical precision and unmatched power.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Sound of Modern Neurofunk Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            The Sound of <span className="text-purple-500">Modern Neurofunk</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Today, neurofunk continues to evolve with new generations of producers experimenting with hybrid sounds.
              Expect clean yet aggressive bass design, tight percussion, and progressive arrangements that balance chaos and control.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              Labels and artists are merging influences from techno, halftime, and cinematic music, creating a modern neurofunk sound that is both brutal and hypnotic.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DNB Doctor and the Next Wave Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            <span className="text-green-500">DNB Doctor</span> and the Next Wave of Neurofunk
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              At DNB Doctor, we celebrate the raw, futuristic side of drum and bass.
              Our releases focus on precision, depth, and storytelling — from dark rollers to experimental soundscapes that push the genre forward.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Recent releases like <strong className="text-green-400">Yehor – Where Do We Go</strong> and <strong className="text-green-400">Razerbeam – Oblivion</strong> represent this evolution:
              they combine emotional tension, cinematic layers, and the unmistakable neurofunk energy that hits both mind and body.
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-8">
              <h3 className="text-green-400 text-xl font-semibold mb-4 flex items-center">
                🎧 Discover the sound:
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Link href="/music" className="text-green-400 hover:text-green-300 transition-colors">
                    Yehor – Where Do We Go
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Link href="/music" className="text-green-400 hover:text-green-300 transition-colors">
                    Razerbeam – Oblivion
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Link href="/music" className="text-green-400 hover:text-green-300 transition-colors">
                    All Neurofunk Releases
                  </Link>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <SpotifyPlaylistsSection
        title={
          <>
            Stream our <span className="text-green-500">Spotify</span> Playlists
          </>
        }
        description="Curated neurofunk selections from DNB Doctor — updated regularly with dark rollers, surgical tech, and underground cuts."
        playlists={dnbDoctorSpotifyPlaylists}
        ctas={[
          { href: '/neurofunk-spotify', label: 'All Playlists', variant: 'toxic' },
          { href: 'https://open.spotify.com/user/dnbdoctor', label: 'Follow', variant: 'infected', external: true },
        ]}
      />

      {/* Latest Releases Section */}
      <LatestMusic />

      {/* Why Neurofunk Endures Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Why <span className="text-purple-500">Neurofunk</span> Endures
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Neurofunk isn&apos;t just a sound — it&apos;s an attitude.
              It&apos;s the technical frontier of drum and bass, where producers craft every detail with obsession, precision, and intensity.
              For listeners, it&apos;s a journey into controlled chaos, mechanical beauty, and pure adrenaline.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              Whether you&apos;re a producer, a DJ, or just a fan of heavy underground energy — neurofunk connects people who love sound that bites back.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Neurofunk DnB FAQ
          </motion.h2>
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-green-500/20 rounded-2xl p-6 bg-black/40"
              >
                <h3 className="text-xl font-semibold mb-3 text-white">{faq.question}</h3>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">{faq.answer}</p>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {faq.bullets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-green-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
        <Script id="faq-neurofunk-dnb" type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </Script>
      </section>

      {/* CTA / Outro Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            🎧 Join the <span className="text-green-500">DNB Doctor</span> movement
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg leading-relaxed mb-12"
          >
            Stay tuned for new releases, mixes, and artist features celebrating the best of neurofunk DnB.
            Follow us on Spotify, YouTube, and Instagram for the latest drops.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Button 
              href="/music"
              variant="toxic"
              size="lg"
              className="group"
            >
              Explore All Releases
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-2"
              >
                →
              </motion.span>
            </Button>

            <div className="flex gap-4">
              <a
                href="https://open.spotify.com/playlist/your-playlist"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors border border-green-500/30"
              >
                <FaSpotify className="w-4 h-4" />
                <span className="text-sm">Spotify</span>
              </a>
              <a
                href="https://youtube.com/@dnbdoctor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/30"
              >
                <FaYoutube className="w-4 h-4" />
                <span className="text-sm">YouTube</span>
              </a>
              <a
                href="https://instagram.com/dnbdoctor"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 rounded-lg transition-colors border border-pink-500/30"
              >
                <FaInstagram className="w-4 h-4" />
                <span className="text-sm">Instagram</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Engagement CTA Section */}
      <EngagementCTA />
    </div>
  )
}
