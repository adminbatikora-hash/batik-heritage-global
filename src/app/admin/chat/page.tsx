"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  Bot,
  Clock,
  TrendingUp,
  Star,
  Search,
  Filter,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  User,
  Tag,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Zap,
} from "lucide-react";

// Mock data
const conversations = [
  {
    id: "1",
    customer: "Sarah Mitchell",
    email: "sarah@example.com",
    avatar: "SM",
    lastMessage: "What's the shipping cost to New York?",
    time: "2 min ago",
    unread: 2,
    status: "active",
    priority: "medium",
    intent: "shipping_inquiry",
    country: "US",
  },
  {
    id: "2",
    customer: "James Thompson",
    email: "james@example.com",
    avatar: "JT",
    lastMessage: "I'd like to return my order BHG-A7X9",
    time: "5 min ago",
    unread: 1,
    status: "waiting",
    priority: "high",
    intent: "refund_request",
    country: "UK",
  },
  {
    id: "3",
    customer: "Yuki Tanaka",
    email: "yuki@example.com",
    avatar: "YT",
    lastMessage: "Do you have this in size L?",
    time: "12 min ago",
    unread: 0,
    status: "active",
    priority: "low",
    intent: "product_inquiry",
    country: "JP",
  },
  {
    id: "4",
    customer: "Marie Dubois",
    email: "marie@example.com",
    avatar: "MD",
    lastMessage: "Thank you! The dress is beautiful 😍",
    time: "1 hour ago",
    unread: 0,
    status: "closed",
    priority: "low",
    intent: "general",
    country: "FR",
  },
  {
    id: "5",
    customer: "Hans Mueller",
    email: "hans@example.com",
    avatar: "HM",
    lastMessage: "Payment failed, can you help?",
    time: "2 hours ago",
    unread: 3,
    status: "waiting",
    priority: "urgent",
    intent: "payment_inquiry",
    country: "DE",
  },
];

const chatMessages = [
  { id: "1", sender: "customer", content: "Hi! I want to know about shipping to New York", time: "10:30 AM" },
  { id: "2", sender: "ai", content: "Hello Sarah! 👋 I'd be happy to help with shipping information.\n\nFor orders to the US, we offer:\n\n• Standard Shipping: 10-14 days (Free over $150)\n• Express: 5-7 days ($25)\n• Priority: 3-5 days ($45)\n\nWhat's your order total? I can tell you the exact cost!", time: "10:30 AM" },
  { id: "3", sender: "customer", content: "My cart is about $120. What's the shipping cost?", time: "10:32 AM" },
  { id: "4", sender: "ai", content: "For an order of $120 to New York:\n\n📦 Standard Shipping: $15 (10-14 business days)\n🚀 Express Shipping: $25 (5-7 business days)\n\n💡 Tip: Add just $30 more to your cart to get FREE standard shipping! 🎉\n\nWould you like product recommendations to reach the free shipping threshold?", time: "10:32 AM" },
  { id: "5", sender: "customer", content: "What's the shipping cost to New York?", time: "10:34 AM" },
];

const stats = [
  { label: "Active Chats", value: "23", icon: MessageCircle, color: "bg-blue-100 text-blue-600", trend: "+5" },
  { label: "Waiting", value: "7", icon: Clock, color: "bg-yellow-100 text-yellow-600", trend: "-2" },
  { label: "AI Resolved", value: "89%", icon: Bot, color: "bg-green-100 text-green-600", trend: "+3%" },
  { label: "Satisfaction", value: "4.8", icon: Star, color: "bg-purple-100 text-purple-600", trend: "+0.2" },
];

const aiSuggestions = [
  "Standard shipping to NY is $15 for orders under $150. You're just $30 away from free shipping!",
  "We offer free shipping on orders over $150. Would you like me to suggest some items?",
  "Shipping to New York typically takes 10-14 business days via standard delivery.",
];

const priorityColors: Record<string, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-600",
  high: "bg-orange-100 text-orange-600",
  urgent: "bg-red-100 text-red-600",
};

const statusColors: Record<string, string> = {
  active: "bg-green-400",
  waiting: "bg-yellow-400",
  closed: "bg-gray-400",
};

export default function AdminChatPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [replyInput, setReplyInput] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredConversations = conversations.filter(
    (c) => filterStatus === "all" || c.status === filterStatus
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col -m-8">
      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4 p-4 bg-white border-b">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-[11px] text-foreground/50">{stat.label}</p>
            </div>
            <span className="ml-auto text-xs text-green-600 font-medium">{stat.trend}</span>
          </div>
        ))}
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Conversation List */}
        <div className="w-80 border-r bg-white flex flex-col">
          {/* Search & Filter */}
          <div className="p-3 border-b space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div className="flex gap-1">
              {["all", "active", "waiting", "closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                    filterStatus === status
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-foreground/60 hover:bg-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Items */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={`w-full p-3 flex gap-3 border-b hover:bg-gray-50 transition-colors text-left ${
                  selectedChat.id === conv.id ? "bg-accent/5 border-l-2 border-l-accent" : ""
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary">
                    {conv.avatar}
                  </div>
                  <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[conv.status]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">{conv.customer}</span>
                    <span className="text-[10px] text-foreground/40 flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-foreground/50 truncate mt-0.5">{conv.lastMessage}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${priorityColors[conv.priority]}`}>
                      {conv.priority}
                    </span>
                    <span className="text-[9px] text-foreground/30">{conv.country}</span>
                  </div>
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Chat Header */}
          <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary">
                {selectedChat.avatar}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{selectedChat.customer}</h4>
                <p className="text-[11px] text-foreground/50">{selectedChat.email} • {selectedChat.country}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${priorityColors[selectedChat.priority]}`}>
                {selectedChat.priority}
              </span>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-4 h-4 text-foreground/40" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "customer" ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[70%] ${msg.sender === "customer" ? "" : ""}`}>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.sender === "customer"
                        ? "bg-white border rounded-bl-md"
                        : msg.sender === "ai"
                        ? "bg-primary/5 border border-primary/10 rounded-br-md"
                        : "bg-accent/10 border border-accent/20 rounded-br-md"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="flex items-center gap-1 mb-1.5 text-[10px] text-primary/60 font-medium">
                        <Bot className="w-3 h-3" />
                        AI Response
                      </div>
                    )}
                    {msg.content}
                  </div>
                  <p className={`text-[10px] text-foreground/30 mt-1 ${msg.sender === "customer" ? "" : "text-right"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* AI Suggestions */}
          <div className="px-4 py-2 bg-white border-t border-b">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="text-[11px] font-medium text-foreground/50">AI Suggestions</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {aiSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setReplyInput(suggestion)}
                  className="flex-shrink-0 px-3 py-1.5 bg-accent/5 border border-accent/20 rounded-full text-[11px] text-secondary hover:bg-accent/10 transition-colors max-w-[250px] truncate"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Reply Input */}
          <div className="p-3 bg-white">
            <div className="flex items-end gap-2">
              <button className="p-2 text-foreground/40 hover:text-secondary rounded-lg hover:bg-gray-50">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-2 text-foreground/40 hover:text-secondary rounded-lg hover:bg-gray-50">
                <Smile className="w-4 h-4" />
              </button>
              <div className="flex-1">
                <textarea
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  placeholder="Type a reply..."
                  rows={1}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <button
                className={`p-2.5 rounded-xl transition-all ${
                  replyInput.trim()
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-gray-100 text-foreground/30"
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Customer Profile Panel */}
        <div className="w-72 border-l bg-white overflow-y-auto">
          <div className="p-4 text-center border-b">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-bold text-primary mx-auto">
              {selectedChat.avatar}
            </div>
            <h4 className="font-semibold mt-3">{selectedChat.customer}</h4>
            <p className="text-xs text-foreground/50">{selectedChat.email}</p>
            <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-[10px] font-medium ${priorityColors[selectedChat.priority]}`}>
              {selectedChat.intent?.replace("_", " ")}
            </span>
          </div>

          {/* Customer Info */}
          <div className="p-4 border-b space-y-3">
            <h5 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">Customer Info</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/50">Country</span>
                <span className="font-medium">{selectedChat.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Total Orders</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Total Spent</span>
                <span className="font-medium">$1,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Loyalty</span>
                <span className="font-medium text-accent">Gold ⭐</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/50">Last Order</span>
                <span className="font-medium">3 days ago</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="p-4 border-b">
            <h5 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Tags</h5>
            <div className="flex flex-wrap gap-1.5">
              {["VIP", "Repeat Buyer", "US"].map((tag) => (
                <span key={tag} className="px-2 py-0.5 bg-gray-100 text-[10px] font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="p-4">
            <h5 className="text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-2">Recent Orders</h5>
            <div className="space-y-2">
              {[
                { id: "BHG-A7X9", item: "Royal Parang Shirt", total: "$189", status: "Delivered" },
                { id: "BHG-B3F1", item: "Kawung Blazer", total: "$349", status: "Shipped" },
              ].map((order) => (
                <div key={order.id} className="p-2 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-medium">{order.item}</p>
                      <p className="text-[10px] text-foreground/40">{order.id}</p>
                    </div>
                    <span className="text-xs font-semibold">{order.total}</span>
                  </div>
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded">
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
