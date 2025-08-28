import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/app/lib/auth'
import { sendDemoStatusUpdateEmail } from '@/app/services/email'

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

    const where: {
      status?: 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'ARCHIVED' | { in: Array<'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED'> };
      OR?: Array<{ artistName?: { contains: string; mode: 'insensitive' } } | { email?: { contains: string; mode: 'insensitive' } } | { genre?: { contains: string; mode: 'insensitive' } }>;
    } = {};

    if (status && status !== 'ALL') {
      where.status = status as 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
    } else {
      where.status = { in: ['PENDING', 'REVIEWED', 'APPROVED', 'REJECTED'] };
    }
    
    if (search) {
      where.OR = [
        { artistName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { genre: { contains: search, mode: 'insensitive' } },
      ];
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

    const existingSubmission = await prisma.demoSubmission.findUnique({
      where: { id },
    });

    if (!existingSubmission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const submission = await prisma.demoSubmission.update({
      where: { id },
      data: {
        status: status as 'PENDING' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'ARCHIVED',
        notes,
        updatedAt: new Date(),
      },
    })

    if (
      (status === 'APPROVED' || status === 'REJECTED') &&
      existingSubmission.status !== status
    ) {
      try {
        await sendDemoStatusUpdateEmail({
          email: submission.email,
          artistName: submission.artistName,
          status,
          notes,
        });
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // We don't want to fail the whole request if email fails,
        // so we just log the error. The status is already updated in the DB.
      }
    }

    return NextResponse.json({ submission })
  } catch (error) {
    console.error('Error updating demo submission:', error)
    return NextResponse.json(
      { error: 'Failed to update demo submission' },
      { status: 500 }
    )
  }
}
