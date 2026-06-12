import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "View and manage your shopping cart.",
};

export default function CartPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <CartView />
      <Footer />
    </main>
  );
}
