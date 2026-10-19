// server component: pulls the newest signings + their release footprint
import { prisma } from '@/lib/prisma'
import FeaturedArtistsRoster, { type RosterArtist } from './FeaturedArtistsRoster'

const COUNT = 8

export default async function FeaturedArtists() {
  const [artists, total] = await Promise.all([
    prisma.artist.findMany({
      where: { imageUrl: { not: null } },
      orderBy: { createdAt: 'desc' },
      take: COUNT,
      select: { id: true, slug: true, name: true, imageUrl: true, soundcloud: true, spotify: true, instagram: true },
    }),
    prisma.artist.count({ where: { imageUrl: { not: null } } }),
  ])

  if (!artists.length) return null

  const roster: RosterArtist[] = await Promise.all(
    artists.map(async (a) => {
      // artistName is often empty on imported releases, so the title ("Artist - Track") counts too
      const match = { contains: a.name, mode: 'insensitive' as const }
      const where = { publishedAt: { not: null }, OR: [{ artistName: match }, { title: match }] }
      const [releases, latest] = await Promise.all([
        prisma.release.count({ where }),
        prisma.release.findFirst({
          where,
          orderBy: { publishedAt: 'desc' },
          select: { slug: true, title: true },
        }),
      ])
      return { ...a, releases, latest }
    }),
  )

  return <FeaturedArtistsRoster artists={roster} total={total} />
}
