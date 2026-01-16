import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendMetaCapiEvent } from '@/lib/metaCapi'

export async function POST(request: NextRequest) {
  const { slug, title, eventId, eventSourceUrl } = await request
    .json()
    .catch(() => ({ slug: '', title: undefined, eventId: undefined, eventSourceUrl: undefined }))

  const safeSlug = typeof slug === 'string' ? slug : ''
  const safeTitle = typeof title === 'string' ? title.slice(0, 200) : undefined
  const safeEventId = typeof eventId === 'string' ? eventId.slice(0, 80) : undefined
  const safeEventSourceUrl = typeof eventSourceUrl === 'string' ? eventSourceUrl.slice(0, 500) : undefined

  if (!safeSlug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 })
  }

  const release = await prisma.release.findUnique({
    where: { slug: safeSlug },
    select: { id: true },
  })

  if (!release) {
    return NextResponse.json({ error: 'Release not found' }, { status: 404 })
  }

  await sendMetaCapiEvent({
    request,
    eventName: 'ViewContent',
    eventId: safeEventId,
    eventSourceUrl: safeEventSourceUrl,
    customData: {
      ...(safeTitle ? { content_name: safeTitle } : {}),
      content_type: 'product',
      content_category: 'Music',
      content_ids: [safeSlug],
    },
  })

  return NextResponse.json({ ok: true })
}

