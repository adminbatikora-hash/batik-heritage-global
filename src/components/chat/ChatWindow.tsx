"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Minus,
  Bot,
  User,
  Check,
  CheckCheck,
  X,
  Sparkles,
  ArrowDown,
  Headphones,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import { useChatStore, ChatMode } from "@/store/useChatStore";
import { ChatMessage } from "@/lib/chat/types";
import { getQuickReplies } from "@/lib/chat/ai-knowledge";
import { formatDistanceToNow } from "date-fns";

interface ChatWindowProps {
  onClose: () => void;
}

export default function ChatWindow({ onClose }: ChatWindowProps) {
  const { chatMode } = useChatStore();

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-luxury overflow-hidden border border-gray-100">
      {chatMode === "initial" && <ModeSelection onClose={onClose} />}
      {chatMode === "ai" && <AIChatView onClose={onClose} />}
      {chatMode === "live" && <LiveChatView onClose={onClose} />}
    </div>
  );
}

// ============ MODE SELECTION SCREEN ============

function ModeSelection({ onClose }: { onClose: () => void }) {
  const { startAIChat, startLiveChat, setChatMode, initConversation } = useChatStore();
  const [showLiveForm, setShowLiveForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleStartAI = () => {
    initConversation("Guest", "");
    startAIChat();
  };

  const handleStartLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    startLiveChat(name.trim(), email.trim());
  };

  return (
    <>
      {/* Header */}
      <div className="px-4 py-4 bg-gradient-to-r from-primary to-primary/90 text-white text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
          <MessageSquare className="w-7 h-7" />
        </div>
        <h3 className="font-bold text-lg">Batikora Support</h3>
        <p className="text-white/70 text-xs mt-1">How would you like to chat?</p>
      </div>

      <div className="flex-1 p-5 flex flex-col gap-4 justify-center">
        {!showLiveForm ? (
          <>
            {/* AI Option */}
            <button
              onClick={handleStartAI}
              className="group flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-accent/30 hover:bg-accent/5 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Batikora AI</h4>
                <p className="text-xs text-foreground/50 mt-0.5">
                  Instant answers 24/7 — product info, shipping, returns
                </p>
              </div>
            </button>

            {/* Live Agent Option */}
            <button
              onClick={() => setShowLiveForm(true)}
              className="group flex items-center gap-4 p-4 border-2 border-gray-100 rounded-2xl hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Live Agent</h4>
                <p className="text-xs text-foreground/50 mt-0.5">
                  Chat directly with our support team
                </p>
              </div>
            </button>

            <p className="text-center text-[10px] text-foreground/30 mt-2">
              Agents available Mon-Fri 9AM-6PM WIB
            </p>
          </>
        ) : (
          /* Live Chat Form */
          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleStartLive}
            className="space-y-4"
          >
            <button
              type="button"
              onClick={() => setShowLiveForm(false)}
              className="flex items-center gap-1 text-xs text-foreground/50 hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>

            <div className="text-center mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-2">
                <Headphones className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Connect to Live Agent</h4>
              <p className="text-xs text-foreground/50 mt-1">Please enter your details to start</p>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              Start Chat
            </button>
          </motion.form>
        )}
      </div>
    </>
  );
}

// ============ AI CHAT VIEW ============

function AIChatView({ onClose }: { onClose: () => void }) {
  const { messages, sendMessage, isTyping, clearChat, setChatMode } = useChatStore();
  const [input, setInput] = useState("");
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickReplies = getQuickReplies();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
    setShowQuickReplies(false);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    clearChat();
    setChatMode("initial");
  };

  const emojis = ["👋", "😊", "👍", "❤️", "🙏", "✨", "🎉", "💯", "🔥", "😍", "🤔", "👀"];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Batikora AI</h4>
            <p className="text-[11px] text-white/70">
              {isTyping ? "Typing..." : "Online"}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        {showQuickReplies && messages.length <= 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 pt-2">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => { sendMessage(reply); setShowQuickReplies(false); }}
                className="px-3 py-1.5 bg-accent/10 text-secondary text-xs font-medium rounded-full border border-accent/20 hover:bg-accent/20 transition-colors"
              >
                {reply}
              </button>
            ))}
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="px-4 py-2 border-t bg-white">
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button key={emoji} onClick={() => { setInput(input + emoji); setShowEmojiPicker(false); }} className="text-xl hover:scale-125 transition-transform p-1">
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        onEmojiToggle={() => setShowEmojiPicker(!showEmojiPicker)}
      />
    </>
  );
}

// ============ LIVE CHAT VIEW ============

function LiveChatView({ onClose }: { onClose: () => void }) {
  const { messages, sendMessage, isTyping, clearChat, setChatMode } = useChatStore();
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    clearChat();
    setChatMode("initial");
  };

  const emojis = ["👋", "😊", "👍", "❤️", "🙏", "✨", "🎉", "💯", "🔥", "😍", "🤔", "👀"];

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-300 rounded-full border-2 border-green-700" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">Live Support</h4>
            <p className="text-[11px] text-white/70">Connected to agent</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Close">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gradient-to-b from-green-50/30 to-white">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isLive />
        ))}

        {isTyping && <TypingIndicator isAgent />}

        <div ref={messagesEndRef} />
      </div>

      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="px-4 py-2 border-t bg-white">
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button key={emoji} onClick={() => { setInput(input + emoji); setShowEmojiPicker(false); }} className="text-xl hover:scale-125 transition-transform p-1">
                  {emoji}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        onEmojiToggle={() => setShowEmojiPicker(!showEmojiPicker)}
      />
    </>
  );
}

// ============ SHARED COMPONENTS ============

function ChatInput({
  input,
  setInput,
  onSend,
  onKeyDown,
  onEmojiToggle,
}: {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onEmojiToggle: () => void;
}) {
  return (
    <div className="px-3 py-3 border-t bg-white">
      <div className="flex items-end gap-2">
        <div className="flex gap-0.5">
          <button className="p-2 text-foreground/40 hover:text-secondary rounded-lg hover:bg-gray-50 transition-colors" aria-label="Attach file">
            <Paperclip className="w-4 h-4" />
          </button>
          <button onClick={onEmojiToggle} className="p-2 text-foreground/40 hover:text-secondary rounded-lg hover:bg-gray-50 transition-colors" aria-label="Emoji">
            <Smile className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/30 max-h-24 overflow-y-auto"
            style={{ minHeight: "40px" }}
          />
        </div>
        <button
          onClick={onSend}
          disabled={!input.trim()}
          className={`p-2.5 rounded-xl transition-all ${
            input.trim()
              ? "bg-gradient-to-r from-secondary to-accent text-white shadow-gold hover:shadow-gold-lg"
              : "bg-gray-100 text-foreground/30"
          }`}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center justify-center gap-1 mt-2">
        <Sparkles className="w-3 h-3 text-accent" />
        <span className="text-[10px] text-foreground/30">Batikora Support</span>
      </div>
    </div>
  );
}

function MessageBubble({ message, isLive }: { message: ChatMessage; isLive?: boolean }) {
  const isCustomer = message.sender === "customer";
  const isSystem = message.type === "system";

  if (isSystem) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
        <span className="inline-block px-3 py-1.5 bg-gray-100 text-foreground/50 text-xs rounded-full">
          {message.content}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-end gap-2 ${isCustomer ? "flex-row-reverse" : ""}`}
    >
      {/* Avatar */}
      {!isCustomer && (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
          message.sender === "ai" ? "bg-primary/10" : "bg-green-100"
        }`}>
          {message.sender === "ai" ? (
            <Bot className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Headphones className="w-3.5 h-3.5 text-green-600" />
          )}
        </div>
      )}

      {/* Message Content */}
      <div className={`max-w-[75%]`}>
        {/* Sender label for live chat */}
        {!isCustomer && isLive && message.sender === "agent" && (
          <p className="text-[10px] text-green-600 font-medium mb-0.5 px-1">Support Agent</p>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isCustomer
              ? "bg-gradient-to-r from-secondary to-accent text-white rounded-br-md"
              : message.sender === "ai"
              ? "bg-gray-100 text-foreground/80 rounded-bl-md"
              : "bg-green-50 text-foreground/80 border border-green-100 rounded-bl-md"
          }`}
        >
          {message.content.split("\n").map((line, i) => (
            <span key={i}>
              {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>;
                }
                return <span key={j}>{part}</span>;
              })}
              {i < message.content.split("\n").length - 1 && <br />}
            </span>
          ))}
        </div>

        {/* Timestamp & Status */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${isCustomer ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-foreground/30">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
          {isCustomer && <MessageStatusIcon status={message.status} />}
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator({ isAgent }: { isAgent?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex items-end gap-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isAgent ? "bg-green-100" : "bg-primary/10"}`}>
        {isAgent ? <Headphones className="w-3.5 h-3.5 text-green-600" /> : <Bot className="w-3.5 h-3.5 text-primary" />}
      </div>
      <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-bl-md">
        <div className="flex gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </motion.div>
  );
}

function MessageStatusIcon({ status }: { status: ChatMessage["status"] }) {
  switch (status) {
    case "sent":
      return <Check className="w-3 h-3 text-foreground/30" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-foreground/30" />;
    case "read":
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    default:
      return <span className="w-3 h-3 rounded-full border border-foreground/20" />;
  }
}
