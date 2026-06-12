import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your purchase securely.",
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <CheckoutFlow />
    </main>
  );
}
