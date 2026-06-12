"use client";

import { motion } from "framer-motion";
import { Palette, Hand, Globe2, Award } from "lucide-react";

const features = [
  {
    icon: Hand,
    title: "Handcrafted with Love",
    description:
      "Each piece is meticulously hand-drawn by skilled artisans using traditional canting tools passed down through generations.",
  },
  {
    icon: Palette,
    title: "Natural Dyes",
    description:
      "We use plant-based natural dyes extracted from indigo, teak, and mahogany, creating rich colors that age beautifully.",
  },
  {
    icon: Award,
    title: "UNESCO Heritage",
    description:
      "Indonesian Batik is recognized by UNESCO as an Intangible Cultural Heritage of Humanity since 2009.",
  },
  {
    icon: Globe2,
    title: "Worldwide Delivery",
    description:
      "We ship to 50+ countries with premium packaging to ensure your batik arrives in perfect condition.",
  },
];

export default function HeritageSection() {
  return (
    <section className="section-padding bg-primary text-white overflow-hidden relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 batik-pattern-bg opacity-10" />
      </div>

      <div className="container-luxury mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium tracking-widest text-accent uppercase">
              Our Heritage
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3 leading-tight">
              Centuries of{" "}
              <span className="gradient-text-gold">Tradition</span> in Every
              Thread
            </h2>
            <p className="text-white/60 mt-6 text-lg leading-relaxed">
              Batik is more than fabric — it's a living canvas that tells
              stories of Indonesian culture, spirituality, and artistry. Our
              master artisans preserve these ancient techniques while creating
              contemporary designs for the modern world.
            </p>
            <p className="text-white/50 mt-4 leading-relaxed">
              From the royal courts of Java to international runways, Batik has
              evolved while maintaining its soul. Every pattern has meaning,
              every color tells a story, and every piece connects you to a
              heritage spanning over a thousand years.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text-gold">1000+</p>
                <p className="text-xs text-white/50 mt-1">Years of History</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text-gold">200+</p>
                <p className="text-xs text-white/50 mt-1">Artisan Partners</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold gradient-text-gold">100%</p>
                <p className="text-xs text-white/50 mt-1">Authentic</p>
              </div>
            </div>
          </motion.div>

          {/* Right - Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center mb-4 group-hover:shadow-gold transition-shadow">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg">{feature.title}</h3>
                <p className="text-white/50 text-sm mt-2 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
