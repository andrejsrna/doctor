import "dotenv/config"
import { prisma } from "../lib/prisma"
import { seedArtistProfileSetup } from "../lib/artistLabProfileSetup"

async function main() {
  const result = await seedArtistProfileSetup(prisma)
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
