'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/app/components/Button'
import LatestMusic from '@/app/components/LatestMusic'
import SubscribeCTA from '@/app/components/SubscribeCTA'

export default function WhatIsDrumAndBassPage() {
  const faqData = [
    {
      question: 'What does DnB stand for?',
      answer: 'DnB means "Drum and Bass" — a fast, bass-driven electronic music genre.',
    },
    {
      question: "What's the difference between Jungle and DnB?",
      answer: 'Jungle uses more reggae-inspired basslines and samples, while DnB tends to sound more polished and modern.',
    },
    {
      question: 'What BPM is Drum and Bass?',
      answer: 'Usually between 160–180 BPM, most tracks sit around 174 BPM.',
    },
  ]

  const subgenres = [
    {
      name: 'Liquid DnB',
      description: 'Smooth, melodic, emotional',
      artists: 'Netsky, LSB',
    },
    {
      name: 'Neurofunk',
      description: 'Dark, futuristic, mechanical',
      artists: 'Noisia, Mefjus, DnB Doctor',
    },
    {
      name: 'Jump-Up',
      description: 'Playful, heavy, rave-ready',
      artists: 'DJ Hazard, Macky Gee',
    },
    {
      name: 'Techstep',
      description: 'Minimal, robotic',
      artists: 'Ed Rush & Optical',
    },
    {
      name: 'Jungle',
      description: 'Organic, breakbeat-driven',
      artists: 'Shy FX, Congo Natty',
    },
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/music-bg.jpeg"
            alt="Drum and Bass Background"
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
              The Complete Guide
            </motion.h2>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-purple-500 to-pink-500">
                What Is Drum and Bass?
              </span>
            </h1>

            <motion.p 
              className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Drum and Bass — often shortened to <strong>DnB</strong> — is a <strong>high-energy electronic music genre</strong> defined by <strong>fast breakbeats (160–180 BPM)</strong>, deep basslines, and complex rhythmic structures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-6"
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
                  href="/submit-demo"
                  variant="infected"
                  size="lg"
                >
                  Submit Your Track
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* The Meaning of DnB Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            🧠 The Meaning of <span className="text-green-500">DnB</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              At its core, Drum and Bass is about <strong className="text-green-400">rhythmic precision</strong> and <strong className="text-green-400">bass energy</strong>.
              <br />
              While techno and house focus on steady four-on-the-floor beats, DnB uses <strong className="text-green-400">syncopated breakbeats</strong> — chopped, swung drum patterns that create tension and movement.
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-green-400 text-xl font-semibold mb-4">Typical features:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Tempo between <strong className="text-green-400">160–180 BPM</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Heavy use of <strong className="text-green-400">Amen break</strong>, <strong className="text-green-400">Reese bass</strong>, and <strong className="text-green-400">sub-bass layers</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Emphasis on <strong className="text-green-400">sound design</strong> and <strong className="text-green-400">mix clarity</strong></span>
                </li>
              </ul>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed italic border-l-4 border-green-500 pl-4">
              The name itself says it all: <strong>Drums and Bass</strong> are the foundation — everything else (melodies, atmospheres, vocals) serves the rhythm.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Origins Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            🧬 Origins: From Jungle to <span className="text-purple-500">DnB</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              Drum and Bass was born in early &apos;90s London, growing out of <strong className="text-purple-400">jungle</strong>, <strong className="text-purple-400">hardcore</strong>, and <strong className="text-purple-400">breakbeat rave</strong>.
              <br />
              Pioneers like <strong className="text-purple-400">Goldie</strong>, <strong className="text-purple-400">LTJ Bukem</strong>, and <strong className="text-purple-400">Roni Size</strong> shaped the first wave — merging <strong>breakbeats</strong>, <strong>dub basslines</strong>, and <strong>soulful samples</strong>.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed">
              By the 2000s, the genre diversified:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">Liquid DnB</h3>
                <p className="text-gray-400 text-sm">smooth, melodic, emotional</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">Neurofunk</h3>
                <p className="text-gray-400 text-sm">dark, technical, cinematic</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">Jump-Up</h3>
                <p className="text-gray-400 text-sm">aggressive, playful, built for clubs</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">Techstep</h3>
                <p className="text-gray-400 text-sm">industrial, robotic, minimal</p>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              Each subgenre kept the DnB DNA but evolved its own identity and energy.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modern Sound Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            ⚙️ The Modern <span className="text-green-500">Drum and Bass</span> Sound
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              Modern DnB is produced with <strong className="text-green-400">high-precision digital tools</strong> — DAWs like <strong>Ableton Live, FL Studio, or Cubase</strong>, and plugins such as <strong>Serum, Phase Plant, or FabFilter</strong>.
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
              <h3 className="text-green-400 text-xl font-semibold mb-4">Key production traits:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-green-400">Layered drum design</strong> (snare + ghost hits + transient shaping)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-green-400">Clean sub separation</strong> — bass never collides with the kick</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-green-400">Atmospheric pads</strong> or <strong>cinematic ambiences</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span><strong className="text-green-400">Automation-driven movement</strong> — filters, LFOs, distortion shaping</span>
                </li>
              </ul>
            </div>

            <blockquote className="text-gray-300 text-lg leading-relaxed italic border-l-4 border-green-500 pl-4">
              🎧 The genre has always balanced <strong>engineering and emotion</strong> — high-tech sound with human groove.
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Global Scene Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            🌍 Global Scene & <span className="text-purple-500">Subculture</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              From underground raves in Bristol to main stages at Let It Roll, Drum and Bass has become a <strong className="text-purple-400">worldwide subculture</strong>.
            </p>

            <div className="space-y-4">
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                  <span>🇬🇧</span> United Kingdom
                </h3>
                <p className="text-gray-400">the birthplace, home of Hospital, RAM, Metalheadz</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                  <span>🇨🇿</span> Czech Republic
                </h3>
                <p className="text-gray-400">Let It Roll & DnB Doctor generation</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                  <span>🇳🇿</span> New Zealand
                </h3>
                <p className="text-gray-400">vibrant live scene, artists like The Upbeats</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                  <span>🇺🇸</span> North America
                </h3>
                <p className="text-gray-400">neurofunk and liquid resurgence</p>
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              The community thrives on <strong className="text-purple-400">respect, collaboration, and sonic experimentation</strong> — it&apos;s more than a genre; it&apos;s a global network of producers, DJs, and fans.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Subgenres Table Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            🧩 DnB <span className="text-green-500">Subgenres</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-green-500/30">
                  <th className="text-left py-4 px-4 text-green-400 font-semibold">Subgenre</th>
                  <th className="text-left py-4 px-4 text-green-400 font-semibold">Description</th>
                  <th className="text-left py-4 px-4 text-green-400 font-semibold">Example Artists</th>
                </tr>
              </thead>
              <tbody>
                {subgenres.map((subgenre, index) => (
                  <tr key={index} className="border-b border-green-500/10 hover:bg-green-500/5 transition-colors">
                    <td className="py-4 px-4 text-gray-200 font-medium">{subgenre.name}</td>
                    <td className="py-4 px-4 text-gray-400">{subgenre.description}</td>
                    <td className="py-4 px-4 text-gray-400">{subgenre.artists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <p className="text-gray-400 text-sm mt-6 text-center italic">
            (See also: <Link href="/drum-and-bass-subgenres" className="text-green-400 hover:text-green-300 transition-colors">/drum-and-bass-subgenres</Link>)
          </p>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            🔊 Why It <span className="text-purple-500">Matters</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-gray-300 text-lg leading-relaxed">
              Drum and Bass has shaped not just club music but also <strong className="text-purple-400">film scores, video games, and advertising</strong>.
              <br />
              Its mix of <strong className="text-purple-400">intensity and precision</strong> influenced genres like dubstep, trap, and techno.
            </p>

            <p className="text-gray-300 text-lg leading-relaxed">
              The best way to understand it?
              <br />
              ➡️ <strong>Listen.</strong> Explore our latest releases below.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Latest Releases Section */}
      <LatestMusic />

      {/* Subscribe CTA Section */}
      <SubscribeCTA />

      {/* FAQ Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            FAQ
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {faqData.map((faq, index) => (
              <div key={index} className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-green-400 text-xl font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

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
            &quot;Drum and Bass isn&apos;t just music — it&apos;s a frequency culture.&quot;
          </motion.blockquote>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-green-400 text-xl font-semibold"
          >
            — DnB Doctor
          </motion.p>
        </div>
      </section>
    </div>
  )
}

