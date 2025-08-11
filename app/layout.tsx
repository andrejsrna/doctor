import type { Metadata } from "next";
import { Share_Tech } from "next/font/google";
import Navigation from "./components/Navigation";
import Footer from './components/Footer'
import CookieConsent from "./components/CookieConsent";
import './globals.css';
import './styles/content-wrapper.css';
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import { PostHogProvider } from "./components/PostHogProvider";
import { Toaster } from 'react-hot-toast';
import GlobalErrorReporter from './components/GlobalErrorReporter'

const rajdhani = Share_Tech({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
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
    'schema:graph': [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://admin.dnbdoctor.com" />
        
        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="https://admin.dnbdoctor.com" />
        
        {/* Google Analytics moved to body via next/script */}
        
        {/* Critical CSS - inline for performance */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for above-the-fold content */
            * { box-sizing: border-box; }
            html { scroll-behavior: smooth; }
            body { 
              margin: 0; padding: 0; 
              font-family: var(--font-rajdhani), system-ui, -apple-system, sans-serif;
              background-color: #000; color: #fff; line-height: 1.6;
              -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
            }
            .min-h-screen { min-height: 100vh; }
            .relative { position: relative; }
            .absolute { position: absolute; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .text-center { text-align: center; }
            .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
            .text-5xl { font-size: 3rem; line-height: 1; }
            .text-6xl { font-size: 3.75rem; line-height: 1; }
            .font-bold { font-weight: 700; }
            .text-purple-500 { color: #a855f7; }
            .text-white { color: #ffffff; }
            .text-gray-300 { color: #d1d5db; }
            .text-gray-400 { color: #9ca3af; }
            .bg-black { background-color: #000000; }
            .bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)); }
            .from-black { --tw-gradient-from: #000000; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(0, 0, 0, 0)); }
            .via-purple-900\\/10 { --tw-gradient-stops: var(--tw-gradient-from), rgba(88, 28, 135, 0.1), var(--tw-gradient-to, rgba(88, 28, 135, 0.1)); }
            .to-black { --tw-gradient-to: #000000; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .py-20 { padding-top: 5rem; padding-bottom: 5rem; }
            .py-32 { padding-top: 8rem; padding-bottom: 8rem; }
            .mb-8 { margin-bottom: 2rem; }
            .mb-12 { margin-bottom: 3rem; }
            .mb-16 { margin-bottom: 4rem; }
            .max-w-7xl { max-width: 80rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .object-cover { object-fit: cover; }
            .object-contain { object-fit: contain; }
            .animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .5; } }
            @media (min-width: 768px) { .md\\:text-5xl { font-size: 3rem; line-height: 1; } .md\\:text-6xl { font-size: 3.75rem; line-height: 1; } }
            @media (min-width: 1024px) { .lg\\:text-5xl { font-size: 3rem; line-height: 1; } .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; } }
          `
        }} />
        
        {process.env.NODE_ENV === 'development' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  if (typeof window === 'undefined' || typeof console === 'undefined') return;
                  let errorCount = 0;
                  const MAX_ERRORS = 100;
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
                           message.includes('preloaded with link preload') ||
                           message.includes('seek failed') ||
                           message.includes('volume setting failed');
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
                  setTimeout(() => {
                    console.error = originalError;
                    console.warn = originalWarn;
                  }, 30000);
                })();
              `
            }}
          />
        )}
      </head>
      <body
        className={`${rajdhani.variable} antialiased bg-black text-white min-h-screen`}
      >
        <PostHogProvider>
          <SessionProviderWrapper>
            <GlobalErrorReporter />
            <Navigation />
            {children}
            <Footer />
            <CookieConsent />
            <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          </SessionProviderWrapper>
        </PostHogProvider>
      </body>
    </html>
  );
}