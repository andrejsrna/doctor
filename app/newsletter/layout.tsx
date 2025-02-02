import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Newsletter | DnB Doctor - Stay Updated',
  description: 'Subscribe to DnB Doctor newsletter and stay up to date with our latest releases, exclusive content, and special announcements in the world of neurofunk and drum & bass.',
  keywords: 'dnb newsletter, neurofunk updates, drum and bass news, electronic music newsletter, dnb doctor subscription',
  openGraph: {
    title: 'Subscribe to DnB Doctor Newsletter',
    description: 'Get the latest neurofunk and drum & bass updates directly to your inbox. Exclusive content and special announcements from DnB Doctor.',
    url: 'https://dnbdoctor.com/newsletter',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/newsletter.jpeg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor Newsletter Subscription',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Join DnB Doctor Newsletter',
    description: 'Subscribe for exclusive updates and content from DnB Doctor.',
    images: ['https://dnbdoctor.com/newsletter.jpeg'],
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
    canonical: 'https://dnbdoctor.com/newsletter',
  },
  // Schema.org structured data for newsletter subscription page
  verification: {
    other: {
      'schema:WebPage': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'DnB Doctor Newsletter Subscription',
        description: 'Subscribe to DnB Doctor newsletter for latest updates and exclusive content.',
        publisher: {
          '@type': 'Organization',
          name: 'DnB Doctor',
          url: 'https://dnbdoctor.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://dnbdoctor.com/logo.png'
          }
        },
        potentialAction: {
          '@type': 'SubscribeAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://dnbdoctor.com/newsletter',
            actionPlatform: [
              'http://schema.org/DesktopWebPlatform',
              'http://schema.org/MobileWebPlatform'
            ]
          },
          result: {
            '@type': 'Thing',
            name: 'NewsletterSubscription',
            description: 'Regular updates about neurofunk and drum & bass music'
          }
        },
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          description: 'Free newsletter subscription'
        },
        mainEntity: {
          '@type': 'SubscribeAction',
          description: 'Subscribe to our newsletter for exclusive content and updates',
          object: {
            '@type': 'Product',
            name: 'DnB Doctor Newsletter',
            description: 'Regular updates about neurofunk and drum & bass music',
            category: 'Digital Content',
            isAccessibleForFree: true
          }
        }
      })
    }
  }
}

export default function NewsletterLayout({ children }: Props) {
  return children
} 