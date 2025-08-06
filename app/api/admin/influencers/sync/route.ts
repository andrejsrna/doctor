import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, autoSync = true } = body;

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const subscribers = await prisma.subscriber.findMany({
      where: { categoryId },
      include: { category: true },
    });

    let createdCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const subscriber of subscribers) {
      const existingInfluencer = await prisma.influencer.findUnique({
        where: { email: subscriber.email },
      });

      if (existingInfluencer) {
        if (autoSync) {
          await prisma.influencer.update({
            where: { email: subscriber.email },
            data: {
              name: subscriber.name || existingInfluencer.name,
              status: 'ACTIVE',
              priority: category.name === 'Promoters' ? 'HIGH' : 'MEDIUM',
              tags: [...new Set([...existingInfluencer.tags, 'newsletter-sync'])],
            },
          });
          updatedCount++;
        } else {
          skippedCount++;
        }
      } else {
        await prisma.influencer.create({
          data: {
            email: subscriber.email,
            name: subscriber.name,
            category: category.name === 'Promoters' ? 'Promoter' : 'Subscriber',
            status: 'ACTIVE',
            priority: category.name === 'Promoters' ? 'HIGH' : 'MEDIUM',
            tags: ['newsletter-sync', category.name.toLowerCase()],
            notes: `Auto-synced from newsletter category: ${category.name}`,
          },
        });
        createdCount++;
      }
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: subscribers.length,
        created: createdCount,
        updated: updatedCount,
        skipped: skippedCount,
      },
      category: category.name,
    });
  } catch (error) {
    const details = (typeof error === 'object' && error && 'message' in error) 
      ? (error as { message?: string }).message 
      : String(error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to sync influencers', details },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    if (!categoryId) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const subscribers = await prisma.subscriber.count({
      where: { categoryId },
    });

    const influencers = await prisma.influencer.count({
      where: {
        subscriber: {
          categoryId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      category: category.name,
      stats: {
        subscribers,
        influencers,
        syncPercentage: subscribers > 0 ? Math.round((influencers / subscribers) * 100) : 0,
      },
    });
  } catch (error) {
    const details = (typeof error === 'object' && error && 'message' in error) 
      ? (error as { message?: string }).message 
      : String(error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to get sync stats', details },
      { status: 500 }
    );
  }
} 