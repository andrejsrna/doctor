import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'News | DnB Doctor - Latest Updates & Announcements',
  description: 'Stay up to date with the latest news, releases, and announcements from DnB Doctor. Get insights into neurofunk and drum & bass music scene.',
  keywords: 'dnb news, neurofunk updates, drum and bass announcements, electronic music news, dnb doctor blog, music label news',
  openGraph: {
    title: 'Latest News | DnB Doctor',
    description: 'Latest updates from the world of neurofunk and drum & bass. News, releases, and announcements from DnB Doctor.',
    url: 'https://dnbdoctor.com/news',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/news-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor News & Updates',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Latest News | DnB Doctor',
    description: 'Stay updated with the latest from DnB Doctor.',
    images: ['https://dnbdoctor.com/news-banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://dnbdoctor.com/news',
  },
  // Schema.org structured data for blog listing
  verification: {
    other: {
      'schema:Blog': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: 'DnB Doctor News',
        description: 'Latest news and updates from DnB Doctor music label.',
        publisher: {
          '@type': 'Organization',
          name: 'DnB Doctor',
          url: 'https://dnbdoctor.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://dnbdoctor.com/logo.png'
          }
        },
        inLanguage: 'en',
        copyrightYear: new Date().getFullYear(),
        genre: 'Music News',
        about: {
          '@type': 'Thing',
          name: 'Electronic Music',
          description: 'News and updates about neurofunk and drum & bass music'
        },
        audience: {
          '@type': 'Audience',
          audienceType: 'Electronic Music Enthusiasts'
        },
        isPartOf: {
          '@type': 'WebSite',
          name: 'DnB Doctor',
          url: 'https://dnbdoctor.com'
        },
        potentialAction: {
          '@type': 'ReadAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://dnbdoctor.com/news/{slug}'
          }
        }
      })
    }
  }
}

export default function NewsLayout({ children }: Props) {
  return children
} 