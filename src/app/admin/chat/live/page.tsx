"use client";

import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";
import { useChatStore } from "@/store/useChatStore";
import { ChatMessage } from "@/lib/chat/types";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

export default function AdminLiveChatPage() {
  const { messages, conversation, adminReply, liveAgentConnected, isTyping } = useChatStore();
  const [replyInput, setReplyInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!replyInput.trim()) return;
    adminReply(replyInput.trim());
    setReplyInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const customerMessages = messages.filter((m) => m.sender === "customer");
  const hasActiveChat = conversation && liveAgentConnected;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-8">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <Link href="/admin/chat" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <Headphones className="w-5 h-5 text-green-600" />
          <div>
            <h1 className="text-lg font-bold">Live Chat Agent Panel</h1>
            <p className="text-xs text-foreground/50">Respond to customers in real-time</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            hasActiveChat ? "bg-green-100 text-green-700" : "bg-gray-100 text-foreground/50"
          }`}>
            <Circle className={`w-2 h-2 fill-current ${hasActiveChat ? "text-green-500" : "text-gray-400"}`} />
            {hasActiveChat ? "Active Chat" : "No Active Chat"}
          </span>
        </div>
      </div>

      {hasActiveChat ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="px-6 py-3 bg-gray-50 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{conversation.customerName}</h3>
                  <p className="text-[11px] text-foreground/50">
                    {conversation.customerEmail || "No email provided"} • Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="Phone call">
                  <Phone className="w-4 h-4 text-foreground/40" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="Video call">
                  <Video className="w-4 h-4 text-foreground/40" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" aria-label="Info">
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
                <button className="p-2 text-foreground/40 hover:text-green-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-foreground/40 hover:text-green-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
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
                  disabled={!replyInput.trim()}
                  className={`p-3 rounded-xl transition-all ${
                    replyInput.trim()
                      ? "bg-green-600 text-white hover:bg-green-700 shadow-lg"
                      : "bg-gray-100 text-foreground/30"
                  }`}
                  aria-label="Send reply"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Customer Info Panel */}
          <div className="w-72 border-l bg-gray-50 overflow-y-auto">
            <div className="p-5 text-center border-b bg-white">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-green-700" />
              </div>
              <h4 className="font-semibold mt-3">{conversation.customerName}</h4>
              <p className="text-xs text-foreground/50 mt-1">{conversation.customerEmail || "Guest"}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                <span className="text-xs text-green-600">Online now</span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <h5 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Chat Info</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Started</span>
                    <span className="font-medium text-xs">
                      {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Messages</span>
                    <span className="font-medium">{messages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Status</span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Active</span>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h5 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Internal Notes</h5>
                <textarea
                  placeholder="Add a note about this customer..."
                  className="w-full px-3 py-2 bg-white border rounded-lg text-xs resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div>
                <h5 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Actions</h5>
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 bg-white border rounded-lg text-xs text-left hover:bg-gray-50 transition-colors">
                    📋 Transfer to another agent
                  </button>
                  <button className="w-full px-3 py-2 bg-white border rounded-lg text-xs text-left hover:bg-gray-50 transition-colors">
                    🏷️ Add tag
                  </button>
                  <button className="w-full px-3 py-2 bg-white border rounded-lg text-xs text-left hover:bg-red-50 hover:border-red-200 text-red-600 transition-colors">
                    ✕ Close conversation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No Active Chat */
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-foreground/50">No Active Live Chat</h3>
            <p className="text-sm text-foreground/30 mt-2 max-w-sm">
              When a customer starts a live chat from the widget, it will appear here. You can then respond in real-time.
            </p>
            <p className="text-xs text-foreground/20 mt-4">
              Tip: Open the website in another tab and click the chat widget → Live Agent to test.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminMessageBubble({ message }: { message: ChatMessage }) {
  const isCustomer = message.sender === "customer";
  const isSystem = message.type === "system";

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
      <div className={`max-w-[65%]`}>
        <div className={`flex items-center gap-1.5 mb-1 ${isCustomer ? "" : "justify-end"}`}>
          <span className="text-[10px] font-medium text-foreground/40">
            {isCustomer ? message.senderName : "You"}
          </span>
          <span className="text-[10px] text-foreground/20">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
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
