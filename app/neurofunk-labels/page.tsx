'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Button from '@/app/components/Button'
import LatestMusic from '@/app/components/LatestMusic'
import EngagementCTA from '@/app/components/EngagementCTA'
import SubscribeCTA from '@/app/components/SubscribeCTA'

const undergroundScouts = [
  {
    name: 'DnB Doctor',
    description:
      'Prague-based label and creative studio focused on dark, rolling narratives with cinematic storytelling.',
  },
  {
    name: 'Neuroheadz',
    description:
      'UK collective nurturing next-gen engineers who love experimental drum programming and raw bass design.',
  },
  {
    name: 'Bass Rabbit Recordings',
    description:
      'Vienna imprint turning rave energy into tightly curated releases and collaborative showcases.',
  },
]

const europeanLabels = [
  'Eatbrain',
  'Blackout Music NL',
  'Darkshire',
  'Skamele Recordings',
  'Bass Rabbit Recordings',
  'DnB Doctor',
  'Nonoise',
  'Hanzom Music',
  'Bassomnia',
  'Spring Bass Jam Recordings',
  'Neurosports Recordings',
  'District Bass',
  'Brain Rave',
  'NeuroDNB Recordings',
  'Evolution Chamber',
  'Nocturnal Demons',
  'Paperfunk Recordings',
  'Hoofbeats Music',
]

const darkshireFacts = [
  {
    label: 'Origin Story',
    value: 'From forest micro-festival to touring brand with immersive scenography.',
  },
  {
    label: 'Signature Artists',
    value: 'PRDK, Zigi SC, A-Cray, ABSU_NTQL, Raido, Kaira.',
  },
  {
    label: 'What Sets Them Apart',
    value: 'Narrative-first branding, relentless visual identity, and high-stakes bass pressure.',
  },
]

const undergroundRegions = [
  'Czechia: warehouse grit, relentless bass scientists, Let It Roll alumni.',
  'Austria: precision engineering, cross-pollination with techno aesthetics.',
  'Germany & Netherlands: modular experiments, boutique vinyl runs.',
  'Slovakia & UK: hybrid crews fusing neurofunk with halftime and glitch.',
]

export default function NeurofunkLabelsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/newsletter/showcase.jpeg"
            alt="Neurofunk label ecosystem collage"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/50 via-black/80 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.07)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Neurofunk Labels:<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-purple-400 to-pink-400">
              From the Giants to the Underground
            </span>
          </motion.h1>

          <motion.p
            className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            The neurofunk label landscape has evolved. Legacy houses like Eatbrain and Blackout still stand tall,
            but independent crews and self-releasing producers now drive the genre forward.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button href="/music" variant="toxic" size="lg">
              Explore Releases
            </Button>
            <Button href="/submit-demo" variant="infected" size="lg">
              Submit a Demo
            </Button>
          </motion.div>
        </div>
      </section>

      {/* How Neurofunk Labels Evolved */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="border border-green-500/30 rounded-3xl p-8 bg-black/40 backdrop-blur">
            <motion.p
              className="text-gray-300 text-lg leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Life changed -- and so did the labels. Some titans survived, others shut down, and the monopoly on attention disappeared.
              You no longer need the Virus or Blackout cosign to be heard; one heavyweight bootleg can travel the world overnight.
            </motion.p>
            <motion.p
              className="text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              The Covid era forced everyone to relearn agility. Artists launched imprints, Twitch channels, Patreon communities,
              and Bandcamp clubs. The truth? It&apos;s not the same anymore -- and that&apos;s a good thing.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Independent Rise */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Rise of Independent & Underground Labels
          </motion.h2>
          <motion.p
            className="text-gray-300 text-lg mb-10 max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Boutique crews scout hungry producers who want label support without losing creative control.
            Consistency, unique sound design, and dedication still open doors -- the rulebook just changed.
          </motion.p>

          <div className="grid gap-6 md:grid-cols-3">
            {undergroundScouts.map((label) => (
              <motion.div
                key={label.name}
                className="border border-purple-500/30 rounded-2xl p-6 bg-purple-500/5"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl font-semibold mb-3 text-purple-200">{label.name}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{label.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Label List */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Most Active & Influential Neurofunk Labels in Europe (2020s)
          </motion.h2>
          <div className="border border-green-500/30 rounded-3xl p-8 bg-green-500/5">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-gray-100 text-lg">
              {europeanLabels.map((label) => (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full bg-green-400 block"
                    aria-hidden="true"
                  />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-400 text-sm mt-6">
              These imprints shape modern neurofunk culture, whether through festival stages, boutique vinyl drops, or unstoppable release schedules.
            </p>
          </div>
        </div>
      </section>

      {/* Central Europe */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Central Europe: The Heartbeat
          </motion.h2>
          <motion.p
            className="text-gray-300 text-lg mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Czech and Austrian creatives forged a true symbiosis.
            Prague, Brno, and Vienna trade ideas weekly -- from warehouse raves to cross-border showcases and festival takeovers.
          </motion.p>
          <div className="grid gap-4">
            {undergroundRegions.map((region) => (
              <motion.div
                key={region}
                className="border border-purple-500/30 rounded-2xl p-4 bg-purple-500/5 text-gray-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                {region}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Darkshire Spotlight */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            className="border border-green-500/30 rounded-[32px] p-10 bg-gradient-to-br from-green-500/10 to-transparent"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Spotlight: Darkshire</h2>
            <p className="text-gray-300 text-lg mb-8">
              They started in the forest - now they run high-production parties across Slovakia, Hungary, and Czechia, and dedicated Austrian ravers hope they&apos;ll fill the blank Darkshire space at home soon.
              Darkshire&apos;s growth is pure dedication, relentless storytelling, and heavy music direction.
            </p>
            <div className="grid gap-6 md:grid-cols-3">
              {darkshireFacts.map((fact) => (
                <div key={fact.label} className="bg-black/40 border border-green-500/20 rounded-2xl p-5">
                  <p className="text-sm uppercase tracking-wide text-green-400 mb-2">{fact.label}</p>
                  <p className="text-gray-200 text-sm">{fact.value}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-100 text-lg mt-8 italic">
              &quot;Their growth is the price of dedication, good music, and clever marketing.&quot;
            </p>
          </motion.div>
        </div>
      </section>

      {/* Legacy Labels */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Legends in Transition: Eatbrain & Blackout
          </motion.h2>
          <motion.p
            className="text-gray-300 text-lg leading-relaxed space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span>
              For OVER a decade they were unquestioned kings, dropping era-defining releases and arena-sized live shows.
            </span>
            <span>
              Culture shifted, algorithms rewired attention, and underground-meets-viral energy took over. They are not gone - just evolving, recalibrating their place in a decentralized ecosystem. A comeback is always one bold release away.
            </span>
          </motion.p>
        </div>
      </section>

      {/* Underground core */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-6xl mx-auto relative z-10 grid gap-10 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Underground Core</h2>
            <p className="text-gray-300 text-lg mb-6">
              Thousands of listeners per drop, but pure cultural gravity. SoundCloud crews, cassette runs, Discord syndicates --
              they keep the fire alive with deep rollers, halftime experiments, and multi-country collabs.
            </p>
            <p className="text-gray-400 text-sm">
              Czechia, Germany, the Netherlands, Austria, Slovakia, and the UK keep trading ideas, pushing neuro forward because they love it.
            </p>
          </motion.div>

          <motion.div
            className="border border-purple-500/30 rounded-3xl p-8 bg-purple-500/5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-semibold mb-4">Spotlight: DnB Doctor</h3>
            <p className="text-gray-300 text-base mb-4">
              DnB Doctor is the archetype of modern underground neuro: dark, gritty, and hyper-focused on identity.
              Artists like Asana, Yehor, Ill-Fated, and EmZee deliver weaponized basslines built for late-night systems.
            </p>
            <p className="text-gray-300 text-base">
              Expect raw pressure inspired by the classics but sculpted with today&apos;s sound design tools. The future of the underground might already be in their release calendar.
            </p>
            <p className="text-gray-400 text-sm mt-4">
              Austria shows up too via DnB Doctor releases from Overtune, Asom, Reality, and Virus.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Future */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/5 to-black" />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The Future of Neurofunk
          </motion.h2>
          <motion.p
            className="text-gray-300 text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            The ravers shape what happens next. Every show you attend, mix you share, and underground release you stream keeps the culture alive.
            Support the big names, champion the independents, and keep the scene weird.
          </motion.p>
          <p className="text-gray-200 text-lg font-semibold">Keep it underground. Keep it real.</p>
          <p className="text-gray-400 mt-4">
            ðŸ’š With the heaviest neuro love,<br />
            Anne
          </p>
          <p className="text-gray-400 mt-4 text-sm">
            PS: My monthly Neurofunk Playlist is live on Spotify -- soon dropping on SoundCloud via DnB Doctor.
          </p>
        </div>
      </section>

      {/* Engagement & Music */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-900/5 to-black" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Join the Movement
          </motion.h2>
          <EngagementCTA />
        </div>
      </section>

      <LatestMusic />
      <SubscribeCTA />
    </div>
  )
}
