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

function TickerItem({ link }: { link: typeof links[number] }) {
  const Icon = 'icon' in link ? link.icon : null

  const inner = (
    <span className="group/link inline-flex items-center gap-2 px-4 py-1 rounded-md hover:bg-purple-500/10 transition-colors cursor-pointer whitespace-nowrap">
      {Icon && <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${'iconColor' in link ? link.iconColor : ''}`} />}
      <span className="text-xs font-semibold text-purple-100 group-hover/link:text-white transition-colors">
        {link.label}
      </span>
      <span className="text-[10px] text-purple-400/60 group-hover/link:text-purple-300 transition-colors">
        {link.sublabel}
      </span>
      <span className="text-purple-500/50 text-[10px]">→</span>
    </span>
  )

  const separator = <span className="text-purple-700/40 select-none px-2">✦</span>

  const content = (
    <>
      {inner}
      {separator}
    </>
  )

  if (link.internal) {
    return <Link href={link.href}>{content}</Link>
  }

  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  )
}

export default function PromoBar() {
  return (
    <div className="w-full bg-gradient-to-r from-purple-900/60 via-black/80 to-purple-900/60 border-b border-purple-500/15 backdrop-blur-md overflow-hidden">
      {/* edge fade masks */}
      <div className="relative py-2">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-[#0d0014]/80 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-[#0d0014]/80 to-transparent pointer-events-none" />

        <div className="flex items-center" style={{ animation: 'ticker 28s linear infinite' }}>
          {/* Two copies for seamless loop */}
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center shrink-0" aria-hidden={copy === 1}>
              {links.map((link) => (
                <TickerItem key={`${copy}-${link.href}`} link={link} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .flex[style*="animation"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
