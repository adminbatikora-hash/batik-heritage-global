import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { RotateCcw, Clock, CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges | Batikora",
  description:
    "Learn about Batikora 30-day return policy, exchange process, and refund information.",
};

const steps = [
  {
    step: 1,
    title: "Contact Us",
    description: "Email adminbatikora@gmail.com with your order number and reason for return.",
  },
  {
    step: 2,
    title: "Get Return Label",
    description: "We'll send you a prepaid return shipping label within 24 hours.",
  },
  {
    step: 3,
    title: "Ship the Item",
    description: "Pack the item in its original packaging and attach the return label.",
  },
  {
    step: 4,
    title: "Receive Refund",
    description: "Refund processed within 5-7 business days after we receive the item.",
  },
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-16 mb-12">
          <div className="container mx-auto px-4 text-center">
            <RotateCcw className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Returns & Exchanges
            </h1>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
              We want you to love your batik. If it&apos;s not perfect, we&apos;ll make it right.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl">
          {/* Policy Overview */}
          <section className="mb-16 grid md:grid-cols-3 gap-6">
            <div className="p-6 border rounded-2xl text-center">
              <Clock className="w-10 h-10 mx-auto mb-3 text-secondary" />
              <h3 className="font-bold">30-Day Returns</h3>
              <p className="text-sm text-foreground/60 mt-2">
                Return unworn items within 30 days of delivery
              </p>
            </div>
            <div className="p-6 border rounded-2xl text-center">
              <RotateCcw className="w-10 h-10 mx-auto mb-3 text-secondary" />
              <h3 className="font-bold">Free Exchanges</h3>
              <p className="text-sm text-foreground/60 mt-2">
                Exchange for a different size or color at no extra cost
              </p>
            </div>
            <div className="p-6 border rounded-2xl text-center">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-secondary" />
              <h3 className="font-bold">5-7 Day Refund</h3>
              <p className="text-sm text-foreground/60 mt-2">
                Refunds processed within 5-7 business days
              </p>
            </div>
          </section>

          {/* How to Return */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">How to Return</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {steps.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-accent/10 text-secondary font-bold text-lg flex items-center justify-center mx-auto mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-semibold text-sm">{s.title}</h3>
                  <p className="text-xs text-foreground/60 mt-2">{s.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Eligible / Not Eligible */}
          <section className="mb-16 grid md:grid-cols-2 gap-8">
            <div className="p-6 bg-green-50 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-bold text-green-800">Eligible for Return</h3>
              </div>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Unworn items in original condition</li>
                <li>• Items with all original tags attached</li>
                <li>• Items in original packaging</li>
                <li>• Items returned within 30 days of delivery</li>
                <li>• Defective or damaged items (any time)</li>
              </ul>
            </div>
            <div className="p-6 bg-red-50 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="font-bold text-red-800">Not Eligible</h3>
              </div>
              <ul className="space-y-2 text-sm text-red-700">
                <li>• Worn, washed, or altered items</li>
                <li>• Items without original tags</li>
                <li>• Custom-made or personalized items</li>
                <li>• Final sale items</li>
                <li>• Items returned after 30 days</li>
              </ul>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="p-8 bg-gradient-to-r from-primary to-primary/90 rounded-2xl text-white text-center">
            <Mail className="w-10 h-10 mx-auto mb-4 text-accent" />
            <h2 className="text-xl font-bold">Need Help with a Return?</h2>
            <p className="text-white/70 mt-2 max-w-md mx-auto text-sm">
              Contact our support team and we&apos;ll guide you through the process.
            </p>
            <a
              href="mailto:adminbatikora@gmail.com"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors"
            >
              Email Us <ArrowRight className="w-4 h-4" />
            </a>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
