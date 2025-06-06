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
      'https://admin.dnbdoctor.com/wp-json/wp/v2/posts?' + new URLSearchParams({
        slug,
        _embed: '1'
      }),
      { next: { revalidate: 3600 } }
    )
    const data = await response.json()
    const release = data[0]

    // Helper function to decode HTML entities
    const decodeHtmlEntities = (text: string) => {
      const namedEntities: { [key: string]: string } = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&apos;': "'",
        '&nbsp;': ' ',
        '&mdash;': '—',
        '&ndash;': '–',
        '&hellip;': '…',
        '&copy;': '©',
        '&reg;': '®',
        '&trade;': '™'
      }
      
      return text
        // Handle named entities
        .replace(/&[a-zA-Z]+;/g, (entity) => namedEntities[entity] || entity)
        // Handle numeric entities like &#8211;
        .replace(/&#(\d+);/g, (match, num) => String.fromCharCode(parseInt(num, 10)))
        // Handle hex entities like &#x2013;
        .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    }
    
    const rawTitle = release?.title?.rendered || 'Music Release'
    const title = decodeHtmlEntities(rawTitle)
    
    const rawDescription = release?.excerpt?.rendered?.replace(/<[^>]*>/g, '') || 'Check out this release on DnB Doctor'
    const description = decodeHtmlEntities(rawDescription)
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