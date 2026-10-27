/**
 * Builds the public "what's inside" manifest + audio previews for a sample-pack product.
 *
 *   npx tsx --env-file=.env --tsconfig tsconfig.json scripts/shop-pack-manifest.ts <product-slug> [--apply]
 *
 * Reads the private product ZIP from R2, lists its contents, renders short MP3 previews
 * (capped at 4 bars @ 174 BPM, faded out) plus waveform peaks for every loop, and uploads
 * `releases/<release-slug>/pack/manifest.json` + `preview-*.mp3` to the public bucket.
 * The full-quality WAVs never leave the private key. Without --apply it only prints the plan.
 * Needs `unzip`, `ffmpeg`, `ffprobe` on PATH. Re-run after replacing the product file.
 */
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, relative } from 'node:path'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { prisma } from '../lib/prisma'
import type { PackManifest, PackGroup, PackItem } from '../lib/shop/pack'

const BAR_SECONDS = (60 / 174) * 4
const PREVIEW_MAX = BAR_SECONDS * 4 + 0.05
const PEAKS = 72

const [slug, flag] = process.argv.slice(2)
if (!slug) throw new Error('usage: shop-pack-manifest.ts <product-slug> [--apply]')
const apply = flag === '--apply'

const run = (cmd: string, args: string[]) => execFileSync(cmd, args, { maxBuffer: 1 << 28 })

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

/** "02 BASSLOOP Y B _174.wav" → key "B", bpm 174 */
function parseName(file: string) {
  const stem = basename(file).replace(/\.[^.]+$/, '')
  const bpm = Number(stem.match(/_(\d{2,3})$/)?.[1]) || null
  const key = stem.split(/[\s_]+/).filter((t) => /^[A-G](?:#|b)?$/.test(t)).pop() ?? null
  return { stem, bpm, key }
}

function groupLabel(folder: string, kind: PackGroup['kind']) {
  const f = folder.toLowerCase()
  if (kind === 'preset') return 'Serum presets'
  if (f.includes('bass')) return 'Bass loops'
  if (f.includes('drum')) return 'Drum loops'
  return 'Synths & pads'
}

function peaks(file: string): number[] {
  const pcm = run('ffmpeg', ['-v', 'error', '-i', file, '-ac', '1', '-ar', '8000', '-f', 's16le', '-'])
  const samples = new Int16Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 2))
  const step = Math.max(1, Math.floor(samples.length / PEAKS))
  const out: number[] = []
  for (let i = 0; i < PEAKS; i++) {
    let max = 0
    for (let j = i * step; j < Math.min(samples.length, (i + 1) * step); j++) max = Math.max(max, Math.abs(samples[j]))
    out.push(max)
  }
  const top = Math.max(...out, 1)
  return out.map((v) => Math.round((v / top) * 100) / 100)
}

;(async () => {
  const product = await prisma.product.findUniqueOrThrow({ where: { slug }, include: { release: { select: { slug: true } } } })
  if (!product.fileKey) throw new Error('product has no file')
  const releaseSlug = product.release?.slug ?? product.slug
  const { R2_ENDPOINT: endpoint, R2_ACCESS_KEY_ID: accessKeyId, R2_SECRET_ACCESS_KEY: secretAccessKey } = process.env
  const bucket = (process.env.R2_BUCKET || process.env.R2_BUCKET_NAME)!
  const base = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/$/, '')
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !base) throw new Error('R2 env missing')
  const s3 = new S3Client({ region: 'auto', endpoint, forcePathStyle: true, credentials: { accessKeyId, secretAccessKey } })

  const work = mkdtempSync(join(tmpdir(), 'pack-'))
  try {
    const zip = join(work, 'pack.zip')
    const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: product.fileKey }))
    writeFileSync(zip, Buffer.from(await obj.Body!.transformToByteArray()))
    run('unzip', ['-q', zip, '-d', join(work, 'x'), '-x', '__MACOSX/*', '*.DS_Store'])

    const files = walk(join(work, 'x')).sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
    const content = files.filter((f) => !f.endsWith('.asd'))
    const prefix = `releases/${releaseSlug}/pack`
    const groups = new Map<string, PackGroup>()
    const uploads: { key: string; body: Buffer; type: string }[] = []
    let audio: PackManifest['audio'] = null

    for (const f of content) {
      const rel = relative(join(work, 'x'), f)
      const parts = rel.split('/')
      const folder = parts.length > 2 ? parts[parts.length - 2] : parts.length === 2 ? parts[0] : 'Files'
      const ext = f.split('.').pop()!.toLowerCase()
      const kind: PackGroup['kind'] = ext === 'fxp' || ext === 'fxb' ? 'preset' : 'audio'
      const id = folder.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      if (!groups.has(id)) groups.set(id, { id, folder, label: groupLabel(folder, kind), kind, items: [] })
      const { stem, bpm, key } = parseName(f)
      const item: PackItem = { name: basename(f), title: stem.replace(/_\d{2,3}$/, '').replace(/\s+/g, ' ').trim(), key, bpm, bytes: statSync(f).size }

      if (kind === 'audio') {
        const probe = JSON.parse(run('ffprobe', ['-v', 'error', '-show_entries', 'stream=sample_rate,bits_per_sample,channels:format=duration', '-of', 'json', f]).toString())
        const s = probe.streams[0]
        audio ??= { sampleRate: Number(s.sample_rate), bits: Number(s.bits_per_sample), channels: Number(s.channels), format: ext.toUpperCase() }
        const seconds = Number(probe.format.duration)
        item.seconds = Math.round(seconds * 100) / 100
        item.bars = Math.round(seconds / BAR_SECONDS)
        const clip = Math.min(seconds, PREVIEW_MAX)
        const out = join(work, `p-${uploads.length}.mp3`)
        run('ffmpeg', ['-v', 'error', '-y', '-i', f, '-t', String(clip), '-af', `afade=t=out:st=${Math.max(0, clip - 0.35)}:d=0.35`, '-ac', '2', '-b:a', '128k', out])
        const key = `${prefix}/preview-${id}-${String(groups.get(id)!.items.length + 1).padStart(2, '0')}.mp3`
        uploads.push({ key, body: readFileSync(out), type: 'audio/mpeg' })
        item.preview = `${base}/${key}`
        item.previewSeconds = Math.round(clip * 100) / 100
        item.peaks = peaks(out)
      }
      groups.get(id)!.items.push(item)
    }

    // Audio groups first (they're playable), presets last.
    const ordered = [...groups.values()].sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'audio' ? -1 : 1))
    const manifest: PackManifest = {
      version: 1,
      generatedAt: new Date().toISOString(),
      zipBytes: product.fileSize ?? statSync(zip).size,
      fileCount: content.length,
      abletonWarp: files.some((f) => f.endsWith('.asd')),
      audio,
      groups: ordered,
    }
    uploads.push({ key: `${prefix}/manifest.json`, body: Buffer.from(JSON.stringify(manifest)), type: 'application/json' })

    for (const g of ordered) console.log(`${g.label.padEnd(14)} ${g.items.length} × ${g.kind}  ${g.items.map((i) => `${i.title}${i.key ? ` [${i.key}]` : ''}${i.bars ? ` ${i.bars}b` : ''}`).join(', ')}`)
    console.log(`files ${manifest.fileCount}, zip ${(manifest.zipBytes / 1e6).toFixed(1)} MB, audio ${JSON.stringify(audio)}, uploads ${uploads.length}`)
    if (!apply) return console.log('dry run — pass --apply to upload')

    for (const u of uploads) {
      await s3.send(new PutObjectCommand({ Bucket: bucket, Key: u.key, Body: u.body, ContentType: u.type, CacheControl: u.type === 'application/json' ? 'public, max-age=300' : 'public, max-age=86400' }))
    }
    console.log(`uploaded → ${base}/${prefix}/manifest.json`)
  } finally {
    rmSync(work, { recursive: true, force: true })
    await prisma.$disconnect()
  }
})()
