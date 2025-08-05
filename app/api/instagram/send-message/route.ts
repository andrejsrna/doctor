import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const accessToken = process.env.IG_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Instagram token not configured" },
        { status: 401 }
      );
    }

    const { recipientId, message } = await request.json();

    if (!recipientId || !message) {
      return NextResponse.json(
        { error: "Recipient ID and message are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://graph.instagram.com/v21.0/me/messages?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: message },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Instagram API error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}