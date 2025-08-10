import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });

    const influencer = await prisma.influencer.findUnique({
      where: { id },
      include: { subscriber: { include: { category: true } } },
    });
    if (!influencer) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const feedbacks = await prisma.demoFeedback.findMany({
      where: { recipientEmail: influencer.email.toLowerCase(), submittedAt: { not: null } },
      orderBy: { submittedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        subject: true,
        rating: true,
        feedback: true,
        submittedAt: true,
        createdAt: true,
        wpPostId: true,
      }
    });

    return NextResponse.json({ success: true, influencer, feedbacks });
  } catch (error) {
    const details = (typeof error === 'object' && error && 'message' in error)
      ? (error as { message?: string }).message
      : String(error);
    return NextResponse.json({ success: false, error: 'Failed to fetch influencer', details }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });

    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (typeof body.name !== 'undefined') data.name = body.name || null;
    if (typeof body.platform !== 'undefined') data.platform = body.platform || null;
    if (typeof body.handle !== 'undefined') data.handle = body.handle || null;
    if (typeof body.followers !== 'undefined') data.followers = body.followers === '' ? null : Number(body.followers);
    if (typeof body.engagement !== 'undefined') data.engagement = body.engagement === '' ? null : Number(body.engagement);
    if (typeof body.category !== 'undefined') data.category = body.category || null;
    if (typeof body.location !== 'undefined') data.location = body.location || null;
    if (typeof body.notes !== 'undefined') data.notes = body.notes || null;
    if (typeof body.status !== 'undefined') data.status = body.status;
    if (typeof body.priority !== 'undefined') data.priority = body.priority;
    if (typeof body.tags !== 'undefined') data.tags = Array.isArray(body.tags) ? body.tags : String(body.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const updated = await prisma.influencer.update({
      where: { id },
      data,
      include: { subscriber: { include: { category: true } } },
    });

    return NextResponse.json({ success: true, influencer: updated });
  } catch (error) {
    const details = (typeof error === 'object' && error && 'message' in error)
      ? (error as { message?: string }).message
      : String(error);
    return NextResponse.json({ success: false, error: 'Failed to update influencer', details }, { status: 500 });
  }
}