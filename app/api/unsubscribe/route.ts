import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/newsletter/unsubscribe";

interface UnsubscribeData {
  email: string;
  token?: string;
}

function addNoCacheHeaders(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  return response;
}

/** RFC 8058 one-click unsubscribe (List-Unsubscribe-Post from mail clients): signed ?e=&t= in the URL. */
async function oneClick(request: NextRequest) {
  const email = (request.nextUrl.searchParams.get("e") || "").trim().toLowerCase();
  if (!email || !verifyUnsubscribeToken(email, request.nextUrl.searchParams.get("t"))) {
    return addNoCacheHeaders(NextResponse.json({ success: false, error: "Invalid unsubscribe link" }, { status: 400 }));
  }
  await prisma.subscriber.updateMany({ where: { email, status: { not: "UNSUBSCRIBED" } }, data: { status: "UNSUBSCRIBED" } });
  return addNoCacheHeaders(NextResponse.json({ success: true, unsubscribed: true }));
}

export async function POST(request: NextRequest) {
  if (request.nextUrl.searchParams.has("t")) return oneClick(request);
  try {
    const { email }: UnsubscribeData = await request.json();

    if (!email) {
      const response = NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
      return addNoCacheHeaders(response);
    }

    const emailLower = email.toLowerCase().trim();

    // Find the subscriber
    const subscriber = await prisma.subscriber.findUnique({
      where: { email: emailLower }
    });

    if (!subscriber) {
      const response = NextResponse.json(
        { success: false, error: 'Email not found in our subscriber list' },
        { status: 404 }
      );
      return addNoCacheHeaders(response);
    }

    if (subscriber.status === 'UNSUBSCRIBED') {
      const response = NextResponse.json(
        { success: false, error: 'You are already unsubscribed' },
        { status: 409 }
      );
      return addNoCacheHeaders(response);
    }

    // Unsubscribe the subscriber
    await prisma.subscriber.update({
      where: { email: emailLower },
      data: {
        status: 'UNSUBSCRIBED',
        notes: subscriber.notes ? 
          `${subscriber.notes}\n[UNSUBSCRIBED]` : 
          '[UNSUBSCRIBED]'
      }
    });

    const response = NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.',
      unsubscribed: true
    });

    return addNoCacheHeaders(response);

  } catch (error) {
    console.error('Error unsubscribing:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    const response = NextResponse.json(
      { 
        success: false, 
        error: 'Failed to unsubscribe',
        details: errorMessage
      },
      { status: 500 }
    );

    return addNoCacheHeaders(response);
  }
} 