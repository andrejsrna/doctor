import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { token, rating, feedback, name, track_id } = await request.json()
    if (!token || !rating) {
      return NextResponse.json({ error: 'Missing token or rating' }, { status: 400 })
    }

    const record = await prisma.demoFeedback.findUnique({ where: { token } })
    if (!record) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 404 })
    }

    await prisma.demoFeedback.update({
      where: { token },
      data: {
        rating: Number(rating),
        feedback: feedback || null,
        name: name || null,
        submittedAt: new Date(),
      },
    })

    // Optionally forward to WordPress if track_id provided
    if (track_id) {
      try {
        const resp = await fetch(`${process.env.WP_API_BASE_URL || 'https://admin.dnbdoctor.com/wp-json/mlds/v1'}/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ track_id, token, rating, feedback, name }),
          cache: 'no-store',
        })
        if (!resp.ok) {
          const text = await resp.text()
          console.warn('WP feedback forward failed:', text)
        }
      } catch (e) {
        console.warn('WP feedback forward error:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback submit error:', error)
    return NextResponse.json({ error: 'Failed to submit feedback' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token') || ''
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

    const record = await prisma.demoFeedback.findUnique({ where: { token } })
    if (!record) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json({
      subject: record.subject,
      message: record.message,
      files: record.files,
      recipientEmail: record.recipientEmail,
      submittedAt: record.submittedAt,
    })
  } catch (error) {
    console.error('Feedback fetch error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}


