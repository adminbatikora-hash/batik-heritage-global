import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Truck, Globe, Clock, Package, Shield, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information | Batikora",
  description:
    "Learn about Batikora shipping options, delivery times, and international shipping to 50+ countries.",
};

const shippingMethods = [
  {
    name: "Standard Shipping",
    time: "10-14 business days",
    cost: "Free over $150, otherwise $15",
    icon: Package,
  },
  {
    name: "Express Shipping",
    time: "5-7 business days",
    cost: "$25",
    icon: Truck,
  },
  {
    name: "Priority Shipping",
    time: "3-5 business days",
    cost: "$45",
    icon: Clock,
  },
  {
    name: "Overnight Shipping",
    time: "1-2 business days",
    cost: "$75",
    icon: Shield,
  },
];

const regions = [
  { region: "Southeast Asia", countries: "Indonesia, Singapore, Malaysia, Thailand, Philippines", time: "3-7 days" },
  { region: "East Asia", countries: "Japan, South Korea, China, Taiwan, Hong Kong", time: "5-10 days" },
  { region: "North America", countries: "United States, Canada", time: "7-14 days" },
  { region: "Europe", countries: "UK, Germany, France, Netherlands, Italy, Spain", time: "7-14 days" },
  { region: "Oceania", countries: "Australia, New Zealand", time: "7-12 days" },
  { region: "Middle East", countries: "UAE, Saudi Arabia, Qatar, Kuwait", time: "7-14 days" },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-16 mb-12">
          <div className="container mx-auto px-4 text-center">
            <Globe className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Shipping Information
            </h1>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
              We deliver authentic Indonesian Batik worldwide. Free shipping on orders over $150.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Shipping Methods */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Shipping Methods</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {shippingMethods.map((method) => (
                <div
                  key={method.name}
                  className="p-6 border rounded-2xl hover:shadow-lg transition-shadow text-center"
                >
                  <method.icon className="w-10 h-10 mx-auto mb-4 text-secondary" />
                  <h3 className="font-semibold text-sm">{method.name}</h3>
                  <p className="text-foreground/60 text-sm mt-2">{method.time}</p>
                  <p className="font-bold text-secondary mt-2">{method.cost}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Free Shipping Banner */}
          <section className="mb-16 p-8 bg-gradient-to-r from-accent/10 to-secondary/10 rounded-2xl text-center">
            <Truck className="w-12 h-12 mx-auto mb-4 text-secondary" />
            <h2 className="text-2xl font-bold">Free Worldwide Shipping</h2>
            <p className="text-foreground/60 mt-2 max-w-lg mx-auto">
              Enjoy free standard shipping on all orders over $150. No promo code needed — automatically applied at checkout.
            </p>
          </section>

          {/* Delivery by Region */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Delivery Times by Region</h2>
            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Region</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Countries</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Estimated Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {regions.map((r) => (
                    <tr key={r.region} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-sm">{r.region}</td>
                      <td className="px-6 py-4 text-sm text-foreground/60">{r.countries}</td>
                      <td className="px-6 py-4 text-sm font-medium text-secondary">{r.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Tracking & Carriers */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Tracking Your Order</h2>
            <div className="prose prose-gray max-w-none space-y-4 text-foreground/70">
              <p>
                Once your order ships, you will receive an email with your tracking number. You can track your order through:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Your Batikora account under &quot;My Orders&quot;</li>
                <li>The carrier&apos;s website directly (DHL, FedEx, UPS, or EMS)</li>
                <li>Contacting our support team at adminbatikora@gmail.com</li>
              </ul>
              <p>
                <strong>Carriers we use:</strong> DHL, FedEx, UPS, and EMS — depending on your location and chosen shipping method.
              </p>
            </div>
          </section>

          {/* Important Notes */}
          <section className="p-8 bg-gray-50 rounded-2xl">
            <h2 className="text-xl font-bold mb-4">Important Notes</h2>
            <ul className="space-y-3 text-sm text-foreground/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                <span>Delivery times are estimates and may vary due to customs processing in your country.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                <span>All packages are insured and carefully packaged to protect your batik items.</span>
              </li>
              <li className="flex items-start gap-2">
                <Package className="w-4 h-4 mt-0.5 text-secondary flex-shrink-0" />
                <span>Import duties and taxes may apply depending on your country and are the responsibility of the buyer.</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
