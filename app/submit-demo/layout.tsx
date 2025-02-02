import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Submit Demo | DnB Doctor - Neurofunk Label',
  description: 'Submit your drum and bass demo to DnB Doctor. We\'re always looking for fresh neurofunk talent. Professional review and quick response guaranteed.',
  keywords: 'submit demo, demo submission, drum and bass demos, neurofunk producer, dnb label submission, electronic music demo',
  openGraph: {
    title: 'Submit Your Demo | DnB Doctor',
    description: 'Share your music with us. We review every submission and respond within 5 working days.',
    url: 'https://dnbdoctor.com/submit-demo',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/submitdemo.jpeg',
        width: 1200,
        height: 630,
        alt: 'Submit Demo to DnB Doctor',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Submit Your Demo | DnB Doctor',
    description: 'Looking for a home for your neurofunk tracks? Submit your demo to DnB Doctor today.',
    images: ['https://dnbdoctor.com/submitdemo.jpeg'],
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
    canonical: 'https://dnbdoctor.com/submit-demo',
  },
  // Structured data for better SEO
  other: {
    'music:musician': 'DnB Doctor',
    'music:genre': 'Drum and Bass, Neurofunk',
    'og:type': 'music.radio_station',
  },
  // Schema.org structured data
  verification: {
    other: {
      'schema:Organization': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'DnB Doctor',
        url: 'https://dnbdoctor.com',
        logo: 'https://dnbdoctor.com/logo.png',
        sameAs: [
          'https://soundcloud.com/dnbdoctor',
          'https://www.facebook.com/dnbdoctor',
          // Add other social links
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'demo submission',
          url: 'https://dnbdoctor.com/submit-demo'
        }
      })
    }
  }
}

export default function SubmitDemoLayout({ children }: Props) {
  return children
} 