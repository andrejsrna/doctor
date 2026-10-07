import { NextRequest, NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { auth } from '@/app/lib/auth'
import { prisma } from '@/lib/prisma'
import { calendarPayload, validCalendarDate } from '@/lib/release-calendar'

export const dynamic = 'force-dynamic'

async function guard(request: NextRequest, write = false) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if ((session.user as { role?: string }).role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const origin = request.headers.get('origin')
  if (write && ((origin && origin !== request.nextUrl.origin) || request.headers.get('sec-fetch-site') === 'cross-site')) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 })
  }
}

export async function GET(request: NextRequest) {
  const denied = await guard(request)
  if (denied) return denied
  const month = request.nextUrl.searchParams.get('month') || ''
  if (!/^\d{4}-\d{2}$/.test(month) || !validCalendarDate(`${month}-01`)) return NextResponse.json({ error: 'Invalid month' }, { status: 400 })
  try {
    const start = new Date(`${month}-01T00:00:00Z`)
    const end = new Date(start)
    end.setUTCMonth(end.getUTCMonth() + 1)
    const [items, releases] = await Promise.all([
      prisma.releaseCalendarEntry.findMany({ where: { releaseDate: { gte: start, lt: end } }, orderBy: [{ releaseDate: 'asc' }, { title: 'asc' }] }),
      prisma.release.findMany({ select: { id: true, title: true }, orderBy: { title: 'asc' } }),
    ])
    return NextResponse.json({ items, releases }, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (error) {
    console.error('Calendar load failed', error)
    return NextResponse.json({ error: 'Could not load calendar' }, { status: 500 })
  }
}

async function save(request: NextRequest, update: boolean) {
  const denied = await guard(request, true)
  if (denied) return denied
  let body: Record<string, unknown>
  let data: ReturnType<typeof calendarPayload>
  try {
    body = await request.json()
    data = calendarPayload(body)
    if (update && (typeof body.id !== 'string' || !body.id)) throw new Error('Missing entry ID')
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Invalid request' }, { status: 400 })
  }
  try {
    if (data.releaseId && !await prisma.release.findUnique({ where: { id: data.releaseId }, select: { id: true } })) {
      return NextResponse.json({ error: 'Release not found' }, { status: 400 })
    }
    const item = update
      ? await prisma.releaseCalendarEntry.update({ where: { id: body.id as string }, data })
      : await prisma.releaseCalendarEntry.create({ data })
    return NextResponse.json({ item }, { status: update ? 200 : 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') return NextResponse.json({ error: 'This catalogue number is already scheduled' }, { status: 409 })
      if (error.code === 'P2025') return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    }
    console.error('Calendar save failed', error)
    return NextResponse.json({ error: 'Could not save entry' }, { status: 500 })
  }
}

export function POST(request: NextRequest) { return save(request, false) }
export function PATCH(request: NextRequest) { return save(request, true) }

export async function DELETE(request: NextRequest) {
  const denied = await guard(request, true)
  if (denied) return denied
  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing entry ID' }, { status: 400 })
  try {
    await prisma.releaseCalendarEntry.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
    return NextResponse.json({ error: 'Could not delete entry' }, { status: 500 })
  }
}
