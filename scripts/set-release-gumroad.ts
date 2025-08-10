import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const [, , slug, url] = process.argv
  if (!slug || !url) {
    console.error('Usage: tsx scripts/set-release-gumroad.ts <slug> <gumroad_url>')
    process.exit(1)
  }
  const updated = await prisma.release.update({ where: { slug }, data: { gumroad: url } })
  console.log(`Updated release ${updated.slug} gumroad -> ${updated.gumroad}`)
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
