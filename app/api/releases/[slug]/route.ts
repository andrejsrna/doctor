import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const item = await prisma.release.findUnique({
    where: { slug },
    select: {
      id: true,
      wpId: true,
      slug: true,
      title: true,
      content: true,
      artistName: true,
      coverImageUrl: true,
      coverImageKey: true,
      previewUrl: true,
      releaseType: true,
      spotify: true,
      appleMusic: true,
      beatport: true,
      deezer: true,
      soundcloud: true,
      youtubeMusic: true,
      junoDownload: true,
      tidal: true,
      gumroad: true,
      bandcamp: true,
      categories: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const res = NextResponse.json({ item })
  res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
  return res
}

