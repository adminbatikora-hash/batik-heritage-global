import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://batikora.com";

  const staticPages = [
    "",
    "/collections",
    "/collections/men-batik",
    "/collections/women-batik",
    "/collections/new-arrivals",
    "/collections/best-sellers",
    "/about",
    "/blog",
    "/contact",
    "/shipping",
    "/returns",
    "/size-guide",
    "/faq",
    "/privacy",
    "/terms",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "daily" : "weekly",
    priority: page === "" ? 1 : page.includes("collections") ? 0.9 : 0.7,
  }));

  return sitemapEntries;
}
