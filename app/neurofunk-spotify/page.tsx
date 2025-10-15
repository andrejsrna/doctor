'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '@/app/components/Button'
import LatestMusic from '@/app/components/LatestMusic'
import SpotifyPlaylists from '@/app/components/SpotifyPlaylists'
import EngagementCTA from '@/app/components/EngagementCTA'
import { FaSpotify, FaPlay } from 'react-icons/fa'

export default function NeurofunkSpotifyPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/music-bg.jpeg"
            alt="Neurofunk Spotify Playlists Background"
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
            <motion.div 
              className="flex items-center justify-center gap-3 mb-6"
              animate={{ textShadow: ['0 0 8px rgb(0,255,0)', '0 0 12px rgb(0,255,0)', '0 0 8px rgb(0,255,0)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FaSpotify className="text-green-500 text-3xl" />
              <h2 className="text-green-500 font-mono text-xl">
                Curated Neurofunk Playlists
              </h2>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-500 via-purple-500 to-pink-500">
                Best Neurofunk DnB
              </span><br />
              <span className="text-white">Playlists on Spotify</span>
            </h1>

            <motion.p 
              className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Discover the best Neurofunk DnB playlists on Spotify — from dark rollers to tech-driven anthems. Curated by DNB Doctor and top underground artists.
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
                  href="https://open.spotify.com/user/dnbdoctor"
                  variant="toxic"
                  size="lg"
                  className="group"
                >
                  <FaSpotify className="w-5 h-5 mr-2" />
                  Follow on Spotify
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
                  href="/music"
                  variant="infected"
                  size="lg"
                >
                  <FaPlay className="w-4 h-4 mr-2" />
                  Browse All Releases
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Explore the Dark Side Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Explore the <span className="text-green-500">Dark Side</span> of Drum and Bass
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Neurofunk on Spotify has never sounded this sharp.
              Whether you&apos;re a producer seeking inspiration, a DJ digging for heavy rollers, or just someone who loves that dark, mechanical sound — these playlists are built to keep your brain wired and your head nodding.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              At DNB Doctor, we curate and update our neurofunk selections weekly, blending underground releases, label exclusives, and new-wave artists redefining the sound of modern drum and bass.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Spotify Playlists Section */}
      <SpotifyPlaylists />

      {/* Recommended Neurofunk Playlists Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Recommended <span className="text-purple-500">Neurofunk</span> Playlists
          </motion.h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Playlist 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-xl overflow-hidden"
            >
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/playlist/6PLall5kR62hTs9QP4FXLr?utm_source=generator" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              />
            </motion.div>

            {/* Playlist 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-xl overflow-hidden"
            >
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/playlist/2GD72ly17HcWc9OAEtdUBP?utm_source=generator" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              />
            </motion.div>

            {/* Playlist 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-xl overflow-hidden"
            >
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/playlist/5VPtC2C3IO8r9oFT3Jzj15?utm_source=generator" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              />
            </motion.div>

            {/* Playlist 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-xl overflow-hidden"
            >
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/playlist/3krCJBEYkHDS8RCrM4Q1kV?utm_source=generator" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              />
            </motion.div>

            {/* Playlist 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="rounded-xl overflow-hidden"
            >
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/playlist/74qpkWDhdxOnzhlV1podBN?utm_source=generator" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              />
            </motion.div>

            {/* Playlist 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="rounded-xl overflow-hidden"
            >
              <iframe 
                data-testid="embed-iframe" 
                style={{ borderRadius: '12px' }} 
                src="https://open.spotify.com/embed/playlist/0Po1Xhn50bsrQwyjXWMMKJ?utm_source=generator" 
                width="100%" 
                height="352" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
              />
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-green-500/10 via-purple-500/10 to-pink-500/10 border border-green-500/30 rounded-lg p-6"
          >
            <p className="text-center text-lg">
              <span className="text-2xl mr-2">💡</span>
              <strong className="text-green-400">Tip:</strong>
              <span className="text-gray-300"> Follow us on Spotify to get new tracks directly in your Release Radar.</span>
            </p>
          </motion.div>
        </div>
      </section>

      {/* Top Artists Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Top <span className="text-green-500">Neurofunk Artists</span> You&apos;ll Hear
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Our Spotify playlists feature both legendary pioneers and cutting-edge newcomers.
              Expect a mix of:
            </p>
            
            <ul className="space-y-3 text-gray-300 text-lg mb-6">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">•</span>
                <span><strong className="text-green-400">Noisia, Phace, Black Sun Empire</strong> – the foundations of neurofunk</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong className="text-purple-400">Mefjus, Synergy, Joe Ford</strong> – the new era innovators</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span><strong className="text-pink-400">Yehor, Razerbeam, EmZee, Xsonsence</strong> – exclusive DNB Doctor artists pushing the sound forward</span>
              </li>
            </ul>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              Each track is handpicked for its energy, mix quality, and emotional depth — not just loudness.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Sound of DNB Doctor Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            The Sound of <span className="text-purple-500">DNB Doctor</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none mb-12"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              What makes our playlists different?
              We focus on precision-engineered neurofunk — the kind that feels alive, cinematic, and brutal in all the right ways.
              Every bassline tells a story, every drop has intent.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              These tracks represent what neurofunk means to us — control, chaos, and creativity colliding in perfect sync.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Latest Music Component */}
      <LatestMusic />

      {/* Follow & Stay Connected Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            Follow & <span className="text-green-500">Stay Connected</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg leading-relaxed mb-8"
          >
            Don&apos;t just listen — join the movement.
            Follow DNB Doctor on Spotify and get early access to:
          </motion.p>

          <motion.ul 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-3 text-gray-300 text-lg mb-12 max-w-xl mx-auto"
          >
            <li className="flex items-center justify-center gap-3">
              <span className="text-green-500">✓</span>
              <span>New neurofunk releases</span>
            </li>
            <li className="flex items-center justify-center gap-3">
              <span className="text-green-500">✓</span>
              <span>Exclusive pre-release previews</span>
            </li>
            <li className="flex items-center justify-center gap-3">
              <span className="text-green-500">✓</span>
              <span>Behind-the-scenes stories from our artists</span>
            </li>
          </motion.ul>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Button 
              href="https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP?si=67b54af160464446"
              variant="toxic"
              size="lg"
              className="group"
            >
              <FaSpotify className="w-5 h-5 mr-2" />
              Follow DNB Doctor on Spotify
            </Button>

            <Button
              href="/music"
              variant="infected"
              size="lg"
            >
              Listen to All Releases
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Why Spotify Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center"
          >
            Why <span className="text-purple-500">Spotify</span> Is Great for Drum and Bass
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Spotify&apos;s algorithm actively promotes niche subgenres like neurofunk, meaning new tracks can gain exposure faster than ever before.
              By following curated playlists, you help underground artists reach new listeners — and keep the neurofunk scene alive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Engagement CTA */}
      <EngagementCTA />
    </div>
  )
}
