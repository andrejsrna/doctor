import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const item = await prisma.news.findUnique({ where: { slug } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const res = NextResponse.json({ item })
  res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400')
  return res
}


