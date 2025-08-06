import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CreateSubscriberData {
  email: string;
  name?: string;
  tags?: string[];
  category?: string;
  notes?: string;
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

export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      subscribers: subscribers as SubscriberResponse[]
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch subscribers',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, tags, category, notes }: CreateSubscriberData = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingSubscriber) {
      return NextResponse.json(
        { success: false, error: 'Subscriber already exists' },
        { status: 409 }
      );
    }

    // Create new subscriber
    const newSubscriber = await prisma.subscriber.create({
      data: {
        email: email.toLowerCase(),
        name: name || undefined,
        status: "ACTIVE",
        source: "admin",
        tags: tags || [],
        categoryId: category || undefined,
        notes: notes || undefined,
        emailCount: 0
      },
      include: { category: true }
    });

    return NextResponse.json({ 
      success: true, 
      subscriber: newSubscriber as SubscriberResponse, 
      message: "Subscriber added successfully" 
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to add subscriber',
        details: errorMessage
      },
      { status: 500 }
    );
  }
} 