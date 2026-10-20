'use client'

import { trackEvent } from '@/app/utils/analytics'

/** External Bandcamp link that reports which CTA on the page was used. */
export default function BandcampLink({ href, className, place, children }: { href: string; className?: string; place: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent('promotion_click', { promotion_type: 'bulk_sale', content_type: 'bandcamp', content_name: `Bulk Sale — ${place}` })}
    >
      {children}
    </a>
  )
}
