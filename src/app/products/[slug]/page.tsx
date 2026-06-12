import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetail from "@/components/products/ProductDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const productName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${productName} | Premium Indonesian Batik`,
    description: `Shop ${productName} - Authentic handcrafted Indonesian Batik. Premium quality, worldwide shipping.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen">
      <Navbar />
      <ProductDetail slug={slug} />
      <Footer />
    </main>
  );
}
