'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/app/components/Button'
import EngagementCTA from '@/app/components/EngagementCTA'

export default function HowToProduceNeurofunkPage() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/music-bg.jpeg"
            alt="How to Produce Neurofunk"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black/80 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-60" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h2 
              className="text-purple-500 font-mono text-xl mb-6 inline-block"
              animate={{ textShadow: ['0 0 8px rgb(168,85,247)', '0 0 12px rgb(168,85,247)', '0 0 8px rgb(168,85,247)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Complete Production Guide
            </motion.h2>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-green-500">
                How to Produce
              </span><br />
              <span className="text-white">Neurofunk</span>
            </h1>

            <motion.p 
              className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-12 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Learn how to produce neurofunk – from bass design and drum programming to arrangement, mixing, and mastering.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-6"
            >
              <Button 
                href="/sample-packs"
                variant="toxic"
                size="lg"
              >
                Free Sample Packs
              </Button>

              <Button
                href="/submit-demo"
                variant="infected"
                size="lg"
              >
                Submit Your Track
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg prose-invert max-w-none"
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Neurofunk is one of the most technical and powerful subgenres of <strong className="text-purple-400">Drum & Bass</strong> — a world of precision sound design, surgical mixing, and dark cinematic tension.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed">
              If you&apos;ve ever wondered <strong className="text-purple-400">how to make neurofunk</strong>, this guide breaks down the essential elements: from bass design and drum layering to arrangement and mixdown.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Defines Neurofunk Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            🎧 What Defines <span className="text-purple-500">Neurofunk</span>?
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Neurofunk emerged in the early 2000s as the <strong className="text-purple-400">evolution of techstep</strong> — darker, more complex, and focused on <strong className="text-purple-400">bass movement</strong> rather than melody.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              It&apos;s a hybrid of art and engineering:
            </p>

            <blockquote className="border-l-4 border-purple-500 pl-6 py-4 my-8 bg-purple-500/5 italic text-gray-300 text-lg">
              Every sound is designed, not found.
            </blockquote>

            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 my-8">
              <h3 className="text-purple-400 text-xl font-semibold mb-4">Key traits:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">•</span>
                  <span><strong>Tempo:</strong> 172–175 BPM</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">•</span>
                  <span><strong>Basslines:</strong> modulated, evolving, and aggressive</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">•</span>
                  <span><strong>Drums:</strong> tight, punchy, layered</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">•</span>
                  <span><strong>Atmosphere:</strong> sci-fi, dystopian, industrial</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-purple-500 mt-1">•</span>
                  <span><strong>Mixdown:</strong> ultra-clean, headroom-controlled, stereo-balanced</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              Producers like <strong className="text-purple-400">Noisia</strong>, <strong className="text-purple-400">Mefjus</strong>, <strong className="text-purple-400">Gydra</strong>, and <strong className="text-purple-400">Joe Ford</strong> defined the modern neurofunk sound — equal parts groove, complexity, and chaos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step 1: Start with the Groove */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            🧬 Step 1: Start with the <span className="text-green-500">Groove</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              A strong <strong className="text-green-400">drum foundation</strong> is everything. Neurofunk lives and dies by its groove.
            </p>

            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Kick:</strong> short, controlled low end (around 50–70 Hz)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Snare:</strong> crisp transient, fundamental around 180–200 Hz</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Hi-hats:</strong> syncopated layers, subtle shuffle</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">•</span>
                <span><strong>Ghost notes:</strong> light, fast hits that keep motion in the beat</span>
              </li>
            </ul>

            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Start simple: one solid <strong className="text-green-400">two-bar loop</strong> with a snare on 2 and 4, then add subtle ghost hits and cymbal variations.
            </p>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Use <strong className="text-green-400">sample layering</strong> and <strong className="text-green-400">transient shaping</strong> to make drums hit hard without clipping.
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 my-8">
              <p className="text-green-400">
                👉 Check out our <Link href="/sample-packs" className="underline hover:text-green-300">Free DnB Sample Packs</Link> to build your drum library.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step 2: Design the Bass */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            ⚙️ Step 2: Design the <span className="text-pink-500">Bass</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              The <strong className="text-pink-400">bassline is the heart of neurofunk</strong>. It&apos;s not just low-end energy — it&apos;s a character.
            </p>

            <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-6 my-8">
              <h3 className="text-pink-400 text-xl font-semibold mb-4">Common tools:</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">•</span>
                  <span>Xfer Serum</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">•</span>
                  <span>Phase Plant</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">•</span>
                  <span>Vital</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-500">•</span>
                  <span>Massive X</span>
                </li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-pink-400 mb-4">Core Techniques:</h3>
            <ol className="space-y-4 text-gray-300 mb-6 list-decimal list-inside">
              <li><strong>FM Synthesis:</strong> Use operators to modulate pitch and create movement.</li>
              <li><strong>Distortion Layers:</strong> Combine different saturation stages (tube, soft clip, bit-crush).</li>
              <li><strong>Filtering:</strong> Automate high-pass/low-pass sweeps to create motion.</li>
              <li><strong>Resampling:</strong> Bounce your bass, re-process it, and twist it again.</li>
            </ol>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6 my-8">
              <p className="text-yellow-400">
                💡 <strong>Tip:</strong> Neurofunk bass is rarely one synth — it&apos;s usually <strong>3–5 layers</strong> blended across frequency bands.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Step 3: Sound Design & Atmosphere */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            🎚 Step 3: Sound Design & <span className="text-purple-500">Atmosphere</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              A true neuro track feels like a <strong className="text-purple-400">living machine</strong>. Add textures and ambient tension:
            </p>

            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Pads:</strong> dark reverb tails, metallic drones</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>FX:</strong> risers, downlifters, glitches, industrial noises</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span><strong>Foley:</strong> mechanical hits, machinery hum, reverb tails from field recordings</span>
              </li>
            </ul>

            <p className="text-gray-300 text-lg leading-relaxed">
              Try creating your own samples by recording sounds (metal hits, cables, tools) and <strong className="text-purple-400">re-processing</strong> them with distortion and reverb.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step 4: Arrangement & Flow */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            🧩 Step 4: Arrangement & <span className="text-green-500">Flow</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Structure your track with <strong className="text-green-400">tension and release</strong> in mind:
            </p>

            <div className="space-y-4 text-gray-300 mb-6">
              <div className="bg-green-500/5 border-l-4 border-green-500 p-4">
                <strong className="text-green-400">Intro:</strong> 16–32 bars of atmosphere and FX
              </div>
              <div className="bg-green-500/5 border-l-4 border-green-500 p-4">
                <strong className="text-green-400">Build:</strong> introduce drums and bass stabs gradually
              </div>
              <div className="bg-green-500/5 border-l-4 border-green-500 p-4">
                <strong className="text-green-400">Drop:</strong> main theme, tight groove, clear energy
              </div>
              <div className="bg-green-500/5 border-l-4 border-green-500 p-4">
                <strong className="text-green-400">Breakdown:</strong> space and atmosphere, minimal elements
              </div>
              <div className="bg-green-500/5 border-l-4 border-green-500 p-4">
                <strong className="text-green-400">Second Drop:</strong> variation or new bassline
              </div>
              <div className="bg-green-500/5 border-l-4 border-green-500 p-4">
                <strong className="text-green-400">Outro:</strong> filters down, returns to minimalism
              </div>
            </div>

            <p className="text-gray-300 text-lg leading-relaxed">
              Neurofunk works best when it <strong className="text-green-400">feels unpredictable but controlled</strong> — each section should evolve while maintaining the same pulse.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Step 5: Mixing & Mastering */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-pink-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            🔊 Step 5: Mixing & <span className="text-pink-500">Mastering</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-pink-400 mb-4">Mixing Goals</h3>
            <ul className="space-y-3 text-gray-300 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>Keep <strong>sub frequencies clean</strong> — nothing collides with the kick.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>Use <strong>bus compression</strong> for glue, not loudness.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>Balance with <strong>mid-side EQ</strong> for width without phase issues.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>Automate EQs to keep the low end consistent as the bass moves.</span>
              </li>
            </ul>

            <h3 className="text-2xl font-bold text-pink-400 mb-4">Mastering Tips</h3>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>Light multiband compression (C4 or Pro-MB).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>Subtle saturation for perceived loudness.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>Target loudness: around <strong>–7 to –6 LUFS</strong> (for heavy DnB).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-pink-500 mt-1">•</span>
                <span>Leave some headroom — neurofunk lives in dynamics.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Step 6: Workflow & Mindset */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            💻 Step 6: Workflow & <span className="text-purple-500">Mindset</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Producing neurofunk isn&apos;t just about plugins — it&apos;s about <strong className="text-purple-400">discipline and iteration</strong>.
            </p>

            <ul className="space-y-3 text-gray-300 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span>Work in focused sessions (sound design → composition → mixdown).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span>Reference pros (Noisia, Gydra, Mefjus) often.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span>A/B your track at low volume — balance reveals itself there.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 mt-1">•</span>
                <span>Don&apos;t chase loudness, chase <strong>clarity and character</strong>.</span>
              </li>
            </ul>

            <blockquote className="border-l-4 border-purple-500 pl-6 py-4 my-8 bg-purple-500/5 italic text-gray-300 text-lg">
              &quot;The groove is human, the mix is mechanical.&quot; — <em>DnB Doctor</em>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Step 7: Learn, Collaborate, Release */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8"
          >
            🧠 Step 7: Learn, Collaborate, <span className="text-green-500">Release</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Neurofunk is a <strong className="text-green-400">community-driven genre</strong> — producers share techniques, collabs, and remix stems.
            </p>

            <ul className="space-y-3 text-gray-300 mb-8">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">•</span>
                <span>Join Discords and forums like Neurofunk Grid or Bass Rabbit.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">•</span>
                <span>Follow labels like <strong>DnB Doctor</strong>, <strong>Neuropunk</strong>, and <strong>Close2Death</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">•</span>
                <span>Submit demos once your mixdown feels ready: <Link href="/submit-demo" className="text-green-400 underline hover:text-green-300">Submit Demo →</Link></span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-8 text-center"
          >
            🎁 <span className="text-purple-500">Resources</span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid gap-6"
          >
            <Link 
              href="/sample-packs"
              className="block bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/50 transition-all duration-300"
            >
              <h3 className="text-purple-400 text-xl font-bold mb-2">Free Neurofunk Sample Packs</h3>
              <p className="text-gray-400">Download professional sample packs to kickstart your productions</p>
            </Link>

            <div className="block bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-purple-400 text-xl font-bold mb-2">Best Plugins for Drum and Bass Production</h3>
              <p className="text-gray-400">Essential tools and VSTs for neurofunk production</p>
            </div>

            <div className="block bg-purple-500/10 border border-purple-500/30 rounded-lg p-6">
              <h3 className="text-purple-400 text-xl font-bold mb-2">Drum and Bass Production Tips</h3>
              <p className="text-gray-400">Advanced techniques and workflow optimization</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final Quote */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.blockquote 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-l-4 border-green-500 pl-6 py-6 bg-green-500/5 text-gray-300 text-xl leading-relaxed text-center"
          >
            <p className="mb-4">
              <em>Neurofunk isn&apos;t about perfection — it&apos;s about evolution. Every sound, every bar, every bounce teaches you something new.</em>
            </p>
            <footer className="text-green-400 font-semibold">— DnB Doctor</footer>
          </motion.blockquote>
        </div>
      </section>

      {/* Engagement CTA */}
      <EngagementCTA />
    </div>
  )
}

