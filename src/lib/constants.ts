export const SITE_CONFIG = {
  name: "Batikora",
  description:
    "Discover authentic Indonesian Batik masterpieces crafted by skilled artisans. Premium handcrafted batik delivered worldwide.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://batikora.com",
  ogImage: "/og-image.jpg",
  keywords: [
    "Indonesian Batik",
    "Premium Batik",
    "Handmade Batik",
    "Batik Shirt",
    "Batik Fashion",
    "Authentic Batik",
    "Batik Dress",
    "Traditional Indonesian Fabric",
  ],
};

export const CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", flag: "🇦🇺" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", flag: "🇸🇬" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", flag: "🇯🇵" },
] as const;

export const SUPPORTED_COUNTRIES = [
  // Asia Pacific
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "HK", name: "Hong Kong", flag: "🇭🇰" },
  // North America
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  // Europe
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  // Middle East
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
] as const;

export const SHIPPING_METHODS = [
  { id: "standard", name: "Standard Shipping", days: "10-14 days" },
  { id: "express", name: "Express Shipping", days: "5-7 days" },
  { id: "priority", name: "Priority Shipping", days: "3-5 days" },
  { id: "overnight", name: "Overnight Shipping", days: "1-2 days" },
] as const;

// Country-to-zone mapping for quick reference
export const COUNTRY_ZONES: Record<string, string> = {
  // Domestic
  ID: "Domestic (Indonesia)",
  // Asia Pacific
  SG: "Asia Pacific",
  JP: "Asia Pacific",
  AU: "Asia Pacific",
  NZ: "Asia Pacific",
  MY: "Asia Pacific",
  TH: "Asia Pacific",
  KR: "Asia Pacific",
  PH: "Asia Pacific",
  IN: "Asia Pacific",
  HK: "Asia Pacific",
  // North America
  US: "North America",
  CA: "North America",
  // Europe
  GB: "Europe",
  DE: "Europe",
  FR: "Europe",
  NL: "Europe",
  IT: "Europe",
  ES: "Europe",
  SE: "Europe",
  CH: "Europe",
  BE: "Europe",
  // Middle East
  AE: "Middle East",
  SA: "Middle East",
  QA: "Middle East",
  KW: "Middle East",
  BH: "Middle East",
};

export const CATEGORIES = [
  { name: "Men Batik", slug: "men-batik" },
  { name: "Women Batik", slug: "women-batik" },
  { name: "New Arrivals", slug: "new-arrivals" },
  { name: "Best Sellers", slug: "best-sellers" },
  { name: "Accessories", slug: "accessories" },
  { name: "Home & Living", slug: "home-living" },
] as const;

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  {
    name: "Collections",
    href: "/collections",
    children: [
      { name: "Men Batik", href: "/collections/men-batik" },
      { name: "Women Batik", href: "/collections/women-batik" },
      { name: "New Arrivals", href: "/collections/new-arrivals" },
      { name: "Best Sellers", href: "/collections/best-sellers" },
    ],
  },
  { name: "About", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
] as const;

export const HERO_STATS = [
  { value: "5000+", label: "Customers" },
  { value: "50+", label: "Countries Served" },
  { value: "100%", label: "Authentic Batik" },
  { value: "Free", label: "Worldwide Shipping" },
] as const;
