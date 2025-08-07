import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface SubscribeData {
  email: string;
  name?: string;
  group?: string;
  source?: string;
}

function addNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, group, source }: SubscribeData = await request.json();

    if (!email) {
      const response = NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
      return addNoCacheHeaders(response);
    }

    const emailLower = email.toLowerCase().trim();

    // Check if subscriber already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: emailLower }
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === 'UNSUBSCRIBED') {
        // Reactivate unsubscribed subscriber
        await prisma.subscriber.update({
          where: { email: emailLower },
          data: {
            status: 'ACTIVE',
            notes: existingSubscriber.notes ? 
              `${existingSubscriber.notes}\n[REACTIVATED]` : 
              '[REACTIVATED]'
          }
        });

        const response = NextResponse.json({
          success: true,
          message: 'Welcome back! You have been reactivated.',
          reactivated: true
        });
        return addNoCacheHeaders(response);
      } else {
        const response = NextResponse.json(
          { success: false, error: 'You are already subscribed to our newsletter' },
          { status: 409 }
        );
        return addNoCacheHeaders(response);
      }
    }

    // Create new subscriber
    const newSubscriber = await prisma.subscriber.create({
      data: {
        email: emailLower,
        name: name || undefined,
        status: "ACTIVE",
        source: source || "website",
        tags: group ? [group] : [],
        notes: `Subscribed via ${source || 'website'} form`,
        emailCount: 0
      }
    });

    const response = NextResponse.json({
      success: true,
      message: 'Successfully subscribed to our newsletter!',
      subscriber: {
        id: newSubscriber.id,
        email: newSubscriber.email,
        name: newSubscriber.name
      }
    });

    return addNoCacheHeaders(response);

  } catch (error) {
    console.error('Error subscribing:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to subscribe',
        details: errorMessage
      },
      { status: 500 }
    );

    return addNoCacheHeaders(response);
  }
} 