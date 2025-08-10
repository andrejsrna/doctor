import { prisma } from '../lib/prisma'

function deriveArtistNameFromTitle(title: string): string | null {
  if (!title) return null
  const parts = title.split('-')
  if (parts.length > 1) return parts[0].trim()
  const firstWord = title.split(' ')[0]?.trim()
  return firstWord || null
}

async function main() {
  const releases = await prisma.release.findMany({ select: { id: true, title: true, artistName: true } })
  let updated = 0
  for (const r of releases) {
    if (r.artistName && r.artistName.trim().length > 0) continue
    const derived = deriveArtistNameFromTitle(r.title)
    if (!derived) continue
    await prisma.release.update({ where: { id: r.id }, data: { artistName: derived } })
    updated++
  }
  console.log(`Backfill complete. Updated ${updated} releases.`)
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1) })


