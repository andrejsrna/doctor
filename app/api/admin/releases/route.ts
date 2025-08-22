import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/lib/auth"
import { validateAdminOrigin } from "@/app/lib/adminUtils"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const search = searchParams.get("search") || ""
  const category = searchParams.get("category") || ""

  const skip = (page - 1) * limit
  const where: {
    OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; slug?: { contains: string; mode: 'insensitive' } }>
    categories?: { has: string }
  } = {}
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" as const } },
      { slug: { contains: search, mode: "insensitive" as const } },
    ]
  }
  if (category) where.categories = { has: category }

  const [items, total] = await Promise.all([
    prisma.release.findMany({ where, orderBy: { publishedAt: "desc" }, skip, take: limit }),
    prisma.release.count({ where }),
  ])

  return NextResponse.json({
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  })
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)
  const data = await request.json()
  const created = await prisma.release.create({
    data: {
      slug: data.slug,
      title: data.title,
      content: data.content || null,
      coverImageUrl: data.coverImageUrl || null,
      coverImageKey: data.coverImageKey || null,
      previewUrl: data.previewUrl || null,
      spotify: data.spotify || null,
      appleMusic: data.appleMusic || null,
      beatport: data.beatport || null,
      deezer: data.deezer || null,
      soundcloud: data.soundcloud || null,
      youtubeMusic: data.youtubeMusic || null,
      junoDownload: data.junoDownload || null,
      tidal: data.tidal || null,
      gumroad: data.gumroad || null,
      bandcamp: data.bandcamp || null,
      categories: Array.isArray(data.categories) ? data.categories : [],
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
    },
  })
  return NextResponse.json({ item: created })
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)
  const { id, ...data } = await request.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const updated = await prisma.release.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content ?? undefined,
      coverImageUrl: data.coverImageUrl ?? undefined,
      coverImageKey: data.coverImageKey ?? undefined,
      previewUrl: data.previewUrl ?? undefined,
      spotify: data.spotify ?? undefined,
      appleMusic: data.appleMusic ?? undefined,
      beatport: data.beatport ?? undefined,
      deezer: data.deezer ?? undefined,
      soundcloud: data.soundcloud ?? undefined,
      youtubeMusic: data.youtubeMusic ?? undefined,
      junoDownload: data.junoDownload ?? undefined,
      tidal: data.tidal ?? undefined,
      gumroad: data.gumroad ?? undefined,
      bandcamp: data.bandcamp ?? undefined,
      categories: Array.isArray(data.categories) ? data.categories : undefined,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined,
    },
  })
  return NextResponse.json({ item: updated })
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  await prisma.release.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}


