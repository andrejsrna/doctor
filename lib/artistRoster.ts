import { prisma } from '@/lib/prisma'

export type RosterArtist = {
  id: string
  slug: string
  name: string
  imageUrl: string | null
  soundcloud: string | null
  spotify: string | null
  instagram: string | null
  releases: number
  latest: { slug: string; title: string } | null
}

/**
 * Public roster: only artists with a photo (credit-only profiles imported from
 * release titles stay off listings), newest signings first, with release footprint.
 */
export async function getRosterArtists(take?: number): Promise<{ artists: RosterArtist[]; total: number }> {
  const where = { imageUrl: { not: null } }
  const [artists, total] = await Promise.all([
    prisma.artist.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      select: { id: true, slug: true, name: true, imageUrl: true, soundcloud: true, spotify: true, instagram: true },
    }),
    prisma.artist.count({ where }),
  ])

  const roster = await Promise.all(
    artists.map(async (a) => {
      // artistName may be a collab credit ("A & B"), the title carries "Artist - Track"
      const match = { contains: a.name, mode: 'insensitive' as const }
      const rel = { publishedAt: { not: null }, OR: [{ artistName: match }, { title: match }] }
      const [releases, latest] = await Promise.all([
        prisma.release.count({ where: rel }),
        prisma.release.findFirst({ where: rel, orderBy: { publishedAt: 'desc' }, select: { slug: true, title: true } }),
      ])
      return { ...a, releases, latest }
    }),
  )

  return { artists: roster, total }
}
