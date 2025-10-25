'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/app/components/Button'
import LatestMusic from '@/app/components/LatestMusic'
import SubscribeCTA from '@/app/components/SubscribeCTA'

export default function DrumAndBassHistoryPage() {
  const timeline = [
    {
      period: 'Late 1980s – Early 1990s',
      emoji: '🪩',
      title: 'The Birth of Jungle',
      color: 'green',
      content: [
        'Drum and Bass started with **breakbeats** — chopped-up drum loops from funk and soul records, especially the legendary **"Amen Break."**',
        'When UK producers began speeding up these samples to 160–170 BPM and layering heavy basslines under them, **jungle** was born.',
        'It was the sound of multicultural Britain — **Caribbean sound system culture**, **hip-hop sampling**, and **techno futurism** colliding on dancefloors.',
      ],
      artists: ['Goldie', 'LTJ Bukem', 'DJ Hype', 'Shy FX', 'Roni Size'],
      keyTrack: 'Goldie – Inner City Life (1994)',
      keyTrackDesc: 'A timeless anthem that bridged underground jungle with mainstream recognition.',
    },
    {
      period: 'Mid–Late 1990s',
      emoji: '⚙️',
      title: 'The Rise of Drum and Bass',
      color: 'purple',
      content: [
        'As production tools improved, the jungle sound began to evolve — cleaner, tighter, more precise.',
        'The genre took a new name: **Drum and Bass**.',
        'Producers started focusing on **engineering** as much as musicality — perfecting mixdowns, layering sub frequencies, and defining modern DnB structure.',
      ],
      subgenres: [
        { name: 'Liquid Funk', desc: 'soulful, melodic', artists: 'High Contrast, Calibre, London Elektricity' },
        { name: 'Techstep', desc: 'darker, industrial, robotic', artists: 'Ed Rush & Optical, Trace, Dom & Roland' },
        { name: 'Jump-Up', desc: 'playful, rave-inspired', artists: 'DJ Hazard, Macky Gee' },
      ],
    },
    {
      period: '2000s',
      emoji: '🧠',
      title: 'Neurofunk and the Age of Precision',
      color: 'pink',
      content: [
        'In the early 2000s, producers pushed sound design to a new level — birthing **Neurofunk**.',
        'This subgenre took the structure of DnB and filled it with **complex modulation, resampled basslines, and futuristic soundscapes**.',
        'Neurofunk became the **mechanical heartbeat** of Drum and Bass — a dark, cerebral style focused on movement, depth, and detail.',
      ],
      artists: ['Noisia', 'Phace', 'Black Sun Empire', 'Spor', 'Mefjus'],
      quote: 'If jungle was the rebel, neurofunk became the scientist.',
    },
    {
      period: '2010s',
      emoji: '🌍',
      title: 'Global Expansion',
      color: 'green',
      content: [
        'By the 2010s, Drum and Bass was everywhere — from **main stages to bedrooms**.',
        'Scenes exploded in **New Zealand, Czech Republic, Austria, and Germany**, where producers and labels built new ecosystems.',
        'DnB had become a **global language** — precise, emotional, and deeply communal.',
      ],
      regions: [
        { flag: '🇬🇧', name: 'Hospital Records', desc: 'brought DnB to festivals and live acts' },
        { flag: '🇳🇿', name: 'The Upbeats & State of Mind', desc: 'led the Southern Hemisphere wave' },
        { flag: '🇨🇿', name: 'Let It Roll Festival', desc: 'world\'s largest DnB gathering' },
        { flag: '🇷🇺', name: 'Russia neurofunk movement', desc: 'Gydra, Teddy Killerz, Enei, Yehor, Warp Fa2e' },
      ],
    },
    {
      period: '2020s – Today',
      emoji: '🚀',
      title: 'The Modern Era',
      color: 'purple',
      content: [
        'Today, Drum and Bass is stronger than ever.',
        'Producers blend styles — **liquid meets neuro**, **deep meets tech**, **organic meets digital**.',
        'AI tools, modular synths, and advanced DAWs have made production more creative than ever.',
      ],
      trends: [
        'Cinematic DnB (Hybrid Minds, Sub Focus)',
        'Minimal & Deep (Alix Perez, Monty)',
        'High-Energy Neurofunk (Gydra, Mefjus, DnB Doctor roster)',
        'Experimental Fusions (Halogenix, IMANU, Visages)',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/music-bg.jpeg"
            alt="History of Drum and Bass"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-black/80 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 z-[1] opacity-10">
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360] 
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity,
              ease: "linear" 
            }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.3, 1, 1.3],
              rotate: [360, 180, 0] 
            }}
            transition={{ 
              duration: 30, 
              repeat: Infinity,
              ease: "linear" 
            }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-green-500/30 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h2 
              className="text-purple-400 font-mono text-xl mb-6 inline-block"
              animate={{ textShadow: ['0 0 8px rgb(168,85,247)', '0 0 15px rgb(168,85,247)', '0 0 8px rgb(168,85,247)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              The Complete Timeline
            </motion.h2>
            
            <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-green-400">
                History of<br />Drum and Bass
              </span>
            </h1>

            <motion.p 
              className="text-gray-300 text-lg md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Drum and Bass wasn&apos;t born overnight — it <strong>evolved from chaos, technology, and community</strong>. 
              What began in small underground clubs of early &apos;90s London has become one of the most technically advanced and emotionally charged genres in electronic music.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-6"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button href="/what-is-drum-and-bass" variant="infected" size="lg">
                  What Is DnB?
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-[2]" />
      </section>

      {/* Intro Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-300 text-xl md:text-2xl leading-relaxed mb-8"
          >
            Let&apos;s trace the story from <strong className="text-purple-400">jungle&apos;s raw beginnings</strong> to the <strong className="text-green-400">modern precision of DnB and neurofunk</strong>.
          </motion.p>
        </div>
      </section>

      {/* Timeline Sections */}
      {timeline.map((era, index) => {
        const colorClasses = {
          green: {
            bg: 'via-green-900/10',
            text: 'text-green-400',
            bgCard: 'bg-green-500/10',
            border: 'border-green-500/30',
            borderL: 'border-green-500',
            dot: 'bg-green-500',
            gradient: 'from-green-500/50',
          },
          purple: {
            bg: 'via-purple-900/10',
            text: 'text-purple-400',
            bgCard: 'bg-purple-500/10',
            border: 'border-purple-500/30',
            borderL: 'border-purple-500',
            dot: 'bg-purple-500',
            gradient: 'from-purple-500/50',
          },
          pink: {
            bg: 'via-pink-900/10',
            text: 'text-pink-400',
            bgCard: 'bg-pink-500/10',
            border: 'border-pink-500/30',
            borderL: 'border-pink-500',
            dot: 'bg-pink-500',
            gradient: 'from-pink-500/50',
          },
        }

        const colors = colorClasses[era.color as keyof typeof colorClasses]

        return (
          <section key={index} className="py-20 px-4 relative">
            <div className={`absolute inset-0 bg-gradient-to-b from-black ${colors.bg} to-black`} />
            <div className="max-w-5xl mx-auto relative z-10">
              {/* Era Header */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{era.emoji}</span>
                  <div>
                    <p className={`${colors.text} font-mono text-sm mb-2`}>{era.period}</p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                      {era.title}
                    </h2>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                {era.content.map((paragraph, i) => (
                  <p key={i} className="text-gray-300 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, `<strong class="${colors.text}">$1</strong>`) }} />
                ))}

                {/* Artists */}
                {era.artists && (
                  <div className={`${colors.bgCard} border ${colors.border} rounded-lg p-6 mt-6`}>
                    <h3 className={`${colors.text} text-xl font-semibold mb-4`}>Influential early artists:</h3>
                    <ul className="space-y-2">
                      {era.artists.map((artist, i) => (
                        <li key={i} className="text-gray-300 flex items-center gap-2">
                          <span className={`w-2 h-2 ${colors.dot} rounded-full`}></span>
                          <em>{artist}</em>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Track */}
                {era.keyTrack && (
                  <div className={`${colors.bgCard} border ${colors.border} rounded-lg p-6 mt-6`}>
                    <p className="text-gray-300">
                      <span className="text-2xl mr-2">🎧</span>
                      <strong className={colors.text}>Key Track:</strong> <em>{era.keyTrack}</em>
                    </p>
                    <p className="text-gray-400 text-sm mt-2 pl-8">→ {era.keyTrackDesc}</p>
                  </div>
                )}

                {/* Subgenres */}
                {era.subgenres && (
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    {era.subgenres.map((sub, i) => (
                      <div key={i} className={`${colors.bgCard} border ${colors.border} rounded-lg p-4`}>
                        <h4 className={`${colors.text} font-semibold mb-2`}>{sub.name}</h4>
                        <p className="text-gray-400 text-sm mb-2">{sub.desc}</p>
                        <p className="text-gray-500 text-xs">{sub.artists}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quote */}
                {era.quote && (
                  <blockquote className={`text-gray-300 text-xl italic border-l-4 ${colors.borderL} pl-6 my-6`}>
                    &quot;{era.quote}&quot;
                  </blockquote>
                )}

                {/* Regions */}
                {era.regions && (
                  <div className="space-y-3 mt-6">
                    {era.regions.map((region, i) => (
                      <div key={i} className={`${colors.bgCard} border ${colors.border} rounded-lg p-4`}>
                        <h4 className={`${colors.text} font-semibold mb-1 flex items-center gap-2`}>
                          <span className="text-xl">{region.flag}</span>
                          {region.name}
                        </h4>
                        <p className="text-gray-400 text-sm">{region.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Trends */}
                {era.trends && (
                  <div className={`${colors.bgCard} border ${colors.border} rounded-lg p-6 mt-6`}>
                    <h3 className={`${colors.text} text-xl font-semibold mb-4`}>Current trends:</h3>
                    <ul className="space-y-2">
                      {era.trends.map((trend, i) => (
                        <li key={i} className="text-gray-300 flex items-start gap-2">
                          <span className={`w-2 h-2 ${colors.dot} rounded-full mt-2 flex-shrink-0`}></span>
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Connector Line */}
            {index < timeline.length - 1 && (
              <div className="flex justify-center mt-12">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className={`w-1 h-24 bg-gradient-to-b ${colors.gradient} to-transparent origin-top`}
                />
              </div>
            )}
          </section>
        )
      })}

      {/* Legacy Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            <span className="text-purple-400">🧩</span> Legacy
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              Drum and Bass has shaped <strong className="text-purple-400">film scores</strong>, <strong className="text-purple-400">video games</strong>, <strong className="text-purple-400">advertising</strong>, and <strong className="text-purple-400">club culture</strong>.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed">
              It&apos;s influenced genres from dubstep to techno and remains one of the few electronic movements where <strong className="text-purple-400">artistry, innovation, and underground spirit</strong> still coexist.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed">
              It&apos;s not nostalgia — <strong className="text-green-400">it&apos;s evolution</strong>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Unites DnB Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-green-500/10 border border-green-500/30 rounded-2xl p-12"
          >
            <p className="text-gray-300 text-2xl md:text-3xl leading-relaxed mb-6">
              DnB no longer belongs to one sound — it&apos;s a <strong className="text-green-400">spectrum</strong>.
            </p>
            <p className="text-gray-300 text-xl leading-relaxed mb-4">
              What unites it is still the same force that started it all:
            </p>
            <p className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-purple-400">
              the drums and the bass
            </p>
          </motion.div>
        </div>
      </section>

      {/* Latest Releases Section */}
      <LatestMusic />

      {/* Related Reading Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            📚 Related Reading
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-2 gap-4"
          >
            {[
              { title: 'What Is Drum and Bass', href: '/what-is-drum-and-bass' },
              { title: 'What Is Neurofunk', href: '/neurofunk-dnb' },
              { title: 'How to Produce Neurofunk', href: '/how-to-produce-neurofunk' },
              { title: 'Latest Drum and Bass Releases', href: '/music' },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="group bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/50 rounded-lg p-6 transition-all duration-300 hover:bg-purple-500/20"
              >
                <h3 className="text-purple-400 group-hover:text-purple-300 font-semibold text-lg transition-colors">
                  {link.title} →
                </h3>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Subscribe CTA Section */}
      <SubscribeCTA />

      {/* Closing Quote Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.blockquote 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-medium text-gray-200 italic mb-6"
          >
            &quot;From jungle to neurofunk, from vinyl to digital — the history of Drum and Bass is a story of rhythm, rebellion, and reinvention.&quot;
          </motion.blockquote>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-purple-400 text-xl font-semibold"
          >
            — DnB Doctor
          </motion.p>
        </div>
      </section>
    </div>
  )
}

