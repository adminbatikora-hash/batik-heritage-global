"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const categories = [
  {
    name: "Men's Batik",
    slug: "men-batik",
    description: "Sophisticated shirts, blazers & formal wear",
    count: 120,
    gradient: "from-primary/80 to-primary/40",
  },
  {
    name: "Women's Batik",
    slug: "women-batik",
    description: "Elegant dresses, blouses & accessories",
    count: 156,
    gradient: "from-secondary/80 to-accent/40",
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "Latest designs from our master artisans",
    count: 48,
    gradient: "from-accent/80 to-secondary/40",
  },
  {
    name: "Premium Silk",
    slug: "premium-silk",
    description: "Luxurious hand-painted silk collection",
    count: 36,
    gradient: "from-purple-900/80 to-purple-500/40",
  },
];

export default function CategoriesSection() {
  return (
    <section className="section-padding batik-pattern-bg">
      <div className="container-luxury mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-widest text-secondary uppercase">
            Browse By Category
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3">
            Shop Our <span className="gradient-text-gold">Collections</span>
          </h2>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
            Explore our diverse range of authentic Indonesian Batik, from
            traditional patterns to modern interpretations.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={`/collections/${category.slug}`}>
                <div className="group relative overflow-hidden rounded-3xl h-64 cursor-pointer">
                  {/* Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.gradient} transition-transform duration-500 group-hover:scale-105`}
                  />

                  {/* Glass Overlay */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-between p-8">
                    <div>
                      <h3 className="text-2xl font-display font-bold text-white">
                        {category.name}
                      </h3>
                      <p className="text-white/70 mt-2 text-sm">
                        {category.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">
                        {category.count} Products
                      </span>
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-all group-hover:scale-110">
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-6 right-6 w-24 h-24 border border-white/10 rounded-full" />
                  <div className="absolute bottom-6 right-12 w-16 h-16 border border-white/10 rounded-full" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
