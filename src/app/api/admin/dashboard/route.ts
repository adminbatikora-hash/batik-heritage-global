import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const [totalProducts, totalOrders, totalCustomers, recentOrders, topProducts, revenueResult] =
      await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { name: true, email: true } } },
        }),
        prisma.product.findMany({
          take: 5,
          orderBy: { sold: "desc" },
          select: { name: true, sold: true, price: true },
        }),
        prisma.order.aggregate({ _sum: { total: true } }),
      ]);

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue: Number(revenueResult._sum.total || 0),
      totalCustomers,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
