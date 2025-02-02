import type { Metadata } from 'next'
import AboutContent from './components/AboutContent'

export const metadata: Metadata = {
  title: 'About DnB Doctor | Neurofunk Label',
  description: 'DnB Doctor is your premier destination for drum and bass music, connecting artists with fans and providing a platform for the best electronic music.',
  keywords: 'dnb doctor, drum and bass, neurofunk, electronic music, music label',
  openGraph: {
    title: 'About DNB Doctor | Neurofunk Label',
    description: 'Your premier destination for drum and bass music, connecting artists with fans and providing a platform for the best electronic music.',
    url: 'https://dnbdoctor.com/about',
    siteName: 'DNB Doctor',
    images: [
      {
        url: 'https://dnbdoctor.com/aboutus.jpg', // Upravte podľa vašej skutočnej URL
        width: 1200,
        height: 630,
        alt: 'DNB Doctor - Neurofunk Label',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About DnB Doctor | Neurofunk Label',
    description: 'Your premier destination for drum and bass music and culture.',
    images: ['https://dnbdoctor.com/aboutus.jpg'], // Upravte podľa vašej skutočnej URL
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
  verification: {
    google: 'your-google-verification-code', // Ak máte Google verification code
  },
}

export default function AboutPage() {
  return <AboutContent />
}