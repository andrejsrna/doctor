import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function addNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            subscribers: {
              where: {
                status: {
                  not: 'UNSUBSCRIBED'
                }
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const response = NextResponse.json({
      success: true,
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        color: category.color,
        description: category.description,
        influencersEnabled: (category as any).influencersEnabled ?? false,
        subscriberCount: category._count.subscribers
      }))
    });

    return addNoCacheHeaders(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
        details: errorMessage
      },
      { status: 500 }
    );

    return addNoCacheHeaders(response);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, color, description, influencersEnabled = false } = await request.json();

    if (!name || !color || !description) {
      return NextResponse.json(
        { error: "Name, color, and description are required" },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: { name, color, description, influencersEnabled }
    });

    if (newCategory.influencersEnabled) {
      try {
        const subscribers = await prisma.subscriber.findMany({ where: { categoryId: newCategory.id } });
        for (const s of subscribers) {
          const emailLc = s.email.toLowerCase();
          const existing = await prisma.influencer.findUnique({ where: { email: emailLc } });
          if (!existing) {
            await prisma.influencer.create({
              data: {
                email: emailLc,
                name: s.name || undefined,
                status: 'ACTIVE',
                priority: 'MEDIUM',
                tags: ['newsletter-sync'],
                notes: `Auto-synced from newsletter category: ${newCategory.name}`
              }
            });
          }
        }
      } catch (e) {
        console.error('Auto-sync on create failed:', e);
      }
    }

    return NextResponse.json({
      success: true,
      category: newCategory,
      message: "Category created successfully"
    });

  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
} 