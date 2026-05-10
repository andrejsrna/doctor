'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaHeadphones, FaMusic, FaUsers, FaNewspaper, FaSyringe } from 'react-icons/fa'
import SubscribeCTA from '../../components/SubscribeCTA'
import Link from 'next/link'
import Gallery from '@/app/components/Gallery'
import Button from '@/app/components/Button'

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

const FEATURES = [
  {
    icon: FaHeadphones,
    title: 'Top Releases',
    description: 'Heavyweight releases from the best artists in the scene.',
    accent: '#6F3DFF',
  },
  {
    icon: FaNewspaper,
    title: 'Mixes & Podcasts',
    description: 'Fresh mixes and podcasts from our locally grown artists.',
    accent: 'var(--color-secondary)',
  },
  {
    icon: FaUsers,
    title: 'Community',
    description: 'Connect with fellow drum and bass enthusiasts from around the globe.',
    accent: '#6F3DFF',
  },
  {
    icon: FaMusic,
    title: 'Artist Spotlight',
    description: 'In-depth features and interviews with leading artists and newcomers.',
    accent: 'var(--color-secondary)',
  },
]

const STATS = [
  { number: '100+', label: 'Releases' },
  { number: '50+', label: 'Artists' },
  { number: '50K+', label: 'Monthly Listeners' },
  { number: '10K+', label: 'Social Followers' },
]

const FEATURED_CREW = [
  {
    name: 'Anne',
    role: 'Community manager & playlist',
    image: '/anne.jpg',
    email: 'anne@dnbdoctor.com',
    description: 'Contact me regarding playlist inquiries and curation.',
  },
  {
    name: 'Andrej',
    role: 'Distribution and releases',
    image: '/andrej.jpg',
    email: 'releases@dnbdoctor.com',
    description: null,
  },
]

const CREW = [
  { name: 'Yehor', role: 'Sound Engineer', image: '/yehor.jpg' },
  { name: 'Christopher', role: 'Talent Scout', image: '/christopher.jpeg' },
  { name: 'Jaroslav', role: 'Creative Strategist', image: '/jaroslav.jpeg' },
  { name: 'Your Name Here', role: 'Suggest Your Role', image: '/avatar.jpeg' },
]

export default function AboutContent() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ─── HERO ────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d0020] via-[#050505] to-[#050505]" />
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#6F3DFF]/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--color-secondary)]/5 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4" />
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 80px, rgba(111,61,255,0.03) 80px, rgba(111,61,255,0.03) 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(111,61,255,0.03) 80px, rgba(111,61,255,0.03) 81px)' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-24">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <span className="inline-flex items-center gap-2 text-[var(--color-secondary)] text-xs font-mono uppercase tracking-[0.3em] mb-8 border border-[var(--color-secondary)]/25 px-3 py-1.5">
              Since 2015 · Neurofunk · DNB
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="show"
            className="text-7xl md:text-[clamp(4rem,12vw,130px)] font-black leading-none tracking-tight"
          >
            <span className="text-white">DnB</span>
            <br />
            <span className="text-[#6F3DFF]">Doctor.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="mt-8 max-w-lg text-gray-400 text-lg leading-relaxed"
          >
            Your premier destination for drum and bass music, news, and culture.
          </motion.p>
        </div>
      </section>

      {/* ─── MISSION ─────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[220px_1fr] gap-16 items-start">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="text-[var(--color-secondary)] text-xs font-mono uppercase tracking-[0.3em] mb-3">01 / Mission</div>
            <div className="w-10 h-[2px] bg-[#6F3DFF]" />
          </motion.div>

          <div>
            <motion.p
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white leading-snug"
            >
              We&apos;re dedicated to promoting and preserving drum and bass culture —
              <span className="text-[#6F3DFF]"> connecting artists with fans</span> and providing
              a platform for the best electronic music on the planet.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-12"
            >
              <Button href="/music" variant="infected" size="lg" className="group">
                <FaSyringe className="w-5 h-5 transform group-hover:rotate-45 transition-transform duration-500" />
                The DnB Doctor Experience
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── DOCTOR & YOU ────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#020208]">
        {/* Grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(111,61,255,0.018) 60px, rgba(111,61,255,0.018) 61px), repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(111,61,255,0.018) 60px, rgba(111,61,255,0.018) 61px)' }} />

        {/* Column header bar */}
        <div className="relative z-10 grid md:grid-cols-2 border-b border-white/[0.06]">
          <div className="px-8 md:px-14 py-5 border-r border-white/[0.06] flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6F3DFF] animate-pulse" />
            <span className="text-[#6F3DFF] font-mono text-[9px] tracking-[0.4em] uppercase">SUBJECT_01 · LABEL · EST. 2015</span>
          </div>
          <div className="px-8 md:px-14 py-5 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#01ef01] animate-pulse" />
            <span className="text-[#01ef01] font-mono text-[9px] tracking-[0.4em] uppercase">SUBJECT_02 · LISTENER · STATUS: ACTIVE</span>
          </div>
        </div>

        {/* Main split */}
        <div className="relative z-10 grid md:grid-cols-2">

          {/* ── THE DOCTOR panel ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative px-8 md:px-14 py-20 border-r border-white/[0.06] overflow-hidden"
          >
            {/* Decorative Rx */}
            <div
              aria-hidden
              className="absolute -right-6 top-6 text-[clamp(120px,18vw,200px)] font-black leading-none select-none pointer-events-none text-[#6F3DFF]"
              style={{ opacity: 0.045, fontVariantNumeric: 'tabular-nums' }}
            >
              Rx
            </div>

            <div className="relative">
              <div className="text-[#6F3DFF] font-mono text-[10px] tracking-[0.38em] uppercase mb-10">The Doctor.</div>

              <h2 className="text-[clamp(2.6rem,5.5vw,4.5rem)] font-black uppercase leading-[0.88] tracking-[-0.02em] mb-14 text-white">
                Ten years.<br />
                One obsession.<br />
                No apologies.
              </h2>

              <ul className="space-y-7">
                {[
                  ['01', 'Surgical curation — only the heaviest drops make the cut.'],
                  ['02', 'Independent since 2015. Beholden to no one but the music.'],
                  ['03', '100+ releases. 50+ artists. One relentless standard.'],
                ].map(([num, text]) => (
                  <motion.li
                    key={num}
                    variants={fadeUp}
                    custom={Number(num) * 0.3}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex gap-5 items-start group"
                  >
                    <span className="font-mono text-xs text-[#6F3DFF]/40 shrink-0 mt-0.5 group-hover:text-[#6F3DFF] transition-colors duration-300 tabular-nums">
                      {num}
                    </span>
                    <span className="text-gray-400 text-sm leading-relaxed font-mono">{text}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-14 inline-flex items-center gap-3 border border-[#6F3DFF]/20 px-5 py-2.5 hover:border-[#6F3DFF]/50 transition-colors duration-300">
                <span className="w-1 h-5 bg-[#6F3DFF] inline-block" />
                <span className="text-[#6F3DFF] font-mono text-[9px] tracking-[0.35em] uppercase">DIAGNOSIS: NEUROFUNK · PRESCRIPTION: ACTIVE</span>
              </div>
            </div>
          </motion.div>

          {/* ── YOU panel ── */}
          <motion.div
            variants={fadeUp}
            custom={0.2}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative px-8 md:px-14 py-20 overflow-hidden"
          >
            {/* Decorative YOU */}
            <div
              aria-hidden
              className="absolute -right-4 top-6 text-[clamp(100px,14vw,160px)] font-black leading-none select-none pointer-events-none text-[#01ef01]"
              style={{ opacity: 0.04 }}
            >
              YOU
            </div>

            <div className="relative">
              <div className="text-[#01ef01] font-mono text-[10px] tracking-[0.38em] uppercase mb-10">You.</div>

              <h2 className="text-[clamp(2.6rem,5.5vw,4.5rem)] font-black uppercase leading-[0.88] tracking-[-0.02em] mb-14 text-white">
                You hear<br />
                what others<br />
                can only feel.
              </h2>

              <ul className="space-y-7">
                {[
                  ['01', 'You came for the bass. You stayed for everything else.'],
                  ['02', 'You know the difference between heavy and just loud.'],
                  ['03', 'You don\'t need an explanation. The drop speaks for itself.'],
                ].map(([num, text]) => (
                  <motion.li
                    key={num}
                    variants={fadeUp}
                    custom={Number(num) * 0.3 + 0.2}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex gap-5 items-start group"
                  >
                    <span className="font-mono text-xs text-[#01ef01]/40 shrink-0 mt-0.5 group-hover:text-[#01ef01] transition-colors duration-300 tabular-nums">
                      {num}
                    </span>
                    <span className="text-gray-400 text-sm leading-relaxed font-mono">{text}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-14 inline-flex items-center gap-3 border border-[#01ef01]/20 px-5 py-2.5 hover:border-[#01ef01]/50 transition-colors duration-300">
                <span className="w-1 h-5 bg-[#01ef01] inline-block" />
                <span className="text-[#01ef01] font-mono text-[9px] tracking-[0.35em] uppercase">CLASSIFICATION: ONE OF US</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom diagnostics bar */}
        <div className="relative z-10 border-t border-white/[0.06] px-8 md:px-14 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <span className="font-mono text-[9px] text-white/15 tracking-[0.35em] uppercase">DNB-DOCTOR-DIAGNOSTICS // REF-2015-NEUROFUNK</span>
          <span className="font-mono text-[9px] text-white/15 tracking-[0.35em] uppercase">SYSTEM: ONLINE // BASS: PRESCRIBED</span>
        </div>
      </section>

      {/* ─── STATS ───────────────────────────────────── */}
      <section className="border-y border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="py-12 px-8"
            >
              <div className="text-5xl md:text-6xl font-black text-[#6F3DFF] leading-none">{stat.number}</div>
              <div className="mt-3 text-xs uppercase tracking-[0.22em] text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── WHAT WE DO ──────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
            <div className="text-[var(--color-secondary)] text-xs font-mono uppercase tracking-[0.3em] mb-3">02 / What we do</div>
            <h2 className="text-4xl md:text-5xl font-black text-white">The platform.</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-px bg-white/5">
            {FEATURES.map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                custom={i * 0.4}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-[#050505] p-10 hover:bg-[#0b0715] transition-colors duration-300 group"
              >
                <div className="w-1 h-10 mb-8 rounded-full" style={{ backgroundColor: item.accent }} />
                <item.icon className="w-7 h-7 mb-5 transition-transform duration-300 group-hover:scale-110" style={{ color: item.accent }} />
                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TEAM ────────────────────────────────────── */}
      <section className="py-32 px-6 bg-[#030303]">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
            <div className="text-[var(--color-secondary)] text-xs font-mono uppercase tracking-[0.3em] mb-3">03 / People</div>
            <h2 className="text-4xl md:text-5xl font-black text-white">Meet the crew.</h2>
          </motion.div>

          {/* Featured two */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {FEATURED_CREW.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="flex gap-6 items-start bg-[#0a0a0a] border border-white/5 p-8 hover:border-[#6F3DFF]/35 transition-colors duration-300"
              >
                <div className="w-20 h-20 shrink-0 relative overflow-hidden">
                  <Image src={member.image} alt={member.name} fill sizes="80px" className="object-cover grayscale" />
                </div>
                <div>
                  <div className="text-[var(--color-secondary)] text-xs font-mono uppercase tracking-[0.2em] mb-1.5">{member.role}</div>
                  <h3 className="text-2xl font-black text-white mb-2">{member.name}</h3>
                  {member.description && (
                    <p className="text-gray-500 text-sm leading-relaxed mb-3">{member.description}</p>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-[#6F3DFF] hover:text-[var(--color-secondary)] transition-colors"
                    >
                      {member.email}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Supporting crew */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CREW.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                custom={i * 0.4}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="bg-[#0a0a0a] border border-white/5 p-5 hover:border-[#6F3DFF]/35 transition-colors duration-300 group"
              >
                <div className="w-full aspect-square relative overflow-hidden mb-4 grayscale group-hover:grayscale-0 transition-all duration-500">
                  <Image src={member.image} alt={member.name} fill sizes="200px" className="object-cover" />
                </div>
                <div className="text-[#6F3DFF] text-xs font-mono uppercase tracking-[0.15em] mb-1">{member.role}</div>
                <h3 className="font-black text-white">{member.name}</h3>
              </motion.div>
            ))}
          </div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-10 text-gray-600 text-sm"
          >
            We&apos;re looking for more team members.{' '}
            <Link href="/contact" className="text-[#6F3DFF] hover:text-[var(--color-secondary)] transition-colors">
              Get in touch →
            </Link>
          </motion.p>
        </div>
      </section>

      {/* ─── GALLERY ─────────────────────────────────── */}
      <Gallery />

      {/* ─── NEWSLETTER ──────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SubscribeCTA />
        </div>
      </section>
    </div>
  )
}
