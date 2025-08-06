import { PrismaClient } from '@prisma/client'
import mysql from 'mysql2/promise'

const prisma = new PrismaClient()

// WordPress database configuration
const wpConfig = {
  host: '188.245.226.152',
  port: 5912,
  user: 'PF6DbUTp1ONfQGwj',
  password: 'gpc9ec3T1Rz1mPzviouvDZ4wQobLXjCn',
  database: 'wordpress'
}

interface WordPressSubscriber {
  id: number
  email: string
  name: string | null
  group_name: string | null
  date_added: Date
}

async function importWordPressData() {
  console.log('🚀 Starting WordPress import...')
  
  try {
    // Connect to WordPress database
    const wpConnection = await mysql.createConnection(wpConfig)
    console.log('✅ Connected to WordPress database')

    // Get all subscribers from WordPress
    const [wpSubscribers] = await wpConnection.execute(
      'SELECT id, email, name, group_name, date_added FROM wp_mlds_subscribers'
    ) as [WordPressSubscriber[], any]

    console.log(`📧 Found ${wpSubscribers.length} subscribers in WordPress`)

    // Get unique group names (categories)
    const [wpGroups] = await wpConnection.execute(
      'SELECT DISTINCT group_name FROM wp_mlds_subscribers WHERE group_name IS NOT NULL'
    ) as [any[], any]

    console.log(`📂 Found ${wpGroups.length} groups:`, wpGroups.map(g => g.group_name))

    // Create categories in our database
    const categoryMap = new Map<string, string>()
    
    for (const group of wpGroups) {
      const groupName = group.group_name
      if (!groupName) continue

      // Map WordPress groups to our categories
      let categoryName = groupName
      let color = 'blue'
      let description = `Imported from WordPress: ${groupName}`

      // Map specific groups to our categories
      if (groupName.toLowerCase().includes('promo')) {
        categoryName = 'Promoters'
        color = 'green'
        description = 'Music promoters and DJs'
      } else if (groupName.toLowerCase().includes('newsletter')) {
        categoryName = 'Newsletter'
        color = 'purple'
        description = 'General newsletter subscribers'
      } else if (groupName.toLowerCase().includes('customer')) {
        categoryName = 'VIP'
        color = 'purple'
        description = 'Premium customers'
      }

      // Check if category already exists
      let category = await prisma.category.findFirst({
        where: { name: categoryName }
      })

      if (!category) {
        category = await prisma.category.create({
          data: {
            name: categoryName,
            color,
            description
          }
        })
        console.log(`✅ Created category: ${categoryName}`)
      }

      categoryMap.set(groupName, category.id)
    }

    // Import subscribers
    let importedCount = 0
    let skippedCount = 0

    for (const wpSub of wpSubscribers) {
      try {
        // Check if subscriber already exists
        const existingSubscriber = await prisma.subscriber.findUnique({
          where: { email: wpSub.email.toLowerCase() }
        })

        if (existingSubscriber) {
          console.log(`⏭️  Skipping existing subscriber: ${wpSub.email}`)
          skippedCount++
          continue
        }

        // Determine category
        let categoryId: string | undefined
        if (wpSub.group_name && categoryMap.has(wpSub.group_name)) {
          categoryId = categoryMap.get(wpSub.group_name)
        }

        // Create subscriber
        await prisma.subscriber.create({
          data: {
            email: wpSub.email.toLowerCase(),
            name: wpSub.name || undefined,
            status: 'ACTIVE',
            source: 'wordpress_import',
            tags: ['imported', wpSub.group_name || 'wordpress'].filter(Boolean),
            categoryId,
            subscribedAt: wpSub.date_added,
            notes: `Imported from WordPress (ID: ${wpSub.id})`,
            emailCount: 0
          }
        })

        console.log(`✅ Imported: ${wpSub.email}`)
        importedCount++

      } catch (error) {
        console.error(`❌ Error importing ${wpSub.email}:`, error)
      }
    }

    // Close WordPress connection
    await wpConnection.end()

    console.log('\n📊 Import Summary:')
    console.log(`✅ Imported: ${importedCount} subscribers`)
    console.log(`⏭️  Skipped: ${skippedCount} existing subscribers`)
    console.log(`📂 Categories: ${categoryMap.size} mapped`)

    // Show final stats
    const totalSubscribers = await prisma.subscriber.count()
    const totalCategories = await prisma.category.count()
    
    console.log(`\n📈 Database Stats:`)
    console.log(`📧 Total subscribers: ${totalSubscribers}`)
    console.log(`📂 Total categories: ${totalCategories}`)

  } catch (error) {
    console.error('❌ Import failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the import
importWordPressData()
  .then(() => {
    console.log('🎉 WordPress import completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Import failed:', error)
    process.exit(1)
  }) 