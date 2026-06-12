import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CollectionGrid from "@/components/collections/CollectionGrid";

export const metadata: Metadata = {
  title: "Collections | Premium Indonesian Batik",
  description:
    "Explore our curated collections of authentic Indonesian Batik. From formal wear to casual elegance, find the perfect piece for every occasion.",
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <CollectionGrid />
      <Footer />
    </main>
  );
}
