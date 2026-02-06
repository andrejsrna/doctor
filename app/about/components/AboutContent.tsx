'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaHeadphones, FaMusic, FaUsers, FaNewspaper, FaSyringe } from 'react-icons/fa'
import SubscribeCTA from '../../components/SubscribeCTA'
import Link from 'next/link'
import Gallery from '@/app/components/Gallery'
import Button from '@/app/components/Button'

export default function AboutContent() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/aboutus.jpg" // Add your hero image
            alt="DNB Doctor Background"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent 
            bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500">
            About DnB Doctor
          </h1>
          <p className="text-xl text-gray-300">
            Your premier destination for drum and bass music, news, and culture
          </p>
        </motion.div>
      </section>

      {/* Mission Statement */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-purple-500">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              We&apos;re dedicated to promoting and preserving drum and bass culture,
              connecting artists with fans, and providing a platform for the best electronic music.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Experience Button Section */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
            whileHover={{ scale: 1.05 }}
          >
            <Button
              href="/music"
              variant="infected"
              size="lg"
              className="group text-2xl py-6 px-12"
            >
              <FaSyringe className="w-6 h-6 mr-3 transform group-hover:rotate-45 transition-transform duration-500" />
              <span>The DnB Doctor Experience</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 bg-gradient-to-b from-purple-900/20 to-pink-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: FaHeadphones,
                title: "Top Releases",
                description: "Heavyweight releases from the best artists in the scene"
              },
              {
                icon: FaNewspaper,
                title: "Mixes and Podcasts",
                description: "Fresh mixes and podcasts from the our local grown artists"
              },
              {
                icon: FaUsers,
                title: "Community",
                description: "Connect with fellow drum and bass enthusiasts from around the globe"
              },
              {
                icon: FaMusic,
                title: "Artist Spotlight",
                description: "In-depth features and interviews with leading artists and newcomers"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-black/50 border border-purple-500/20 backdrop-blur-sm
                  hover:border-purple-500/40 transition-all duration-300"
              >
                <feature.icon className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "100+", label: "Releases" },
              { number: "50+", label: "Artists" },
              { number: "50K+", label: "Monthly Listeners" },
              { number: "10K+", label: "Social Followers" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent 
                  bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (Optional) */}
      <section className="py-24 px-4 bg-black/80">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-purple-500 mb-16">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Anne",
                role: "Community manager & playlist",
                image: "/anne.jpg",
                email: "anne@dnbdoctor.com",
                description: "Contact me regarding playlist inquiries and curation."
              },
              {
                name: "Andrej",
                role: "Distribution and releases",
                image: "/andrej.jpg",
                email: "releases@dnbdoctor.com"
              },
              {
                name: "Yehor",
                role: "Sound Engineer",
                image: "/yehor.jpg" // Add team member images
              },
              {
                name: "Christopher",
                role: "Talent Scout",
                image: "/christopher.jpeg" // Add team member images
              },
              {
                name: "Jaroslav",
                role: "Creative strategist",
                image: "/jaroslav.jpeg" // Add team member images
              },
              {
                name: "Your Name Here",
                role: "Suggest Your Own Role",
                image: "/avatar.jpeg" // Add team member images
              },
              // Add more team members...
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={index < 2
                  ? "md:col-span-3 flex flex-col md:flex-row items-center gap-8 bg-white/5 p-8 rounded-2xl text-left mb-8"
                  : "text-center"
                }
              >
                <div className={index < 2
                  ? "w-48 h-48 relative shrink-0 rounded-full overflow-hidden"
                  : "w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden relative"
                }>
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes={index < 2 ? "192px" : "128px"}
                    className="object-cover"
                  />
                </div>
                <div className={index < 2 ? "md:flex-1" : ""}>
                  <h3 className={`font-bold text-white mb-2 ${index < 2 ? "text-3xl" : "text-xl"}`}>
                    {member.name}
                  </h3>
                  <p className={`text-gray-400 ${index < 2 ? "text-xl" : ""}`}>
                    {member.role}
                  </p>
                  {member.description && (
                    <p className="text-gray-300 mt-4 mb-2 max-w-xl">
                      {member.description}
                    </p>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="block text-sm text-purple-500 hover:text-pink-500 transition-colors mt-2"
                    >
                      {member.email}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-4">We are looking for more team members, if you are interested, <Link href="/contact" className="text-purple-500 hover:text-pink-500 transition-colors duration-300">please contact us</Link></p>
        </div>
      </section>

      <Gallery />

      {/* Newsletter Section */}

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <SubscribeCTA />
        </div>
      </section>
    </div>
  )
} 
