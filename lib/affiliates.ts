export type AffiliateLink = {
  name: string
  url: string
  description: string
  group: 'dj' | 'producer'
  icon?: string
  tagline?: string
}

export const affiliateLinks: AffiliateLink[] = [
  // DJ Group
  {
    name: 'Beatport',
    url: 'https://www.beatport.com/?a_aid=69dac828ced75',
    description: 'The world\'s largest electronic music store for DJs. Buy and download high-quality tracks, stems, and DJ tools.',
    group: 'dj',
    tagline: 'Buy & Download DJ Tracks',
  },
  {
    name: 'DJCity',
    url: 'https://www.djcity.com/?a_aid=69dac828ced75',
    description: 'Premium DJ record pool with the latest music, exclusives, and remixes updated daily.',
    group: 'dj',
    tagline: 'Premium DJ Record Pool',
  },
  // Producer Group
  {
    name: 'Plugin Boutique',
    url: 'https://www.pluginboutique.com/?a_aid=69dac828ced75',
    description: 'The ultimate plugin store. Browse thousands of VST plugins, DAWs, and production tools with exclusive deals.',
    group: 'producer',
    tagline: 'VST Plugins & Production Tools',
  },
  {
    name: 'Loopcloud',
    url: 'https://www.loopcloud.com/?a_aid=69dac828ced75',
    description: 'Cloud-connected sample management. Browse, audition, and drag sounds directly into your DAW in real time.',
    group: 'producer',
    tagline: 'Cloud Sample Management',
  },
  {
    name: 'Loopmasters',
    url: 'https://www.loopmasters.com/?a_aid=69dac828ced75',
    description: 'Leading sample pack store with genre-defining sounds from top producers and labels worldwide.',
    group: 'producer',
    tagline: 'Premium Sample Packs',
  },
]

export const djLinks = affiliateLinks.filter((l) => l.group === 'dj')
export const producerLinks = affiliateLinks.filter((l) => l.group === 'producer')

/**
 * Append the Beatport affiliate param to any Beatport URL.
 * If the URL already has query params, adds &a_aid=...; otherwise adds ?a_aid=...
 */
export function withBeatportAffiliate(url: string | undefined): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('beatport')) {
      parsed.searchParams.set('a_aid', '69dac828ced75')
      return parsed.toString()
    }
  } catch {
    // not a valid URL, return as-is
  }
  return url
}
