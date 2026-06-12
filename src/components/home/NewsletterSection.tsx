"use client";

import { motion } from "framer-motion";
import { Mail, Gift, Truck, Shield } from "lucide-react";

const benefits = [
  { icon: Gift, text: "10% off your first order" },
  { icon: Truck, text: "Free worldwide shipping" },
  { icon: Shield, text: "Exclusive early access" },
];

export default function NewsletterSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-accent/5 via-background to-secondary/5 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-32 -right-32 w-96 h-96 border border-accent/10 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-32 -left-32 w-80 h-80 border border-secondary/10 rounded-full"
        />
      </div>

      <div className="container-luxury mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 gradient-gold rounded-2xl mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-display font-bold">
            Join the{" "}
            <span className="gradient-text-gold">Heritage Circle</span>
          </h2>
          <p className="text-foreground/60 mt-4 text-lg">
            Subscribe to receive exclusive offers, artisan stories, and early
            access to new collections.
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center gap-2 text-sm text-foreground/70"
              >
                <benefit.icon className="w-4 h-4 text-accent" />
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm"
              required
            />
            <button
              type="submit"
              className="btn-gold whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </form>

          <p className="text-xs text-foreground/40 mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe
            anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
