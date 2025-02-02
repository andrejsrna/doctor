import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Contact Us | DnB Doctor - Neurofunk Label',
  description: 'Get in touch with DnB Doctor. Contact us for collaborations, demo submissions, or any questions about our neurofunk releases and services.',
  keywords: 'contact dnb doctor, music label contact, neurofunk collaboration, demo submission contact, electronic music inquiries',
  openGraph: {
    title: 'Contact DnB Doctor | Neurofunk Label',
    description: 'Reach out to us for collaborations, questions, or business inquiries. We\'re here to help!',
    url: 'https://dnbdoctor.com/contact',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/contact-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact DnB Doctor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact DnB Doctor | Neurofunk Label',
    description: 'Get in touch with us for any inquiries or collaborations.',
    images: ['https://dnbdoctor.com/contact-banner.jpg'],
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
    canonical: 'https://dnbdoctor.com/contact',
  },
  // Schema.org structured data for contact page
  verification: {
    other: {
      'schema:ContactPage': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact DnB Doctor',
        description: 'Contact page for DnB Doctor music label.',
        publisher: {
          '@type': 'Organization',
          name: 'DnB Doctor',
          url: 'https://dnbdoctor.com',
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '',
            email: 'info@dnbdoctor.com',
            contactType: 'customer service',
            availableLanguage: ['English'],
            areaServed: 'Worldwide'
          },
          sameAs: [
            'https://www.facebook.com/dnbdoctor',
            'https://www.instagram.com/dnbdoctor/',
            // Add other social links
          ]
        },
        mainEntity: {
          '@type': 'Organization',
          name: 'DnB Doctor',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'SK'
          },
          openingHours: ['Mo-Fr 09:00-17:00'],
          availableLanguage: ['English', 'Slovak']
        }
      })
    }
  }
}

export default function ContactLayout({ children }: Props) {
  return children
} 