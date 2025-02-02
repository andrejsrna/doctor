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
    const response = await fetch(
      'https://dnbdoctor.com/wp-json/wp/v2/posts?' + new URLSearchParams({
        slug,
        _embed: '1'
      }),
      { next: { revalidate: 3600 } }
    )
    const data = await response.json()
    const release = data[0]

    const title = release?.title?.rendered || 'Music Release'
    const description = release?.excerpt?.rendered?.replace(/<[^>]*>/g, '') || 'Check out this release on DnB Doctor'
    const releaseUrl = `https://dnbdoctor.com/music/${slug}`
    const imageUrl = release?._embedded?.['wp:featuredmedia']?.[0]?.source_url

    return {
      title: `${title} | DnB Doctor`,
      description,
      openGraph: {
        title: `${title} | DnB Doctor`,
        description,
        url: releaseUrl,
        siteName: 'DnB Doctor',
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
          }
        ] : [],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  } catch (error) {
    console.error('Error fetching release data:', error)
    return {
      title: 'Music Release | DnB Doctor',
      description: 'Check out our latest releases on DnB Doctor.',
    }
  }
}

export default async function MusicLayout({ children }: { children: React.ReactNode }) {
  return children
} 