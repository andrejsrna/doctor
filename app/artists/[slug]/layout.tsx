import { Metadata } from 'next'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: LayoutProps
): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ''}/api/artists/${slug}`, { next: { revalidate: 3600 } })
    const data = await res.json()
    const artist = data?.item
    const formattedName = artist?.name || slug
    const artistUrl = `https://dnbdoctor.com/artists/${slug}`
    const coverImage = artist?.imageUrl || `https://dnbdoctor.com/artists/${slug}/cover.jpg`

    return {
      title: `${formattedName} | DnB Doctor Artist`,
      description: `Check out ${formattedName}'s latest releases and mixes on DnB Doctor.`,
      openGraph: {
        title: `${formattedName} | DnB Doctor Artist`,
        description: `Check out ${formattedName}'s latest releases and mixes on DnB Doctor.`,
        url: artistUrl,
        siteName: 'DnB Doctor',
        images: [{
          url: coverImage,
          width: 1200,
          height: 630,
        }],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    console.error('Error fetching artist data:', error)
    return {
      title: 'Artist | DnB Doctor',
      description: 'Check out our artists on DnB Doctor.',
    }
  }
}

export default async function ArtistLayout({ children }: { children: React.ReactNode }) {
  return children
} 