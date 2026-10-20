import { prisma } from '@/lib/prisma'
import { plainTitle, splitTitle } from '@/app/components/hero/releaseMeta'

export type CollectionKind = 'albums' | 'music-packs' | 'sample-packs'

export type CollectionItem = {
  id: string
  slug: string
  title: string
  artist: string | null
  cover: string | null
  preview: string | null
  date: string | null
  excerpt: string | null
  free: boolean
  /** also listed in another collection (e.g. a compilation that is both an album and a music pack) */
  alsoIn: CollectionKind[]
  stores: { name: string; url: string }[]
}

type Config = {
  /** DB category name */
  category: string
  path: string
  tab: string
  kicker: string
  h1: [string, string]
  lede: string
  listTitle: [string, string]
  listLede: string
  noun: [string, string]
  /** schema.org type of the listed items */
  itemType: 'MusicAlbum' | 'CreativeWork'
}

export const COLLECTIONS: Record<CollectionKind, Config> = {
  albums: {
    category: 'Albums',
    path: '/albums',
    tab: 'Albums & LPs',
    kicker: 'Complete Collections & Full-Length Releases',
    h1: ['New Drum and Bass', 'Albums'],
    lede: 'Discover the latest drum and bass albums and LP releases. New DnB albums updated daily with fresh neurofunk, liquid, and dark DnB album collections.',
    listTitle: ['Latest', 'DnB Albums'],
    listLede: 'Explore complete drum and bass album collections, full-length LPs, and extended play releases from top DnB artists and labels.',
    noun: ['album', 'albums'],
    itemType: 'MusicAlbum',
  },
  'music-packs': {
    category: 'Music Packs',
    path: '/music-packs',
    tab: 'Music packs',
    kicker: 'Curated Collections & Albums',
    h1: ['Neurofunk', 'Music Packs'],
    lede: 'Discover exclusive music collections featuring the best neurofunk tracks from DNB Doctor artists.',
    listTitle: ['Latest', 'Music Packs'],
    listLede: 'Label showcases, yearly compilations and continuous mixes that pull a whole season of DnB Doctor releases into one drop.',
    noun: ['pack', 'packs'],
    itemType: 'MusicAlbum',
  },
  'sample-packs': {
    category: 'Sample Packs',
    path: '/sample-packs',
    tab: 'Sample packs',
    kicker: 'Professional neurofunk sample packs with rolling basslines and complex drums',
    h1: ['Neurofunk', 'Samples'],
    lede: 'Download high-quality neurofunk samples featuring dark atmospheres, technical precision, and infectious beats for your drum and bass productions.',
    listTitle: ['Neurofunk', 'Sample Packs'],
    listLede: 'Bass loops, drum loops, one-shots and Serum presets made by DnB Doctor artists for your own productions.',
    noun: ['pack', 'packs'],
    itemType: 'CreativeWork',
  },
}

export const KINDS = Object.keys(COLLECTIONS) as CollectionKind[]

const STORES = [
  ['beatport', 'Beatport'],
  ['bandcamp', 'Bandcamp'],
  ['gumroad', 'Gumroad'],
  ['spotify', 'Spotify'],
  ['appleMusic', 'Apple Music'],
  ['soundcloud', 'SoundCloud'],
  ['youtubeMusic', 'YouTube Music'],
  ['tidal', 'Tidal'],
  ['deezer', 'Deezer'],
] as const

/** First ~240 chars of readable prose from the release description. */
function excerpt(html: string | null) {
  if (!html) return null
  const text = plainTitle(html.replace(/<\/(p|h\d|li|div)>|<br\s*\/?>/gi, ' \n'))
    .replace(/https?:\/\/\S+/g, '')
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return null
  if (text.length <= 240) return text
  const cut = text.slice(0, 240)
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—–-]$/, '') + '…'
}

export async function loadCollections(): Promise<Record<CollectionKind, CollectionItem[]>> {
  const empty = { albums: [], 'music-packs': [], 'sample-packs': [] } as Record<CollectionKind, CollectionItem[]>
  if (!process.env.DATABASE_URL) return empty
  try {
    const rows = await prisma.release.findMany({
      where: { categories: { hasSome: KINDS.map((k) => COLLECTIONS[k].category) } },
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        artistName: true,
        content: true,
        coverImageUrl: true,
        previewUrl: true,
        publishedAt: true,
        categories: true,
        releaseType: true,
        beatport: true,
        bandcamp: true,
        gumroad: true,
        spotify: true,
        appleMusic: true,
        soundcloud: true,
        youtubeMusic: true,
        tidal: true,
        deezer: true,
      },
    })
    for (const r of rows) {
      const kinds = KINDS.filter((k) => r.categories.includes(COLLECTIONS[k].category))
      const { artist, title } = splitTitle(plainTitle(r.title), r.artistName ? plainTitle(r.artistName) : null)
      for (const k of kinds) {
        empty[k].push({
          id: r.id,
          slug: r.slug,
          title,
          artist,
          cover: r.coverImageUrl,
          preview: r.previewUrl,
          date: r.publishedAt ? r.publishedAt.toISOString() : null,
          excerpt: excerpt(r.content),
          free: r.releaseType === 'FREE_DOWNLOAD',
          alsoIn: kinds.filter((o) => o !== k),
          stores: STORES.filter(([key]) => r[key]).map(([key, name]) => ({ name, url: r[key] as string })),
        })
      }
    }
    return empty
  } catch {
    return empty
  }
}
