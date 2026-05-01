import Link from 'next/link'
import { FaYoutube, FaSpotify } from 'react-icons/fa'

const links = [
  {
    label: 'Save up to 60% with Music Packs',
    sublabel: 'Bundle tracks, pay less',
    href: '/music-packs',
    internal: true,
  },
  {
    label: 'Get Our Full Catalog 35% Off',
    sublabel: 'Bulk sale — everything included',
    href: '/bulk-sale',
    internal: true,
  },
  {
    label: 'Subscribe on YouTube',
    sublabel: 'Videos, sets & tutorials',
    href: 'https://www.youtube.com/@dnbdoctor1',
    internal: false,
    icon: FaYoutube,
    iconColor: 'text-red-500',
  },
  {
    label: 'Follow on Spotify',
    sublabel: 'Monthly curated playlists',
    href: 'https://open.spotify.com/playlist/5VPtC2C3IO8r9oFT3Jzj15',
    internal: false,
    icon: FaSpotify,
    iconColor: 'text-green-500',
  },
]

export default function PromoBar() {
  return (
    <div className="w-full bg-gradient-to-r from-purple-900/60 via-black/80 to-purple-900/60 border-b border-purple-500/15">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-2.5">
          {links.map((link) => {
            const Icon = 'icon' in link ? link.icon : null

            const inner = (
              <>
                {'icon' in link && Icon && (
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${link.iconColor}`} />
                )}
                <span className="text-xs md:text-sm font-semibold text-purple-100 group-hover/link:text-white transition-colors whitespace-nowrap">
                  {link.label}
                </span>
                <span className="hidden md:inline text-[10px] text-purple-400/70 group-hover/link:text-purple-300 transition-colors">
                  {link.sublabel}
                </span>
                <span className="text-purple-400/50 group-hover/link:text-purple-300 transition-colors text-[10px]">→</span>
              </>
            )

            const className =
              'group/link inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-purple-500/10 transition-colors'

            if (link.internal) {
              return (
                <Link key={link.href} href={link.href} className={className}>
                  {inner}
                </Link>
              )
            }

            return (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
              >
                {inner}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
