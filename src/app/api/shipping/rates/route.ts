import { NextRequest, NextResponse } from "next/server";
import {
  getAllShippingRates,
  getAvailableCarriers,
  DEFAULT_ORIGIN,
  ShippingDestination,
  ShippingPackage,
} from "@/lib/shipping";

// GET /api/shipping/rates?country=US&city=New+York&postalCode=10001&weight=0.5
// Returns real-time shipping rates from all available carriers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const city = searchParams.get("city") || "";
    const postalCode = searchParams.get("postalCode") || "";
    const weight = parseFloat(searchParams.get("weight") || "0.5");
    const cityId = searchParams.get("cityId") || undefined;

    if (!country) {
      return NextResponse.json(
        { error: "Country code is required" },
        { status: 400 }
      );
    }

    const destination: ShippingDestination = {
      city,
      cityId,
      postalCode,
      countryCode: country.toUpperCase(),
    };

    const pkg: ShippingPackage = {
      weight: Math.max(weight, 0.1), // minimum 100g
      length: 30,
      width: 20,
      height: 10,
    };

    // Get origin from env or default
    const origin = {
      ...DEFAULT_ORIGIN,
      city: process.env.SHIPPING_ORIGIN_CITY || DEFAULT_ORIGIN.city,
      cityId: process.env.SHIPPING_ORIGIN_CITY_ID || DEFAULT_ORIGIN.cityId,
      postalCode: process.env.SHIPPING_ORIGIN_POSTAL_CODE || DEFAULT_ORIGIN.postalCode,
      countryCode: process.env.SHIPPING_ORIGIN_COUNTRY || DEFAULT_ORIGIN.countryCode,
    };

    // Fetch rates from all carriers
    const rates = await getAllShippingRates(destination, pkg, origin);
    const availableCarriers = getAvailableCarriers(destination);

    return NextResponse.json({
      country: country.toUpperCase(),
      isDomestic: country.toUpperCase() === "ID",
      availableCarriers,
      rates,
      totalOptions: rates.length,
    });
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping rates" },
      { status: 500 }
    );
  }
}

// POST /api/shipping/rates - For more detailed rate requests with full address
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, weight, length, width, height } = body;

    if (!destination || !destination.countryCode) {
      return NextResponse.json(
        { error: "Destination with countryCode is required" },
        { status: 400 }
      );
    }

    const dest: ShippingDestination = {
      city: destination.city || "",
      cityId: destination.cityId,
      state: destination.state,
      postalCode: destination.postalCode || "",
      countryCode: destination.countryCode.toUpperCase(),
      address: destination.address,
    };

    const pkg: ShippingPackage = {
      weight: Math.max(weight || 0.5, 0.1),
      length: length || 30,
      width: width || 20,
      height: height || 10,
    };

    const origin = {
      ...DEFAULT_ORIGIN,
      city: process.env.SHIPPING_ORIGIN_CITY || DEFAULT_ORIGIN.city,
      cityId: process.env.SHIPPING_ORIGIN_CITY_ID || DEFAULT_ORIGIN.cityId,
      postalCode: process.env.SHIPPING_ORIGIN_POSTAL_CODE || DEFAULT_ORIGIN.postalCode,
      countryCode: process.env.SHIPPING_ORIGIN_COUNTRY || DEFAULT_ORIGIN.countryCode,
    };

    const rates = await getAllShippingRates(dest, pkg, origin);
    const availableCarriers = getAvailableCarriers(dest);

    return NextResponse.json({
      country: dest.countryCode,
      isDomestic: dest.countryCode === "ID",
      availableCarriers,
      rates,
      totalOptions: rates.length,
    });
  } catch (error) {
    console.error("Error fetching shipping rates:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping rates" },
      { status: 500 }
    );
  }
}
