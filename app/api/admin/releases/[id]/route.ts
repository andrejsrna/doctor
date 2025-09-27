import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { auth } from "@/app/lib/auth"

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const params = await ctx.params
  const item = await prisma.release.findUnique({ where: { id: params.id } })
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
      slug: data.slug ?? undefined,
      title: data.title ?? undefined,
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


