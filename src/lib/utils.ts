import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "USD"): string {
  const currencyConfig: Record<string, { locale: string; currency: string }> = {
    USD: { locale: "en-US", currency: "USD" },
    EUR: { locale: "de-DE", currency: "EUR" },
    GBP: { locale: "en-GB", currency: "GBP" },
    AUD: { locale: "en-AU", currency: "AUD" },
    SGD: { locale: "en-SG", currency: "SGD" },
    JPY: { locale: "ja-JP", currency: "JPY" },
  };

  const config = currencyConfig[currency] || currencyConfig.USD;

  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
  }).format(price);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BHG-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

export function getExchangeRate(currency: string): number {
  const rates: Record<string, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    AUD: 1.53,
    SGD: 1.34,
    JPY: 149.5,
  };
  return rates[currency] || 1;
}
