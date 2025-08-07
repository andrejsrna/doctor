"use client"
import { motion } from 'framer-motion'
import Button from './Button'

export default function LearnMoreNeurofunk() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-br from-black/60 via-purple-900/20 to-pink-900/20 p-10 text-center"
      >
        <div className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] bg-purple-600/20 blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-[520px] h-[520px] bg-pink-600/20 blur-3xl rounded-full" />
        <motion.h2
          initial={{ letterSpacing: '0.05em' }}
          animate={{ letterSpacing: ['0.05em','0.1em','0.05em'] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-3xl md:text-5xl font-extrabold"
        >
          Want to learn more about
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-300">Neurofunk DnB?</span>
        </motion.h2>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">Deep dive into the culture, sound design, and history behind the most surgical branch of DnB.</p>
        <div className="mt-8 flex justify-center">
          <Button href="/neurofunk-drum-and-bass" variant="toxic" size="lg" className="group">
            Explore The Guide
            <motion.span animate={{ x: [0,6,0] }} transition={{ duration: 1.6, repeat: Infinity }} className="ml-2">→</motion.span>
          </Button>
        </div>
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2,0.5,0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_60%)]"
        />
      </motion.div>
    </section>
  )
}


