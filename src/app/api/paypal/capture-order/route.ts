import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { buildWhatsAppNotification } from "@/lib/whatsapp";

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    throw new Error("Failed to get PayPal access token");
  }

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { orderID, orderData } = await request.json();

    if (!orderID) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    // Capture the PayPal order
    const res = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error("PayPal capture error:", errorData);
      return NextResponse.json(
        { error: "Failed to capture PayPal payment" },
        { status: 500 }
      );
    }

    const captureData = await res.json();

    // If payment was successful, create order in database
    if (captureData.status === "COMPLETED") {
      const captureId =
        captureData.purchase_units[0]?.payments?.captures[0]?.id;

      // Create order in database if orderData is provided
      if (orderData && orderData.userId) {
        const orderNumber = `BTK-${Date.now().toString(36).toUpperCase()}`;

        await prisma.order.create({
          data: {
            orderNumber,
            userId: orderData.userId,
            status: "PAID",
            subtotal: orderData.subtotal,
            shipping: orderData.shipping,
            tax: 0,
            discount: orderData.discount || 0,
            total: orderData.total,
            currency: "USD",
            shippingMethod: orderData.shippingMethod,
            paymentMethod: "paypal",
            paymentId: captureId || orderID,
            paymentStatus: "PAID",
            shippingAddress: orderData.shippingAddress || null,
            items: {
              create: orderData.items?.map(
                (item: {
                  productId: string;
                  name: string;
                  sku: string;
                  price: number;
                  quantity: number;
                  size?: string;
                  color?: string;
                  image?: string;
                }) => ({
                  productId: item.productId,
                  name: item.name,
                  sku: item.sku || "N/A",
                  price: item.price,
                  quantity: item.quantity,
                  size: item.size || null,
                  color: item.color || null,
                  image: item.image || null,
                })
              ),
            },
          },
        });

        // Generate WhatsApp notification for admin
        const whatsapp = buildWhatsAppNotification({
          orderNumber,
          customerName: `${orderData.shippingAddress?.firstName || ""} ${orderData.shippingAddress?.lastName || ""}`.trim(),
          customerEmail: orderData.email || "",
          customerPhone: orderData.phone || "",
          shippingAddress: {
            address1: orderData.shippingAddress?.address1 || "",
            address2: orderData.shippingAddress?.address2 || "",
            city: orderData.shippingAddress?.city || "",
            state: orderData.shippingAddress?.state || "",
            postalCode: orderData.shippingAddress?.postalCode || "",
            country: orderData.shippingAddress?.country || "",
          },
          items: orderData.items?.map((item: { name: string; quantity: number; price: number }) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })) || [],
          shippingMethod: orderData.shippingMethod || "Standard",
          shippingCost: orderData.shipping || 0,
          subtotal: orderData.subtotal || 0,
          discount: orderData.discount || 0,
          total: orderData.total || 0,
          paymentMethod: "PayPal",
          transactionId: captureId || orderID,
        });

        return NextResponse.json({
          status: "COMPLETED",
          captureId,
          paypalOrderId: orderID,
          orderNumber,
          whatsappUrl: whatsapp.url,
        });
      }

      return NextResponse.json({
        status: "COMPLETED",
        captureId,
        paypalOrderId: orderID,
      });
    }

    return NextResponse.json({
      status: captureData.status,
      details: captureData,
    });
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
