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

    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Clean the username (remove @ if present)
    const cleanUsername = username.replace(/^@/, "");

    // Method 1: Try to search using Instagram Graph API
    // This works if the user has interacted with your account before
    try {
      const conversationsResponse = await fetch(
        `https://graph.instagram.com/v21.0/me/conversations?platform=instagram&fields=participants&access_token=${accessToken}`
      );

      if (conversationsResponse.ok) {
        const conversationsData = await conversationsResponse.json();
        
        // Search through existing conversations for matching username
        for (const conversation of conversationsData.data || []) {
          if (conversation.participants?.data) {
            for (const participant of conversation.participants.data) {
              if (participant.username === cleanUsername) {
                return NextResponse.json({
                  success: true,
                  userId: participant.id,
                  username: participant.username
                });
              }
            }
          }
        }
      }
    } catch (error) {
      console.log("Search in conversations failed:", error);
    }

    // Method 2: Try Instagram Business Discovery API (requires business account)
    try {
      const discoveryResponse = await fetch(
        `https://graph.instagram.com/v21.0/ig_hashtag_search?user_id=me&q=${cleanUsername}&access_token=${accessToken}`
      );
      
      if (discoveryResponse.ok) {
        await discoveryResponse.json();
        // Process discovery results if available
      }
    } catch (error) {
      console.log("Business discovery failed:", error);
    }

    // Method 3: Use Instagram Basic Display API search (limited)
    try {
      // This is a fallback method with limited functionality
      const basicResponse = await fetch(
        `https://graph.instagram.com/v21.0/me?fields=id,username&access_token=${accessToken}`
      );

      if (basicResponse.ok) {
        const userData = await basicResponse.json();
        
        // If searching for yourself
        if (userData.username === cleanUsername) {
          return NextResponse.json({
            success: true,
            userId: userData.id,
            username: userData.username
          });
        }
      }
    } catch (error) {
      console.log("Basic API search failed:", error);
    }

    // If all methods fail, return helpful error
    return NextResponse.json({
      error: "User not found",
      message: `Could not find Instagram user @${cleanUsername}. This could mean:`,
      reasons: [
        "The username doesn't exist",
        "The user hasn't interacted with your account",
        "Additional permissions are needed for broader user search",
        "The user's account is private and not accessible"
      ],
      suggestion: "You can still use the numeric user ID if you have it, or use external tools to find the user ID."
    }, { status: 404 });

  } catch (error) {
    console.error("Error looking up user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}