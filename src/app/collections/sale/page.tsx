import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SaleCollection from "@/components/collections/SaleCollection";

export const metadata: Metadata = {
  title: "Sale | Batikora - Premium Indonesian Batik",
  description:
    "Shop our sale collection. Authentic handcrafted Indonesian Batik at special prices.",
};

export default function SalePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <SaleCollection />
      <Footer />
    </main>
  );
}
