import "dotenv/config"
import { prisma } from "../lib/prisma"
import { seedArtistAssets } from "../lib/artistLabAssets"

async function main() {
  const result = await seedArtistAssets(prisma)
  console.log(
    `Seeded ${result.document.title}: ${result.templates} templates, ${result.artists} artists, ${result.createdTasks} new checklist tasks.`
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
