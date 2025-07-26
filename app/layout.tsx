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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Safer console override for Firefox compatibility
                if (typeof window === 'undefined' || typeof console === 'undefined') return;
                
                let errorCount = 0;
                const MAX_ERRORS = 100; // Prevent memory buildup
                
                const originalError = console.error;
                const originalWarn = console.warn;
                
                const shouldSuppressError = (message) => {
                  return message.includes('cloudflareinsights.com') ||
                         message.includes('beacon.min.js') ||
                         (message.includes('integrity') && message.includes('cloudflare')) ||
                         (message.includes('CORS') && message.includes('cloudflare')) ||
                         message.includes('fbevents.js') ||
                         message.includes('connect.facebook.net') ||
                         message.includes('Unexpected value undefined parsing r attribute') ||
                         message.includes('AudioContext was prevented from starting automatically') ||
                         message.includes('Content-Security-Policy') ||
                         message.includes('Cookie "_fbp" has been rejected') ||
                         message.includes('NetworkError when attempting to fetch resource') ||
                         message.includes('admin.dnbdoctor.com') ||
                         message.includes('was not used within a few seconds') ||
                         message.includes('preloaded with link preload');
                };
                
                const shouldSuppressWarn = (message) => {
                  return message.includes('Feature Policy') ||
                         message.includes('clipboard-write') ||
                         message.includes('Layout was forced before the page was fully loaded') ||
                         message.includes('Skipping unsupported feature name');
                };
                
                console.error = function() {
                  if (errorCount++ > MAX_ERRORS) {
                    console.error = originalError;
                    return originalError.apply(console, arguments);
                  }
                  
                  const message = Array.from(arguments).join(' ');
                  if (!shouldSuppressError(message)) {
                    originalError.apply(console, arguments);
                  }
                };
                
                console.warn = function() {
                  const message = Array.from(arguments).join(' ');
                  if (!shouldSuppressWarn(message)) {
                    originalWarn.apply(console, arguments);
                  }
                };
                
                // Cleanup after 30 seconds to prevent memory leaks
                setTimeout(() => {
                  console.error = originalError;
                  console.warn = originalWarn;
                }, 30000);
              })();
            `
          }}
        />
      </head>
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
