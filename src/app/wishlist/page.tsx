import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WishlistView from "@/components/wishlist/WishlistView";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "View your saved batik products.",
};

export default function WishlistPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <WishlistView />
      <Footer />
    </main>
  );
}
