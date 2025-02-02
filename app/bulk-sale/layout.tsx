import type { Metadata } from 'next'

interface Props {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Bulk Sale | DnB Doctor - Special Discography Offer',
  description: 'Get our entire drum and bass discography with a permanent 35% discount. Download high-quality neurofunk tracks from DnB Doctor.',
  keywords: 'dnb bulk sale, drum and bass discography, neurofunk collection, dnb doctor music, electronic music sale',
  openGraph: {
    title: 'Bulk Sale | DnB Doctor - 35% Off Entire Discography',
    description: 'Special offer: Get our complete drum and bass collection with a permanent 35% discount. High-quality neurofunk tracks from DnB Doctor.',
    url: 'https://dnbdoctor.com/bulk-sale',
    siteName: 'DnB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/bulk-sale-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor Bulk Sale - 35% Off',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DnB Doctor Bulk Sale - 35% Off Entire Discography',
    description: 'Get our complete drum and bass collection with a permanent discount.',
    images: ['https://dnbdoctor.com/bulk-sale-banner.jpg'],
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
    canonical: 'https://dnbdoctor.com/bulk-sale',
  },
  // Structured data for better SEO
  other: {
    'og:priceAmount': '35',
    'og:priceCurrency': 'OFF',
    'og:availability': 'in_stock',
  },
}

export default function BulkSaleLayout({ children }: Props) {
  return children
} 