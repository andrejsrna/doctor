import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { validateAdminOrigin } from "@/app/lib/adminUtils"
import { requireRole } from "@/app/lib/roles"
import { prisma } from "@/lib/prisma"
import { assignArtistOnboardingTasks } from "@/lib/artistLabOnboarding"
import { assignArtistProfileSetupTasks } from "@/lib/artistLabProfileSetup"
import { assignArtistReleaseWeekTasks } from "@/lib/artistLabReleaseWeek"
import { assignArtistContentIdeasTasks } from "@/lib/artistLabContentIdeas"
import { assignArtistShortVideoTasks } from "@/lib/artistLabShortVideo"
import { assignArtistAssetsTasks } from "@/lib/artistLabAssets"
import { assignArtistNoSpamSharingTasks } from "@/lib/artistLabNoSpamSharing"
import { assignArtistMonthlyRoutineTasks } from "@/lib/artistLabMonthlyRoutine"
import { assignArtistFanEngagementTasks } from "@/lib/artistLabFanEngagement"

export async function POST(request: NextRequest) {
  const { response } = await requireRole(request, ["ADMIN"])
  if (response) return response
  validateAdminOrigin(request)

  const data = await request.json()
  const artistId = String(data.artistId || "")
  const email = String(data.email || "").trim().toLowerCase()
  const name = String(data.name || "").trim()
  const password = String(data.password || "")

  if (!artistId || !email || !name) {
    return NextResponse.json({ error: "Artist, name and email are required" }, { status: 400 })
  }

  const artist = await prisma.artist.findUnique({ where: { id: artistId } })
  if (!artist) return NextResponse.json({ error: "Artist not found" }, { status: 404 })

  let user = await prisma.user.findUnique({ where: { email } })

  if (!user) {
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const signUpResponse = await auth.api.signUpEmail({
      body: { email, name, password },
      asResponse: true,
    })

    if (!signUpResponse.ok) {
      const text = await signUpResponse.text()
      return NextResponse.json({ error: text || "Failed to create account" }, { status: 400 })
    }

    user = await prisma.user.findUnique({ where: { email } })
  }

  if (!user) return NextResponse.json({ error: "User was not created" }, { status: 500 })

  const [updatedUser, membership] = await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { role: "ARTIST", name },
      select: { id: true, name: true, email: true, role: true },
    }),
    prisma.artistMember.upsert({
      where: { userId_artistId: { userId: user.id, artistId } },
      update: { role: data.memberRole || "OWNER" },
      create: { userId: user.id, artistId, role: data.memberRole || "OWNER" },
    }),
  ])

  await assignArtistOnboardingTasks(prisma, artistId)
  await assignArtistProfileSetupTasks(prisma, artistId)
  await assignArtistReleaseWeekTasks(prisma, artistId)
  await assignArtistContentIdeasTasks(prisma, artistId)
  await assignArtistShortVideoTasks(prisma, artistId)
  await assignArtistAssetsTasks(prisma, artistId)
  await assignArtistNoSpamSharingTasks(prisma, artistId)
  await assignArtistMonthlyRoutineTasks(prisma, artistId)
  await assignArtistFanEngagementTasks(prisma, artistId)

  return NextResponse.json({ user: updatedUser, membership })
}
