"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Grid3X3,
  LayoutList,
  Star,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  category: string;
  categorySlug: string;
  material: string | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  image: string;
  images: string[];
  stock: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const priceRanges = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 - $200", min: 100, max: 200 },
  { label: "$200 - $350", min: 200, max: 350 },
  { label: "$350+", min: 350, max: 9999 },
];

export default function CollectionGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);
  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [category, sort, priceRange]);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/admin/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch {}
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("sort", sort);
      if (category !== "all") params.set("category", category);
      if (priceRange) {
        params.set("minPrice", String(priceRange.min));
        params.set("maxPrice", String(priceRange.max));
      }

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const mapped: Product[] = data.products.map((p: { id: string; name: string; slug: string; price: number; compareAt: number | null; category: { name: string; slug: string } | null; material: string | null; rating: number; reviewCount: number; featured: boolean; images: { url: string }[]; stock: number }) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          compareAt: p.compareAt ? Number(p.compareAt) : null,
          category: p.category?.name || "Batik",
          categorySlug: p.category?.slug || "",
          material: p.material,
          rating: Number(p.rating) || 0,
          reviewCount: p.reviewCount || 0,
          featured: p.featured,
          image: p.images?.[0]?.url || "",
          images: p.images?.map((img: { url: string }) => img.url) || [],
          stock: p.stock,
        }));
        setProducts(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart(e: React.MouseEvent, product: Product) {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M",
      color: "",
      quantity: 1,
      sku: "",
      slug: product.slug,
    });
    toast.success("Added to cart!");
  }

  function handleWishlist(e: React.MouseEvent, product: Product) {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
      });
      toast.success("Added to wishlist!");
    }
  }

  return (
    <section className="section-padding bg-background min-h-screen">
      <div className="container-luxury mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Our <span className="gradient-text-gold">Collections</span>
          </h1>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
            Explore our complete range of authentic Indonesian Batik, curated for
            the modern global citizen.
          </p>
        </motion.div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === "all"
                  ? "bg-primary text-white"
                  : "bg-white text-foreground/70 hover:bg-gray-100 border"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat.slug
                    ? "bg-primary text-white"
                    : "bg-white text-foreground/70 hover:bg-gray-100 border"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border rounded-full text-sm hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Sort Dropdown */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Grid Toggle */}
            <div className="hidden sm:flex items-center border rounded-full overflow-hidden">
              <button
                onClick={() => setGridView("grid")}
                className={`p-2 ${
                  gridView === "grid" ? "bg-primary text-white" : "bg-white"
                }`}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridView("list")}
                className={`p-2 ${
                  gridView === "list" ? "bg-primary text-white" : "bg-white"
                }`}
                aria-label="List view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="glass-card-solid p-6">
                <h4 className="font-semibold text-sm mb-3">Price Range</h4>
                <div className="flex flex-wrap gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() =>
                        setPriceRange(
                          priceRange?.min === range.min ? null : range
                        )
                      }
                      className={`px-4 py-2 rounded-full text-sm transition-colors ${
                        priceRange?.min === range.min
                          ? "bg-accent/10 text-secondary border border-accent"
                          : "hover:bg-gray-50 text-foreground/70 border"
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <p className="text-sm text-foreground/50 mb-6">
          Showing {products.length} products
        </p>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-foreground/50 text-lg">No products found</p>
            <p className="text-foreground/30 text-sm mt-2">Try adjusting your filters or check back later.</p>
          </div>
        ) : (
          /* Product Grid */
          <motion.div
            layout
            className={
              gridView === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence mode="popLayout">
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`group ${
                    gridView === "list"
                      ? "flex gap-6 glass-card-solid p-4"
                      : ""
                  }`}
                >
                  {/* Product Image */}
                  <Link href={`/products/${product.slug}`} className="block">
                    <div
                      className={`relative overflow-hidden rounded-2xl bg-gray-50 ${
                        gridView === "list"
                          ? "w-40 h-40 flex-shrink-0"
                          : "aspect-[3/4]"
                      }`}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                          <div className="w-16 h-16 gradient-gold rounded-xl opacity-30" />
                        </div>
                      )}

                      {product.featured && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="px-2.5 py-1 bg-primary text-white text-xs font-medium rounded-full">
                            Featured
                          </span>
                        </div>
                      )}

                      {product.compareAt && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                            -{Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                          </span>
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => handleWishlist(e, product)}
                            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all ${
                              isInWishlist(product.id)
                                ? "bg-red-50 text-red-500"
                                : "bg-white hover:bg-accent hover:text-white"
                            }`}
                            aria-label="Add to wishlist"
                          >
                            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all"
                            aria-label="Add to cart"
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className={gridView === "list" ? "flex-1" : "mt-4 px-1"}>
                    <p className="text-xs text-secondary font-medium tracking-wide uppercase">
                      {product.category}
                    </p>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-base font-semibold mt-1 group-hover:text-secondary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3 h-3 fill-accent text-accent" />
                        <span className="text-xs font-medium">{Number(product.rating).toFixed(1)}</span>
                        <span className="text-xs text-foreground/40">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold">${product.price}</span>
                      {product.compareAt && (
                        <span className="text-sm text-foreground/40 line-through">
                          ${product.compareAt}
                        </span>
                      )}
                    </div>
                    {product.material && (
                      <p className="text-xs text-foreground/40 mt-1">
                        {product.material}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
