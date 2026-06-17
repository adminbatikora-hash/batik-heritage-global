// Shared types for shipping carrier integrations

export interface ShippingOrigin {
  city: string;
  cityId?: string; // RajaOngkir city ID
  postalCode: string;
  countryCode: string;
  address?: string;
}

export interface ShippingDestination {
  city: string;
  cityId?: string; // RajaOngkir city ID
  state?: string;
  postalCode: string;
  countryCode: string;
  address?: string;
}

export interface ShippingPackage {
  weight: number; // in kg
  length?: number; // in cm
  width?: number; // in cm
  height?: number; // in cm
}

export interface ShippingRateResult {
  carrier: string;
  carrierLogo: string;
  service: string;
  serviceName: string;
  price: number; // in USD for international, IDR for domestic
  currency: string;
  estimatedDays: string;
  description?: string;
}

export interface ShippingRateRequest {
  origin: ShippingOrigin;
  destination: ShippingDestination;
  package: ShippingPackage;
  isDomestic: boolean;
}

export interface CarrierService {
  name: string;
  getRate(request: ShippingRateRequest): Promise<ShippingRateResult[]>;
  isAvailable(destination: ShippingDestination): boolean;
}
