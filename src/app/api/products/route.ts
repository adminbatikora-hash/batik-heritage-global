import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    // Only filter published for public (non-admin) requests
    const admin = searchParams.get("admin");
    if (!admin) {
      where.published = true;
    }

    if (category) {
      where.category = { slug: category };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) (where.price as Record<string, unknown>).gte = parseFloat(minPrice);
      if (maxPrice) (where.price as Record<string, unknown>).lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: Record<string, string> = {};
    switch (sort) {
      case "price-asc":
        orderBy.price = "asc";
        break;
      case "price-desc":
        orderBy.price = "desc";
        break;
      case "best-selling":
        orderBy.sold = "desc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { position: "asc" } },
          category: { select: { id: true, name: true, slug: true } },
          sizes: admin ? true : undefined,
          colors: admin ? true : undefined,
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      shortDesc,
      sku,
      price,
      compareAt,
      cost,
      weight,
      material,
      categoryId,
      stock,
      featured,
      images,
      sizes,
      colors,
    } = body;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        sku,
        price,
        compareAt,
        cost,
        weight,
        material,
        categoryId,
        stock,
        featured,
        images: images
          ? {
              create: images.map((img: { url: string; alt?: string }, i: number) => ({
                url: img.url,
                alt: img.alt,
                position: i,
              })),
            }
          : undefined,
        sizes: sizes
          ? {
              create: sizes.map((s: { name: string; stock: number }) => ({
                name: s.name,
                stock: s.stock,
              })),
            }
          : undefined,
        colors: colors
          ? {
              create: colors.map((c: { name: string; hex: string }) => ({
                name: c.name,
                hex: c.hex,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        sizes: true,
        colors: true,
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
