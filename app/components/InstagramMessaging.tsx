"use client";

import { useState, useEffect } from "react";

interface Message {
  id: string;
  created_time: string;
  from: { id: string; username?: string };
  to: { data: Array<{ id: string; username?: string }> };
  message: string;
  attachments?: {
    data: Array<{
      id: string;
      mime_type?: string;
      name?: string;
      size?: number;
    }>;
  };
  sticker?: unknown;
  shares?: unknown;
  reactions?: unknown;
}

interface Conversation {
  id: string;
  updated_time: string;
  message_count: number;
  unread_count: number;
  participants: {
    data: Array<{ id: string; username?: string }>;
  };
}

interface ConversationData {
  messages: {
    data: Message[];
  };
}

export default function InstagramMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newRecipientId, setNewRecipientId] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [recipientInput, setRecipientInput] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/instagram/conversations");
      if (response.ok) {
        const data = await response.json();
        setConversations(data.data || []);
      } else {
        console.error("Failed to fetch conversations");
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/instagram/conversations/${conversationId}`);
      if (response.ok) {
        const data: ConversationData = await response.json();
        setMessages(data.messages?.data || []);
        setSelectedConversation(conversationId);
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return;

    const recipientId = conversation.participants.data.find(p => p.id !== "me")?.id;
    if (!recipientId) return;

    setSending(true);
    try {
      const response = await fetch("/api/instagram/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId,
          message: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchMessages(selectedConversation);
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleRecipientLookup = async () => {
    const input = recipientInput.trim();
    if (!input) return;

    // If it looks like a user ID (all numbers), use it directly
    if (/^\d+$/.test(input)) {
      setNewRecipientId(input);
      return;
    }

    // If it looks like a username, try to look it up via API
    if (input.startsWith('@') || /^[a-zA-Z0-9._]+$/.test(input)) {
      const cleanUsername = input.replace(/^@/, '');
      setLookupLoading(true);
      
      try {
        const response = await fetch(`/api/instagram/user-lookup?username=${encodeURIComponent(cleanUsername)}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setNewRecipientId(data.userId);
          alert(`Found user @${data.username}! Ready to send message.`);
        } else {
          // Show detailed error information
          let errorMessage = `Could not find @${cleanUsername}.\n\n`;
          
          if (data.reasons) {
            errorMessage += "Possible reasons:\n";
            data.reasons.forEach((reason: string, index: number) => {
              errorMessage += `${index + 1}. ${reason}\n`;
            });
          }
          
          errorMessage += `\n${data.suggestion || 'You can try using a numeric user ID instead.'}`;
          
          const useExternalTool = confirm(
            errorMessage + '\n\nWould you like to use an external tool to find the user ID?'
          );
          
          if (useExternalTool) {
            window.open(`https://codeofaninja.com/tools/find-instagram-user-id/`, '_blank');
          }
        }
      } catch (error) {
        console.error('Error looking up user:', error);
        alert('Error looking up user. Please try again or use a numeric user ID.');
      } finally {
        setLookupLoading(false);
      }
      return;
    }

    alert("Please enter either a username (e.g., @username) or a numeric user ID");
  };

  const sendNewMessage = async () => {
    if (!newMessageText.trim() || !newRecipientId.trim()) return;

    setSending(true);
    try {
      const response = await fetch("/api/instagram/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId: newRecipientId,
          message: newMessageText,
        }),
      });

      if (response.ok) {
        setNewMessageText("");
        setNewRecipientId("");
        setRecipientInput("");
        setShowNewMessageModal(false);
        fetchConversations(); // Refresh conversations to show the new one
        alert("Message sent successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to send message: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="flex h-96 border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 bg-gray-50 border-r">
        <div className="p-4 border-b bg-gray-100">
          <h3 className="font-semibold">Conversations</h3>
          <div className="flex gap-2 mt-2">
            <button
              onClick={fetchConversations}
              disabled={loading}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={() => setShowNewMessageModal(true)}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
            >
              New Message
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => fetchMessages(conversation.id)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                selectedConversation === conversation.id ? "bg-blue-100" : ""
              }`}
            >
              <div className="font-medium">
                {conversation.participants.data
                  .filter(p => p.id !== "me")
                  .map(p => p.username || p.id)
                  .join(", ") || "Unknown"}
              </div>
              <div className="text-xs text-gray-500">
                {conversation.message_count} messages
                {conversation.unread_count > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded-full text-xs">
                    {conversation.unread_count}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {formatTime(conversation.updated_time)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              {loading ? (
                <div className="text-center text-gray-500">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500">No messages found</div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.from.id === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs px-3 py-2 rounded-lg ${
                          message.from.id === "me"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-900"
                        }`}
                      >
                        <div>
                          {message.message || "💬 Message"}
                          {message.attachments?.data && message.attachments.data.length > 0 && (
                            <div className="text-xs opacity-75 mt-1">
                              {message.attachments.data.map((attachment, idx) => (
                                <div key={idx}>
                                  📎 {attachment.name || "Attachment"} 
                                  {attachment.size && ` (${Math.round(attachment.size / 1024)}KB)`}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {formatTime(message.created_time)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-gray-50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to view messages
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Send New Message</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    placeholder="Enter @username or user ID"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleRecipientLookup}
                    disabled={!recipientInput.trim() || lookupLoading}
                    className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 text-sm"
                  >
                    {lookupLoading ? "Looking up..." : "Lookup"}
                  </button>
                </div>
                {newRecipientId && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">
                      ✓ Ready to send to user ID: {newRecipientId}
                    </p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Enter @username (we&apos;ll help you find the ID) or paste a numeric user ID directly
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type your message..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setShowNewMessageModal(false);
                  setNewRecipientId("");
                  setNewMessageText("");
                  setRecipientInput("");
                }}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={sendNewMessage}
                disabled={sending || !newRecipientId.trim() || !newMessageText.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}