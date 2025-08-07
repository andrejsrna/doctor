import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CreateInfluencerData {
  email: string;
  name?: string;
  platform?: string;
  handle?: string;
  followers?: number;
  engagement?: number;
  category?: string;
  location?: string;
  notes?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'CONTACTED' | 'RESPONDED' | 'COLLABORATING';
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIP';
  tags?: string[];
}

interface InfluencerResponse {
  id: string;
  email: string;
  name: string | null;
  platform: string | null;
  handle: string | null;
  followers: number | null;
  engagement: number | null;
  category: string | null;
  location: string | null;
  notes: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'CONTACTED' | 'RESPONDED' | 'COLLABORATING';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'VIP';
  lastContact: Date | null;
  nextContact: Date | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  subscriber?: {
    id: string;
    name: string | null;
    category?: {
      id: string;
      name: string;
      color: string;
    } | null;
  } | null;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const debug = searchParams.get('debug') === '1';
    const includeStats = searchParams.get('includeStats') === '1';

    const where: Record<string, unknown> = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { handle: { contains: search, mode: 'insensitive' } },
        { platform: { contains: search, mode: 'insensitive' } },
      ];
    }

    let influencers = await prisma.influencer.findMany({
      where,
      include: {
        subscriber: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (
      influencers.length === 0 &&
      !status && !category && !priority && !search
    ) {
      try {
        const flagged = await prisma.category.findMany({ where: { influencersEnabled: true }, select: { id: true, name: true } });
        for (const f of flagged) {
          const subs = await prisma.subscriber.findMany({ where: { categoryId: f.id } });
          for (const s of subs) {
            const emailLc = s.email.toLowerCase();
            const exists = await prisma.influencer.findUnique({ where: { email: emailLc } });
            if (!exists) {
              await prisma.influencer.create({
                data: {
                  email: emailLc,
                  name: s.name || undefined,
                  status: 'ACTIVE',
                  priority: 'MEDIUM',
                  tags: ['newsletter-sync'],
                  notes: `Auto-synced from newsletter category: ${f.name}`
                }
              });
            }
          }
        }
        influencers = await prisma.influencer.findMany({
          where,
          include: { subscriber: { include: { category: true } } },
          orderBy: { createdAt: 'desc' },
        });
      } catch (e) {
        console.error('Auto-repair sync failed:', e);
      }
    }

    if (includeStats) {
      const subscriberIds = influencers.map((i) => i.subscriber?.id).filter(Boolean) as string[];
      const emails = influencers.map((i) => i.email);

      const [sentAgg, openAgg, clickAgg, fbAgg] = await Promise.all([
        subscriberIds.length
          ? prisma.emailLog.groupBy({
              by: ['subscriberId'],
              where: { subscriberId: { in: subscriberIds }, status: 'SENT' },
              _count: { _all: true },
              _max: { sentAt: true },
            })
          : Promise.resolve([]),
        subscriberIds.length
          ? prisma.emailLog.groupBy({
              by: ['subscriberId'],
              where: { subscriberId: { in: subscriberIds }, openedAt: { not: null } },
              _count: { _all: true },
              _max: { openedAt: true },
            })
          : Promise.resolve([]),
        subscriberIds.length
          ? prisma.emailLog.groupBy({
              by: ['subscriberId'],
              where: { subscriberId: { in: subscriberIds }, clickedAt: { not: null } },
              _count: { _all: true },
              _max: { clickedAt: true },
            })
          : Promise.resolve([]),
        emails.length
          ? prisma.demoFeedback.groupBy({
              by: ['recipientEmail'],
              where: { recipientEmail: { in: emails }, submittedAt: { not: null } },
              _count: { _all: true },
              _avg: { rating: true },
              _max: { submittedAt: true },
            })
          : Promise.resolve([]),
      ]);

      const sentMap = new Map(sentAgg.map((a) => [a.subscriberId, a]));
      const openMap = new Map(openAgg.map((a) => [a.subscriberId, a]));
      const clickMap = new Map(clickAgg.map((a) => [a.subscriberId, a]));
      const fbMap = new Map(fbAgg.map((a) => [a.recipientEmail, a]));

      const enriched = influencers.map((i) => {
        const sid = i.subscriber?.id || '';
        const s = sentMap.get(sid);
        const o = openMap.get(sid);
        const c = clickMap.get(sid);
        const f = fbMap.get(i.email);
        return {
          ...i,
          stats: {
            newsletter: {
              sent: s?._count?._all || 0,
              opened: o?._count?._all || 0,
              clicked: c?._count?._all || 0,
              lastSentAt: s?._max?.sentAt || null,
            },
            feedbacks: {
              total: f?._count?._all || 0,
              avgRating: f?._avg?.rating || null,
              lastSubmittedAt: f?._max?.submittedAt || null,
            },
          },
        };
      });

      if (debug) {
        const flagged = await prisma.category.findMany({ where: { influencersEnabled: true } });
        const flaggedStats = await Promise.all(flagged.map(async (f) => {
          const subs = await prisma.subscriber.findMany({ where: { categoryId: f.id } });
          return {
            id: f.id,
            name: f.name,
            subscribers: subs.length,
            sampleEmails: subs.slice(0, 5).map(s => s.email)
          };
        }));
        return NextResponse.json({ influencers: enriched, debug: { flaggedCategories: flaggedStats } });
      }

      return NextResponse.json(enriched as unknown as InfluencerResponse[]);
    }

    if (debug) {
      const flagged = await prisma.category.findMany({ where: { influencersEnabled: true } });
      const flaggedStats = await Promise.all(flagged.map(async (f) => {
        const subs = await prisma.subscriber.findMany({ where: { categoryId: f.id } });
        return {
          id: f.id,
          name: f.name,
          subscribers: subs.length,
          sampleEmails: subs.slice(0, 5).map(s => s.email)
        };
      }));
      return NextResponse.json({ influencers, debug: { flaggedCategories: flaggedStats } });
    }

    return NextResponse.json(influencers as InfluencerResponse[]);
  } catch (error) {
    const details = (typeof error === 'object' && error && 'message' in error) 
      ? (error as { message?: string }).message 
      : String(error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to fetch influencers', details },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateInfluencerData = await request.json();
    const { email, name, platform, handle, followers, engagement, category, location, notes, status, priority, tags } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    const existingInfluencer = await prisma.influencer.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingInfluencer) {
      return NextResponse.json(
        { success: false, error: 'Influencer with this email already exists' },
        { status: 409 }
      );
    }

    const influencer = await prisma.influencer.create({
      data: {
        email: email.toLowerCase(),
        name,
        platform,
        handle,
        followers,
        engagement,
        category,
        location,
        notes,
        status: status || 'ACTIVE',
        priority: priority || 'MEDIUM',
        tags: tags || [],
      },
      include: {
        subscriber: {
          include: {
            category: true,
          },
        },
      },
    });

    const existingSubscriber = await prisma.subscriber.findUnique({ where: { email: email.toLowerCase() } });
    if (!existingSubscriber) {
      const flaggedCategory = await prisma.category.findFirst({ where: { influencersEnabled: true } });
      await prisma.subscriber.create({
        data: {
          email: email.toLowerCase(),
          name: name || undefined,
          status: 'ACTIVE',
          source: 'influencers',
          tags: ['influencer-sync'],
          categoryId: flaggedCategory?.id,
        }
      });
    }

    return NextResponse.json(
      { success: true, influencer: influencer as InfluencerResponse },
      { status: 201 }
    );
  } catch (error) {
    const details = (typeof error === 'object' && error && 'message' in error) 
      ? (error as { message?: string }).message 
      : String(error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to create influencer', details },
      { status: 500 }
    );
  }
} 