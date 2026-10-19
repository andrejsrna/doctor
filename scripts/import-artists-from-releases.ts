/**
 * One-off: create Artist rows for every act credited in release titles and
 * normalise Release.artistName to the full credit ("A & B", "A ft. B").
 *
 *   npx tsx --env-file=.env --tsconfig tsconfig.json scripts/import-artists-from-releases.ts          # dry run
 *   npx tsx --env-file=.env --tsconfig tsconfig.json scripts/import-artists-from-releases.ts --apply  # write
 */
import { prisma } from '@/lib/prisma'
import { plainTitle } from '@/app/components/hero/releaseMeta'

const APPLY = process.argv.includes('--apply')

/** Compilations / packs: no artist to extract from the title. */
const SKIP = new Set(['REVENANT', 'VA - Black Signal', 'VORTEX: Neurofunk Pressure', 'DnB Doctor Showcase', 'Hotbox EP'])
/** Releases whose credit can't be read from a "Artist - Title" split. */
const CREDIT_OVERRIDE: Record<string, string | null> = {
  'Chemical Chronicles 2024': null,
  'Yehor X-Mass Free Neurofunk Sample Pack': 'Yehor',
  'Yehor Sample Pack': 'Yehor',
}
/** Spelling variants across releases → one canonical name. */
const CANON: Record<string, string> = { illfated: 'Ill-Fated', led: 'LED' }

const key = (n: string) => n.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
const slugify = (n: string) =>
  n.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ø/gi, 'o').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const clean = (n: string) => n.trim().replace(/,$/, '').replace(/\s*\((UK|X3A)\)$/, '').trim()

function parse(title: string) {
  const m = title.match(/^(.+?)\s+[-–—]\s+(.+)$/)
  if (!m) return null
  const [, credit, track] = m
  const [main, ...feats] = credit.split(/\s+(?:feat\.|ft\.)\s+/i)
  const names = [
    ...main.split(/\s*(?:&|,|\bx\b)\s*/),
    ...feats.flatMap((f) => f.split(/\s*(?:&|,)\s*/)),
    ...[...track.matchAll(/\(([^()]+?)\s+(?:VIP\s+)?Remix\)/gi)].map((r) => r[1]),
  ]
    .map(clean)
    .filter(Boolean)
  return { credit: credit.trim(), names }
}

;(async () => {
  const releases = await prisma.release.findMany({ select: { id: true, title: true, artistName: true } })
  const existing = await prisma.artist.findMany({ select: { name: true, slug: true } })
  const known = new Set(existing.map((a) => key(a.name)))
  const slugs = new Set(existing.map((a) => a.slug))

  const toCreate = new Map<string, string>()
  const nameUpdates: { id: string; from: string | null; to: string | null }[] = []

  for (const r of releases) {
    const t = plainTitle(r.title)
    let credit: string | null | undefined
    if (t in CREDIT_OVERRIDE) credit = CREDIT_OVERRIDE[t]
    else if (!SKIP.has(t)) {
      const p = parse(t)
      if (!p) {
        console.log('  ? no artist in title:', t)
        continue
      }
      credit = p.credit
      for (const n of p.names) {
        const k = key(n)
        if (!known.has(k) && !toCreate.has(k)) toCreate.set(k, CANON[k] ?? n)
      }
    }
    if (credit !== undefined && credit !== r.artistName) nameUpdates.push({ id: r.id, from: r.artistName, to: credit })
  }

  const rows = [...toCreate.values()].map((name) => {
    let slug = slugify(name)
    if (slugs.has(slug)) slug = `${slug}-artist`
    slugs.add(slug)
    return { name, slug }
  })

  console.log(`\nArtists to create: ${rows.length}`)
  for (const r of rows) console.log(`  + ${r.name}  /artists/${r.slug}`)
  console.log(`\nRelease.artistName updates: ${nameUpdates.length}`)
  for (const u of nameUpdates) console.log(`  ~ ${JSON.stringify(u.from)} → ${JSON.stringify(u.to)}`)

  if (!APPLY) {
    console.log('\nDry run. Re-run with --apply to write.')
    process.exit(0)
  }

  await prisma.$transaction([
    prisma.artist.createMany({ data: rows, skipDuplicates: true }),
    ...nameUpdates.map((u) => prisma.release.update({ where: { id: u.id }, data: { artistName: u.to } })),
  ])
  console.log('\nApplied. Artists now:', await prisma.artist.count())
  process.exit(0)
})()
