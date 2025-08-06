import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create default categories
  const categories = [
    {
      name: "VIP",
      color: "purple",
      description: "Premium subscribers"
    },
    {
      name: "Promoters",
      color: "green", 
      description: "Music promoters"
    },
    {
      name: "Artists",
      color: "blue",
      description: "Music artists"
    },
    {
      name: "Fans",
      color: "orange",
      description: "General fans"
    },
    {
      name: "Press",
      color: "red",
      description: "Media contacts"
    }
  ]

  console.log('Creating categories...')
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        id: category.name.toLowerCase().replace(/\s+/g, '-'),
        ...category
      }
    })
  }

  // Create sample subscribers
  const subscribers = [
    {
      email: "john@example.com",
      name: "John Doe",
      status: "ACTIVE" as const,
      source: "website",
      tags: ["newsletter", "vip"],
      notes: "VIP customer"
    },
    {
      email: "jane@example.com", 
      name: "Jane Smith",
      status: "ACTIVE" as const,
      source: "social",
      tags: ["newsletter"]
    },
    {
      email: "bob@example.com",
      status: "PENDING" as const,
      source: "website", 
      tags: ["promoter"]
    }
  ]

  console.log('Creating subscribers...')
  for (const subscriber of subscribers) {
    await prisma.subscriber.upsert({
      where: { email: subscriber.email },
      update: {},
      create: subscriber
    })
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 