import { prisma } from '@/lib/prisma'
import ArtistDetailClient, { ArtistDetail } from './ArtistDetailClient'

interface PageProps { params: Promise<{ slug: string }> }

export const revalidate = 300

export default async function ArtistPage({ params }: PageProps) {
  const { slug } = await params
  const item = await prisma.artist.findUnique({ where: { slug } })
  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">Artist not found</div>
      </div>
    )
  }
  const artist: ArtistDetail = {
    id: item.id,
    slug: item.slug,
    name: item.name,
    bio: item.bio,
    imageUrl: item.imageUrl || undefined,
    soundcloud: item.soundcloud || undefined,
    spotify: item.spotify || undefined,
    facebook: item.facebook || undefined,
    instagram: item.instagram || undefined,
  }
  return <ArtistDetailClient artist={artist} />
}