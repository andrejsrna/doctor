import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const origin = request.headers.get("origin");
    const requestOrigin = new URL(request.url).origin;
    if (origin && origin !== requestOrigin) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }

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