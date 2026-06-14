"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag, Eye, Star, ArrowRight } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { t } from "@/lib/translations";

// Sample product data
const FEATURED_PRODUCTS = [
  {
    id: "0",
    name: "Batik Tulis Mega Mendung Premium Cirebon",
    slug: "batik-tulis-mega-mendung-premium-cirebon",
    price: 275,
    compareAt: 350,
    image: "/products/batik1.png",
    category: "Men Batik",
    rating: 4.9,
    reviews: 47,
    badge: "New Arrival",
  },
  {
    id: "1",
    name: "Royal Parang Silk Shirt",
    slug: "royal-parang-silk-shirt",
    price: 189,
    compareAt: 249,
    image: "/products/batik-shirt-1.jpg",
    category: "Men Batik",
    rating: 4.9,
    reviews: 128,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Mega Mendung Dress",
    slug: "mega-mendung-dress",
    price: 259,
    compareAt: null,
    image: "/products/batik-dress-1.jpg",
    category: "Women Batik",
    rating: 4.8,
    reviews: 96,
    badge: "New",
  },
  {
    id: "3",
    name: "Kawung Premium Blazer",
    slug: "kawung-premium-blazer",
    price: 349,
    compareAt: 429,
    image: "/products/batik-blazer-1.jpg",
    category: "Men Batik",
    rating: 4.9,
    reviews: 74,
    badge: "Limited",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function FeaturedProducts() {
  const { language } = useLanguageStore();
  const tr = t(language);

  return (
    <section className="section-padding bg-white">
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
            {tr.featured.subtitle}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3">
            {tr.featured.title} <span className="gradient-text-gold">{tr.featured.titleHighlight}</span>
          </h2>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
            {tr.featured.description}
          </p>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {FEATURED_PRODUCTS.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-[3/4]">
                {/* Product Image */}
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                    <div className="w-20 h-20 gradient-gold rounded-xl opacity-30" />
                  </div>
                )}

                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Discount Badge */}
                {product.compareAt && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      -
                      {Math.round(
                        ((product.compareAt - product.price) /
                          product.compareAt) *
                          100
                      )}
                      %
                    </span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="hidden group-hover:flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <button
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all"
                      aria-label="Add to wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all"
                      aria-label="Quick view"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all"
                      aria-label="Add to cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </motion.div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-4 px-1">
                <p className="text-xs text-secondary font-medium tracking-wide uppercase">
                  {product.category}
                </p>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="text-base font-semibold mt-1 group-hover:text-secondary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 fill-accent text-accent" />
                  <span className="text-xs font-medium">{product.rating}</span>
                  <span className="text-xs text-foreground/40">
                    ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold">
                    ${product.price}
                  </span>
                  {product.compareAt && (
                    <span className="text-sm text-foreground/40 line-through">
                      ${product.compareAt}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/collections" className="btn-outline group">
            {tr.featured.viewAll}
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
