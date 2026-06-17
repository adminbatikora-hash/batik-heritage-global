import { NextRequest, NextResponse } from "next/server";
import { buildWhatsAppNotification } from "@/lib/whatsapp";

// POST /api/notifications/whatsapp
// Generates WhatsApp notification URL for order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      shippingMethod,
      shippingCost,
      subtotal,
      discount,
      total,
      paymentMethod,
      transactionId,
    } = body;

    if (!orderNumber || !customerName || !items) {
      return NextResponse.json(
        { error: "Missing required order data" },
        { status: 400 }
      );
    }

    const notification = buildWhatsAppNotification({
      orderNumber,
      customerName,
      customerEmail: customerEmail || "",
      customerPhone,
      shippingAddress: shippingAddress || {},
      items: items || [],
      shippingMethod: shippingMethod || "Standard",
      shippingCost: shippingCost || 0,
      subtotal: subtotal || 0,
      discount: discount || 0,
      total: total || 0,
      paymentMethod: paymentMethod || "PayPal",
      transactionId: transactionId || "",
    });

    return NextResponse.json({
      success: true,
      whatsappUrl: notification.url,
      phone: notification.phone,
    });
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    return NextResponse.json(
      { error: "Failed to generate notification" },
      { status: 500 }
    );
  }
}
