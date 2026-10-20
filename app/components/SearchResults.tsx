'use client'

import Image from 'next/image'
import Link from 'next/link'
import { shortDate } from '@/app/utils/shortDate'
import type { SearchGroups, SearchHit } from '../lib/catalog-search'
import styles from './search.module.css'

const GROUPS: { key: keyof SearchGroups; label: string }[] = [
  { key: 'artists', label: 'Artists' },
  { key: 'releases', label: 'Releases' },
  { key: 'news', label: 'News & mixes' },
]

/** Grouped result list. `active` is an index into the flattened artists → releases → news order. */
export default function SearchResults({
  groups,
  active = -1,
  onPick,
  onHover,
  idPrefix = 'sr',
}: {
  groups: SearchGroups
  active?: number
  onPick?: () => void
  onHover?: (index: number) => void
  idPrefix?: string
}) {
  let n = -1
  return (
    <div className={styles.groups}>
      {GROUPS.map(({ key, label }) =>
        groups[key].length ? (
          <section key={key} className={styles.group} aria-label={label}>
            <h3 className={styles.groupHead}>
              {label} <span>{groups[key].length}</span>
            </h3>
            <ul role="listbox" aria-label={label}>
              {groups[key].map((hit) => {
                n += 1
                const i = n
                return (
                  <li key={hit.href} role="option" aria-selected={i === active} id={`${idPrefix}-${i}`}>
                    <Hit hit={hit} active={i === active} onPick={onPick} onHover={() => onHover?.(i)} />
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null,
      )}
    </div>
  )
}

function Hit({ hit, active, onPick, onHover }: { hit: SearchHit; active: boolean; onPick?: () => void; onHover: () => void }) {
  return (
    <Link href={hit.href} className={styles.hit} data-active={active || undefined} data-kind={hit.kind} onClick={onPick} onMouseEnter={onHover}>
      <span className={styles.thumb}>
        {hit.image ? (
          <Image src={hit.image} alt="" width={112} height={112} sizes="56px" />
        ) : (
          <span aria-hidden="true">{hit.title.slice(0, 1)}</span>
        )}
      </span>
      <span className={styles.meta}>
        {hit.sub && <span className={styles.sub}>{hit.sub}</span>}
        <span className={styles.title}>{hit.title}</span>
      </span>
      <span className={styles.tags}>
        <span className={styles.tag}>{hit.tag}</span>
        {hit.date && <span className={styles.date}>{shortDate(hit.date, { day: false })}</span>}
      </span>
      <span className={styles.go} aria-hidden="true">
        →
      </span>
    </Link>
  )
}
