import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { sanitizeHtml } from '@/app/utils/sanitize'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: LayoutProps
): Promise<Metadata> {
  const { slug } = await params
  
  try {
    const release = await prisma.release.findUnique({ where: { slug } })

    const rawTitle = release?.title || 'Music Release'
    const title = sanitizeHtml(rawTitle).replace(/<[^>]+>/g, '')
    const rawDescription = release?.content?.slice(0, 160) || 'Check out this release on DnB Doctor'
    const description = sanitizeHtml(rawDescription).replace(/<[^>]+>/g, '')
    const releaseUrl = `https://dnbdoctor.com/music/${slug}`
    const imageUrl = release?.coverImageUrl || undefined

    return {
      title: `${title} | DnB Doctor`,
      description,
      alternates: { canonical: releaseUrl },
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
        audio: release?.previewUrl ? [{ url: release.previewUrl }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${title} | DnB Doctor`,
        description,
        images: imageUrl ? [imageUrl] : [],
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