import { prisma } from "../lib/prisma"
import { seedArtistPreReleaseAssetTemplate } from "../lib/artistLabPreReleaseAssets"

async function main() {
  const result = await seedArtistPreReleaseAssetTemplate(prisma)
  console.log(`Seeded ${result.document.title} template: ${result.templates} checklist templates`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
