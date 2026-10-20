import type { Metadata } from 'next'
import { Suspense } from 'react'
import { displayFont, monoFont } from '@/app/components/brandFonts'
import styles from '@/app/components/search.module.css'
import SearchPageClient from './SearchPageClient'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search DnB Doctor artists, neurofunk releases, DJ mixes and news.',
  alternates: { canonical: 'https://dnbdoctor.com/search' },
  // result pages are thin/duplicate content — keep them out of the index, still follow links
  robots: { index: false, follow: true },
}

export default function SearchPage() {
  return (
    <div className={`${styles.page} ${displayFont.variable} ${monoFont.variable}`}>
      <div className={styles.pageInner}>
        <h1 className={styles.pageTitle}>
          Search <span>the lab.</span>
        </h1>
        <Suspense fallback={null}>
          <SearchPageClient />
        </Suspense>
      </div>
    </div>
  )
}
