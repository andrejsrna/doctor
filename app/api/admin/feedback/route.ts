import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@prisma/client"
import { auth } from "@/app/lib/auth"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const search = (searchParams.get('search') || '').trim()
  const onlyLegacy = (searchParams.get('legacy') || 'false') === 'true'
  const ratingMinStr = searchParams.get('ratingMin')
  const ratingMaxStr = searchParams.get('ratingMax')
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''

  const where: Prisma.DemoFeedbackWhereInput = {}
  if (onlyLegacy) where.recipientEmail = { equals: 'import@dnbdoctor.com', mode: 'insensitive' }
  if (search) {
    where.AND = [ ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), {
      OR: [
        { recipientEmail: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { feedback: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        // trackToken optional, only include if exists in client
      ],
    }]
  }
  if ((ratingMinStr && ratingMinStr.trim() !== '') || (ratingMaxStr && ratingMaxStr.trim() !== '')) {
    const ratingMin = ratingMinStr && ratingMinStr.trim() !== '' ? parseInt(ratingMinStr, 10) : undefined
    const ratingMax = ratingMaxStr && ratingMaxStr.trim() !== '' ? parseInt(ratingMaxStr, 10) : undefined
    where.AND = [ ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), { rating: { gte: ratingMin, lte: ratingMax } } ]
  }
  if (startDate || endDate) {
    where.AND = [ ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []), {
      submittedAt: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    }]
  }

  const skip = (page - 1) * limit

  const [itemsRaw, total] = await Promise.all([
    prisma.demoFeedback.findMany({
      where,
      orderBy: [{ submittedAt: 'desc' }, { createdAt: 'desc' }],
      skip,
      take: limit,
      select: {
        id: true,
        recipientEmail: true,
        subject: true,
        rating: true,
        feedback: true,
        name: true,
        submittedAt: true,
        createdAt: true,
        wpPostId: true,
        files: true,
      },
    }),
    prisma.demoFeedback.count({ where }),
  ])

  // Map WP post IDs to release titles/slugs if available
  const wpIds = Array.from(new Set(itemsRaw.map(i => {
    const m = /post\s+(\d+)/i.exec(i.subject || '')
    return m ? parseInt(m[1], 10) : undefined
  }).filter((v): v is number => typeof v === 'number')))
  let releaseMap: Record<number, { title: string; slug: string } > = {}
  if (wpIds.length) {
    const releases = await prisma.release.findMany({ where: { wpId: { in: wpIds } }, select: { wpId: true, title: true, slug: true } })
    releaseMap = releases.reduce((acc, r) => { if (typeof r.wpId === 'number') acc[r.wpId] = { title: r.title, slug: r.slug }; return acc }, {} as Record<number, { title: string; slug: string }>)
  }
  const items = itemsRaw.map(it => {
    const m = /post\s+(\d+)/i.exec(it.subject || '')
    const pid = m ? parseInt(m[1], 10) : undefined
    return {
      ...it,
      release: pid && releaseMap[pid] ? releaseMap[pid] : null,
    }
  })

  return NextResponse.json({
    items,
    pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
  })
}


