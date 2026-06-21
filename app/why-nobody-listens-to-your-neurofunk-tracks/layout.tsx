import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Redirecting…',
  robots: { index: false, follow: true },
  alternates: {
    canonical: 'https://dnbdoctor.com/news/why-nobody-listens-to-your-neurofunk-tracks',
  },
}

export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return children
}
