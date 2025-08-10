import { prisma } from '@/lib/prisma'
import ArtistsListClient from './ArtistsListClient'

export const revalidate = 600

export default async function ArtistsPage() {
  const artists = await prisma.artist.findMany({
    orderBy: { createdAt: 'desc' },
    take: 60,
    select: {
      id: true,
      slug: true,
      name: true,
      imageUrl: true,
      soundcloud: true,
      spotify: true,
    },
  })

  return (
    <section className="py-32 px-4 relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
      <div className="max-w-7xl mx-auto relative z-10">
        <ArtistsListClient artists={artists} />
      </div>
    </section>
  )
}