import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireRole } from "@/app/lib/roles"

export async function GET(request: NextRequest) {
  const { response } = await requireRole(request, ["ADMIN"])
  if (response) return response

  const [artists, globalDocuments, documentTemplates, templates, totals] = await Promise.all([
    prisma.artist.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } },
          },
        },
        labTasks: {
          select: {
            id: true,
            title: true,
            category: true,
            priority: true,
            status: true,
            dueAt: true,
            completedAt: true,
          },
          orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "asc" }],
        },
        documents: {
          select: { id: true, title: true, type: true, url: true, isPinned: true },
          orderBy: [{ isPinned: "desc" }, { createdAt: "asc" }],
        },
        releasePlans: {
          select: { id: true, name: true, status: true, releaseDate: true },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.artistDocument.findMany({
      where: { artistId: null, isTemplate: false },
      orderBy: [{ isPinned: "desc" }, { createdAt: "asc" }],
      take: 20,
    }),
    prisma.artistDocument.findMany({
      where: { artistId: null, isTemplate: true },
      orderBy: [{ createdAt: "asc" }],
      take: 20,
    }),
    prisma.artistTaskTemplate.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 50,
    }),
    Promise.all([
      prisma.artistTask.count(),
      prisma.artistTask.count({ where: { status: "DONE" } }),
      prisma.artistTask.count({
        where: { status: { not: "DONE" }, dueAt: { lt: new Date() } },
      }),
      prisma.artistMember.count(),
    ]),
  ])

  const [taskCount, doneCount, overdueCount, memberCount] = totals

  return NextResponse.json({
    artists: artists.map((artist) => {
      const total = artist.labTasks.length
      const done = artist.labTasks.filter((task) => task.status === "DONE").length
      const overdue = artist.labTasks.filter((task) => {
        return task.status !== "DONE" && task.dueAt && task.dueAt < new Date()
      }).length

      return {
        ...artist,
        progress: total > 0 ? Math.round((done / total) * 100) : 0,
        taskSummary: { total, done, overdue },
      }
    }),
    globalDocuments,
    documentTemplates,
    templates,
    stats: {
      artists: artists.length,
      members: memberCount,
      tasks: taskCount,
      completedTasks: doneCount,
      overdueTasks: overdueCount,
      progress: taskCount > 0 ? Math.round((doneCount / taskCount) * 100) : 0,
    },
  })
}
