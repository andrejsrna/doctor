import { NextRequest, NextResponse } from "next/server"
import { validateAdminOrigin } from "@/app/lib/adminUtils"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { response } = await requireRole(request, ["ADMIN"])
  if (response) return response
  validateAdminOrigin(request)

  const data = await request.json()
  const title = String(data.title || "").trim()

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const document = await prisma.artistDocument.create({
    data: {
      artistId: data.artistId || null,
      title,
      description: data.description || null,
      type: data.type || "LINK",
      url: data.url || null,
      content: data.content || null,
      isPinned: Boolean(data.isPinned),
      isTemplate: Boolean(data.isTemplate),
    },
  })

  return NextResponse.json({ document })
}
