import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET: Get messages for a conversation (polling)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const after = searchParams.get("after"); // timestamp to get messages after

    const where: Record<string, unknown> = { conversationId: id };

    if (after) {
      where.createdAt = { gt: new Date(after) };
    }

    const messages = await prisma.chatMessage.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST: Send a message in a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, sender, senderName } = await request.json();

    if (!content || !sender || !senderName) {
      return NextResponse.json(
        { error: "Content, sender, and senderName are required" },
        { status: 400 }
      );
    }

    // Verify conversation exists
    const conversation = await prisma.chatConversation.findUnique({
      where: { id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    // Create message
    const message = await prisma.chatMessage.create({
      data: {
        conversationId: id,
        content,
        sender,
        senderName,
      },
    });

    // Update conversation updatedAt
    await prisma.chatConversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
