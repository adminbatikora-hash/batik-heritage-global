import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET: List all active conversations (for admin)
export async function GET() {
  try {
    const conversations = await prisma.chatConversation.findMany({
      where: { status: "active" },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}

// POST: Create a new conversation (from customer widget)
export async function POST(request: NextRequest) {
  try {
    const { customerName, customerEmail } = await request.json();

    if (!customerName) {
      return NextResponse.json(
        { error: "Customer name is required" },
        { status: 400 }
      );
    }

    const conversation = await prisma.chatConversation.create({
      data: {
        customerName,
        customerEmail: customerEmail || null,
        status: "active",
      },
    });

    // Create system welcome message
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        content:
          "You are now connected to our support team. An agent will respond shortly.",
        sender: "system",
        senderName: "System",
      },
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Failed to create conversation" },
      { status: 500 }
    );
  }
}
