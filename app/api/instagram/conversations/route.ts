import { NextResponse } from "next/server";

export async function GET() {
  try {
    const accessToken = process.env.IG_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Instagram token not configured" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `https://graph.instagram.com/v21.0/me/conversations?platform=instagram&fields=id,updated_time,message_count,unread_count,participants&access_token=${accessToken}`
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Instagram API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}