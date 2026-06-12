import { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryCollection from "@/components/collections/CategoryCollection";

const COLLECTIONS: Record<string, { title: string; description: string; heroGradient: string }> = {
  "men-batik": {
    title: "Men's Batik Collection",
    description: "Sophisticated batik shirts, blazers, and formal wear crafted for the modern gentleman. From boardroom to special occasions.",
    heroGradient: "from-primary/90 to-primary/60",
  },
  "women-batik": {
    title: "Women's Batik Collection",
    description: "Elegant dresses, blouses, and accessories that blend traditional Indonesian artistry with contemporary fashion.",
    heroGradient: "from-secondary/90 to-accent/60",
  },
  "new-arrivals": {
    title: "New Arrivals",
    description: "The latest designs from our master artisans. Be the first to discover fresh batik creations.",
    heroGradient: "from-accent/90 to-secondary/60",
  },
  "best-sellers": {
    title: "Best Sellers",
    description: "Our most loved pieces chosen by customers from over 50 countries worldwide.",
    heroGradient: "from-purple-900/90 to-purple-600/60",
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  return {
    title: `${collection.title} | Premium Indonesian Batik`,
    description: collection.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((slug) => ({ slug }));
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = COLLECTIONS[slug];

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <CategoryCollection
        slug={slug}
        title={collection.title}
        description={collection.description}
        heroGradient={collection.heroGradient}
      />
      <Footer />
    </main>
  );
}
