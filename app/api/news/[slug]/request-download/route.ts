import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/app/services/email'
import { mixDownloadLink } from '@/lib/mixDownload'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

/** Mix download behind an email opt-in: adds the address to the newsletter and emails a signed 7-day link. */
export async function POST(request: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  // Honeypot: pretend it worked.
  if (typeof body.website === 'string' && body.website) return NextResponse.json({ ok: true })

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase().slice(0, 254) : ''
  if (!EMAIL.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  if (body.acceptPrivacy !== true || body.acceptNewsletter !== true) {
    return NextResponse.json({ error: 'Please accept the privacy policy and the newsletter to get the mix.' }, { status: 400 })
  }

  const post = await prisma.news.findUnique({ where: { slug }, select: { title: true, mixDownloadUrl: true, categories: true } })
  if (!post?.mixDownloadUrl || !post.categories.includes('Mixes')) return NextResponse.json({ error: 'This mix has no download.' }, { status: 404 })

  const tag = `mix-download:${slug}`
  const existing = await prisma.subscriber.findUnique({ where: { email }, select: { tags: true } })
  if (existing) {
    const tags = [...new Set([...existing.tags, 'mix-download', tag])]
    await prisma.subscriber.update({ where: { email }, data: { status: 'ACTIVE', tags } })
  } else {
    const category = await prisma.category.findFirst({ where: { name: { equals: 'Newsletter', mode: 'insensitive' } }, select: { id: true } })
    await prisma.subscriber.create({
      data: { email, status: 'ACTIVE', source: tag, tags: ['mix-download', tag], categoryId: category?.id, notes: `Subscribed via mix download (${slug})` },
    })
  }

  const link = mixDownloadLink(slug, email)
  const title = esc(post.title)
  try {
    await sendEmail({
      to: email,
      subject: `Your download: ${post.title}`,
      text: `Here is your download link for "${post.title}".\n\n${link}\n\nThe link works for 7 days.\n\nMore mixes: https://dnbdoctor.com/neurofunk-dnb-mixes`,
      html: `
        <div style="background:#0b0b0f;color:#e8e8ec;padding:28px;font-family:Arial,Helvetica,sans-serif">
          <p style="margin:0 0 6px;color:#39ff14;font:700 12px/1.4 monospace;letter-spacing:2px;text-transform:uppercase">DnB Doctor · mix download</p>
          <h1 style="margin:0 0 18px;font-size:24px;line-height:1.1;text-transform:uppercase;color:#fff">${title}</h1>
          <p style="margin:0 0 22px">
            <a href="${link}" style="display:inline-block;background:#39ff14;color:#050505;padding:14px 22px;font:700 13px monospace;letter-spacing:2px;text-transform:uppercase;text-decoration:none">Download the mix</a>
          </p>
          <p style="margin:0 0 6px;color:#9a9aa5;font-size:13px">The link works for 7 days.</p>
          <p style="margin:0;color:#9a9aa5;font-size:13px">More mixes: <a href="https://dnbdoctor.com/neurofunk-dnb-mixes" style="color:#9b5eff">dnbdoctor.com/neurofunk-dnb-mixes</a></p>
        </div>`,
    })
  } catch {
    return NextResponse.json({ error: 'We could not send the email. Please try again later.' }, { status: 502 })
  }
  return NextResponse.json({ ok: true })
}
