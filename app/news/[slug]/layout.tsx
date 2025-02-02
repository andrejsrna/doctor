import { Metadata } from 'next'

interface LayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

async function getPostData(slug: string) {
  try {
    const response = await fetch(
      `https://admin.dnbdoctor.com/wp-json/wp/v2/news?slug=${slug}&_embed`,
      { next: { revalidate: 3600 } }
    )
    const posts = await response.json()
    return posts[0] || null
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export async function generateMetadata(
  { params }: LayoutProps
): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostData(slug)
  
  if (!post) {
    return {
      title: 'News | DnB Doctor',
      description: 'Latest news from DnB Doctor',
    }
  }

  const title = post.title.rendered
  const description = post.excerpt?.rendered?.replace(/<[^>]+>/g, '') || 
    'Read the latest news from DnB Doctor'
  const newsUrl = `https://dnbdoctor.com/news/${slug}`
  const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const datePublished = post.date
  const dateModified = post.modified

  return {
    title: `${title} | DnB Doctor News`,
    description,
    openGraph: {
      title,
      description,
      url: newsUrl,
      siteName: 'DnB Doctor',
      images: [
        {
          url: imageUrl || '/default-news.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: newsUrl,
    },
    other: {
      'og:article:published_time': datePublished,
      'og:article:modified_time': dateModified,
      'og:article:author': 'DnB Doctor',
      'og:article:section': 'Music News',
      'article:publisher': 'https://dnbdoctor.com',
      'article:published_time': datePublished,
      'article:modified_time': dateModified,
      'schema:graph': [
      ]
    }
  }
}

export default async function NewsLayout({ children }: { children: React.ReactNode }) {
  return children
} 