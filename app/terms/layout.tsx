import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Terms & Conditions | DnB Doctor',
  description: 'Read our terms and conditions. Learn about our policies regarding demo submissions, intellectual property, content usage, and user responsibilities at DnB Doctor.',
  keywords: 'terms and conditions, legal terms, dnb doctor terms, music label terms, demo submission terms, copyright policy',
  openGraph: {
    title: 'Terms & Conditions | DnB Doctor',
    description: 'Important information about using DnB Doctor&apos;s services, including demo submissions, intellectual property rights, and user responsibilities.',
    url: 'https://dnbdoctor.com/terms',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/terms-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor Terms & Conditions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | DnB Doctor',
    description: 'Read our terms of service and legal information.',
    images: ['https://dnbdoctor.com/terms-banner.jpg'],
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
    canonical: 'https://dnbdoctor.com/terms',
  },
  // Schema.org structured data for legal document
  verification: {
    other: {
      'schema:WebPage': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'Terms & Conditions',
        description: 'Legal terms and conditions for using DnB Doctor services.',
        publisher: {
          '@type': 'Organization',
          name: 'DnB Doctor',
          url: 'https://dnbdoctor.com'
        },
        dateModified: new Date().toISOString(),
        isAccessibleForFree: true,
        about: {
          '@type': 'Thing',
          name: 'Terms of Service',
          description: 'Legal agreement between DnB Doctor and its users.'
        }
      })
    }
  }
}

export default function TermsLayout({ children }: Props) {
  return children
} 