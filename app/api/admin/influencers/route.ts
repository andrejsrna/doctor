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

    const influencers = await prisma.influencer.findMany({
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
      where: { email },
    });

    if (existingInfluencer) {
      return NextResponse.json(
        { success: false, error: 'Influencer with this email already exists' },
        { status: 409 }
      );
    }

    const influencer = await prisma.influencer.create({
      data: {
        email,
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