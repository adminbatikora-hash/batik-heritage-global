"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, Search, Package, Truck, CreditCard, RotateCcw, Palette } from "lucide-react";

const faqCategories = [
  { id: "all", name: "All", icon: HelpCircle },
  { id: "products", name: "Products", icon: Palette },
  { id: "shipping", name: "Shipping", icon: Truck },
  { id: "payment", name: "Payment", icon: CreditCard },
  { id: "returns", name: "Returns", icon: RotateCcw },
  { id: "orders", name: "Orders", icon: Package },
];

const faqs = [
  {
    category: "products",
    question: "Are your batik products authentic?",
    answer: "Yes! Every piece is hand-crafted by certified Indonesian artisans from Yogyakarta, Solo, Cirebon, and Pekalongan. Each item comes with a certificate of authenticity verifying it as genuine Indonesian Batik.",
  },
  {
    category: "products",
    question: "How do I care for batik clothing?",
    answer: "Hand wash in cold water with mild detergent. Do not wring or twist. Dry flat in shade away from direct sunlight. Iron on low heat on the reverse side. Avoid bleach and harsh chemicals. With proper care, your batik will last for years.",
  },
  {
    category: "products",
    question: "Do you offer custom orders?",
    answer: "Yes! We offer custom batik pieces including custom sizing, patterns, and colors. Contact us at adminbatikora@gmail.com with your design ideas and we'll connect you with our artisans. Custom orders typically take 3-4 weeks.",
  },
  {
    category: "products",
    question: "What materials do you use?",
    answer: "We use only premium materials: Pure Silk, Premium Cotton, Silk Blend, Linen, and Cotton Sateen. All materials are sustainably sourced and carefully selected for quality and comfort.",
  },
  {
    category: "shipping",
    question: "Do you ship internationally?",
    answer: "Yes! We ship to 50+ countries worldwide including the US, Canada, UK, Germany, France, Australia, Singapore, Japan, and many more. We use trusted carriers like DHL, FedEx, UPS, and EMS.",
  },
  {
    category: "shipping",
    question: "How long does shipping take?",
    answer: "Standard shipping takes 10-14 business days, Express 5-7 days, Priority 3-5 days, and Overnight 1-2 days. Delivery times vary by region and may be affected by customs processing.",
  },
  {
    category: "shipping",
    question: "Is there free shipping?",
    answer: "Yes! We offer free worldwide standard shipping on all orders over $150. No promo code needed — it's automatically applied at checkout.",
  },
  {
    category: "shipping",
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive an email with a tracking number. You can also track your order through your Batikora account under 'My Orders', or directly on the carrier's website.",
  },
  {
    category: "payment",
    question: "What payment methods do you accept?",
    answer: "We accept Credit/Debit Cards (Visa, Mastercard, Amex), PayPal (including Pay Later), and Bank Transfer (select countries). All payments are encrypted with 256-bit SSL for your security.",
  },
  {
    category: "payment",
    question: "Is it safe to shop on your website?",
    answer: "Absolutely! Our website uses 256-bit SSL encryption. We never store your card details. All transactions are processed through secure, PCI-compliant payment gateways.",
  },
  {
    category: "payment",
    question: "What currencies do you accept?",
    answer: "We accept USD, EUR, GBP, AUD, SGD, and JPY. Prices are displayed in USD by default but you can change the currency on our website.",
  },
  {
    category: "returns",
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unworn items in original condition with tags attached. Items must be in their original packaging. Refunds are processed within 5-7 business days after we receive the returned item.",
  },
  {
    category: "returns",
    question: "Can I exchange an item?",
    answer: "Yes! We offer free exchanges for different sizes or colors. Contact us at adminbatikora@gmail.com with your order number and we'll arrange the exchange.",
  },
  {
    category: "returns",
    question: "Are sale items returnable?",
    answer: "Sale items and custom-made items are final sale and cannot be returned. However, if you receive a defective item, we'll always make it right regardless of sale status.",
  },
  {
    category: "orders",
    question: "How do I cancel an order?",
    answer: "You can cancel an order within 2 hours of placing it by contacting us at adminbatikora@gmail.com. After 2 hours, orders enter processing and cannot be cancelled, but you can return the item after delivery.",
  },
  {
    category: "orders",
    question: "What are your customer service hours?",
    answer: "Our AI assistant is available 24/7 through the chat widget on our website. Human agents are available Monday to Friday, 9AM-6PM WIB (GMT+7), and Saturday 9AM-3PM WIB.",
  },
  {
    category: "orders",
    question: "Do you offer wholesale pricing?",
    answer: "Yes! For orders of 50+ pieces, we offer competitive wholesale pricing. Please email adminbatikora@gmail.com with your requirements and we'll send you a custom quote.",
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-16 mb-12">
          <div className="container mx-auto px-4 text-center">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Frequently Asked Questions
            </h1>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
              Find answers to common questions about our products, shipping, and more.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-4xl">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenIndex(null); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-foreground/60 hover:bg-gray-200"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-foreground/50">No questions found. Try a different search.</p>
              </div>
            ) : (
              filteredFaqs.map((faq, i) => (
                <div key={i} className="border rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-sm pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-foreground/40 flex-shrink-0 transition-transform ${
                        openIndex === i ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 text-sm text-foreground/70 leading-relaxed border-t pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>

          {/* Contact CTA */}
          <div className="mt-16 p-8 bg-gray-50 rounded-2xl text-center">
            <h2 className="text-xl font-bold">Still have questions?</h2>
            <p className="text-foreground/60 mt-2 text-sm">
              Can&apos;t find what you&apos;re looking for? Our support team is happy to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <a
                href="mailto:adminbatikora@gmail.com"
                className="px-6 py-3 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Email Support
              </a>
              <a
                href="/contact"
                className="px-6 py-3 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary/5 transition-colors"
              >
                Contact Page
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
