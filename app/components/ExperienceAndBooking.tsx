'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  FaCalendarAlt,
  FaArrowRight,
  FaHeadphones,
  FaSyringe,
  FaUserPlus,
  FaInfoCircle,
} from 'react-icons/fa'
import Button from './Button'

const values = [
  { title: 'Innovation', description: 'Pushing boundaries with cutting-edge sound design' },
  { title: 'Community', description: 'Building connections through shared passion' },
  { title: 'Quality', description: 'Curating the finest selections in neurofunk' },
  { title: 'Growth', description: 'Supporting emerging talent in the scene' },
]

const bookingFeatures = [
  'Professional DJ Equipment',
  'Extensive Music Library',
  'Custom Playlists',
  'Sound System Available',
  'Experienced Performance',
  'Flexible Booking Options',
]

export default function ExperienceAndBooking() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Layered background */}
      <div className="absolute inset-0">
        <Image
          src="/party.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.07]"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(168,85,247,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">

        {/* ── Section 1: Label Identity ───────────────────────────────── */}
        <div className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs uppercase tracking-[0.3em] text-purple-400 font-mono mb-5"
          >
            About the Label
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-none mb-6 bg-clip-text text-transparent
              bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
          >
            The DnB Doctor<br />Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            More than just a record label — we&apos;re a movement dedicated to pushing the boundaries
            of Neurofunk and Drum &amp; Bass. Our mission is to cultivate and showcase the most
            innovative sounds in the scene.
          </motion.p>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {values.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group p-6 rounded-2xl border border-purple-500/20 bg-purple-500/5
                hover:border-purple-500/40 hover:bg-purple-500/10 transition-all duration-300"
            >
              <div className="w-2 h-2 rounded-full bg-purple-500 mb-4
                group-hover:scale-150 transition-transform duration-300" />
              <h4 className="text-white font-bold mb-2">{item.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent mb-20" />

        {/* ── Section 2: Booking ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center"
        >
          {/* DJ image */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden
                border border-purple-500/30 shadow-[0_0_60px_rgba(168,85,247,0.18)] group"
            >
              <Image
                src="/about.jpg"
                alt="About DnB Doctor"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3 text-xs text-center">
                <Link
                  href="https://www.instagram.com/moor_door_music/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-pink-400 transition-colors"
                >
                  Asana playing at moor.door.music event in Prague @ IG
                </Link>
              </div>
            </motion.div>

          </div>

          {/* Booking content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-2 rounded-full
                bg-purple-500/20 border border-purple-500/30 text-purple-400 text-sm
                hover:bg-purple-500/30 transition-all duration-300"
            >
              <FaCalendarAlt className="w-3.5 h-3.5 mr-2" />
              Available for Bookings
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-black leading-tight text-white"
            >
              Book Us At<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                Your Party
              </span>
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-400 leading-relaxed"
            >
              Want to bring the neurofunk vibes to your event? We offer professional DJ services
              for clubs, private parties, and special events.
            </motion.p>

            <ul className="grid sm:grid-cols-2 gap-3">
              {bookingFeatures.map((feature, i) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-center text-gray-300 text-sm group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3 shrink-0
                    group-hover:scale-150 transition-transform duration-300" />
                  {feature}
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex gap-3 flex-wrap"
            >
              <Button href="/contact" variant="infected" size="lg" className="flex-1 min-w-[160px] group">
                <FaSyringe className="w-4 h-4 mr-2 transform group-hover:rotate-45 transition-transform duration-300" />
                <span>Book Now</span>
                <FaArrowRight className="w-3.5 h-3.5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button href="/music" variant="decayed" size="lg" className="flex-1 min-w-[160px] group">
                <FaHeadphones className="w-4 h-4 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
                <span>Listen to Music</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Bottom label CTAs ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 justify-center mt-20 pt-16
            border-t border-white/5"
        >
          <Button href="/contact" variant="infected" className="group">
            <FaUserPlus className="w-4 h-4 mr-2 transform group-hover:rotate-12 transition-transform duration-300" />
            <span>Join the Movement</span>
          </Button>
          <Button href="/about" variant="decayed" className="group">
            <FaInfoCircle className="w-4 h-4 mr-2 transform group-hover:rotate-180 transition-transform duration-500" />
            <span>About DnB Doctor</span>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
