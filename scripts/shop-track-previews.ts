/**
 * 45 s MP3 previews for every active TRACK product, public at
 * `${R2_PUBLIC_BASE_URL}/previews/tracks/<product slug>.mp3` (see lib/shop/catalog.ts trackPreviewUrl).
 * ffmpeg reads the private WAV through a presigned URL and seeks over HTTP, so nothing is downloaded whole.
 * Idempotent: existing previews are skipped unless --force. Run after importing new tracks:
 *   npx tsx --env-file=.env --tsconfig tsconfig.json scripts/shop-track-previews.ts [--force]
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { prisma } from '../lib/prisma'

const SECONDS = 45

;(async () => {
  const force = process.argv.includes('--force')
  const s3 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    forcePathStyle: true,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
  })
  const Bucket = process.env.R2_BUCKET_NAME!
  const tmp = process.env.TMPDIR || '/tmp'
  const tracks = await prisma.product.findMany({ where: { type: 'TRACK', active: true, fileKey: { not: null } }, select: { slug: true, fileKey: true } })
  let made = 0, skipped = 0, failed = 0
  for (const t of tracks) {
    const Key = `previews/tracks/${t.slug}.mp3`
    if (!force) {
      try {
        await s3.send(new HeadObjectCommand({ Bucket, Key }))
        skipped++
        continue
      } catch {
        // missing: make it
      }
    }
    try {
      const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket, Key: t.fileKey! }), { expiresIn: 600 })
      const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', url]).toString().trim()) || 0
      // Skip the intro: DnB drops usually land around a quarter to a third in.
      const start = dur > SECONDS + 10 ? Math.min(Math.max(dur * 0.28, 20), Math.max(dur - SECONDS - 5, 0)) : 0
      const len = Math.min(SECONDS, dur || SECONDS)
      const out = path.join(tmp, `${t.slug}.mp3`)
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', start.toFixed(2), '-t', String(len), '-i', url, '-vn', '-map_metadata', '-1',
        '-af', `afade=t=in:d=1,afade=t=out:st=${Math.max(len - 3, 0)}:d=3`, '-ac', '2', '-ar', '44100', '-b:a', '128k', out])
      await s3.send(new PutObjectCommand({ Bucket, Key, Body: readFileSync(out), ContentType: 'audio/mpeg', CacheControl: 'public, max-age=31536000' }))
      rmSync(out, { force: true })
      made++
      console.log(`OK ${t.slug} @${start.toFixed(0)}s`)
    } catch (e) {
      failed++
      console.log(`!! ${t.slug}: ${(e as Error).message.split('\n')[0]}`)
    }
  }
  console.log(`done: ${made} made, ${skipped} existing, ${failed} failed, ${tracks.length} tracks`)
  process.exit(failed ? 1 : 0)
})()
