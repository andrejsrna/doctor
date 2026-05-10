'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'

const galleryItems = [
  {
    type: 'image',
    src: '/gallery/wax.jpeg',
    alt: 'DnB Doctor Live Performance',
    title: 'Live at Wax',
    year: '2024',
    description: 'Packed house, great vibe — a set we won\'t forget.',
  },
  {
    type: 'video',
    src: '/gallery/neurotikum.mp4',
    poster: '/gallery/cooking.jpeg',
    alt: 'DnB Doctor in Action',
    title: 'Cooking with Neurotikum',
    year: '2023',
    description: 'Sun in our faces, fresh neurofunk from the speakers.',
  },
  {
    type: 'image',
    src: '/gallery/minidynamo.jpeg',
    alt: 'Studio Session',
    title: 'Mini & Dynamo',
    year: '2023 · 2021',
    description: 'The best neurofunk cats in the game, together at last.',
  },
  {
    type: 'image',
    src: '/gallery/moordoor.jpeg',
    alt: 'Live Event',
    title: 'Moordoor',
    year: '2024',
    description: 'Prague. Heavy. Exactly how it should be.',
  },
  {
    type: 'image',
    src: '/gallery/asana-prague-2025.jpg',
    alt: 'Asana plays Double Trouble Prague',
    title: 'Double Trouble Prague',
    year: '2025',
    description: 'Asana on the decks — Double Trouble, Prague.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

function VideoItem({ item, index }: { item: typeof galleryItems[number]; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (!videoRef.current) return
    if (playing) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setPlaying(!playing)
  }

  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.15}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-[#0a0a0a]">
        {/* Number badge */}
        <div className="absolute top-4 left-4 z-20 font-mono text-[9px] tracking-[0.35em] uppercase text-white/40 mix-blend-screen">
          {String(index + 1).padStart(2, '0')}
        </div>

        <video
          ref={videoRef}
          poster={item.poster}
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          onClick={toggle}
        >
          <source src={item.src} type="video/mp4" />
        </video>

        {/* Play / Pause overlay */}
        {!playing && (
          <button
            onClick={toggle}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
          >
            <div className="w-14 h-14 border border-white/30 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:border-[#01ef01]/60 transition-colors duration-300">
              <svg className="w-5 h-5 text-white group-hover:text-[#01ef01] transition-colors duration-300 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </button>
        )}

        {/* Hover overlay with text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 flex flex-col justify-end p-6 z-10">
          <div className="text-[#01ef01] font-mono text-[9px] tracking-[0.35em] uppercase mb-1">{item.year}</div>
          <h3 className="text-white font-black text-lg uppercase leading-tight">{item.title}</h3>
          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{item.description}</p>
        </div>
      </div>

      {/* Below-image label (always visible) */}
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-white font-black text-sm uppercase tracking-tight">{item.title}</span>
        <span className="text-white/30 font-mono text-[9px] tracking-widest uppercase">{item.year}</span>
      </div>
    </motion.div>
  )
}

function ImageItem({ item, index, featured = false }: { item: typeof galleryItems[number]; index: number; featured?: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index * 0.15}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="group relative"
    >
      <div className={`relative overflow-hidden bg-[#0a0a0a] ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        {/* Number badge */}
        <div className="absolute top-4 left-4 z-20 font-mono text-[9px] tracking-[0.35em] uppercase text-white/40 mix-blend-screen">
          {String(index + 1).padStart(2, '0')}
        </div>

        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.04]"
        />

        {/* Hover overlay with text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 flex flex-col justify-end p-6 z-10">
          <div className="text-[#01ef01] font-mono text-[9px] tracking-[0.35em] uppercase mb-1">{item.year}</div>
          <h3 className="text-white font-black text-lg uppercase leading-tight">{item.title}</h3>
          <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{item.description}</p>
        </div>

        {/* Accent corner */}
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#6F3DFF]/0 group-hover:border-[#6F3DFF]/60 transition-colors duration-500" />
      </div>

      {/* Below-image label */}
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-white font-black text-sm uppercase tracking-tight">{item.title}</span>
        <span className="text-white/30 font-mono text-[9px] tracking-widest uppercase">{item.year}</span>
      </div>
    </motion.div>
  )
}

export default function Gallery() {
  const [featured, ...rest] = galleryItems

  return (
    <section className="py-32 px-6 bg-[#050505]">
      <div className="max-w-7xl mx-auto">

        {/* ── Section header ── */}
        <div className="grid md:grid-cols-[220px_1fr] gap-16 items-start mb-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="text-[var(--color-secondary)] text-xs font-mono uppercase tracking-[0.3em] mb-3">04 / Gallery</div>
            <div className="w-10 h-[2px] bg-[#6F3DFF]" />
          </motion.div>

          <div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white uppercase leading-none"
            >
              Doctor{' '}
              <span className="text-[#6F3DFF]">&</span>{' '}
              You.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mt-4 text-gray-500 text-sm leading-relaxed max-w-md font-mono"
            >
              Studio sessions. Live sets. Moments that built the culture.
            </motion.p>
          </div>
        </div>

        {/* ── Featured + side-by-side layout ── */}
        <div className="grid md:grid-cols-3 gap-px bg-white/[0.04]">

          {/* Featured — takes 2 columns */}
          <div className="md:col-span-2 bg-[#050505] p-4">
            {featured.type === 'video'
              ? <VideoItem item={featured} index={0} />
              : <ImageItem item={featured} index={0} featured />
            }
          </div>

          {/* Right column — stacked */}
          <div className="bg-[#050505] p-4 flex flex-col gap-px">
            {rest.slice(0, 2).map((item, i) =>
              item.type === 'video'
                ? <VideoItem key={item.title} item={item} index={i + 1} />
                : <ImageItem key={item.title} item={item} index={i + 1} />
            )}
          </div>
        </div>

        {/* ── Bottom row — remaining items ── */}
        {rest.length > 2 && (
          <div className="mt-px grid md:grid-cols-3 gap-px bg-white/[0.04]">
            {rest.slice(2).map((item, i) => (
              <div key={item.title} className="bg-[#050505] p-4">
                {item.type === 'video'
                  ? <VideoItem item={item} index={i + 3} />
                  : <ImageItem item={item} index={i + 3} />
                }
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
