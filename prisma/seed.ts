import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...\n");

  // ==================== ADMIN USER ====================
  const adminPassword = await bcrypt.hash("BatikAdmin2024!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@batikheritage.global" },
    update: {},
    create: {
      name: "Admin Batik Heritage",
      email: "admin@batikheritage.global",
      password: adminPassword,
      role: "ADMIN",
      phone: "+62 274 123 456",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ==================== MANAGER USER ====================
  const managerPassword = await bcrypt.hash("BatikManager2024!", 12);

  const manager = await prisma.user.upsert({
    where: { email: "manager@batikheritage.global" },
    update: {},
    create: {
      name: "Manager Batik Heritage",
      email: "manager@batikheritage.global",
      password: managerPassword,
      role: "MANAGER",
      phone: "+62 274 123 457",
    },
  });
  console.log("✅ Manager user created:", manager.email);

  // ==================== DEMO CUSTOMER ====================
  const customerPassword = await bcrypt.hash("Customer2024!", 12);

  const customer = await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "customer@example.com",
      password: customerPassword,
      role: "CUSTOMER",
      phone: "+1 234 567 8900",
    },
  });
  console.log("✅ Demo customer created:", customer.email);

  // ==================== CATEGORIES ====================
  const categories = [
    { name: "Men Batik", slug: "men-batik", description: "Sophisticated batik shirts, blazers & formal wear for men" },
    { name: "Women Batik", slug: "women-batik", description: "Elegant dresses, blouses & accessories for women" },
    { name: "New Arrivals", slug: "new-arrivals", description: "Latest designs from our master artisans" },
    { name: "Best Sellers", slug: "best-sellers", description: "Our most loved pieces worldwide" },
    { name: "Accessories", slug: "accessories", description: "Scarves, bags, and batik accessories" },
    { name: "Home & Living", slug: "home-living", description: "Batik for your living space" },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log("✅ Categories created:", categories.length);

  // ==================== PRODUCTS ====================
  const menCategory = await prisma.category.findUnique({ where: { slug: "men-batik" } });
  const womenCategory = await prisma.category.findUnique({ where: { slug: "women-batik" } });

  if (menCategory && womenCategory) {
    const products = [
      {
        name: "Royal Parang Silk Shirt",
        slug: "royal-parang-silk-shirt",
        description: "The Royal Parang pattern is one of the most prestigious motifs in Indonesian Batik, historically reserved for royalty. This premium silk shirt features hand-drawn Parang patterns using traditional canting tools, created over 30 days of meticulous work by master artisan Pak Hadi from Yogyakarta.",
        shortDesc: "Hand-drawn Parang pattern on premium mulberry silk",
        sku: "BHG-MEN-001",
        price: 189,
        compareAt: 249,
        cost: 65,
        weight: 0.25,
        material: "100% Pure Silk",
        categoryId: menCategory.id,
        stock: 15,
        featured: true,
        rating: 4.9,
        reviewCount: 128,
        sold: 342,
      },
      {
        name: "Kawung Premium Blazer",
        slug: "kawung-premium-blazer",
        description: "The Kawung motif represents the sugar palm fruit and symbolizes purity. This premium blazer combines traditional Kawung batik with modern tailoring, perfect for formal occasions and business meetings.",
        shortDesc: "Luxury Kawung motif blazer for formal occasions",
        sku: "BHG-MEN-002",
        price: 349,
        compareAt: 429,
        cost: 120,
        weight: 0.45,
        material: "Silk Blend",
        categoryId: menCategory.id,
        stock: 8,
        featured: true,
        rating: 4.9,
        reviewCount: 74,
        sold: 186,
      },
      {
        name: "Sogan Classic Kemeja",
        slug: "sogan-classic-kemeja",
        description: "Classic Sogan batik in warm earth tones, a timeless piece rooted in Javanese tradition. The natural brown dyes give this shirt its distinctive warm character that deepens with age.",
        shortDesc: "Classic Sogan batik in warm earth tones",
        sku: "BHG-MEN-003",
        price: 149,
        compareAt: null,
        cost: 48,
        weight: 0.22,
        material: "Premium Cotton",
        categoryId: menCategory.id,
        stock: 22,
        featured: false,
        rating: 4.7,
        reviewCount: 203,
        sold: 567,
      },
      {
        name: "Mega Mendung Dress",
        slug: "mega-mendung-dress",
        description: "The Mega Mendung (cloud) pattern from Cirebon represents patience and grandeur. This elegant dress features hand-stamped cloud motifs in rich blue gradients on premium cotton.",
        shortDesc: "Cloud motif dress from Cirebon in rich blue gradients",
        sku: "BHG-WMN-001",
        price: 259,
        compareAt: null,
        cost: 85,
        weight: 0.30,
        material: "Premium Cotton",
        categoryId: womenCategory.id,
        stock: 12,
        featured: true,
        rating: 4.8,
        reviewCount: 96,
        sold: 234,
      },
      {
        name: "Truntum Elegant Gown",
        slug: "truntum-elegant-gown",
        description: "Truntum means 'blooming love' and is traditionally worn at Javanese weddings. This elegant gown features delicate Truntum patterns on pure silk, hand-drawn by master artisan Bu Siti.",
        shortDesc: "Symbol of blooming love on pure silk gown",
        sku: "BHG-WMN-002",
        price: 499,
        compareAt: null,
        cost: 165,
        weight: 0.40,
        material: "Pure Silk",
        categoryId: womenCategory.id,
        stock: 5,
        featured: true,
        rating: 5.0,
        reviewCount: 52,
        sold: 98,
      },
      {
        name: "Ceplok Modern Blouse",
        slug: "ceplok-modern-blouse",
        description: "Geometric Ceplok patterns meet modern fashion in this versatile blouse. Perfect for office wear or casual outings, it blends traditional artistry with contemporary design.",
        shortDesc: "Geometric Ceplok patterns in modern blouse style",
        sku: "BHG-WMN-003",
        price: 179,
        compareAt: 219,
        cost: 55,
        weight: 0.20,
        material: "Cotton Blend",
        categoryId: womenCategory.id,
        stock: 18,
        featured: false,
        rating: 4.8,
        reviewCount: 87,
        sold: 312,
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: product,
      });
    }
    console.log("✅ Products created:", products.length);
  }

  // ==================== SHIPPING ZONES ====================
  const shippingZones = [
    {
      name: "North America",
      countries: ["US", "CA"],
      rates: [
        { name: "Standard", carrier: "USPS", price: 15, estimatedDays: "10-14 days" },
        { name: "Express", carrier: "FedEx", price: 25, estimatedDays: "5-7 days" },
        { name: "Priority", carrier: "DHL", price: 45, estimatedDays: "3-5 days" },
      ],
    },
    {
      name: "Europe",
      countries: ["GB", "DE", "FR"],
      rates: [
        { name: "Standard", carrier: "Royal Mail", price: 18, estimatedDays: "12-16 days" },
        { name: "Express", carrier: "DHL", price: 30, estimatedDays: "5-7 days" },
        { name: "Priority", carrier: "FedEx", price: 50, estimatedDays: "3-5 days" },
      ],
    },
    {
      name: "Asia Pacific",
      countries: ["AU", "SG", "JP"],
      rates: [
        { name: "Standard", carrier: "EMS", price: 12, estimatedDays: "7-10 days" },
        { name: "Express", carrier: "DHL", price: 22, estimatedDays: "4-6 days" },
        { name: "Priority", carrier: "FedEx", price: 40, estimatedDays: "2-4 days" },
      ],
    },
  ];

  for (const zone of shippingZones) {
    const createdZone = await prisma.shippingZone.create({
      data: {
        name: zone.name,
        countries: zone.countries,
        rates: {
          create: zone.rates.map((rate) => ({
            name: rate.name,
            carrier: rate.carrier,
            price: rate.price,
            estimatedDays: rate.estimatedDays,
          })),
        },
      },
    });
    console.log("✅ Shipping zone created:", createdZone.name);
  }

  // ==================== COUPONS ====================
  const coupons = [
    {
      code: "BATIK10",
      type: "PERCENTAGE" as const,
      value: 10,
      minPurchase: 100,
      maxDiscount: 50,
      active: true,
    },
    {
      code: "HERITAGE20",
      type: "PERCENTAGE" as const,
      value: 20,
      minPurchase: 200,
      maxDiscount: 100,
      active: true,
    },
    {
      code: "FREESHIP",
      type: "FREE_SHIPPING" as const,
      value: 0,
      minPurchase: 50,
      active: true,
    },
    {
      code: "WELCOME15",
      type: "FIXED" as const,
      value: 15,
      minPurchase: 75,
      active: true,
    },
  ];

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: coupon,
    });
  }
  console.log("✅ Coupons created:", coupons.length);

  // ==================== BLOG POSTS ====================
  const blogPosts = [
    {
      title: "The Ancient Art of Batik: A Journey Through 1000 Years",
      slug: "ancient-art-of-batik",
      excerpt: "Discover the fascinating history of Indonesian Batik, from royal courts to UNESCO recognition.",
      content: "Batik has been an integral part of Indonesian culture for over a millennium. The word 'batik' comes from the Javanese words 'amba' (to write) and 'titik' (dot), reflecting the meticulous dot-by-dot process of creating these intricate patterns.\n\nThe earliest evidence of batik in Indonesia dates back to the 6th century, found in ancient temple reliefs. However, the art form truly flourished during the Majapahit Empire in the 13th century, when it became a symbol of royalty and spiritual significance.\n\nIn 2009, UNESCO recognized Indonesian Batik as an Intangible Cultural Heritage of Humanity, cementing its place in world culture.",
      category: "Batik History",
      published: true,
      authorName: "Dr. Sari Widodo",
      readTime: 8,
      tags: ["history", "culture", "UNESCO", "heritage"],
    },
    {
      title: "Meet Pak Hadi: Master Artisan of Yogyakarta",
      slug: "meet-pak-hadi-artisan",
      excerpt: "A behind-the-scenes look at one of Indonesia's most celebrated batik artisans and his 40-year journey.",
      content: "In the heart of Yogyakarta's batik district, 65-year-old Pak Hadi sits cross-legged on his workshop floor, canting tool in hand, creating patterns that have taken decades to master.\n\nPak Hadi learned the art of batik from his grandmother at the age of 8. Today, his pieces are collected by museums and fashion houses worldwide. Each creation takes between 30 to 90 days to complete.",
      category: "Artisan Stories",
      published: true,
      authorName: "Maya Putri",
      readTime: 6,
      tags: ["artisan", "yogyakarta", "handmade", "craftsman"],
    },
    {
      title: "How to Style Batik for Modern Fashion",
      slug: "style-batik-modern-fashion",
      excerpt: "Tips and inspiration for incorporating authentic batik into your contemporary wardrobe.",
      content: "Gone are the days when batik was considered 'old-fashioned' or limited to formal Indonesian events. Today's fashion-forward approach to batik embraces mixing traditional patterns with modern silhouettes.\n\nHere are our top styling tips:\n1. Pair a batik shirt with tailored chinos for smart-casual\n2. Use a batik scarf as a statement accessory\n3. Mix batik patterns with solid colors\n4. Layer a batik blazer over a simple white tee",
      category: "Fashion Trends",
      published: true,
      authorName: "Lisa Hartono",
      readTime: 5,
      tags: ["fashion", "styling", "modern", "tips"],
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
  }
  console.log("✅ Blog posts created:", blogPosts.length);

  // ==================== SITE SETTINGS ====================
  const settings = [
    { key: "store_name", value: "Batik Heritage Global" },
    { key: "store_email", value: "hello@batikheritage.global" },
    { key: "store_phone", value: "+62 274 123 456" },
    { key: "store_address", value: "Jl. Malioboro No. 123, Yogyakarta, Indonesia 55271" },
    { key: "store_currency", value: "USD" },
    { key: "free_shipping_threshold", value: "150" },
    { key: "tax_rate", value: "0" },
    { key: "business_hours", value: "Mon-Fri 9AM-6PM WIB, Sat 9AM-3PM WIB" },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log("✅ Site settings created:", settings.length);

  // ==================== NEWSLETTER SUBSCRIBERS ====================
  const subscribers = [
    "sarah@example.com",
    "james@example.com",
    "yuki@example.com",
    "marie@example.com",
  ];

  for (const email of subscribers) {
    await prisma.newsletter.upsert({
      where: { email },
      update: {},
      create: { email },
    });
  }
  console.log("✅ Newsletter subscribers created:", subscribers.length);

  console.log("\n🎉 Database seeding completed!\n");
  console.log("═══════════════════════════════════════════");
  console.log("  ADMIN CREDENTIALS");
  console.log("═══════════════════════════════════════════");
  console.log("  Email:    admin@batikheritage.global");
  console.log("  Password: BatikAdmin2024!");
  console.log("═══════════════════════════════════════════");
  console.log("  MANAGER CREDENTIALS");
  console.log("═══════════════════════════════════════════");
  console.log("  Email:    manager@batikheritage.global");
  console.log("  Password: BatikManager2024!");
  console.log("═══════════════════════════════════════════");
  console.log("  CUSTOMER CREDENTIALS (Demo)");
  console.log("═══════════════════════════════════════════");
  console.log("  Email:    customer@example.com");
  console.log("  Password: Customer2024!");
  console.log("═══════════════════════════════════════════\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
