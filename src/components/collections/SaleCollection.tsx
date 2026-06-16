"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Tag, ShoppingBag, Percent } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  images: { url: string }[];
  category: { name: string };
}

export default function SaleCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSaleProducts() {
      try {
        const res = await fetch("/api/products?sale=true");
        if (res.ok) {
          const data = await res.json();
          // Filter products that have compareAt price (on sale)
          const saleProducts = (data.products || []).filter(
            (p: Product) => p.compareAt && p.compareAt > p.price
          );
          setProducts(saleProducts);
        }
      } catch (error) {
        console.error("Error fetching sale products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSaleProducts();
  }, []);

  return (
    <div className="pt-24 pb-16">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-500 text-white py-16 mb-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <Percent className="w-8 h-8" />
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Sale
            </h1>
          </motion.div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover amazing deals on our premium Indonesian Batik collection.
            Limited time offers on handcrafted pieces.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-xl" />
                <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-foreground/70">
              No Sale Items Currently
            </h2>
            <p className="text-foreground/50 mt-2 max-w-md mx-auto">
              Check back soon for special deals on our premium batik collection.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse All Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => {
              const discount = product.compareAt
                ? Math.round(
                    ((product.compareAt - product.price) / product.compareAt) *
                      100
                  )
                : 0;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/products/${product.slug}`} className="group">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={product.images[0]?.url || "/products/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {discount > 0 && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                          -{discount}%
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-foreground/50">
                        {product.category?.name}
                      </p>
                      <h3 className="font-medium text-sm mt-1 group-hover:text-secondary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-bold text-red-600">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compareAt && (
                          <span className="text-sm text-foreground/40 line-through">
                            ${product.compareAt.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
