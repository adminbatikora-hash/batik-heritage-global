import { NextRequest, NextResponse } from "next/server";
import { detectIntent, generateAIResponse } from "@/lib/chat/ai-knowledge";

export async function POST(request: NextRequest) {
  try {
    const { message, conversationId } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Detect intent
    const intent = detectIntent(message);

    // Generate AI response (using built-in knowledge base)
    // In production, this would call OpenAI/Claude with RAG context
    const aiResponse = generateAIResponse(message, intent);

    return NextResponse.json({
      response: aiResponse,
      intent,
      confidence: 0.92,
      conversationId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
