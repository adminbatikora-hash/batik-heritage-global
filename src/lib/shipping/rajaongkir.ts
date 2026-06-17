import {
  CarrierService,
  ShippingRateRequest,
  ShippingRateResult,
  ShippingDestination,
} from "./types";

// New Komerce/RajaOngkir API (after acquisition)
const RAJAONGKIR_BASE = "https://rajaongkir.komerce.id";

function getHeaders(): Record<string, string> {
  return {
    key: process.env.RAJAONGKIR_API_KEY || "",
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

// Exchange rate IDR to USD (approximate, should be fetched from API in production)
const IDR_TO_USD = 0.000063;

function idrToUsd(idr: number): number {
  return Math.round(idr * IDR_TO_USD * 100) / 100;
}

// ==================== JNE Service ====================
export const jneService: CarrierService = {
  name: "JNE",

  isAvailable(destination: ShippingDestination): boolean {
    // JNE available for domestic (Indonesia) and some ASEAN countries
    return destination.countryCode === "ID" ||
      ["MY", "SG", "TH", "PH"].includes(destination.countryCode);
  },

  async getRate(request: ShippingRateRequest): Promise<ShippingRateResult[]> {
    const apiKey = process.env.RAJAONGKIR_API_KEY;

    if (!apiKey) {
      console.warn("RajaOngkir API key not configured, using fallback rates");
      return getJNEFallbackRates(request);
    }

    try {
      // For international, use fallback rates (Komerce starter only supports domestic)
      if (request.destination.countryCode !== "ID") {
        return getJNEInternationalRates(request);
      }

      const originId = request.origin.cityId || "501"; // Default: Yogyakarta
      const destinationId = request.destination.cityId || "114"; // Default: Bandung
      const weightGrams = Math.max(Math.ceil(request.package.weight * 1000), 1000);

      const body = new URLSearchParams({
        origin: originId,
        destination: destinationId,
        weight: weightGrams.toString(),
        courier: "jne",
      });

      const response = await fetch(`${RAJAONGKIR_BASE}/api/v1/calculate/domestic-cost`, {
        method: "POST",
        headers: getHeaders(),
        body: body.toString(),
      });

      if (!response.ok) {
        console.error("RajaOngkir API error:", response.status);
        return getJNEFallbackRates(request);
      }

      const data = await response.json();

      if (!data?.data || data.data.length === 0) {
        return getJNEFallbackRates(request);
      }

      return data.data
        .filter((item: KomerceRateItem) => item.cost > 0)
        .map((item: KomerceRateItem) => ({
          carrier: "JNE",
          carrierLogo: "/carriers/jne.svg",
          service: item.service,
          serviceName: `JNE ${item.service}`,
          price: idrToUsd(item.cost),
          currency: "USD",
          estimatedDays: item.etd || "2-3 days",
          description: item.description || item.service,
        }))
        .slice(0, 4);
    } catch (error) {
      console.error("JNE rate fetch error:", error);
      return getJNEFallbackRates(request);
    }
  },
};

// ==================== Pos Indonesia Service ====================
export const posService: CarrierService = {
  name: "Pos Indonesia",

  isAvailable(destination: ShippingDestination): boolean {
    // Pos Indonesia for domestic and international via EMS
    return true; // Available worldwide
  },

  async getRate(request: ShippingRateRequest): Promise<ShippingRateResult[]> {
    const apiKey = process.env.RAJAONGKIR_API_KEY;

    if (!apiKey) {
      console.warn("RajaOngkir API key not configured, using fallback rates");
      return getPosFallbackRates(request);
    }

    try {
      // For international shipments, use fallback
      if (request.destination.countryCode !== "ID") {
        return getPosInternationalRates(request);
      }

      const originId = request.origin.cityId || "501";
      const destinationId = request.destination.cityId || "114";
      const weightGrams = Math.max(Math.ceil(request.package.weight * 1000), 1000);

      const body = new URLSearchParams({
        origin: originId,
        destination: destinationId,
        weight: weightGrams.toString(),
        courier: "pos",
      });

      const response = await fetch(`${RAJAONGKIR_BASE}/api/v1/calculate/domestic-cost`, {
        method: "POST",
        headers: getHeaders(),
        body: body.toString(),
      });

      if (!response.ok) {
        console.error("RajaOngkir API error for POS:", response.status);
        return getPosFallbackRates(request);
      }

      const data = await response.json();

      if (!data?.data || data.data.length === 0) {
        return getPosFallbackRates(request);
      }

      return data.data
        .filter((item: KomerceRateItem) => item.cost > 0)
        .map((item: KomerceRateItem) => ({
          carrier: "Pos Indonesia",
          carrierLogo: "/carriers/pos.svg",
          service: item.service,
          serviceName: `Pos ${item.service}`,
          price: idrToUsd(item.cost),
          currency: "USD",
          estimatedDays: item.etd || "3-5 days",
          description: item.description || item.service,
        }))
        .slice(0, 3);
    } catch (error) {
      console.error("Pos rate fetch error:", error);
      return getPosFallbackRates(request);
    }
  },
};

// ==================== Helper: Search Destination ID ====================
export async function searchDestination(
  cityName: string
): Promise<{ id: number; label: string } | null> {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch(
      `${RAJAONGKIR_BASE}/api/v1/destination/domestic-destination?search=${encodeURIComponent(cityName)}`,
      { headers: { key: apiKey } }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const results = data?.data;

    if (results && results.length > 0) {
      return { id: results[0].id, label: results[0].label };
    }

    return null;
  } catch {
    return null;
  }
}

// ==================== International Rates (Estimated) ====================
function getJNEInternationalRates(request: ShippingRateRequest): ShippingRateResult[] {
  const weight = request.package.weight;
  return [
    {
      carrier: "JNE",
      carrierLogo: "/carriers/jne.svg",
      service: "JNE INTL",
      serviceName: "JNE International",
      price: Math.round((18 + weight * 10) * 100) / 100,
      currency: "USD",
      estimatedDays: "7-14 days",
      description: "JNE International Express",
    },
  ];
}

function getPosInternationalRates(request: ShippingRateRequest): ShippingRateResult[] {
  const weight = request.package.weight;
  const dest = request.destination.countryCode;

  // Zone-based pricing for Pos Indonesia EMS
  let zoneMultiplier = 1;
  if (["SG", "MY", "TH", "PH"].includes(dest)) zoneMultiplier = 0.8;
  else if (["JP", "KR", "AU", "NZ", "IN", "HK"].includes(dest)) zoneMultiplier = 1.0;
  else if (["US", "CA"].includes(dest)) zoneMultiplier = 1.3;
  else if (["GB", "DE", "FR", "NL", "IT", "ES"].includes(dest)) zoneMultiplier = 1.2;
  else if (["AE", "SA", "QA"].includes(dest)) zoneMultiplier = 1.1;
  else zoneMultiplier = 1.4;

  const emsPrice = Math.round((12 + weight * 8) * zoneMultiplier * 100) / 100;
  const registeredPrice = Math.round((8 + weight * 5) * zoneMultiplier * 100) / 100;

  return [
    {
      carrier: "Pos Indonesia",
      carrierLogo: "/carriers/pos.svg",
      service: "EMS",
      serviceName: "Pos Indonesia EMS",
      price: emsPrice,
      currency: "USD",
      estimatedDays: "5-10 days",
      description: "Express Mail Service - International",
    },
    {
      carrier: "Pos Indonesia",
      carrierLogo: "/carriers/pos.svg",
      service: "REGISTERED",
      serviceName: "Pos Registered Mail",
      price: registeredPrice,
      currency: "USD",
      estimatedDays: "14-21 days",
      description: "International Registered Mail",
    },
  ];
}

// ==================== Fallback Rates ====================
function getJNEFallbackRates(request: ShippingRateRequest): ShippingRateResult[] {
  const weight = request.package.weight;

  if (request.destination.countryCode !== "ID") {
    return getJNEInternationalRates(request);
  }

  // Domestic rates (converted to USD)
  const weightGrams = Math.ceil(weight * 1000);
  const regPrice = idrToUsd(Math.max(20000, weightGrams * 20));
  const yesPrice = idrToUsd(Math.max(36000, weightGrams * 36));
  const okePrice = idrToUsd(Math.max(15000, weightGrams * 15));

  return [
    {
      carrier: "JNE",
      carrierLogo: "/carriers/jne.svg",
      service: "OKE",
      serviceName: "JNE OKE",
      price: okePrice,
      currency: "USD",
      estimatedDays: "3-6 days",
      description: "Ongkos Kirim Ekonomis",
    },
    {
      carrier: "JNE",
      carrierLogo: "/carriers/jne.svg",
      service: "REG",
      serviceName: "JNE REG",
      price: regPrice,
      currency: "USD",
      estimatedDays: "2-3 days",
      description: "JNE Regular",
    },
    {
      carrier: "JNE",
      carrierLogo: "/carriers/jne.svg",
      service: "YES",
      serviceName: "JNE YES",
      price: yesPrice,
      currency: "USD",
      estimatedDays: "1-2 days",
      description: "Yakin Esok Sampai",
    },
  ];
}

function getPosFallbackRates(request: ShippingRateRequest): ShippingRateResult[] {
  const weight = request.package.weight;

  if (request.destination.countryCode !== "ID") {
    return getPosInternationalRates(request);
  }

  const weightGrams = Math.ceil(weight * 1000);
  const regularPrice = idrToUsd(Math.max(12000, weightGrams * 12));
  const expressPrice = idrToUsd(Math.max(25000, weightGrams * 25));

  return [
    {
      carrier: "Pos Indonesia",
      carrierLogo: "/carriers/pos.svg",
      service: "Pos Reguler",
      serviceName: "Pos Reguler",
      price: regularPrice,
      currency: "USD",
      estimatedDays: "4-7 days",
      description: "Paket Pos Reguler",
    },
    {
      carrier: "Pos Indonesia",
      carrierLogo: "/carriers/pos.svg",
      service: "EXPRESS",
      serviceName: "Pos Express",
      price: expressPrice,
      currency: "USD",
      estimatedDays: "1-2 days",
      description: "Pos Express Next Day",
    },
  ];
}

// Komerce/RajaOngkir new API response type
interface KomerceRateItem {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}
