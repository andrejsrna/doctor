import { NextRequest, NextResponse } from "next/server"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { user, response } = await requireRole(request, ["ARTIST", "ADMIN"])
  if (response) return response
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const params = await ctx.params
  const data = await request.json()
  const status = data.status === "DONE" ? "DONE" : data.status === "IN_PROGRESS" ? "IN_PROGRESS" : "TODO"

  const task = await prisma.artistTask.findUnique({
    where: { id: params.id },
    select: { id: true, artistId: true },
  })

  if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })

  if (user.role !== "ADMIN") {
    const membership = await prisma.artistMember.findFirst({
      where: { userId: user.id, artistId: task.artistId },
      select: { id: true },
    })
    if (!membership) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const updated = await prisma.artistTask.update({
    where: { id: task.id },
    data: {
      status,
      completedAt: status === "DONE" ? new Date() : null,
      completedById: status === "DONE" ? user.id : null,
    },
  })

  return NextResponse.json({ task: updated })
}
