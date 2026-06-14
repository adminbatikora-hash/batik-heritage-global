import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, shortDesc, sku, price, compareAt, cost, weight, material, categoryId, stock, featured, images } = body;

    // Delete existing images if new ones provided
    if (images) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
    }

    const product = await prisma.product.update({
      where: { id },
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
          ? { create: images.map((img: { url: string; alt?: string }, i: number) => ({ url: img.url, alt: img.alt, position: i })) }
          : undefined,
      },
      include: { images: true, category: true },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
