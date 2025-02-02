import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Privacy Policy | DnB Doctor',
  description: 'Learn how DnB Doctor collects, uses, and protects your personal information. Our privacy policy explains your rights and our data protection practices.',
  keywords: 'privacy policy, data protection, personal information, dnb doctor privacy, gdpr compliance, cookie policy',
  openGraph: {
    title: 'Privacy Policy | DnB Doctor',
    description: 'Understanding how we protect your privacy and handle your personal information at DnB Doctor.',
    url: 'https://dnbdoctor.com/privacy-policy',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/privacy-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor Privacy Policy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | DnB Doctor',
    description: 'Learn about our privacy practices and data protection measures.',
    images: ['https://dnbdoctor.com/privacy-banner.jpg'],
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
    canonical: 'https://dnbdoctor.com/privacy-policy',
  },
  // Schema.org structured data for privacy policy page
  verification: {
    other: {
      'schema:WebPage': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'DnB Doctor Privacy Policy',
        description: 'Privacy policy and data protection information for DnB Doctor users.',
        publisher: {
          '@type': 'Organization',
          name: 'DnB Doctor',
          url: 'https://dnbdoctor.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://dnbdoctor.com/logo.png'
          }
        },
        mainEntity: {
          '@type': 'WebPageElement',
          about: {
            '@type': 'Thing',
            name: 'Privacy Policy',
            description: 'Information about data collection and protection practices'
          },
          text: 'This privacy policy explains how we collect and protect your personal information',
          dateModified: new Date().toISOString(),
          isAccessibleForFree: true
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
              name: 'Privacy Policy',
              item: 'https://dnbdoctor.com/privacy-policy'
            }
          ]
        },
        specialty: 'Data Protection',
        audience: {
          '@type': 'Audience',
          audienceType: 'Website Users'
        },
        significantLink: [
          {
            '@type': 'LinkRole',
            url: 'https://dnbdoctor.com/terms',
            linkRelationship: 'terms of service'
          },
          {
            '@type': 'LinkRole',
            url: 'mailto:privacy@dnbdoctor.com',
            linkRelationship: 'contact'
          }
        ]
      })
    }
  }
}

export default function PrivacyPolicyLayout({ children }: Props) {
  return children
} 