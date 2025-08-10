import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const vip = await prisma.category.findFirst({ where: { name: { equals: 'VIP', mode: 'insensitive' } } })
  const newsletter = await prisma.category.findFirst({ where: { name: { equals: 'Newsletter', mode: 'insensitive' } } })

  if (!vip && !newsletter) {
    await prisma.category.create({
      data: { name: 'Newsletter', color: 'purple', description: 'General newsletter subscribers' }
    })
    console.log('Created Newsletter category')
    return
  }

  if (vip && !newsletter) {
    await prisma.category.update({
      where: { id: vip.id },
      data: {
        name: 'Newsletter',
        color: vip.color || 'purple',
        description: 'General newsletter subscribers'
      }
    })
    console.log(`Renamed category ${vip.id} to Newsletter`)
    return
  }

  if (vip && newsletter) {
    const vipId = vip.id
    const newsletterId = newsletter.id

    await prisma.$transaction([
      prisma.subscriber.updateMany({ where: { categoryId: vipId }, data: { categoryId: newsletterId } }),
      prisma.emailCampaign.updateMany({ where: { categoryId: vipId }, data: { categoryId: newsletterId } }),
    ])

    await prisma.category.delete({ where: { id: vipId } })
    await prisma.category.update({
      where: { id: newsletterId },
      data: {
        name: 'Newsletter',
        color: newsletter.color || 'purple',
        description: newsletter.description || 'General newsletter subscribers'
      }
    })

    console.log('Merged VIP into existing Newsletter and removed VIP category')
    return
  }

  console.log('Newsletter category already present; nothing to do')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


