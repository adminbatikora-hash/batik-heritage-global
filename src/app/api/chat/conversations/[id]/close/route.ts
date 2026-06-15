import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// POST: Close a conversation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const conversation = await prisma.chatConversation.update({
      where: { id },
      data: { status: "closed" },
    });

    // Add system message
    await prisma.chatMessage.create({
      data: {
        conversationId: id,
        content: "This conversation has been closed by the agent.",
        sender: "system",
        senderName: "System",
      },
    });

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Error closing conversation:", error);
    return NextResponse.json(
      { error: "Failed to close conversation" },
      { status: 500 }
    );
  }
}
