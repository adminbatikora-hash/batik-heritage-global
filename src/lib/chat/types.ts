export type MessageStatus = "sending" | "sent" | "delivered" | "read";
export type MessageType = "text" | "image" | "file" | "voice" | "video" | "system";
export type SenderType = "customer" | "agent" | "ai";
export type ChatStatus = "active" | "waiting" | "closed" | "archived";
export type Priority = "low" | "medium" | "high" | "urgent";
export type IntentType =
  | "product_inquiry"
  | "shipping_inquiry"
  | "refund_request"
  | "complaint"
  | "order_status"
  | "technical_support"
  | "payment_inquiry"
  | "general";

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  sender: SenderType;
  senderName: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: Date;
  replyTo?: string;
  attachments?: Attachment[];
  metadata?: Record<string, unknown>;
  isEdited?: boolean;
  isPinned?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  status: ChatStatus;
  priority: Priority;
  intent?: IntentType;
  assignedAgent?: string;
  tags: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    country?: string;
    totalOrders?: number;
    totalSpent?: number;
    loyaltyLevel?: string;
  };
}

export interface AgentInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "online" | "away" | "offline";
  activeChats: number;
  totalResolved: number;
}

export interface AIResponse {
  content: string;
  confidence: number;
  intent: IntentType;
  suggestions?: string[];
  sources?: string[];
}

export interface ChatAnalytics {
  totalChats: number;
  aiResolutionRate: number;
  avgResponseTime: number;
  customerSatisfaction: number;
  conversionRate: number;
  activeChats: number;
  waitingChats: number;
}
