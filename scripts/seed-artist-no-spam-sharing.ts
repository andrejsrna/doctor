import "dotenv/config"
import { prisma } from "../lib/prisma"
import { seedArtistNoSpamSharing } from "../lib/artistLabNoSpamSharing"

async function main() {
  const result = await seedArtistNoSpamSharing(prisma)
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
