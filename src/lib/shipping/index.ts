import { dhlService } from "./dhl";
import { jneService, posService } from "./rajaongkir";
import {
  CarrierService,
  ShippingRateRequest,
  ShippingRateResult,
  ShippingOrigin,
  ShippingDestination,
  ShippingPackage,
} from "./types";

export type { ShippingRateRequest, ShippingRateResult, ShippingOrigin, ShippingDestination, ShippingPackage };

// All available carrier services
const allCarriers: CarrierService[] = [dhlService, jneService, posService];

// Default store origin (Yogyakarta, Indonesia - heart of batik)
export const DEFAULT_ORIGIN: ShippingOrigin = {
  city: "Yogyakarta",
  cityId: "501", // RajaOngkir city ID for Yogyakarta
  postalCode: "55000",
  countryCode: "ID",
  address: "Jl. Malioboro No. 1, Yogyakarta",
};

/**
 * Get shipping rates from all available carriers for a given destination
 */
export async function getAllShippingRates(
  destination: ShippingDestination,
  pkg: ShippingPackage,
  origin?: ShippingOrigin
): Promise<ShippingRateResult[]> {
  const shippingOrigin = origin || DEFAULT_ORIGIN;
  const isDomestic = destination.countryCode === "ID";

  const request: ShippingRateRequest = {
    origin: shippingOrigin,
    destination,
    package: pkg,
    isDomestic,
  };

  // Filter carriers that are available for this destination
  const availableCarriers = allCarriers.filter((carrier) =>
    carrier.isAvailable(destination)
  );

  // Fetch rates from all available carriers in parallel
  const ratePromises = availableCarriers.map(async (carrier) => {
    try {
      return await carrier.getRate(request);
    } catch (error) {
      console.error(`Error fetching rates from ${carrier.name}:`, error);
      return [];
    }
  });

  const results = await Promise.all(ratePromises);

  // Flatten and sort by price
  const allRates = results.flat().sort((a, b) => a.price - b.price);

  return allRates;
}

/**
 * Get rates from a specific carrier only
 */
export async function getCarrierRates(
  carrierName: string,
  destination: ShippingDestination,
  pkg: ShippingPackage,
  origin?: ShippingOrigin
): Promise<ShippingRateResult[]> {
  const shippingOrigin = origin || DEFAULT_ORIGIN;
  const isDomestic = destination.countryCode === "ID";

  const carrier = allCarriers.find(
    (c) => c.name.toLowerCase() === carrierName.toLowerCase()
  );

  if (!carrier) {
    throw new Error(`Carrier not found: ${carrierName}`);
  }

  if (!carrier.isAvailable(destination)) {
    return [];
  }

  const request: ShippingRateRequest = {
    origin: shippingOrigin,
    destination,
    package: pkg,
    isDomestic,
  };

  return carrier.getRate(request);
}

/**
 * Check which carriers are available for a destination
 */
export function getAvailableCarriers(destination: ShippingDestination): string[] {
  return allCarriers
    .filter((carrier) => carrier.isAvailable(destination))
    .map((carrier) => carrier.name);
}
