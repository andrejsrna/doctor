/**
 * Turns the mastered WAVs already in R2 (demo uploads / promo mailouts) into shop products:
 *  - a single release  → one TRACK product (€1.50)
 *  - an EP             → one TRACK product per track (€1.50) + a RELEASE bundle ZIP (€3) when every track is present
 *
 * Files are copied to the private `shop/products/<uuid>/` prefix, so deleting a demo never breaks a purchase.
 * Idempotent: products are upserted by slug and existing files are reused.
 *
 *   npx tsx --env-file=.env --tsconfig tsconfig.json scripts/shop-import-wavs.ts          # dry run: resolve + inspect WAV headers
 *   npx tsx --env-file=.env --tsconfig tsconfig.json scripts/shop-import-wavs.ts --apply  # copy files, build ZIPs, upsert products
 */
import { randomUUID } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { createReadStream, createWriteStream, mkdirSync, rmSync, statSync } from 'node:fs'
import { pipeline } from 'node:stream/promises'
import { Readable } from 'node:stream'
import path from 'node:path'
import { CopyObjectCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { prisma } from '../lib/prisma'

const APPLY = process.argv.includes('--apply')
const TRACK_CENTS = 150
const EP_CENTS = 300

type Track = { title: string; match: string }
type Item = { release: string; tracks: Track[]; ep?: boolean }

// `match` = file name (after the upload prefix) without extension, compared case-insensitively; the newest upload wins.
const ITEMS: Item[] = [
  { release: 'xsonsence-golem', tracks: [{ title: 'Xsonsence - Golem', match: 'Xsonsence---Golem' }] },
  { release: 'carai-stargate', tracks: [{ title: 'Carai - Stargate', match: 'Carai----Stargate' }] },
  { release: 'asana-double-trouble', tracks: [{ title: 'Asana - Double Trouble', match: 'Asana---Double-Trouble' }] },
  { release: 'led-lost-fighters-ill-fated-remix', tracks: [{ title: 'LED - Lost Fighters (Ill-Fated Remix)', match: 'LED.-Lost-Fighters--Ill-Fated-Remix-' }] },
  { release: 'mrmeaner-brain-fuzz', tracks: [{ title: 'Mr.Meaner - Brain Fuzz', match: 'Mr.Meaner---Brain-Fuzz' }] },
  { release: 'c-qnz-low-frequency-orbit', tracks: [{ title: 'C-qnz - Low Frequency Orbit', match: 'C-qnz---Low-Frequency-Orbit' }] },
  { release: 'cidiah-derry', tracks: [{ title: 'CiDiaH - Derry', match: 'CiDiaH---Derry' }] },
  { release: 'razerbeam-oblivion', tracks: [{ title: 'Razerbeam - Oblivion', match: 'Razerbeam---Oblivion' }] },
  { release: 'razerbeam-omen', tracks: [{ title: 'Razerbeam - Omen', match: 'Razerbeam---Omen' }] },
  { release: 'yehor-where-do-we-go', tracks: [{ title: 'YEHOR - Where Do We Go', match: 'Yehor---Where-Do-We-Go' }] },
  { release: 'gouki-precursor', tracks: [{ title: 'Gouki - Precursor', match: 'Gouki---Precursor' }] },
  { release: 'durability-tremor', tracks: [{ title: 'Durability - Tremor', match: 'Durability---Tremor' }] },
  { release: 'xsonsence-danger-zone', tracks: [{ title: 'Xsonsence - Danger Zone', match: 'Xsonsence---Danger-Zone' }] },
  { release: 'lyryck-psycho-rider', tracks: [{ title: 'Lyryck - Psycho Rider', match: 'Lyryck---Psycho-Rider' }] },
  { release: 'corbix-karate', tracks: [{ title: 'Corbix - Karate', match: 'Corbix---Karate' }] },
  { release: 'yehor-good-time', tracks: [{ title: 'YEHOR - Good Time', match: 'YEHOR---Good-Time--Original-Mix-' }] },
  { release: 'ott-uk-fired-up', tracks: [{ title: 'OTT (UK) - Fired Up', match: 'OTT--UK---Fired-Up' }] },
  { release: 'cidiah-rodio', tracks: [{ title: 'CiDiaH - Rodio', match: 'CiDiaH---Rodio' }] },
  { release: 'richart-franshrek-ktmn', tracks: [{ title: 'RichArt & Franshrek - KTMN', match: 'RichArt---Franshrek---KTMN' }] },
  { release: 'damo-the-call-of-the-void', tracks: [{ title: 'Damo - The Call of the Void', match: 'The-Call-of-the-Void---Damo' }] },
  { release: 'xsonsence-blaze', tracks: [{ title: 'Xsonsence - Blaze', match: 'Xsonsence---Blaze' }] },
  { release: 'vorside-mom-get-the-camera', tracks: [{ title: 'VORSIDE - Mom Get The Camera', match: 'VORSIDE---Mom-Get-The-Camera---Final' }] },
  { release: 'south-of-control-sky-invert', tracks: [{ title: 'South Of Control - Sky Invert', match: 'South-Of-Control---Sky-Invert' }] },
  { release: 'south-of-control-dive-into-the-night', tracks: [{ title: 'South Of Control - Dive Into The Night', match: 'South-Of-Control---Dive-In-To-The-Night--MASTER-' }] },
  { release: 'dylemma-shadows-raised-me', tracks: [{ title: "Dylemma - Shadow's Raised Me", match: 'Dylemma---Shadow-s-Raised-Me' }] },
  { release: 'ichor-disorders', tracks: [{ title: 'Ichor - Disorders', match: 'Ichor---Disorders' }] },
  { release: 'ichor-the-exorcist', tracks: [{ title: 'Ichor - The Exorcist', match: 'The-Exorcist-Final-V2' }] },
  { release: 'xustin-nuclear-blast', tracks: [{ title: 'Xustin - Nuclear Blast', match: 'Xustin---Nuclear-Blast' }] },
  { release: 'yehor-cidiah-disobedience', tracks: [{ title: 'CiDiaH & YEHOR - Disobedience', match: 'CiDiaH---YEHOR---Disobedience--Original-Mix-' }] },
  { release: 'doorskip-thermite', tracks: [{ title: 'DoorSkip - Thermite', match: 'Doorskip---Thermite--Original-Mix-' }] },
  { release: 'vorside-smash', tracks: [{ title: 'VORSIDE - Smash', match: 'VORSIDE---Smash---Final' }] },
  { release: 'cray-c-alive-vip', tracks: [{ title: 'CRAY-C - Alive (VIP)', match: 'ALIVE_VIP_final--1-' }] },
  { release: 'yehor-got-your-money', tracks: [{ title: 'YEHOR - Got Your Money', match: 'YEHOR---Got-Your-Money--Original-Mix-' }] },
  { release: 'damo-cobra-clutch', tracks: [{ title: 'Damo - Cobra Clutch', match: 'Cobra-Clutch---Damo--bounce-FINAL-' }] },
  { release: 'alex-physalis-enhance', tracks: [{ title: 'Alex Physalis - Enhance', match: 'Alex-Physalis---Enhance-mst-v2' }] },
  { release: 'xsonsence-earth-temple', tracks: [{ title: 'Xsonsence - Earth Temple', match: 'Xsonsence---Earth-Temple' }] },
  { release: 'jaby-trash-talk', tracks: [{ title: 'JABY - Trash Talk', match: 'JABY---Trash-Talk' }] },
  { release: 'minimalist-reborn', tracks: [{ title: 'Minimalist - Reborn', match: 'Minimalist---Reborn-v2' }] },
  { release: 'ott-morning-glory', tracks: [{ title: 'OTT (UK) - Morning Glory', match: 'OTT---Morning-Glory' }] },
  { release: 'zleesyn-run', tracks: [{ title: 'ZleeSyn - Run', match: 'Run' }] },
  { release: 'dmd-blind-descent', tracks: [{ title: 'D.M.D - Blind Descent', match: 'D.M.D---Blind-Descent' }] },
  { release: 'corbix-tribe', tracks: [{ title: 'Corbix - Tribe', match: 'Corbix---Tribe' }] },
  // Masters uploaded directly to demos/ (no upload prefix).
  { release: 'daccatta-from-the-shadows', tracks: [{ title: 'DACCATTA - From The Shadows', match: 'DACCATTA - FROM THE SHADOWS' }] },
  { release: 'jape-bassline-pressure', tracks: [{ title: 'Jape - Bassline Pressure', match: 'JAPE - BASSLINE PRESSURE' }] },
  { release: 'daccatta-racer', tracks: [{ title: 'DACCATTA - Racer', match: 'DACCATTA - Racer' }] },
  { release: 'warp-fa2e-drilling-rig', tracks: [{ title: 'Warp Fa2e - Drilling Rig', match: 'Warp Fa2e - Drilling Rig' }] },
  { release: 'virus-synthy-tell-the-truth', tracks: [{ title: 'VIRUS & Syn:Thy - Tell the Truth', match: 'VIRUS & Syn-Thy – Tell the Truth' }] },
  { release: 'zekjungle-bricker', tracks: [{ title: 'Zekjungle - Bricker', match: 'Zekjungle - BRICKER' }] },
  { release: 'damo-false-dawn', tracks: [{ title: 'Damo - False Dawn', match: 'Damo - False Dawn' }] },
  { release: 'gouki-raging-demon', tracks: [{ title: 'Gouki - Raging Demon', match: 'Gouki - Raging Demon' }] },
  { release: 'yehor-was-broke', tracks: [{ title: 'YEHOR - Was Broke', match: 'YEHOR - Was Broke' }] },

  // EPs: track order follows Bandcamp.
  { release: 'daccatta-basshead-ep', ep: true, tracks: [
    { title: 'DACCATTA - Basshead', match: 'DACCATTA---Basshead' },
    { title: 'DACCATTA - Unbound', match: 'DACCATTA---Unbound' },
    { title: 'DACCATTA - WTF', match: 'DACCATTA---WTF' },
  ] },
  { release: 'zekjungle-arrival-ep', ep: true, tracks: [
    { title: 'Zekjungle - Invasion', match: 'Zekjungle---Invasion' },
    { title: 'Zekjungle - I Know', match: 'Zekjungle---I-Know' },
  ] },
  { release: 'nbc9-conscious-decline', ep: true, tracks: [
    { title: 'NBC9 - Metacognition', match: 'NBC9---Metacognition' },
    { title: 'NBC9 - Down', match: 'NBC9---Down' },
  ] },
  { release: 'head-bre3k-destroy-ep', ep: true, tracks: [
    { title: 'Head Bre3k - Destroy', match: 'Head-Bre3k---Destroy' },
    { title: 'Head Bre3k - Insomnia', match: 'Head-Break---Insomnia' },
    { title: 'Head Bre3k - Memorial', match: 'head-bre3k---Memorial' },
  ] },
  { release: 'kiki-gaagooa-ep', ep: true, tracks: [
    { title: 'KIKI - GAAGOA', match: 'KIKI---GAAGOA' },
    { title: 'KIKI - SHOKEA', match: 'KIKI---SHOKEA' },
  ] },
  { release: 'verzor-full-contact', ep: true, tracks: [
    { title: 'Verzor - Full Contact', match: 'Verzor---Full-Contact' },
    { title: 'Verzor - A Whisper In The Abyss', match: 'Verzor---A-whisper-in-the-abyss' },
  ] },
  { release: 'the-smell-of-males-burn-the-system-ep', ep: true, tracks: [
    { title: 'The Smell of Males - Burn the System', match: 'The-Smell-of-Males---Burn-the-System' },
    { title: 'The Smell of Males - Welcome', match: 'The-Smell-of-Males---Welcome' },
  ] },
  // Only "Hold Me" is in storage (Move is missing), so no EP bundle — just the track.
  { release: 'yehor-hold-me-ep', tracks: [{ title: 'YEHOR - Hold Me', match: 'YEHOR - Hold Me (Original Mix)' }] },
]

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)
const safeName = (s: string) => s.replace(/[^\w.\-() &']/g, '').replace(/\s+/g, ' ').trim()
const stem = (key: string) => key.replace(/^.*\//, '').replace(/^(mailout-\d+-|\d+-[a-z0-9]+-)/, '').replace(/\.wav$/i, '')
const stamp = (key: string) => Number(key.replace(/^.*\//, '').match(/^(?:mailout-)?(\d{10,})-/)?.[1] ?? 0)

const s3 = new S3Client({ region: 'auto', endpoint: process.env.R2_ENDPOINT, forcePathStyle: true, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! } })
const Bucket = process.env.R2_BUCKET || process.env.R2_BUCKET_NAME!

/** Sample rate / bit depth / duration from the RIFF header (first 64 KB). */
async function wavInfo(Key: string) {
  const r = await s3.send(new GetObjectCommand({ Bucket, Key, Range: 'bytes=0-65535' }))
  const b = Buffer.from(await r.Body!.transformToByteArray())
  if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WAVE') throw new Error(`not a WAV: ${Key}`)
  let o = 12, rate = 0, bits = 0, ch = 0, byteRate = 0, data = 0
  while (o + 8 <= b.length) {
    const id = b.toString('ascii', o, o + 4), size = b.readUInt32LE(o + 4)
    if (id === 'fmt ') { ch = b.readUInt16LE(o + 10); rate = b.readUInt32LE(o + 12); byteRate = b.readUInt32LE(o + 16); bits = b.readUInt16LE(o + 22) }
    if (id === 'data') { data = size; break }
    o += 8 + size + (size % 2)
  }
  const sec = byteRate ? Math.round(data / byteRate) : 0
  return { rate, bits, ch, sec, label: `${rate / 1000}kHz/${bits}bit/${ch}ch ${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}` }
}

async function main() {
  const wavs: { Key: string; Size: number }[] = []
  let token: string | undefined
  do {
    const r = await s3.send(new ListObjectsV2Command({ Bucket, ContinuationToken: token }))
    for (const o of r.Contents ?? []) if (/\.wav$/i.test(o.Key!) && !o.Key!.startsWith('news/') && !o.Key!.startsWith('releases/') && !o.Key!.startsWith('shop/')) wavs.push({ Key: o.Key!, Size: o.Size ?? 0 })
    token = r.NextContinuationToken
  } while (token)

  const pick = (match: string) => {
    const hits = wavs.filter((w) => stem(w.Key).toLowerCase() === match.toLowerCase()).sort((a, b) => stamp(b.Key) - stamp(a.Key))
    if (!hits.length) throw new Error(`no WAV for "${match}"`)
    return hits[0]
  }

  const tmp = path.join(process.env.TMPDIR || '/tmp', `shop-wavs-${Date.now()}`)
  let created = 0, updated = 0

  for (const item of ITEMS) {
    const release = await prisma.release.findUnique({ where: { slug: item.release }, select: { id: true, slug: true, title: true, releaseType: true, products: { select: { slug: true, type: true } } } })
    if (!release) throw new Error(`missing release ${item.release}`)
    if (release.releaseType === 'FREE_DOWNLOAD') throw new Error(`${item.release} is a free download`)
    if (release.products.some((p) => p.type === 'SAMPLE_PACK')) throw new Error(`${item.release} already sells a sample pack`)

    const files = []
    for (const t of item.tracks) {
      const src = pick(t.match)
      const info = await wavInfo(src.Key)
      files.push({ ...t, src, info })
      console.log(`${item.release.padEnd(40)} ${t.title.padEnd(42)} ${info.label.padEnd(26)} ${(src.Size / 1e6).toFixed(0)}MB  ${src.Key}`)
    }
    if (!APPLY) continue

    const upsert = async (slug: string, data: { type: 'TRACK' | 'RELEASE'; title: string; priceCents: number; position: number; fileName: string; size: number; put: (key: string) => Promise<void> }) => {
      const existing = await prisma.product.findUnique({ where: { slug } })
      if (existing && existing.releaseId !== release.id) throw new Error(`slug ${slug} belongs to another release`)
      let fileKey = existing?.fileKey ?? null
      if (!fileKey || existing?.fileName !== data.fileName || existing?.fileSize !== data.size) {
        fileKey = `shop/products/${randomUUID()}/${data.fileName.replace(/[^\w.\-()]+/g, '-')}`
        await data.put(fileKey)
      }
      const fields = { type: data.type, title: data.title, priceCents: data.priceCents, currency: 'eur', active: true, fileKey, fileName: data.fileName, fileSize: data.size, releaseId: release.id, position: data.position }
      if (existing) { await prisma.product.update({ where: { id: existing.id }, data: fields }); updated++ } else { await prisma.product.create({ data: { slug, ...fields } }); created++ }
    }

    for (const [i, f] of files.entries()) {
      const fileName = `${safeName(f.title)}.wav`
      const slug = item.tracks.length === 1 && !item.ep ? `wav-${release.slug}` : `wav-${release.slug}-${slugify(f.title.split(' - ').slice(1).join(' - ') || f.title)}`
      await upsert(slug, {
        type: 'TRACK', title: `${f.title} (WAV)`, priceCents: TRACK_CENTS, position: i + 1, fileName, size: f.src.Size,
        put: async (Key) => { await s3.send(new CopyObjectCommand({ Bucket, Key, CopySource: `${Bucket}/${encodeURI(f.src.Key)}`, ContentType: 'audio/wav' })) },
      })
    }

    if (item.ep) {
      const title = release.title.replace(/&#8211;|–/g, '-').replace(/\s+/g, ' ').trim()
      const zipName = `${safeName(title)} (WAV).zip`
      const dir = path.join(tmp, release.slug)
      mkdirSync(dir, { recursive: true })
      const names: string[] = []
      for (const [i, f] of files.entries()) {
        const name = `${String(i + 1).padStart(2, '0')} ${safeName(f.title)}.wav`
        const r = await s3.send(new GetObjectCommand({ Bucket, Key: f.src.Key }))
        await pipeline(r.Body as Readable, createWriteStream(path.join(dir, name)))
        names.push(name)
      }
      const zipPath = path.join(tmp, `${release.slug}.zip`)
      // WAV barely compresses; store keeps the build fast and the ZIP byte-identical across runs.
      execFileSync('python3', ['-c', 'import sys,zipfile,os\nz=zipfile.ZipFile(sys.argv[1],"w",zipfile.ZIP_STORED)\nfor n in sys.argv[3:]: z.write(os.path.join(sys.argv[2],n),n)\nz.close()', zipPath, dir, ...names])
      const size = statSync(zipPath).size
      await upsert(`ep-${release.slug}`, {
        type: 'RELEASE', title: `${title} (WAV)`, priceCents: EP_CENTS, position: 0, fileName: zipName, size,
        put: async (Key) => { await s3.send(new PutObjectCommand({ Bucket, Key, Body: createReadStream(zipPath), ContentLength: size, ContentType: 'application/zip' })) },
      })
      rmSync(dir, { recursive: true, force: true }); rmSync(zipPath, { force: true })
    }
  }
  rmSync(tmp, { recursive: true, force: true })
  console.log(APPLY ? `created ${created}, updated ${updated}` : 'dry run (pass --apply to write)')
}

main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1) })
