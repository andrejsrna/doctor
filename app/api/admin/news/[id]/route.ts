import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/lib/auth"

function unauthorized() { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }) }
const NEWS_CATEGORIES = ["Artist Interviews", "Streaming", "Press", "General", "Mixes"]

function normalizeCategories(input: unknown): string[] {
  if (!Array.isArray(input)) return ["General"]
  const filtered = input
    .map((c) => (typeof c === 'string' ? c.trim() : ''))
    .filter(Boolean)
    .filter((c) => NEWS_CATEGORIES.includes(c))
  return filtered.length ? filtered : ["General"]
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const params = await ctx.params
  const item = await prisma.news.findUnique({ where: { id: params.id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ item })
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  const params = await ctx.params
  const data = await request.json()
  const categories = data.categories ? normalizeCategories(data.categories) : undefined
  const updated = await prisma.news.update({ where: { id: params.id }, data: {
    slug: data.slug ?? undefined,
    title: data.title ?? undefined,
    content: data.content ?? undefined,
    coverImageUrl: data.coverImageUrl ?? undefined,
    coverImageKey: data.coverImageKey ?? undefined,
    scsc: data.scsc ?? undefined,
    relatedArtistName: data.relatedArtistName ?? undefined,
    publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
    categories,
  } })
  return NextResponse.json({ item: updated })
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  const params = await ctx.params
  await prisma.news.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

