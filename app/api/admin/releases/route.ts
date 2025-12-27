import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/lib/auth"
import { validateAdminOrigin } from "@/app/lib/adminUtils"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function nullable<T>(value: T | null | undefined) {
  return value === undefined ? undefined : value
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
      releaseType: data.releaseType || "NORMAL",
      downloadFileUrl: data.downloadFileUrl || null,
      downloadFileKey: data.downloadFileKey || null,
      downloadFileName: data.downloadFileName || null,
      coverImageUrl: data.coverImageUrl || null,
      coverImageKey: data.coverImageKey || null,
      artworkImageUrl: data.artworkImageUrl || null,
      artworkImageKey: data.artworkImageKey || null,
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
  try {
    // New content affects homepage hero/featured and lists
    revalidatePath(`/`)
    revalidatePath(`/new-fans`)
    revalidatePath(`/music`)
    // Single page and APIs
    if (created.slug) {
      revalidatePath(`/music/${created.slug}`)
      revalidatePath(`/api/releases/${created.slug}`)
    }
    revalidatePath(`/api/releases`)
  } catch (e) {
    console.error("Failed to revalidate paths after release create", e)
  }
  return NextResponse.json({ item: created })
}

export async function PATCH(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  validateAdminOrigin(request)
  const { id, ...data } = await request.json()
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  // Fetch previous values to handle slug change invalidation
  const previous = await prisma.release.findUnique({ where: { id }, select: { slug: true } })

  const updated = await prisma.release.update({
    where: { id },
    data: {
      title: data.title,
      content: nullable(data.content),
      releaseType: nullable(data.releaseType),
      downloadFileUrl: nullable(data.downloadFileUrl),
      downloadFileKey: nullable(data.downloadFileKey),
      downloadFileName: nullable(data.downloadFileName),
      coverImageUrl: nullable(data.coverImageUrl),
      coverImageKey: nullable(data.coverImageKey),
      artworkImageUrl: nullable(data.artworkImageUrl),
      artworkImageKey: nullable(data.artworkImageKey),
      previewUrl: nullable(data.previewUrl),
      spotify: nullable(data.spotify),
      appleMusic: nullable(data.appleMusic),
      beatport: nullable(data.beatport),
      deezer: nullable(data.deezer),
      soundcloud: nullable(data.soundcloud),
      youtubeMusic: nullable(data.youtubeMusic),
      junoDownload: nullable(data.junoDownload),
      tidal: nullable(data.tidal),
      gumroad: nullable(data.gumroad),
      bandcamp: nullable(data.bandcamp),
      categories: Array.isArray(data.categories) ? data.categories : undefined,
      publishedAt: data.publishedAt === null ? null : data.publishedAt ? new Date(data.publishedAt) : undefined,
    },
  })

  // Revalidate single page and listings
  try {
    const oldSlug = previous?.slug
    const newSlug = updated.slug
    if (oldSlug) revalidatePath(`/music/${oldSlug}`)
    if (newSlug && newSlug !== oldSlug) revalidatePath(`/music/${newSlug}`)
    // Listings and home/landing pages using latest/featured music
    revalidatePath(`/music`)
    revalidatePath(`/`)
    revalidatePath(`/new-fans`)
    // API endpoints consumed by clients
    revalidatePath(`/api/releases`)
    if (newSlug) revalidatePath(`/api/releases/${newSlug}`)
  } catch (e) {
    console.error("Failed to revalidate paths for release update", e)
  }
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
