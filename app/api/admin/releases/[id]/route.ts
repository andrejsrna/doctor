import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/lib/auth"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

function nullable<T>(value: T | null | undefined) {
  return value === undefined ? undefined : value
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const params = await ctx.params
  const item = await prisma.release.findUnique({
    where: { id: params.id },
    include: { streamingClicks: { orderBy: { count: "desc" } } },
  })
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ item })
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  const params = await ctx.params
  const data = await request.json()
  const previous = await prisma.release.findUnique({ where: { id: params.id }, select: { slug: true } })
  const updated = await prisma.release.update({
    where: { id: params.id },
    data: {
      slug: nullable(data.slug),
      title: nullable(data.title),
      content: nullable(data.content),
      releaseType: nullable(data.releaseType),
      downloadFileUrl: nullable(data.downloadFileUrl),
      downloadFileKey: nullable(data.downloadFileKey),
      downloadFileName: nullable(data.downloadFileName),
      coverImageUrl: nullable(data.coverImageUrl),
      coverImageKey: nullable(data.coverImageKey),
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
  try {
    const oldSlug = previous?.slug
    const newSlug = updated.slug
    if (oldSlug) revalidatePath(`/music/${oldSlug}`)
    if (newSlug && newSlug !== oldSlug) revalidatePath(`/music/${newSlug}`)
    revalidatePath(`/music`)
    revalidatePath(`/`)
    revalidatePath(`/new-fans`)
    revalidatePath(`/api/releases`)
    if (newSlug) revalidatePath(`/api/releases/${newSlug}`)
  } catch (e) {
    console.error("Failed to revalidate paths for release update", e)
  }
  return NextResponse.json({ item: updated })
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return unauthorized()
  const params = await ctx.params
  await prisma.release.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
