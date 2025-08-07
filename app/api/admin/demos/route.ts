import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const skip = (page - 1) * limit

    const where: any = {
      ...(status && status !== 'ALL' 
        ? { status: status } 
        : {}),
      ...(search ? {
        OR: [
          { artistName: { contains: search, mode: 'insensitive' as any } },
          { email: { contains: search, mode: 'insensitive' as any } },
          { genre: { contains: search, mode: 'insensitive' as any } },
        ],
      } : {}),
    }

    const [submissions, total] = await Promise.all([
      prisma.demoSubmission.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.demoSubmission.count({ where }),
    ])

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching demo submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch demo submissions' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id, status, notes } = await request.json()

    const submission = await prisma.demoSubmission.update({
      where: { id },
      data: {
        status: status as 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED',
        notes,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ submission })
  } catch (error) {
    console.error('Error updating demo submission:', error)
    return NextResponse.json(
      { error: 'Failed to update demo submission' },
      { status: 500 }
    )
  }
}
