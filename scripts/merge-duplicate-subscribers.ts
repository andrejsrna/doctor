import { PrismaClient, Subscriber, Influencer } from '@prisma/client'

const prisma = new PrismaClient()

const KNOWN_DOMAINS = ['gmail.com','googlemail.com','outlook.com','hotmail.com','live.com','yahoo.com','icloud.com','seznam.cz','centrum.cz','azet.sk','proton.me','protonmail.com']

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function tryFixMissingAt(raw: string) {
  const lc = raw.toLowerCase().trim()
  if (lc.includes('@')) return lc
  for (const domain of KNOWN_DOMAINS) {
    if (lc.endsWith(domain)) {
      const local = lc.slice(0, -domain.length)
      if (local && !local.includes('@')) return `${local}@${domain}`
    }
  }
  return lc
}

function canonicalize(email: string) {
  const fixed = tryFixMissingAt(email)
  const lc = fixed.toLowerCase().trim()
  if (!lc.includes('@')) return lc
  const [local, domain] = lc.split('@')
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    const noPlus = local.split('+')[0]
    const noDots = noPlus.replace(/\./g, '')
    return `${noDots}@gmail.com`
  }
  return `${local}@${domain}`
}

function choosePrimary(a: Subscriber, b: Subscriber) {
  const aValid = isValidEmail(a.email)
  const bValid = isValidEmail(b.email)
  if (aValid !== bValid) return aValid ? a : b
  if (a.status !== b.status) return a.status === 'ACTIVE' ? a : b
  if ((a.emailCount || 0) !== (b.emailCount || 0)) return (a.emailCount || 0) > (b.emailCount || 0) ? a : b
  return a.createdAt <= b.createdAt ? a : b
}

function mergeArraysUnique<T>(a: T[] = [], b: T[] = []) {
  return Array.from(new Set([...(a || []), ...(b || [])]))
}

async function mergeInfluencers(primaryEmail: string, dupEmail: string) {
  const [primary, dup] = await Promise.all([
    prisma.influencer.findUnique({ where: { email: primaryEmail } }),
    prisma.influencer.findUnique({ where: { email: dupEmail } }),
  ])
  if (!dup) return
  if (!primary) {
    await prisma.influencer.update({
      where: { email: dup.email },
      data: {
        email: primaryEmail,
        name: dup.name || undefined,
        tags: mergeArraysUnique(dup.tags || [], ['merged'])
      }
    })
    return
  }
  await prisma.influencer.update({
    where: { email: primary.email },
    data: {
      name: primary.name || dup.name || undefined,
      tags: mergeArraysUnique(primary.tags || [], dup.tags || [])
    }
  })
  await prisma.influencer.delete({ where: { email: dup.email } })
}

async function mergeGroup(subscribers: Subscriber[], apply: boolean) {
  if (subscribers.length < 2) return { merged: 0 }
  let primary = subscribers[0]
  for (const s of subscribers.slice(1)) primary = choosePrimary(primary, s)
  const duplicates = subscribers.filter(s => s.id !== primary.id)
  if (!apply) {
    return { merged: duplicates.length, primary: primary.email, dups: duplicates.map(d => d.email) }
  }
  await prisma.$transaction(async tx => {
    for (const d of duplicates) {
      await tx.emailLog.updateMany({ where: { subscriberId: d.id }, data: { subscriberId: primary.id } })
      await mergeInfluencers(primary.email.toLowerCase(), d.email.toLowerCase())
      const mergedTags = mergeArraysUnique(primary.tags || [], d.tags || [])
      const stripSoftDeleted = (s?: string | null) => (s || '').replace(/\n?\[SOFT DELETED\]/g, '')
      const mergedNotes = [stripSoftDeleted(primary.notes), stripSoftDeleted(d.notes), `Merged from ${d.email}`].filter(Boolean).join('\n').trim()
      const mergedEmailCount = (primary.emailCount || 0) + (d.emailCount || 0)
      const mergedLastEmailSent = [primary.lastEmailSent, d.lastEmailSent].filter(Boolean).sort((a, b) => (a && b ? a.getTime() - b.getTime() : 0)).pop() || null
      const mergedCategoryId = primary.categoryId || d.categoryId || null
      const mergedName = primary.name || d.name || null
      const mergedStatus = primary.status === 'ACTIVE' || d.status === 'ACTIVE' ? 'ACTIVE' : (primary.status === 'PENDING' || d.status === 'PENDING' ? 'PENDING' : 'UNSUBSCRIBED')
      await tx.subscriber.update({
        where: { id: primary.id },
        data: {
          name: mergedName || undefined,
          status: mergedStatus,
          tags: mergedTags,
          categoryId: mergedCategoryId,
          notes: mergedNotes,
          lastEmailSent: mergedLastEmailSent,
          emailCount: mergedEmailCount
        }
      })
      await tx.subscriber.delete({ where: { id: d.id } })
    }
  })
  return { merged: duplicates.length, primary: primary.email, dups: duplicates.map(d => d.email) }
}

async function main() {
  const apply = process.argv.includes('--apply')
  const all = await prisma.subscriber.findMany()
  const map = new Map<string, Subscriber[]>()
  for (const s of all) {
    const key = canonicalize(s.email)
    const arr = map.get(key) || []
    arr.push(s)
    map.set(key, arr)
  }
  const groups = Array.from(map.values()).filter(g => g.length > 1)
  if (groups.length === 0) {
    console.log('No duplicates found')
    return
  }
  let totalMerged = 0
  for (const g of groups) {
    const res = await mergeGroup(g, apply)
    totalMerged += res.merged || 0
    console.log(`${apply ? 'Merged' : 'Would merge'} ${res.merged} into ${res.primary}: ${res.dups?.join(', ')}`)
  }
  console.log(`${apply ? 'Done. Merged' : 'Dry run. Would merge'} ${totalMerged} duplicates across ${groups.length} groups`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })


