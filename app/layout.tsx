import type { Metadata } from "next";
import { Share_Tech } from "next/font/google";
import Navigation from "./components/Navigation";
import "./globals.css";
import Footer from './components/Footer'
import './styles/content-wrapper.css'
import CookieConsent from "./components/CookieConsent";

const rajdhani = Share_Tech({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dnbdoctor.com'),
  title: {
    default: 'DnB Doctor | Neurofunk Label',
    template: '%s | DnB Doctor'
  },
  description: 'Your premier destination for high-octane neurofunk and drum & bass music. Discover new releases, artists, and exclusive content.',
  keywords: ['Neurofunk', 'Drum and Bass', 'DnB', 'Electronic Music', 'Record Label', 'Music Label'],
  authors: [{ name: 'DnB Doctor' }],
  creator: 'DnB Doctor',
  publisher: 'DnB Doctor',
  openGraph: {
    type: 'website',
    siteName: 'DnB Doctor',
    title: 'DnB Doctor | Neurofunk Label',
    description: 'Your premier destination for high-octane neurofunk and drum & bass music. Discover new releases, artists, and exclusive content.',
    url: 'https://dnbdoctor.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'DnB Doctor - Neurofunk Label',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DnB Doctor | Neurofunk Label',
    description: 'Your premier destination for high-octane neurofunk and drum & bass music.',
    images: ['/og-image.jpg'],
    creator: '@dnbdoctor',
    site: '@dnbdoctor',
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
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: 'https://dnbdoctor.com',
  },
  other: {
    'schema:graph': [

    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${rajdhani.variable} antialiased bg-black text-white min-h-screen`}
      >
        <Navigation />
        {children}
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
