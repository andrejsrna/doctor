import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { user, response } = await requireRole(request, ["ARTIST", "ADMIN"])
  if (response) return response
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const membership = await prisma.artistMember.findFirst({
    where: user.role === "ADMIN" ? {} : { userId: user.id },
    include: {
      artist: {
        include: {
          labTasks: {
            orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "asc" }],
          },
          documents: {
            orderBy: [{ isPinned: "desc" }, { createdAt: "asc" }],
          },
          releasePlans: {
            include: {
              tasks: {
                orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "asc" }],
              },
            },
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  })

  if (!membership) {
    return NextResponse.json({ error: "No artist workspace assigned" }, { status: 404 })
  }

  const globalDocuments = await prisma.artistDocument.findMany({
    where: { artistId: null, isTemplate: false },
    orderBy: [{ isPinned: "desc" }, { createdAt: "asc" }],
    take: 20,
  })

  const total = membership.artist.labTasks.length
  const done = membership.artist.labTasks.filter((task) => task.status === "DONE").length

  return NextResponse.json({
    user,
    membership,
    globalDocuments,
    progress: total > 0 ? Math.round((done / total) * 100) : 0,
  })
}
