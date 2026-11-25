/**
 * Sells WAV masters dropped into an inbox folder:
 *   <inbox>/Artist - Track.wav              → single release  → one TRACK product (€1.50)
 *   <inbox>/<Release title>/01 Track.wav    → EP / album / pack → one RELEASE bundle ZIP only (tracks are never sold separately)
 *
 * Every WAV is tagged first (title, artist, album, year, track n/N, label, URL, embedded cover) with the
 * `tag_wav.py` helper from the dnb-doctor-site skill; the audio data is not touched.
 * Matches only releases that have no active product yet. Hidden / still-uploading files (".name.xyz") are skipped.
 * Processed sources move to <inbox>/_hotovo/.
 *
 *   npx tsx --env-file=.env --tsconfig tsconfig.json scripts/shop-import-inbox.ts "<inbox>"            # dry run
 *   npx tsx --env-file=.env --tsconfig tsconfig.json scripts/shop-import-inbox.ts "<inbox>" --apply    # tag, upload, create products
 *   --price <slug>=<cents>   price for an album / music pack bundle (EP bundles default to 300)
 */
import { randomUUID } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync } from 'node:fs'
import path from 'node:path'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { prisma } from '../lib/prisma'

const args = process.argv.slice(2)
const APPLY = args.includes('--apply')
const INBOX = args.find((a) => !a.startsWith('--') && !/^[a-z0-9-]+=\d+$/.test(a))
const PRICES = new Map(args.filter((a) => /^[a-z0-9-]+=\d+$/.test(a)).map((a) => a.split('=') as [string, string]).map(([s, c]) => [s, Number(c)]))
if (!INBOX || !existsSync(INBOX)) throw new Error('usage: shop-import-inbox.ts "<inbox dir>" [--apply] [slug=cents ...]')

const TRACK_CENTS = 150
const EP_CENTS = 300
const PY = '/root/.hermes/cache/wavtag-venv/bin/python'
const TAGGER = '/root/.hermes/skills/devops/dnb-doctor-site/scripts/tag_wav.py'
const COVER = path.resolve('backups/wav-tagging/dnb-doctor-logo-src.png')
const SITE = 'https://dnbdoctor.com'

const s3 = new S3Client({ region: 'auto', endpoint: process.env.R2_ENDPOINT, forcePathStyle: true, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! } })
const Bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME!

const clean = (s: string) => s.replace(/&#8211;|&#8212;|–|—/g, '-').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
const safeName = (s: string) => s.replace(/[^\w.\-() &']/g, '').replace(/\s+/g, ' ').trim()
/** Order-insensitive token key: "Asana ft. Yehor – Ratatata" == "Asana & Yehor - Ratatata". */
const key = (s: string) =>
  clean(s).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(ft|feat|featuring|vs|x|and)\b\.?/g, ' ').replace(/\((original mix|master|final)\)/g, ' ')
    .split(/[^a-z0-9]+/).filter(Boolean).sort().join(' ')
const trackPart = (s: string) => clean(s).split(' - ').slice(1).join(' - ') || clean(s)
const artistPart = (s: string) => (clean(s).includes(' - ') ? clean(s).split(' - ')[0] : '')

function wavOk(file: string) {
  try {
    const out = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_name,sample_rate,bits_per_sample:format=duration', '-of', 'json', file]).toString()
    const j = JSON.parse(out)
    const st = j.streams.find((s: { codec_name: string }) => s.codec_name.startsWith('pcm'))
    return st ? `${st.sample_rate / 1000}kHz/${st.bits_per_sample}bit ${Math.round(j.format.duration)}s` : null
  } catch {
    return null
  }
}

async function main() {
  const rels = await prisma.release.findMany({
    where: { products: { none: { active: true } }, NOT: { categories: { has: 'Sample Packs' } } },
    select: { id: true, slug: true, title: true, artistName: true, publishedAt: true, categories: true, releaseType: true },
  })
  const findRelease = (name: string, multi: boolean) => {
    const k = key(name)
    let hits = rels.filter((r) => key(r.title) === k || key(`${r.artistName ?? ''} ${trackPart(r.title)}`) === k)
    // EP folders are often named without "EP" or without the artist.
    if (!hits.length && multi) hits = rels.filter((r) => key(trackPart(r.title)).replace(/\b(ep|lp|album)\b/g, '').trim() === key(trackPart(name)).replace(/\b(ep|lp|album)\b/g, '').trim())
    if (!hits.length && !multi) hits = rels.filter((r) => key(trackPart(r.title)) === key(trackPart(name)))
    return hits
  }

  type Job = { release: (typeof rels)[number]; multi: boolean; files: { src: string; title: string; artist: string }[]; source: string }
  const jobs: Job[] = []
  const problems: string[] = []
  const entries = readdirSync(INBOX!, { withFileTypes: true }).filter((e) => !e.name.startsWith('.') && !e.name.startsWith('_'))

  for (const e of entries) {
    const full = path.join(INBOX!, e.name)
    if (e.isFile()) {
      if (!/\.wav$/i.test(e.name)) { problems.push(`skip (not WAV): ${e.name}`); continue }
      const stem = e.name.replace(/\.wav$/i, '')
      const info = wavOk(full)
      if (!info) { problems.push(`unreadable WAV (still uploading?): ${e.name}`); continue }
      const hits = findRelease(stem, false)
      if (hits.length !== 1) { problems.push(`${hits.length ? 'ambiguous' : 'no release'}: ${e.name}${hits.length ? ' → ' + hits.map((h) => h.slug).join(', ') : ''}`); continue }
      const r = hits[0]
      const multi = r.categories.some((c) => ["EP's", 'Albums', 'Music Packs'].includes(c))
      if (multi) { problems.push(`${e.name} → ${r.slug} is an EP/album/pack: put all its tracks in a folder named after the release`); continue }
      jobs.push({ release: r, multi: false, source: full, files: [{ src: full, title: trackPart(stem), artist: artistPart(stem) || r.artistName || artistPart(r.title) }] })
      console.log(`single  ${e.name.padEnd(52)} ${info.padEnd(22)} → ${r.slug}`)
    } else if (e.isDirectory()) {
      const wavs = readdirSync(full).filter((n) => /\.wav$/i.test(n) && !n.startsWith('.')).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      const partial = readdirSync(full).some((n) => n.startsWith('.'))
      const hits = findRelease(e.name, true)
      if (hits.length !== 1) { problems.push(`${hits.length ? 'ambiguous' : 'no release'} for folder: ${e.name}${hits.length ? ' → ' + hits.map((h) => h.slug).join(', ') : ''}`); continue }
      if (partial || !wavs.length || wavs.some((n) => !wavOk(path.join(full, n)))) { problems.push(`folder still uploading / unreadable WAV: ${e.name}`); continue }
      const r = hits[0]
      const files = wavs.map((n) => {
        const stem = n.replace(/\.wav$/i, '').replace(/^\d{1,2}[\s._-]+/, '')
        return { src: path.join(full, n), title: trackPart(stem), artist: artistPart(stem) || r.artistName || artistPart(r.title) || 'Various Artists' }
      })
      jobs.push({ release: r, multi: true, source: full, files })
      console.log(`bundle  ${e.name.padEnd(52)} ${String(files.length).padEnd(2)} tracks → ${r.slug}`)
      for (const [i, f] of files.entries()) console.log(`          ${i + 1}. ${f.artist} - ${f.title}`)
    }
  }

  for (const p of problems) console.log('!! ' + p)
  if (!APPLY) { console.log(`dry run: ${jobs.length} ready, ${problems.length} problems (pass --apply to write)`); return }

  const tmp = path.join(process.env.TMPDIR || '/tmp', `shop-inbox-${Date.now()}`)
  mkdirSync(tmp, { recursive: true })
  const done = path.join(INBOX!, '_hotovo')
  mkdirSync(done, { recursive: true })
  const put = async (file: string, fileName: string, type: string) => {
    const Key = `shop/products/${randomUUID()}/${fileName.replace(/[^\w.\-()]+/g, '-')}`
    const size = statSync(file).size
    await s3.send(new PutObjectCommand({ Bucket, Key, Body: createReadStream(file), ContentLength: size, ContentType: type }))
    return { Key, size }
  }

  for (const job of jobs) {
    const r = job.release
    const relTitle = clean(r.title)
    const year = r.publishedAt ? String(r.publishedAt.getUTCFullYear()) : undefined
    const url = `${SITE}/music/${r.slug}`
    const price = job.multi ? PRICES.get(r.slug) ?? (r.categories.includes("EP's") ? EP_CENTS : null) : TRACK_CENTS
    if (price == null) { console.log(`!! ${r.slug}: album/pack price needed (pass ${r.slug}=<cents>), skipped`); continue }
    if (await prisma.product.findFirst({ where: { releaseId: r.id, active: true } })) { console.log(`!! ${r.slug} already has an active product, skipped`); continue }

    const tagged: string[] = []
    for (const [i, f] of job.files.entries()) {
      const name = job.multi ? `${String(i + 1).padStart(2, '0')} ${safeName(`${f.artist} - ${f.title}`)}.wav` : `${safeName(`${f.artist} - ${f.title}`)}.wav`
      const out = path.join(tmp, name)
      const tagArgs = [TAGGER, f.src, out, '--title', f.title, '--artist', f.artist, '--album', job.multi ? relTitle.replace(/^.*? - /, '') : f.title,
        '--album-artist', job.multi ? artistPart(relTitle) || f.artist : f.artist, '--url', url, '--cover', COVER]
      if (year) tagArgs.push('--year', year)
      if (job.multi) tagArgs.push('--track', `${i + 1}/${job.files.length}`)
      console.log(execFileSync(PY, tagArgs).toString().trim())
      tagged.push(out)
    }

    let product
    if (!job.multi) {
      const fileName = path.basename(tagged[0])
      const { Key, size } = await put(tagged[0], fileName, 'audio/wav')
      product = await prisma.product.upsert({
        where: { slug: `wav-${r.slug}` },
        create: { slug: `wav-${r.slug}`, type: 'TRACK', title: `${relTitle} (WAV)`, priceCents: price, active: true, fileKey: Key, fileName, fileSize: size, releaseId: r.id, position: 1 },
        update: { type: 'TRACK', title: `${relTitle} (WAV)`, priceCents: price, active: true, fileKey: Key, fileName, fileSize: size, releaseId: r.id, position: 1 },
      })
    } else {
      const zipName = `${safeName(relTitle)} (WAV).zip`
      const zipPath = path.join(tmp, `${r.slug}.zip`)
      // WAV barely compresses: ZIP_STORED keeps it fast.
      execFileSync('python3', ['-c', 'import sys,zipfile,os\nz=zipfile.ZipFile(sys.argv[1],"w",zipfile.ZIP_STORED)\nfor f in sys.argv[2:]: z.write(f,os.path.basename(f))\nz.close()', zipPath, ...tagged])
      const { Key, size } = await put(zipPath, zipName, 'application/zip')
      product = await prisma.product.upsert({
        where: { slug: `ep-${r.slug}` },
        create: { slug: `ep-${r.slug}`, type: 'RELEASE', title: `${relTitle} (WAV)`, priceCents: price, active: true, fileKey: Key, fileName: zipName, fileSize: size, releaseId: r.id, position: 0 },
        update: { type: 'RELEASE', title: `${relTitle} (WAV)`, priceCents: price, active: true, fileKey: Key, fileName: zipName, fileSize: size, releaseId: r.id, position: 0 },
      })
      rmSync(zipPath, { force: true })
    }
    for (const t of tagged) rmSync(t, { force: true })
    renameSync(job.source, path.join(done, path.basename(job.source)))
    console.log(`OK ${r.slug} → ${product.slug} €${(price / 100).toFixed(2)}`)
  }
  rmSync(tmp, { recursive: true, force: true })
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
