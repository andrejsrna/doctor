'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface PlatformCard {
  id: string
  title: string
  description: string
  benefits: string
  url: string
  imageUrl?: string
  icon: 'spotify' | 'youtube' | 'soundcloud' | 'musicpacks'
  isExternal: boolean
}

const platforms: PlatformCard[] = [
  {
    id: 'spotify-monthly',
    title: '(Spotify) Monthly Neurofunk Selection',
    description: 'DNB Doctor Monthly Neurofunk Selection – Dive into the freshest, darkest, and most technical neurofunk cuts hand-picked each month.',
    benefits: 'Curated playlists updated monthly, offline listening, and seamless integration with your music library.',
    url: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15?si=d7b3b3cd778940f9',
    imageUrl: '/playlists/monthly.jpg',
    icon: 'spotify',
    isExternal: true
  },
  {
    id: 'spotify-releases',
    title: '(Spotify) DNB Doctor Exclusives',
    description: 'Exclusive collection of tracks released by DNB Doctor artists. From YEHOR and Asana to Warp Fa2e and more.',
    benefits: 'High-quality streaming, algorithmic recommendations, and easy playlist sharing with friends.',
    url: 'https://open.spotify.com/playlist/2GD72ly17HcWc9OAEtdUBP?si=4857d6cfb8154f51',
    imageUrl: '/playlists/ours.jpg',
    icon: 'spotify',
    isExternal: true
  },
  {
    id: 'youtube',
    title: 'YouTube Channel',
    description: 'Watch music videos, live sets, behind-the-scenes content, and production tutorials from DNB Doctor.',
    benefits: 'Visual content, music videos, DJ sets, and exclusive video content you won\'t find anywhere else.',
    url: 'https://www.youtube.com/@dnbdoctor1',
    icon: 'youtube',
    isExternal: true
  },
  {
    id: 'soundcloud',
    title: 'SoundCloud',
    description: 'Listen to exclusive tracks, demos, and work-in-progress releases before they hit other platforms.',
    benefits: 'Early access to new releases, demos, and exclusive unreleased tracks from DNB Doctor artists.',
    url: 'https://soundcloud.com/dnbdoctor',
    icon: 'soundcloud',
    isExternal: true
  },
  {
    id: 'music-packs',
    title: 'Music Packs',
    description: 'Explore our curated collections and albums featuring the best tracks from DNB Doctor artists.',
    benefits: 'Exclusive music collections, complete albums, and carefully selected compilations of our finest neurofunk releases.',
    url: '/music-packs',
    icon: 'musicpacks',
    isExternal: false
  }
]

const getIcon = (type: string) => {
  switch (type) {
    case 'spotify':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      )
    case 'youtube':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    case 'soundcloud':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c0-.057-.045-.1-.09-.1m-.899.828c-.051 0-.09.04-.099.099l-.135 1.326.135 1.295c.008.057.048.098.099.098.05 0 .09-.04.099-.098l.16-1.295-.16-1.326c-.008-.059-.048-.099-.099-.099m1.79-1.886c-.06 0-.108.047-.114.108l-.21 2.36.21 2.301c.006.061.054.11.114.11s.111-.049.117-.11l.239-2.301-.239-2.36c-.006-.061-.056-.108-.117-.108m.934-.175c-.065 0-.117.05-.122.117l-.189 2.535.189 2.484c.005.067.057.117.122.117s.119-.05.122-.117l.214-2.484-.214-2.535c-.003-.067-.057-.117-.122-.117m.986.077c-.07 0-.126.054-.137.125l-.167 2.458.167 2.432c.011.071.067.125.137.125.069 0 .125-.054.137-.125l.189-2.432-.189-2.458c-.012-.071-.068-.125-.137-.125m1.012.14c-.075 0-.137.06-.148.137l-.139 2.318.139 2.277c.011.077.073.137.148.137s.134-.06.148-.137l.167-2.277-.167-2.318c-.014-.077-.073-.137-.148-.137m.943.065c-.08 0-.145.063-.157.144l-.134 2.253.134 2.221c.012.08.077.145.157.145.076 0 .142-.065.151-.145l.153-2.221-.153-2.253c-.009-.081-.075-.144-.151-.144m.965.058c-.084 0-.153.067-.161.154l-.107 2.195.107 2.174c.008.087.077.155.161.155.083 0 .152-.068.16-.155l.125-2.174-.125-2.195c-.008-.087-.077-.154-.16-.154m1.001.018c-.089 0-.161.072-.168.164l-.093 2.177.093 2.144c.007.092.079.165.168.165s.163-.073.168-.165l.107-2.144-.107-2.177c-.005-.092-.079-.164-.168-.164m1.031.084c-.093 0-.168.076-.177.171l-.067 2.093.067 2.092c.009.095.084.172.177.172.094 0 .169-.077.178-.172l.077-2.092-.077-2.093c-.009-.095-.084-.171-.178-.171m1.061-.084c-.099 0-.177.081-.186.184l-.051 2.009.051 2.023c.009.103.087.186.186.186.095 0 .175-.083.184-.186l.061-2.023-.061-2.009c-.009-.103-.089-.184-.184-.184m1.096.066c-.104 0-.186.087-.195.194l-.034 1.943.034 2c.009.107.091.194.195.194.103 0 .187-.087.194-.194l.04-2-.04-1.943c-.007-.107-.091-.194-.194-.194m1.123.027c-.109 0-.193.09-.202.205l-.016 1.916.016 1.971c.009.115.093.205.202.205.108 0 .193-.09.202-.205l.022-1.971-.022-1.916c-.009-.115-.094-.205-.202-.205m1.146-.008c-.114 0-.204.096-.214.214v.005l-.007 1.889.007 1.958c.01.118.1.214.214.214.113 0 .201-.096.213-.214l.008-1.958-.008-1.889c-.012-.118-.1-.214-.213-.214m1.181.014c-.119 0-.214.097-.223.223l-.001 1.875.001 1.937c.009.126.104.223.223.223.118 0 .214-.097.223-.223l.001-1.937-.001-1.875c-.009-.126-.105-.223-.223-.223m1.195-.014c-.124 0-.223.102-.232.231v1.889l.001 1.927c.009.13.108.232.231.232.124 0 .224-.102.233-.232l.001-1.927v-1.889c-.009-.129-.109-.231-.233-.231m4.639 2.103c-.027 0-.053.002-.077.006-.021-.645-.249-1.207-.615-1.619-.366-.412-.843-.618-1.431-.618-.304 0-.565.046-.783.137-.103.043-.129.102-.129.205v3.964c0 .107.079.186.186.186h2.849c.555 0 1.029-.196 1.423-.589.393-.393.589-.867.589-1.423 0-.555-.196-1.029-.589-1.423-.393-.393-.867-.589-1.423-.589z"/>
        </svg>
      )
    case 'musicpacks':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
        </svg>
      )
    default:
      return null
  }
}

const getPlatformColor = (type: string) => {
  switch (type) {
    case 'spotify':
      return 'from-green-600 to-green-500 hover:from-green-500 hover:to-green-400'
    case 'youtube':
      return 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
    case 'soundcloud':
      return 'from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400'
    case 'musicpacks':
      return 'from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400'
    default:
      return 'from-gray-600 to-gray-500 hover:from-gray-500 hover:to-gray-400'
  }
}

const splitBenefits = (benefits: string) =>
  benefits
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

export default function ListenNow() {
  return (
    <section className="py-24 md:py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.1)_0%,_transparent_100%)] opacity-30" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14 md:mb-16"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300 mb-4">
            Listen &amp; Follow
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-green-400 bg-clip-text text-transparent">
              Listen Now
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Discover DNB Doctor music across all major platforms
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="relative bg-gradient-to-br from-purple-900/15 via-black/35 to-green-900/15 rounded-3xl p-8 border border-white/10 hover:border-purple-500/30 transition-all duration-300 overflow-hidden h-full flex flex-col hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="relative w-[72px] h-[72px] rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/80 to-green-500/70 p-[1px] flex-shrink-0">
                      <div className="w-full h-full rounded-2xl bg-black/60 flex items-center justify-center overflow-hidden">
                        {platform.imageUrl ? (
                          <Image
                            src={platform.imageUrl}
                            alt={platform.title}
                            width={72}
                            height={72}
                            className="w-full h-full object-cover"
                            sizes="72px"
                            quality={85}
                          />
                        ) : (
                          <div className="text-purple-200">{getIcon(platform.icon)}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-purple-200 transition-colors break-words leading-snug">
                        {platform.title}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {platform.isExternal ? 'External platform' : 'On DnB Doctor'}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-200 text-sm leading-relaxed mb-5 line-clamp-3">
                    {platform.description}
                  </p>

                  <div className="mb-7">
                    <p className="text-purple-300/90 text-xs uppercase tracking-[0.2em] mb-3">Highlights</p>
                    <ul className="text-gray-300 text-sm space-y-2">
                      {splitBenefits(platform.benefits)
                        .slice(0, 3)
                        .map((b) => (
                          <li key={b} className="flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-400 to-green-400 flex-shrink-0" />
                            <span className="leading-relaxed">{b}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <Link
                    href={platform.url}
                    target={platform.isExternal ? "_blank" : undefined}
                    rel={platform.isExternal ? "noopener noreferrer" : undefined}
                    className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r ${getPlatformColor(platform.icon)} text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 hover:shadow-[0_14px_40px_rgba(0,0,0,0.45)] mt-auto`}
                  >
                    <span className="text-sm">
                      {getIcon(platform.icon)}
                    </span>
                    {platform.isExternal ? 'Visit' : 'Explore'} {platform.icon === 'musicpacks' ? 'Packs' : platform.icon.charAt(0).toUpperCase() + platform.icon.slice(1)}
                  </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500 to-green-500 opacity-60" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-14"
        >
          <p className="text-gray-400 text-sm">
            Follow us on all platforms to stay updated with the latest neurofunk releases and exclusive content
          </p>
        </motion.div>
      </div>
    </section>
  )
}
