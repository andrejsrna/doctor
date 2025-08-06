import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface UpdateInfluencerData {
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
  lastContact?: Date;
  nextContact?: Date;
  tags?: string[];
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: UpdateInfluencerData = await request.json();

    const existingInfluencer = await prisma.influencer.findUnique({
      where: { id },
    });

    if (!existingInfluencer) {
      return NextResponse.json(
        { success: false, error: 'Influencer not found' },
        { status: 404 }
      );
    }

    const influencer = await prisma.influencer.update({
      where: { id },
      data: body,
      include: {
        subscriber: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, influencer });
  } catch (error) {
    const details = (typeof error === 'object' && error && 'message' in error) 
      ? (error as { message?: string }).message 
      : String(error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to update influencer', details },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingInfluencer = await prisma.influencer.findUnique({
      where: { id },
    });

    if (!existingInfluencer) {
      return NextResponse.json(
        { success: false, error: 'Influencer not found' },
        { status: 404 }
      );
    }

    await prisma.influencer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const details = (typeof error === 'object' && error && 'message' in error) 
      ? (error as { message?: string }).message 
      : String(error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to delete influencer', details },
      { status: 500 }
    );
  }
} 