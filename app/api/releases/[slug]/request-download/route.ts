import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/app/services/email"
import crypto from "node:crypto"

const RequestSchema = z.object({
  email: z.string().email(),
  acceptPrivacy: z.boolean(),
  acceptNewsletter: z.boolean(),
})

function getSiteBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.BASE_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  return raw.replace(/\/$/, "")
}

function newToken() {
  return crypto.randomBytes(32).toString("base64url")
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const json = await request.json().catch(() => null)
  const parsed = RequestSchema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  if (!parsed.data.acceptPrivacy) return NextResponse.json({ error: "Privacy policy consent required" }, { status: 400 })
  if (!parsed.data.acceptNewsletter) return NextResponse.json({ error: "Newsletter consent required" }, { status: 400 })

  const release = await prisma.release.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      releaseType: true,
      downloadFileKey: true,
      downloadFileUrl: true,
      downloadFileName: true,
    },
  })
  if (!release) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (release.releaseType !== "FREE_DOWNLOAD") {
    return NextResponse.json({ error: "This release is not a free download" }, { status: 400 })
  }
  if (!release.downloadFileKey && !release.downloadFileUrl) {
    return NextResponse.json({ error: "Free download file not configured yet" }, { status: 400 })
  }

  const email = parsed.data.email.toLowerCase().trim()
  const now = new Date()
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const existing = await prisma.releaseDownloadToken.findFirst({
    where: {
      releaseId: release.id,
      email,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  })

  const tokenRow =
    existing ??
    (await prisma.releaseDownloadToken.create({
      data: {
        token: newToken(),
        email,
        releaseId: release.id,
        expiresAt,
      },
    }))

  await prisma.subscriber.upsert({
    where: { email },
    create: {
      email,
      status: "ACTIVE",
      subscribedAt: now,
      source: `free-download:${slug}`,
      tags: ["free-download", `free-download:${slug}`],
    },
    update: {
      status: "ACTIVE",
      source: `free-download:${slug}`,
      tags: { push: ["free-download", `free-download:${slug}`] },
    },
  })

  const site = getSiteBaseUrl()
  const downloadUrl = `${site}/api/download/${tokenRow.token}`
  const safeTitle = release.title

  const filenameLine = release.downloadFileName ? `File: ${release.downloadFileName}\n\n` : ""

  await sendEmail({
    to: email,
    subject: `Your download link: ${safeTitle}`,
    text:
      `Here is your download link for "${safeTitle}".\n\n` +
      filenameLine +
      `${downloadUrl}\n\n` +
      `This link expires in 24 hours.`,
    html: `
      <p>Here is your download link for <strong>${safeTitle}</strong>.</p>
      ${release.downloadFileName ? `<p><strong>File:</strong> ${release.downloadFileName}</p>` : ""}
      <p><a href="${downloadUrl}">Download</a></p>
      <p style="color:#666;font-size:12px">This link expires in 24 hours.</p>
    `,
  })

  return NextResponse.json({ ok: true })
}
