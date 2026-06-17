import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      items,
      shippingAddress,
      billingAddress,
      shippingMethod,
      shippingRateId,
      shippingCost: clientShippingCost,
      couponId,
      currency,
    } = body;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { images: { take: 1 } },
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      const itemTotal = Number(product.price) * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        image: product.images[0]?.url,
      });
    }

    // Calculate shipping from database rate
    let shipping = 0;
    if (shippingRateId) {
      // Look up the rate from the database for server-side validation
      const rate = await prisma.shippingRate.findUnique({
        where: { id: shippingRateId },
        include: { zone: true },
      });

      if (rate) {
        // Determine free shipping threshold based on zone
        const freeThresholds: Record<string, number> = {
          "Domestic (Indonesia)": 50,
          "Asia Pacific": 100,
          "North America": 150,
          "Europe": 150,
          "Middle East": 175,
        };
        const threshold = freeThresholds[rate.zone.name] ?? 200;

        // Apply free shipping if subtotal exceeds threshold
        shipping = subtotal >= threshold ? 0 : Number(rate.price);
      } else {
        // Fallback to client-provided cost if rate not found
        shipping = clientShippingCost ?? 15;
      }
    } else if (clientShippingCost !== undefined) {
      // If no rate ID but client sent a cost (e.g., from PayPal flow)
      shipping = clientShippingCost;
    } else {
      // Legacy fallback
      shipping = subtotal > 150 ? 0 : 15;
    }

    // Apply coupon
    let discount = 0;
    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });
      if (coupon && coupon.active) {
        if (coupon.type === "PERCENTAGE") {
          discount = subtotal * (Number(coupon.value) / 100);
          if (coupon.maxDiscount) {
            discount = Math.min(discount, Number(coupon.maxDiscount));
          }
        } else if (coupon.type === "FIXED") {
          discount = Number(coupon.value);
        } else if (coupon.type === "FREE_SHIPPING") {
          shipping = 0;
        }
      }
    }

    const total = subtotal + shipping - discount;

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId,
        subtotal,
        shipping,
        discount,
        total,
        currency: currency || "USD",
        shippingMethod,
        shippingAddress,
        billingAddress,
        couponId,
        items: { create: orderItems },
      },
      include: {
        items: true,
        user: { select: { name: true, email: true } },
      },
    });

    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity },
          sold: { increment: item.quantity },
        },
      });
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
