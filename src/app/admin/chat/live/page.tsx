"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Headphones,
  User,
  Clock,
  CheckCheck,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  ArrowLeft,
  Circle,
  RefreshCw,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface ServerMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: string;
  senderName: string;
  createdAt: string;
}

interface ServerConversation {
  id: string;
  customerName: string;
  customerEmail: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: ServerMessage[];
  _count: { messages: number };
}

export default function AdminLiveChatPage() {
  const [conversations, setConversations] = useState<ServerConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ServerMessage[]>([]);
  const [replyInput, setReplyInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const convPollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch active conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/chat/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async () => {
    if (!selectedConvId) return;
    try {
      const res = await fetch(
        `/api/chat/conversations/${selectedConvId}/messages`
      );
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [selectedConvId]);

  // Initial load + polling for conversations list
  useEffect(() => {
    fetchConversations();
    convPollingRef.current = setInterval(fetchConversations, 5000);
    return () => {
      if (convPollingRef.current) clearInterval(convPollingRef.current);
    };
  }, [fetchConversations]);

  // Poll messages when a conversation is selected
  useEffect(() => {
    if (selectedConvId) {
      fetchMessages();
      pollingRef.current = setInterval(fetchMessages, 2000);
    }
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [selectedConvId, fetchMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConvId
  );

  const handleSend = async () => {
    if (!replyInput.trim() || !selectedConvId) return;
    setSending(true);

    try {
      const res = await fetch(
        `/api/chat/conversations/${selectedConvId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: replyInput.trim(),
            sender: "agent",
            senderName: "Support Agent",
          }),
        }
      );

      if (res.ok) {
        setReplyInput("");
        // Immediately refresh messages
        await fetchMessages();
      }
    } catch (error) {
      console.error("Error sending reply:", error);
    } finally {
      setSending(false);
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConvId) return;
    try {
      await fetch(`/api/chat/conversations/${selectedConvId}/close`, {
        method: "POST",
      });
      setSelectedConvId(null);
      setMessages([]);
      await fetchConversations();
    } catch (error) {
      console.error("Error closing conversation:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/chat"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Headphones className="w-5 h-5 text-green-600" />
          <div>
            <h1 className="text-lg font-bold">Live Chat Agent Panel</h1>
            <p className="text-xs text-foreground/50">
              Respond to customers in real-time
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchConversations}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-foreground/50" />
          </button>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <Circle className="w-2 h-2 fill-current text-green-500" />
            {conversations.length} Active Chat{conversations.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-80 border-r bg-gray-50 overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-sm text-foreground/50">
              Loading conversations...
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm text-foreground/50 font-medium">
                No active chats
              </p>
              <p className="text-xs text-foreground/30 mt-1">
                Waiting for customers to connect...
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`w-full p-4 text-left hover:bg-white transition-colors ${
                    selectedConvId === conv.id
                      ? "bg-white border-l-4 border-l-green-500"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-green-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm truncate">
                          {conv.customerName}
                        </h4>
                        <span className="text-[10px] text-foreground/40 flex-shrink-0">
                          {formatDistanceToNow(new Date(conv.updatedAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/50 truncate mt-0.5">
                        {conv.messages[0]?.content || "New conversation"}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-foreground/40">
                          {conv._count.messages} messages
                        </span>
                        {conv.customerEmail && (
                          <span className="text-[10px] text-foreground/40 truncate">
                            • {conv.customerEmail}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="px-6 py-3 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">
                    {selectedConversation.customerName}
                  </h3>
                  <p className="text-[11px] text-foreground/50">
                    {selectedConversation.customerEmail || "No email provided"} •
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Info"
                >
                  <Info className="w-4 h-4 text-foreground/40" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white">
              {messages.map((msg) => (
                <AdminMessageBubble key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-6 py-2 bg-gray-50 border-t">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  "Hi! How can I help you?",
                  "Let me check that for you.",
                  "One moment please.",
                  "Is there anything else I can help with?",
                  "Thank you for contacting us!",
                ].map((quick) => (
                  <button
                    key={quick}
                    onClick={() => setReplyInput(quick)}
                    className="flex-shrink-0 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[11px] text-foreground/60 hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-colors"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply Input */}
            <div className="px-6 py-4 bg-white border-t">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your reply to the customer..."
                    rows={1}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 max-h-32 overflow-y-auto"
                    style={{ minHeight: "44px" }}
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={!replyInput.trim() || sending}
                  className={`p-3 rounded-xl transition-all ${
                    replyInput.trim() && !sending
                      ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                      : "bg-gray-100 text-foreground/30"
                  }`}
                  aria-label="Send reply"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Close Conversation Button */}
            <div className="px-6 py-2 bg-gray-50 border-t flex justify-end">
              <button
                onClick={handleCloseConversation}
                className="px-4 py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                ✕ Close Conversation
              </button>
            </div>
          </div>
        ) : (
          /* No Conversation Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-foreground/50">
                {conversations.length > 0
                  ? "Select a Conversation"
                  : "No Active Live Chat"}
              </h3>
              <p className="text-sm text-foreground/30 mt-2 max-w-sm">
                {conversations.length > 0
                  ? "Choose a conversation from the left panel to start responding."
                  : "When a customer starts a live chat from the widget, it will appear here."}
              </p>
              <p className="text-xs text-foreground/20 mt-4">
                Tip: Open the website in another tab and click the chat widget →
                Live Agent to test.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminMessageBubble({ message }: { message: ServerMessage }) {
  const isCustomer = message.sender === "customer";
  const isSystem = message.sender === "system";

  if (isSystem) {
    return (
      <div className="text-center py-2">
        <span className="inline-block px-3 py-1.5 bg-gray-100 text-foreground/50 text-xs rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex ${isCustomer ? "justify-start" : "justify-end"}`}>
      <div className="max-w-[65%]">
        <div
          className={`flex items-center gap-1.5 mb-1 ${
            isCustomer ? "" : "justify-end"
          }`}
        >
          <span className="text-[10px] font-medium text-foreground/40">
            {isCustomer ? message.senderName : "You (Agent)"}
          </span>
          <span className="text-[10px] text-foreground/20">
            {formatDistanceToNow(new Date(message.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
            isCustomer
              ? "bg-gray-100 text-foreground/80 rounded-bl-md"
              : "bg-green-600 text-white rounded-br-md"
          }`}
        >
          {message.content}
        </div>
        {!isCustomer && (
          <div className="flex justify-end mt-0.5">
            <CheckCheck className="w-3.5 h-3.5 text-green-500" />
          </div>
        )}
      </div>
    </div>
  );
}
