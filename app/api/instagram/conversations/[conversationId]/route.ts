import { NextRequest, NextResponse } from "next/server";

interface InstagramMessage {
  id: string;
  created_time: string;
  message?: string;
  story_mention?: unknown;
  attachments?: {
    data: Array<{
      mime_type?: string;
      name?: string;
    }>;
  };
  sticker?: unknown;
  shares?: unknown;
  reactions?: unknown;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const accessToken = process.env.IG_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: "Instagram token not configured" },
        { status: 401 }
      );
    }

    const { conversationId } = await params;
    
    const response = await fetch(
      `https://graph.instagram.com/v21.0/${conversationId}?fields=messages{id,created_time,from,to,message,attachments{id,mime_type,name,size},sticker,shares,reactions,story_mention}&access_token=${accessToken}`
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("Instagram API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Process messages to add display text for different types
    if (data.messages && data.messages.data) {
      data.messages.data = data.messages.data.map((message: unknown) => {
        const msg = message as InstagramMessage;
        // If there's no message text, try to determine what type of content it is
        if (!msg.message) {
          if (msg.story_mention) {
            msg.message = '📖 Story mention (expired)';
          } else if (msg.attachments && msg.attachments.data && msg.attachments.data.length > 0) {
            const attachment = msg.attachments.data[0];
            if (attachment.mime_type?.startsWith('image/')) {
              msg.message = '📷 Photo';
            } else if (attachment.mime_type?.startsWith('video/')) {
              msg.message = '🎥 Video';
            } else if (attachment.mime_type?.startsWith('audio/')) {
              msg.message = '🎵 Voice message';
            } else {
              msg.message = `📎 ${attachment.name || 'Attachment'}`;
            }
          } else if (msg.sticker) {
            msg.message = '😊 Sticker';
          } else if (msg.shares) {
            msg.message = '🔗 Shared content';
          } else if (msg.reactions) {
            msg.message = '❤️ Reaction';
          } else {
            // Check if this might be an expired story mention or other expired content
            const messageAge = Date.now() - new Date(msg.created_time).getTime();
            const hoursOld = messageAge / (1000 * 60 * 60);
            
            if (hoursOld > 24) {
              msg.message = '📖 Expired story mention';
            } else {
              msg.message = '💬 Message (content unavailable)';
            }
          }
        }
        return msg;
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}