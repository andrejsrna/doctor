'use client'

import { useEffect } from 'react'
import { trackReleaseView } from '@/app/utils/analytics'

export default function ReleaseViewTracker({ slug, title }: { slug: string; title?: string }) {
  useEffect(() => {
    trackReleaseView(slug, title)
  }, [slug, title])

  return null
}

