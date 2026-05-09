import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireRole(request, ["ARTIST", "ADMIN"])
  if (response) return response
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const params = await ctx.params

  const document = await prisma.artistDocument.findUnique({
    where: { id: params.id },
    include: {
      artist: { select: { id: true, name: true, slug: true } },
      tasks: {
        orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "asc" }],
      },
    },
  })

  if (!document) return NextResponse.json({ error: "Document not found" }, { status: 404 })

  if (document.isTemplate && user.role !== "ADMIN") {
    return NextResponse.json({ error: "Document not found" }, { status: 404 })
  }

  if (user.role === "ADMIN" && !document.artistId) {
    const membership = await prisma.artistMember.findFirst({
      select: { artistId: true },
    })

    if (!membership) return NextResponse.json({ document: { ...document, tasks: [] } })

    const tasks = await prisma.artistTask.findMany({
      where: { documentId: document.id, artistId: membership.artistId },
      orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "asc" }],
    })

    return NextResponse.json({ document: { ...document, tasks } })
  }

  if (user.role !== "ADMIN" && document.artistId) {
    const membership = await prisma.artistMember.findFirst({
      where: { userId: user.id, artistId: document.artistId },
      select: { id: true },
    })
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (user.role !== "ADMIN" && !document.artistId) {
    const membership = await prisma.artistMember.findFirst({
      where: { userId: user.id },
      select: { artistId: true },
    })

    if (membership) {
      const tasks = await prisma.artistTask.findMany({
        where: { documentId: document.id, artistId: membership.artistId },
        orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "asc" }],
      })
      return NextResponse.json({ document: { ...document, tasks } })
    }
  }

  return NextResponse.json({ document })
}
