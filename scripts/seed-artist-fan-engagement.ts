import { prisma } from "../lib/prisma"
import { seedArtistFanEngagement } from "../lib/artistLabFanEngagement"

async function main() {
  const result = await seedArtistFanEngagement(prisma)
  console.log(
    `Seeded ${result.document.title}: ${result.templates} templates, ${result.artists} artists, ${result.createdTasks} tasks created`
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
