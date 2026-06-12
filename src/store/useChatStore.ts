import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import {
  ChatMessage,
  Conversation,
  MessageStatus,
  SenderType,
  ChatStatus,
  IntentType,
} from "@/lib/chat/types";
import {
  detectIntent,
  generateAIResponse,
  getWelcomeMessage,
} from "@/lib/chat/ai-knowledge";

export type ChatMode = "initial" | "ai" | "live";

interface ChatState {
  // Widget State
  isOpen: boolean;
  isMinimized: boolean;
  chatMode: ChatMode;
  setOpen: (open: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  setChatMode: (mode: ChatMode) => void;

  // Conversation
  conversation: Conversation | null;
  messages: ChatMessage[];
  isTyping: boolean;
  unreadCount: number;
  liveAgentConnected: boolean;

  // Actions
  initConversation: (customerName: string, customerEmail: string) => void;
  sendMessage: (content: string, type?: ChatMessage["type"]) => void;
  startLiveChat: (customerName: string, customerEmail: string) => void;
  startAIChat: () => void;
  adminReply: (content: string) => void;
  markAsRead: () => void;
  clearChat: () => void;
}

// Global store for admin to access customer messages
export const liveChatMessages: Map<string, ChatMessage[]> = new Map();
export const liveChatConversations: Map<string, Conversation> = new Map();

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  isMinimized: false,
  chatMode: "initial",
  conversation: null,
  messages: [],
  isTyping: false,
  unreadCount: 0,
  liveAgentConnected: false,

  setOpen: (open) => {
    set({ isOpen: open });
    if (open) {
      get().markAsRead();
    }
  },

  setMinimized: (minimized) => set({ isMinimized: minimized }),

  setChatMode: (mode) => set({ chatMode: mode }),

  initConversation: (customerName, customerEmail) => {
    const conversationId = uuidv4();
    const conversation: Conversation = {
      id: conversationId,
      customerId: uuidv4(),
      customerName,
      customerEmail,
      status: "active",
      priority: "medium",
      tags: [],
      unreadCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set({ conversation });
  },

  startAIChat: () => {
    const { conversation } = get();
    if (!conversation) {
      get().initConversation("Guest", "");
    }

    const conv = get().conversation!;
    const welcomeMsg: ChatMessage = {
      id: uuidv4(),
      conversationId: conv.id,
      content: getWelcomeMessage(),
      sender: "ai",
      senderName: "Batikora AI",
      type: "text",
      status: "delivered",
      timestamp: new Date(),
    };

    set({ chatMode: "ai", messages: [welcomeMsg], unreadCount: 1 });
  },

  startLiveChat: (customerName, customerEmail) => {
    get().initConversation(customerName, customerEmail);
    const conv = get().conversation!;

    const systemMsg: ChatMessage = {
      id: uuidv4(),
      conversationId: conv.id,
      content: "You are now connected to our support team. An agent will respond shortly. Our working hours are Mon-Fri 9AM-6PM WIB.",
      sender: "agent",
      senderName: "System",
      type: "system",
      status: "delivered",
      timestamp: new Date(),
    };

    set({
      chatMode: "live",
      messages: [systemMsg],
      liveAgentConnected: true,
      unreadCount: 1,
    });

    // Register in live chat global store for admin access
    liveChatConversations.set(conv.id, conv);
    liveChatMessages.set(conv.id, [systemMsg]);
  },

  sendMessage: (content, type = "text") => {
    const { conversation, messages, chatMode } = get();
    if (!conversation) return;

    const customerMsg: ChatMessage = {
      id: uuidv4(),
      conversationId: conversation.id,
      content,
      sender: "customer",
      senderName: conversation.customerName,
      type,
      status: "sent",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, customerMsg];
    set({ messages: updatedMessages });

    // Update global store for live mode
    if (chatMode === "live") {
      liveChatMessages.set(conversation.id, updatedMessages);
    }

    // Update status to delivered
    setTimeout(() => {
      set({
        messages: get().messages.map((m) =>
          m.id === customerMsg.id ? { ...m, status: "delivered" as MessageStatus } : m
        ),
      });
    }, 500);

    // Update status to read
    setTimeout(() => {
      set({
        messages: get().messages.map((m) =>
          m.id === customerMsg.id ? { ...m, status: "read" as MessageStatus } : m
        ),
      });
    }, 1000);

    // AI auto-response only in AI mode
    if (chatMode === "ai") {
      set({ isTyping: true });
      const delay = 1500 + Math.random() * 1500;
      setTimeout(() => {
        const intent = detectIntent(content);
        const aiContent = generateAIResponse(content, intent);

        const aiMsg: ChatMessage = {
          id: uuidv4(),
          conversationId: conversation.id,
          content: aiContent,
          sender: "ai",
          senderName: "Batikora AI",
          type: "text",
          status: "delivered",
          timestamp: new Date(),
          metadata: { intent, confidence: 0.92 },
        };

        set({
          messages: [...get().messages, aiMsg],
          isTyping: false,
          unreadCount: get().isOpen ? 0 : get().unreadCount + 1,
        });
      }, delay);
    }
    // In live mode, no auto-reply — admin replies manually
  },

  adminReply: (content) => {
    const { conversation, messages } = get();
    if (!conversation) return;

    const agentMsg: ChatMessage = {
      id: uuidv4(),
      conversationId: conversation.id,
      content,
      sender: "agent",
      senderName: "Support Agent",
      type: "text",
      status: "delivered",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, agentMsg];
    set({
      messages: updatedMessages,
      unreadCount: get().isOpen ? 0 : get().unreadCount + 1,
    });

    liveChatMessages.set(conversation.id, updatedMessages);
  },

  markAsRead: () => set({ unreadCount: 0 }),

  clearChat: () =>
    set({
      conversation: null,
      messages: [],
      isTyping: false,
      unreadCount: 0,
      chatMode: "initial",
      liveAgentConnected: false,
    }),
}));
