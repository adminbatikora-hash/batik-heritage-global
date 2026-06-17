import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/admin/settings?prefix=shipping_origin,carrier_
// Returns site settings filtered by prefix(es)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get("prefix");

    let settings;

    if (prefix) {
      const prefixes = prefix.split(",").map((p) => p.trim());
      settings = await prisma.siteSetting.findMany({
        where: {
          OR: prefixes.map((p) => ({
            key: { startsWith: p },
          })),
        },
      });
    } else {
      settings = await prisma.siteSetting.findMany();
    }

    // Return as key-value object
    const result: Record<string, string> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update multiple settings at once
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Request body must be a key-value object" },
        { status: 400 }
      );
    }

    const updates = Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    );

    await Promise.all(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
