import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { validateAdminOriginPermissive } from "@/app/lib/adminUtils";

interface CreateSubscriberData {
  email: string;
  name?: string;
  tags?: string[];
  category?: string;
  notes?: string;
  updateExisting?: boolean;
}

interface SubscriberResponse {
  id: string;
  email: string;
  name: string | null;
  subscribedAt: Date;
  status: 'ACTIVE' | 'PENDING' | 'UNSUBSCRIBED';
  source: string | null;
  tags: string[];
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    color: string;
    description: string;
  } | null;
  notes: string | null;
  lastEmailSent: Date | null;
  emailCount: number;
  createdAt: Date;
  updatedAt: Date;
}

function addNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0, private");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store");
  return response;
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const category = searchParams.get('category') || '';
    const includeInfluencers = searchParams.get('includeInfluencers') === '1';
    
    const skip = (page - 1) * limit;
    
    const conditions: any[] = [
      {
        status: {
          not: 'UNSUBSCRIBED'
        }
      }
    ];
    
    if (search) {
      conditions.push({
        OR: [
          { email: { contains: search, mode: 'insensitive' } },
          { name: { contains: search, mode: 'insensitive' } }
        ]
      });
    }
    
    if (status && status !== 'all') {
      conditions.push({ status });
    }
    
    if (category && category !== 'all') {
      conditions.push({ categoryId: category });
    }
    
    if (!includeInfluencers) {
      conditions.push({
        NOT: {
          category: {
            is: { influencersEnabled: true }
          }
        }
      });
    }

    const whereClause = { AND: conditions };
    
    const [subscribers, totalCount] = await Promise.all([
      prisma.subscriber.findMany({
        where: whereClause,
        include: {
          category: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.subscriber.count({
        where: whereClause
      })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const response = NextResponse.json({ 
      success: true, 
      subscribers: subscribers as SubscriberResponse[],
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      stats: {
        totalSubscribers: totalCount,
        activeSubscribers: await prisma.subscriber.count({
          where: {
            ...whereClause,
            status: 'ACTIVE'
          }
        }),
        pendingSubscribers: await prisma.subscriber.count({
          where: {
            ...whereClause,
            status: 'PENDING'
          }
        })
      }
    });

    return addNoCacheHeaders(response);
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subscribers',
        details: errorMessage
      },
      { status: 500 }
    );

    return addNoCacheHeaders(response);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    validateAdminOriginPermissive(request);

    const { email, name, tags, category, notes, updateExisting }: CreateSubscriberData = await request.json();
    let validCategoryId: string | undefined = undefined;
    if (category) {
      try {
        const cat = await prisma.category.findUnique({ where: { id: category } });
        if (cat) validCategoryId = category;
      } catch {
        validCategoryId = undefined;
      }
    }

    if (!email) {
      const response = NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
      return addNoCacheHeaders(response);
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingSubscriber) {
      if (updateExisting) {
        // Update existing subscriber
        const updatedSubscriber = await prisma.subscriber.update({
          where: { email: email.toLowerCase() },
          data: {
            name: name || existingSubscriber.name,
            status: "ACTIVE",
            source: "admin",
            tags: tags || existingSubscriber.tags,
            categoryId: validCategoryId || existingSubscriber.categoryId,
            notes: notes || existingSubscriber.notes,
          },
          include: { category: true }
        });

        if (updatedSubscriber.categoryId) {
          const cat = await prisma.category.findUnique({ where: { id: updatedSubscriber.categoryId } });
          if (cat?.influencersEnabled) {
          const emailLc = updatedSubscriber.email.toLowerCase();
          const existingInfluencer = await prisma.influencer.findUnique({ where: { email: emailLc } });
            if (existingInfluencer) {
              await prisma.influencer.update({
              where: { email: emailLc },
                data: {
                  name: updatedSubscriber.name || existingInfluencer.name,
                  status: 'ACTIVE',
                  tags: Array.from(new Set([...(existingInfluencer.tags || []), 'newsletter-sync']))
                }
              });
            } else {
              await prisma.influencer.create({
                data: {
                email: emailLc,
                  name: updatedSubscriber.name || undefined,
                  status: 'ACTIVE',
                  priority: 'MEDIUM',
                  tags: ['newsletter-sync'],
                  notes: `Auto-synced from newsletter category: ${updatedSubscriber.category?.name || ''}`
                }
              });
            }
          }
        }

        const response = NextResponse.json({ 
          success: true, 
          subscriber: updatedSubscriber as SubscriberResponse, 
          message: "Subscriber updated successfully",
          updated: true
        });
        return addNoCacheHeaders(response);
      } else {
        const response = NextResponse.json(
          { 
            success: false, 
            error: 'Subscriber already exists',
            details: {
              existingEmail: existingSubscriber.email,
              status: existingSubscriber.status,
              subscribedAt: existingSubscriber.subscribedAt
            }
          },
          { status: 409 }
        );
        return addNoCacheHeaders(response);
      }
    }

    // Create new subscriber
    const newSubscriber = await prisma.subscriber.create({
      data: {
        email: email.toLowerCase(),
        name: name || undefined,
        status: "ACTIVE",
        source: "admin",
        tags: tags || [],
        categoryId: validCategoryId,
        notes: notes || undefined,
        emailCount: 0
      },
      include: { category: true }
    });

    if (newSubscriber.categoryId) {
      const cat = await prisma.category.findUnique({ where: { id: newSubscriber.categoryId } });
      if (cat?.influencersEnabled) {
        const emailLc = newSubscriber.email.toLowerCase();
        const existingInfluencer = await prisma.influencer.findUnique({ where: { email: emailLc } });
        if (!existingInfluencer) {
          await prisma.influencer.create({
            data: {
              email: emailLc,
              name: newSubscriber.name || undefined,
              status: 'ACTIVE',
              priority: 'MEDIUM',
              tags: ['newsletter-sync'],
              notes: `Auto-synced from newsletter category: ${newSubscriber.category?.name || ''}`
            }
          });
        }
      }
    }

    const response = NextResponse.json({ 
      success: true, 
      subscriber: newSubscriber as SubscriberResponse, 
      message: "Subscriber added successfully" 
    });

    return addNoCacheHeaders(response);
  } catch (error) {
    console.error('Error adding subscriber:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add subscriber',
        details: errorMessage
      },
      { status: 500 }
    );

    return addNoCacheHeaders(response);
  }
} 
