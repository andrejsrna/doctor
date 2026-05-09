import { NextRequest, NextResponse } from "next/server"
import { validateAdminOrigin } from "@/app/lib/adminUtils"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const { response } = await requireRole(request, ["ADMIN"])
  if (response) return response
  validateAdminOrigin(request)

  const data = await request.json()
  const artistId = String(data.artistId || "")
  const title = String(data.title || "").trim()
  const category = String(data.category || "Growth").trim()

  if (!artistId || !title) {
    return NextResponse.json({ error: "Artist and title are required" }, { status: 400 })
  }

  const task = await prisma.artistTask.create({
    data: {
      artistId,
      title,
      category,
      description: data.description || null,
      priority: data.priority || "NORMAL",
      dueAt: data.dueAt ? new Date(data.dueAt) : null,
      releasePlanId: data.releasePlanId || null,
      documentId: data.documentId || null,
    },
  })

  return NextResponse.json({ task })
}
