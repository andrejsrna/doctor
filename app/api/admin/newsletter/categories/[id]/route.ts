import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function json(res: unknown, init?: ResponseInit) {
  const r = NextResponse.json(res, init);
  r.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  r.headers.set("Pragma", "no-cache");
  r.headers.set("Expires", "0");
  return r;
}

export async function PATCH(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const body = await _req.json();
    const { name, color, description, influencersEnabled } = body || {};
    if (!name || !color || !description || typeof influencersEnabled === 'undefined') {
      return json({ success: false, error: "Name, color, description and influencersEnabled are required" }, { status: 400 });
    }

    const { id } = await ctx.params;
    const previous = await prisma.category.findUnique({ where: { id } });
    const category = await prisma.category.update({
      where: { id },
      data: { name, color, description, influencersEnabled }
    });

    if (previous && !previous.influencersEnabled && category.influencersEnabled) {
      try {
        const subscribers = await prisma.subscriber.findMany({ where: { categoryId: id } });
        for (const s of subscribers) {
          const emailLc = s.email.toLowerCase();
          const existing = await prisma.influencer.findUnique({ where: { email: emailLc } });
          if (existing) {
            await prisma.influencer.update({
              where: { email: emailLc },
              data: {
                name: s.name || existing.name,
                status: 'ACTIVE',
                tags: Array.from(new Set([...(existing.tags || []), 'newsletter-sync']))
              }
            });
          } else {
            await prisma.influencer.create({
              data: {
                email: emailLc,
                name: s.name || undefined,
                status: 'ACTIVE',
                priority: 'MEDIUM',
                tags: ['newsletter-sync'],
                notes: `Auto-synced from newsletter category: ${category.name}`
              }
            });
          }
        }
      } catch (e) {
        console.error('Auto-sync on enable failed:', e);
      }
    }

    return json({ success: true, category });
  } catch (error) {
    console.error("Error updating category:", error);
    return json({ success: false, error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    await prisma.$transaction([
      prisma.subscriber.updateMany({ where: { categoryId: id }, data: { categoryId: null } }),
      prisma.category.delete({ where: { id } })
    ]);
    return json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return json({ success: false, error: "Failed to delete category" }, { status: 500 });
  }
}


