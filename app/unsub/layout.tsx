import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Unsubscribe | DnB Doctor Newsletter',
  description: 'Unsubscribe from DnB Doctor newsletter. Manage your email preferences and subscription settings.',
  keywords: 'unsubscribe, email preferences, newsletter settings, dnb doctor newsletter, email management',
  openGraph: {
    title: 'Unsubscribe from DnB Doctor Newsletter',
    description: 'Manage your email subscription preferences for DnB Doctor newsletter.',
    url: 'https://dnbdoctor.com/unsub',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/newsletter.jpeg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor Newsletter Management',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unsubscribe from DnB Doctor Newsletter',
    description: 'Manage your email subscription preferences.',
    images: ['https://dnbdoctor.com/newsletter.jpeg'],
  },
  robots: {
    index: false, // Don't index unsubscribe page
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  alternates: {
    canonical: 'https://dnbdoctor.com/unsub',
  },
  // Schema.org structured data
  verification: {
    other: {
      'schema:WebPage': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Newsletter Unsubscribe',
        description: 'Unsubscribe from DnB Doctor newsletter.',
        publisher: {
          '@type': 'Organization',
          name: 'DnB Doctor',
          url: 'https://dnbdoctor.com'
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://dnbdoctor.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Unsubscribe',
              item: 'https://dnbdoctor.com/unsub'
            }
          ]
        }
      })
    }
  }
}

export default function UnsubLayout({ children }: Props) {
  return children
} 