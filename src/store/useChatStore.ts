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

  // Live chat polling
  pollingInterval: ReturnType<typeof setInterval> | null;

  // Actions
  initConversation: (customerName: string, customerEmail: string) => void;
  sendMessage: (content: string, type?: ChatMessage["type"]) => void;
  startLiveChat: (customerName: string, customerEmail: string) => void;
  startAIChat: () => void;
  adminReply: (content: string) => void;
  pollMessages: () => void;
  markAsRead: () => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  isMinimized: false,
  chatMode: "initial",
  conversation: null,
  messages: [],
  isTyping: false,
  unreadCount: 0,
  liveAgentConnected: false,
  pollingInterval: null,

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

  startLiveChat: async (customerName, customerEmail) => {
    try {
      // Create conversation on server via API
      const res = await fetch("/api/chat/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerName, customerEmail }),
      });

      if (!res.ok) throw new Error("Failed to create conversation");

      const { conversation: serverConv } = await res.json();

      const conversation: Conversation = {
        id: serverConv.id,
        customerId: uuidv4(),
        customerName,
        customerEmail,
        status: "active",
        priority: "medium",
        tags: [],
        unreadCount: 0,
        createdAt: new Date(serverConv.createdAt),
        updatedAt: new Date(serverConv.updatedAt),
      };

      const systemMsg: ChatMessage = {
        id: uuidv4(),
        conversationId: conversation.id,
        content:
          "You are now connected to our support team. An agent will respond shortly.",
        sender: "agent",
        senderName: "System",
        type: "system",
        status: "delivered",
        timestamp: new Date(),
      };

      set({
        conversation,
        chatMode: "live",
        messages: [systemMsg],
        liveAgentConnected: true,
        unreadCount: 1,
      });

      // Start polling for new messages from admin
      const interval = setInterval(() => {
        get().pollMessages();
      }, 2000);

      set({ pollingInterval: interval });
    } catch (error) {
      console.error("Failed to start live chat:", error);
      // Fallback: show error message
      const errorMsg: ChatMessage = {
        id: uuidv4(),
        conversationId: "error",
        content:
          "Unable to connect to live support. Please try again later or use our AI assistant.",
        sender: "agent",
        senderName: "System",
        type: "system",
        status: "delivered",
        timestamp: new Date(),
      };
      set({ messages: [errorMsg], chatMode: "live" });
    }
  },

  pollMessages: async () => {
    const { conversation, messages } = get();
    if (!conversation) return;

    try {
      // Get the timestamp of the last message we know about
      const lastMsg = messages[messages.length - 1];
      const after = lastMsg?.timestamp
        ? new Date(lastMsg.timestamp).toISOString()
        : undefined;

      const url = after
        ? `/api/chat/conversations/${conversation.id}/messages?after=${encodeURIComponent(after)}`
        : `/api/chat/conversations/${conversation.id}/messages`;

      const res = await fetch(url);
      if (!res.ok) return;

      const { messages: newMessages } = await res.json();

      if (newMessages && newMessages.length > 0) {
        // Filter only messages from agent (admin replies) that we don't have yet
        const existingIds = new Set(messages.map((m) => m.id));
        const incomingMessages: ChatMessage[] = newMessages
          .filter(
            (m: { id: string; sender: string }) =>
              !existingIds.has(m.id) && m.sender !== "customer"
          )
          .map(
            (m: {
              id: string;
              conversationId: string;
              content: string;
              sender: SenderType;
              senderName: string;
              createdAt: string;
            }) => ({
              id: m.id,
              conversationId: m.conversationId,
              content: m.content,
              sender: m.sender,
              senderName: m.senderName,
              type: m.sender === "system" ? ("system" as const) : ("text" as const),
              status: "delivered" as MessageStatus,
              timestamp: new Date(m.createdAt),
            })
          );

        if (incomingMessages.length > 0) {
          set({
            messages: [...get().messages, ...incomingMessages],
            unreadCount: get().isOpen ? 0 : get().unreadCount + incomingMessages.length,
          });
        }
      }
    } catch (error) {
      // Silent fail for polling
      console.debug("Poll error:", error);
    }
  },

  sendMessage: async (content, type = "text") => {
    const { conversation, messages, chatMode } = get();
    if (!conversation) return;

    const customerMsg: ChatMessage = {
      id: uuidv4(),
      conversationId: conversation.id,
      content,
      sender: "customer",
      senderName: conversation.customerName,
      type,
      status: "sending",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, customerMsg];
    set({ messages: updatedMessages });

    if (chatMode === "live") {
      // Send to server API
      try {
        const res = await fetch(
          `/api/chat/conversations/${conversation.id}/messages`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content,
              sender: "customer",
              senderName: conversation.customerName,
            }),
          }
        );

        if (res.ok) {
          // Update message status to delivered
          set({
            messages: get().messages.map((m) =>
              m.id === customerMsg.id
                ? { ...m, status: "delivered" as MessageStatus }
                : m
            ),
          });
        } else {
          set({
            messages: get().messages.map((m) =>
              m.id === customerMsg.id
                ? { ...m, status: "sent" as MessageStatus }
                : m
            ),
          });
        }
      } catch {
        // Mark as sent (unconfirmed)
        set({
          messages: get().messages.map((m) =>
            m.id === customerMsg.id
              ? { ...m, status: "sent" as MessageStatus }
              : m
          ),
        });
      }
    } else {
      // AI mode: local status updates
      setTimeout(() => {
        set({
          messages: get().messages.map((m) =>
            m.id === customerMsg.id
              ? { ...m, status: "delivered" as MessageStatus }
              : m
          ),
        });
      }, 500);

      setTimeout(() => {
        set({
          messages: get().messages.map((m) =>
            m.id === customerMsg.id
              ? { ...m, status: "read" as MessageStatus }
              : m
          ),
        });
      }, 1000);

      // AI auto-response
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
  },

  adminReply: (content) => {
    // This is now only used as a fallback / legacy.
    // The admin panel uses the API directly.
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

    set({
      messages: [...messages, agentMsg],
      unreadCount: get().isOpen ? 0 : get().unreadCount + 1,
    });
  },

  markAsRead: () => set({ unreadCount: 0 }),

  clearChat: () => {
    // Stop polling
    const { pollingInterval } = get();
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    set({
      conversation: null,
      messages: [],
      isTyping: false,
      unreadCount: 0,
      chatMode: "initial",
      liveAgentConnected: false,
      pollingInterval: null,
    });
  },
}));
