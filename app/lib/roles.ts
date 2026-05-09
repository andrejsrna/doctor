import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/lib/prisma"

export type AppRole = "ADMIN" | "EDITOR" | "ARTIST" | "USER"

export async function getRequestUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true },
  })
}

export async function requireRole(request: NextRequest, roles: AppRole[]) {
  const user = await getRequestUser(request)
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    }
  }

  if (!roles.includes(user.role as AppRole)) {
    return {
      user,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    }
  }

  return { user, response: null }
}

export function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
