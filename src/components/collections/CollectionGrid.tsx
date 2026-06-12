"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Filter,
  Grid3X3,
  LayoutList,
  ChevronDown,
  Star,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";

// Sample products data
const ALL_PRODUCTS = [
  {
    id: "1",
    name: "Royal Parang Silk Shirt",
    slug: "royal-parang-silk-shirt",
    price: 189,
    compareAt: 249,
    category: "men-batik",
    color: "Navy",
    size: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviews: 128,
    badge: "Best Seller",
    material: "Silk",
  },
  {
    id: "2",
    name: "Mega Mendung Dress",
    slug: "mega-mendung-dress",
    price: 259,
    compareAt: null,
    category: "women-batik",
    color: "Blue",
    size: ["XS", "S", "M", "L"],
    rating: 4.8,
    reviews: 96,
    badge: "New",
    material: "Cotton",
  },
  {
    id: "3",
    name: "Kawung Premium Blazer",
    slug: "kawung-premium-blazer",
    price: 349,
    compareAt: 429,
    category: "men-batik",
    color: "Brown",
    size: ["M", "L", "XL", "XXL"],
    rating: 4.9,
    reviews: 74,
    badge: "Limited",
    material: "Silk Blend",
  },
  {
    id: "4",
    name: "Truntum Elegant Gown",
    slug: "truntum-elegant-gown",
    price: 499,
    compareAt: null,
    category: "women-batik",
    color: "Gold",
    size: ["XS", "S", "M", "L"],
    rating: 5.0,
    reviews: 52,
    badge: "Exclusive",
    material: "Silk",
  },
  {
    id: "5",
    name: "Sogan Classic Kemeja",
    slug: "sogan-classic-kemeja",
    price: 149,
    compareAt: null,
    category: "men-batik",
    color: "Brown",
    size: ["S", "M", "L", "XL", "XXL"],
    rating: 4.7,
    reviews: 203,
    badge: null,
    material: "Cotton",
  },
  {
    id: "6",
    name: "Ceplok Modern Blouse",
    slug: "ceplok-modern-blouse",
    price: 179,
    compareAt: 219,
    category: "women-batik",
    color: "Red",
    size: ["XS", "S", "M", "L"],
    rating: 4.8,
    reviews: 87,
    badge: "Sale",
    material: "Cotton Blend",
  },
  {
    id: "7",
    name: "Sekar Jagad Formal Shirt",
    slug: "sekar-jagad-formal-shirt",
    price: 219,
    compareAt: null,
    category: "men-batik",
    color: "Black",
    size: ["M", "L", "XL"],
    rating: 4.9,
    reviews: 156,
    badge: null,
    material: "Premium Cotton",
  },
  {
    id: "8",
    name: "Lereng Silk Wrap Dress",
    slug: "lereng-silk-wrap-dress",
    price: 329,
    compareAt: 399,
    category: "women-batik",
    color: "Green",
    size: ["XS", "S", "M", "L", "XL"],
    rating: 4.8,
    reviews: 62,
    badge: "Popular",
    material: "Silk",
  },
];

const categories = [
  { label: "All", value: "all" },
  { label: "Men Batik", value: "men-batik" },
  { label: "Women Batik", value: "women-batik" },
  { label: "New Arrivals", value: "new-arrivals" },
  { label: "Best Sellers", value: "best-sellers" },
];

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
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<{ min: number; max: number } | null>(null);

  const filteredProducts = ALL_PRODUCTS.filter((product) => {
    if (category !== "all" && product.category !== category) return false;
    if (priceRange && (product.price < priceRange.min || product.price > priceRange.max))
      return false;
    return true;
  }).sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "best-selling":
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

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
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat.value
                    ? "bg-primary text-white"
                    : "bg-white text-foreground/70 hover:bg-gray-100 border"
                }`}
              >
                {cat.label}
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
              <div className="glass-card-solid p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() =>
                          setPriceRange(
                            priceRange?.min === range.min ? null : range
                          )
                        }
                        className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          priceRange?.min === range.min
                            ? "bg-accent/10 text-secondary"
                            : "hover:bg-gray-50 text-foreground/70"
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Material */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Material</h4>
                  <div className="space-y-2">
                    {["Silk", "Cotton", "Silk Blend", "Premium Cotton"].map(
                      (mat) => (
                        <label
                          key={mat}
                          className="flex items-center gap-2 text-sm text-foreground/70 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-accent focus:ring-accent"
                          />
                          {mat}
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        className="w-10 h-10 border rounded-lg text-xs font-medium hover:bg-accent/10 hover:border-accent transition-colors"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <h4 className="font-semibold text-sm mb-3">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Navy", hex: "#0F172A" },
                      { name: "Blue", hex: "#2563EB" },
                      { name: "Brown", hex: "#8B4513" },
                      { name: "Gold", hex: "#D4AF37" },
                      { name: "Red", hex: "#DC2626" },
                      { name: "Green", hex: "#059669" },
                      { name: "Black", hex: "#111827" },
                    ].map((color) => (
                      <button
                        key={color.name}
                        className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-accent transition-colors"
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                        aria-label={`Filter by ${color.name}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <p className="text-sm text-foreground/50 mb-6">
          Showing {filteredProducts.length} products
        </p>

        {/* Product Grid */}
        <motion.div
          layout
          className={
            gridView === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
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
                <div
                  className={`relative overflow-hidden rounded-2xl bg-gray-50 ${
                    gridView === "list"
                      ? "w-40 h-40 flex-shrink-0"
                      : "aspect-[3/4]"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                    <div className="w-16 h-16 gradient-gold rounded-xl opacity-30" />
                  </div>

                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 bg-primary text-white text-xs font-medium rounded-full">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {product.compareAt && (
                    <div className="absolute top-3 right-3 z-10">
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
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex items-center gap-2">
                      <button
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all"
                        aria-label="Add to wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className={gridView === "list" ? "flex-1" : "mt-4 px-1"}>
                  <p className="text-xs text-secondary font-medium tracking-wide uppercase">
                    {product.category.replace("-", " ")}
                  </p>
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="text-base font-semibold mt-1 group-hover:text-secondary transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-xs text-foreground/40">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold">${product.price}</span>
                    {product.compareAt && (
                      <span className="text-sm text-foreground/40 line-through">
                        ${product.compareAt}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-foreground/40 mt-1">
                    {product.material}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
