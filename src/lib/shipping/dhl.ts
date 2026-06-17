import {
  CarrierService,
  ShippingRateRequest,
  ShippingRateResult,
  ShippingDestination,
} from "./types";

const DHL_API_BASE = "https://express.api.dhl.com/mydhlapi";
const DHL_TEST_API_BASE = "https://express.api.dhl.com/mydhlapi/test";

function getApiBase(): string {
  return process.env.DHL_MODE === "production" ? DHL_API_BASE : DHL_TEST_API_BASE;
}

function getAuthHeaders(): Record<string, string> {
  const username = process.env.DHL_API_KEY || "";
  const password = process.env.DHL_API_SECRET || "";
  const auth = Buffer.from(`${username}:${password}`).toString("base64");

  return {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  };
}

export const dhlService: CarrierService = {
  name: "DHL Express",

  isAvailable(destination: ShippingDestination): boolean {
    // DHL is available for international shipments (outside Indonesia)
    return destination.countryCode !== "ID";
  },

  async getRate(request: ShippingRateRequest): Promise<ShippingRateResult[]> {
    const apiKey = process.env.DHL_API_KEY;
    const apiSecret = process.env.DHL_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.warn("DHL API credentials not configured, using fallback rates");
      return getDHLFallbackRates(request);
    }

    try {
      const accountNumber = process.env.DHL_ACCOUNT_NUMBER || "";
      const now = new Date();
      const plannedDate = now.toISOString().split("T")[0];

      const queryParams = new URLSearchParams({
        accountNumber,
        originCountryCode: request.origin.countryCode,
        originCityName: request.origin.city,
        originPostalCode: request.origin.postalCode,
        destinationCountryCode: request.destination.countryCode,
        destinationCityName: request.destination.city,
        destinationPostalCode: request.destination.postalCode,
        weight: request.package.weight.toString(),
        length: (request.package.length || 20).toString(),
        width: (request.package.width || 15).toString(),
        height: (request.package.height || 10).toString(),
        plannedShippingDate: plannedDate,
        isCustomsDeclarable: "true",
        unitOfMeasurement: "metric",
      });

      const response = await fetch(
        `${getApiBase()}/rates?${queryParams.toString()}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("DHL API error:", response.status, errorData);
        return getDHLFallbackRates(request);
      }

      const data = await response.json();

      if (!data.products || data.products.length === 0) {
        return getDHLFallbackRates(request);
      }

      return data.products
        .filter((product: DHLProduct) => product.totalPrice && product.totalPrice.length > 0)
        .map((product: DHLProduct) => {
          const price = product.totalPrice[0];
          const deliveryDate = product.deliveryCapabilities?.estimatedDeliveryDateAndTime;
          let estimatedDays = "3-7 days";

          if (deliveryDate) {
            const delivery = new Date(deliveryDate);
            const diff = Math.ceil(
              (delivery.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            );
            estimatedDays = `${diff}-${diff + 1} days`;
          }

          return {
            carrier: "DHL Express",
            carrierLogo: "/carriers/dhl.svg",
            service: product.productCode || "EXPRESS",
            serviceName: product.productName || "DHL Express",
            price: Number(price.price),
            currency: price.priceCurrency || "USD",
            estimatedDays,
            description: product.productName,
          };
        })
        .slice(0, 3); // Return max 3 options
    } catch (error) {
      console.error("DHL rate fetch error:", error);
      return getDHLFallbackRates(request);
    }
  },
};

// Fallback rates when API is unavailable
function getDHLFallbackRates(request: ShippingRateRequest): ShippingRateResult[] {
  const weight = request.package.weight;
  const dest = request.destination.countryCode;

  // Base price calculation by region
  let baseMultiplier = 1;
  if (["US", "CA"].includes(dest)) baseMultiplier = 1.2;
  else if (["GB", "DE", "FR", "NL", "IT", "ES", "SE", "CH", "BE"].includes(dest)) baseMultiplier = 1.1;
  else if (["AE", "SA", "QA", "KW", "BH"].includes(dest)) baseMultiplier = 1.3;
  else if (["AU", "NZ"].includes(dest)) baseMultiplier = 1.4;
  else baseMultiplier = 1.0;

  const expressPrice = Math.round((15 + weight * 12) * baseMultiplier * 100) / 100;
  const priorityPrice = Math.round((25 + weight * 18) * baseMultiplier * 100) / 100;
  const economyPrice = Math.round((10 + weight * 8) * baseMultiplier * 100) / 100;

  return [
    {
      carrier: "DHL Express",
      carrierLogo: "/carriers/dhl.svg",
      service: "ECONOMY",
      serviceName: "DHL Express Economy",
      price: economyPrice,
      currency: "USD",
      estimatedDays: "7-12 days",
      description: "Economical international shipping",
    },
    {
      carrier: "DHL Express",
      carrierLogo: "/carriers/dhl.svg",
      service: "EXPRESS",
      serviceName: "DHL Express Worldwide",
      price: expressPrice,
      currency: "USD",
      estimatedDays: "3-5 days",
      description: "Fast international delivery",
    },
    {
      carrier: "DHL Express",
      carrierLogo: "/carriers/dhl.svg",
      service: "PRIORITY",
      serviceName: "DHL Express Priority",
      price: priorityPrice,
      currency: "USD",
      estimatedDays: "1-3 days",
      description: "Fastest international delivery",
    },
  ];
}

// DHL API response types
interface DHLProduct {
  productCode?: string;
  productName?: string;
  totalPrice: { price: number; priceCurrency: string }[];
  deliveryCapabilities?: {
    estimatedDeliveryDateAndTime?: string;
  };
}
