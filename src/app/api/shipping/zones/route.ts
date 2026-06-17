import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/shipping/zones - Get all shipping zones with rates
export async function GET() {
  try {
    const zones = await prisma.shippingZone.findMany({
      include: {
        rates: {
          orderBy: { price: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(
      zones.map((zone) => ({
        id: zone.id,
        name: zone.name,
        countries: zone.countries,
        rates: zone.rates.map((rate) => ({
          id: rate.id,
          name: rate.name,
          carrier: rate.carrier,
          price: Number(rate.price),
          estimatedDays: rate.estimatedDays,
          minWeight: rate.minWeight ? Number(rate.minWeight) : null,
          maxWeight: rate.maxWeight ? Number(rate.maxWeight) : null,
        })),
      }))
    );
  } catch (error) {
    console.error("Error fetching shipping zones:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping zones" },
      { status: 500 }
    );
  }
}

// POST /api/shipping/zones - Create a new shipping zone (admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, countries, rates } = body;

    if (!name || !countries || !Array.isArray(countries)) {
      return NextResponse.json(
        { error: "Name and countries are required" },
        { status: 400 }
      );
    }

    const zone = await prisma.shippingZone.create({
      data: {
        name,
        countries,
        rates: rates
          ? {
              create: rates.map(
                (rate: {
                  name: string;
                  carrier?: string;
                  price: number;
                  estimatedDays?: string;
                  minWeight?: number;
                  maxWeight?: number;
                }) => ({
                  name: rate.name,
                  carrier: rate.carrier || null,
                  price: rate.price,
                  estimatedDays: rate.estimatedDays || null,
                  minWeight: rate.minWeight || null,
                  maxWeight: rate.maxWeight || null,
                })
              ),
            }
          : undefined,
      },
      include: { rates: true },
    });

    return NextResponse.json(zone, { status: 201 });
  } catch (error) {
    console.error("Error creating shipping zone:", error);
    return NextResponse.json(
      { error: "Failed to create shipping zone" },
      { status: 500 }
    );
  }
}

// PUT /api/shipping/zones - Update a shipping zone (admin)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, countries, rates } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Zone ID is required" },
        { status: 400 }
      );
    }

    // Update zone info
    const zone = await prisma.shippingZone.update({
      where: { id },
      data: {
        name,
        countries,
      },
    });

    // If rates provided, delete old and create new
    if (rates && Array.isArray(rates)) {
      await prisma.shippingRate.deleteMany({
        where: { zoneId: id },
      });

      await prisma.shippingRate.createMany({
        data: rates.map(
          (rate: {
            name: string;
            carrier?: string;
            price: number;
            estimatedDays?: string;
            minWeight?: number;
            maxWeight?: number;
          }) => ({
            zoneId: id,
            name: rate.name,
            carrier: rate.carrier || null,
            price: rate.price,
            estimatedDays: rate.estimatedDays || null,
            minWeight: rate.minWeight || null,
            maxWeight: rate.maxWeight || null,
          })
        ),
      });
    }

    const updatedZone = await prisma.shippingZone.findUnique({
      where: { id },
      include: { rates: true },
    });

    return NextResponse.json(updatedZone);
  } catch (error) {
    console.error("Error updating shipping zone:", error);
    return NextResponse.json(
      { error: "Failed to update shipping zone" },
      { status: 500 }
    );
  }
}

// DELETE /api/shipping/zones?id=xxx
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Zone ID is required" },
        { status: 400 }
      );
    }

    await prisma.shippingZone.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting shipping zone:", error);
    return NextResponse.json(
      { error: "Failed to delete shipping zone" },
      { status: 500 }
    );
  }
}
