import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const rows = await prisma.release.findMany({ select: { categories: true } })
  const set = new Set<string>()
  for (const r of rows) (r.categories || []).forEach(c => c && set.add(c))
  const categories = Array.from(set).sort((a, b) => a.localeCompare(b))
  return NextResponse.json({ categories })
}


