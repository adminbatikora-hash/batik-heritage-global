"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingBag,
  Filter,
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import toast from "react-hot-toast";

// Men's Batik Products
const MEN_PRODUCTS = [
  {
    id: "m1",
    name: "Royal Parang Silk Shirt",
    slug: "royal-parang-silk-shirt",
    price: 189,
    compareAt: 249,
    rating: 4.9,
    reviews: 128,
    badge: "Best Seller",
    material: "100% Silk",
    color: "Navy",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/products/men-1.jpg",
    description: "Hand-drawn Parang pattern on premium mulberry silk",
  },
  {
    id: "m2",
    name: "Kawung Premium Blazer",
    slug: "kawung-premium-blazer",
    price: 349,
    compareAt: 429,
    rating: 4.9,
    reviews: 74,
    badge: "Limited Edition",
    material: "Silk Blend",
    color: "Brown",
    sizes: ["M", "L", "XL", "XXL"],
    image: "/products/men-2.jpg",
    description: "Luxury Kawung motif blazer for formal occasions",
  },
  {
    id: "m3",
    name: "Sogan Classic Kemeja",
    slug: "sogan-classic-kemeja",
    price: 149,
    compareAt: null,
    rating: 4.7,
    reviews: 203,
    badge: null,
    material: "Premium Cotton",
    color: "Brown",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/products/men-3.jpg",
    description: "Classic Sogan batik in warm earth tones",
  },
  {
    id: "m4",
    name: "Sekar Jagad Formal Shirt",
    slug: "sekar-jagad-formal-shirt",
    price: 219,
    compareAt: null,
    rating: 4.9,
    reviews: 156,
    badge: "Popular",
    material: "Cotton Sateen",
    color: "Black",
    sizes: ["M", "L", "XL"],
    image: "/products/men-4.jpg",
    description: "The world of flowers pattern for distinguished gentlemen",
  },
  {
    id: "m5",
    name: "Mega Mendung Casual Shirt",
    slug: "mega-mendung-casual-shirt",
    price: 169,
    compareAt: 199,
    rating: 4.8,
    reviews: 89,
    badge: "Sale",
    material: "Cotton",
    color: "Blue",
    sizes: ["S", "M", "L", "XL"],
    image: "/products/men-5.jpg",
    description: "Cloud motif from Cirebon in modern slim-fit cut",
  },
  {
    id: "m6",
    name: "Truntum Executive Shirt",
    slug: "truntum-executive-shirt",
    price: 199,
    compareAt: null,
    rating: 4.8,
    reviews: 67,
    badge: null,
    material: "Premium Cotton",
    color: "Navy",
    sizes: ["M", "L", "XL", "XXL"],
    image: "/products/men-6.jpg",
    description: "Symbol of guidance and love in executive style",
  },
  {
    id: "m7",
    name: "Sido Mukti Silk Shirt",
    slug: "sido-mukti-silk-shirt",
    price: 279,
    compareAt: 329,
    rating: 5.0,
    reviews: 42,
    badge: "Exclusive",
    material: "Pure Silk",
    color: "Gold",
    sizes: ["S", "M", "L", "XL"],
    image: "/products/men-7.jpg",
    description: "Prosperity pattern on hand-woven silk, artisan signed",
  },
  {
    id: "m8",
    name: "Lereng Modern Polo",
    slug: "lereng-modern-polo",
    price: 129,
    compareAt: null,
    rating: 4.6,
    reviews: 112,
    badge: "New",
    material: "Cotton Pique",
    color: "Green",
    sizes: ["S", "M", "L", "XL", "XXL"],
    image: "/products/men-8.jpg",
    description: "Traditional diagonal lines in smart-casual polo style",
  },
  {
    id: "m9",
    name: "Ceplok Mandarin Collar",
    slug: "ceplok-mandarin-collar",
    price: 179,
    compareAt: null,
    rating: 4.7,
    reviews: 58,
    badge: null,
    material: "Linen Blend",
    color: "White",
    sizes: ["M", "L", "XL"],
    image: "/products/men-9.jpg",
    description: "Geometric Ceplok motif with modern mandarin collar",
  },
  {
    id: "m10",
    name: "Tambal Heritage Jacket",
    slug: "tambal-heritage-jacket",
    price: 399,
    compareAt: 499,
    rating: 4.9,
    reviews: 31,
    badge: "Premium",
    material: "Wool Blend",
    color: "Charcoal",
    sizes: ["M", "L", "XL"],
    image: "/products/men-10.jpg",
    description: "Patchwork batik art in a tailored modern jacket",
  },
  {
    id: "m11",
    name: "Nitik Slim Fit Shirt",
    slug: "nitik-slim-fit-shirt",
    price: 159,
    compareAt: null,
    rating: 4.6,
    reviews: 94,
    badge: null,
    material: "Cotton Stretch",
    color: "Gray",
    sizes: ["S", "M", "L", "XL"],
    image: "/products/men-11.jpg",
    description: "Delicate dot-work pattern in contemporary slim fit",
  },
  {
    id: "m12",
    name: "Gringsing Double Ikat Shirt",
    slug: "gringsing-double-ikat-shirt",
    price: 459,
    compareAt: null,
    rating: 5.0,
    reviews: 18,
    badge: "Rare",
    material: "Hand-woven Cotton",
    color: "Earth",
    sizes: ["M", "L", "XL"],
    image: "/products/men-12.jpg",
    description: "Sacred Balinese double-ikat, one of the rarest textiles",
  },
];

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

const priceRanges = [
  { label: "All Prices", min: 0, max: 9999 },
  { label: "Under $150", min: 0, max: 150 },
  { label: "$150 - $250", min: 150, max: 250 },
  { label: "$250 - $400", min: 250, max: 400 },
  { label: "$400+", min: 400, max: 9999 },
];

const materials = ["All", "Silk", "Cotton", "Silk Blend", "Premium Cotton", "Cotton Sateen", "Linen Blend", "Wool Blend"];

interface Props {
  slug: string;
  title: string;
  description: string;
  heroGradient: string;
}

export default function CategoryCollection({ slug, title, description, heroGradient }: Props) {
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState(priceRanges[0]);
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  // Filter and sort products
  const filteredProducts = MEN_PRODUCTS.filter((product) => {
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    if (selectedMaterial !== "All" && product.material !== selectedMaterial) return false;
    if (selectedSize && !product.sizes.includes(selectedSize)) return false;
    return true;
  }).sort((a, b) => {
    switch (sort) {
      case "price-asc": return a.price - b.price;
      case "price-desc": return b.price - a.price;
      case "best-selling": return b.reviews - a.reviews;
      case "rating": return b.rating - a.rating;
      default: return 0;
    }
  });

  const handleAddToCart = (product: typeof MEN_PRODUCTS[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.sizes[1] || product.sizes[0],
      quantity: 1,
      sku: `BHG-${product.id}`,
      slug: product.slug,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (product: typeof MEN_PRODUCTS[0]) => {
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
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className={`relative bg-gradient-to-br ${heroGradient} py-20 lg:py-28 overflow-hidden`}>
        <div className="absolute inset-0 batik-pattern-bg opacity-10" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />

        <div className="container-luxury mx-auto px-4 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/collections" className="hover:text-white transition-colors">Collections</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{title}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white">
              {title}
            </h1>
            <p className="text-white/70 mt-4 max-w-2xl text-lg">
              {description}
            </p>
            <div className="flex items-center gap-4 mt-6 text-white/50 text-sm">
              <span>{filteredProducts.length} Products</span>
              <span>•</span>
              <span>Free shipping on orders over $150</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-luxury mx-auto">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-full text-sm font-medium transition-all ${
                  showFilters ? "bg-primary text-white border-primary" : "hover:bg-gray-50"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {(selectedMaterial !== "All" || selectedSize || priceRange.min > 0) && (
                  <span className="w-2 h-2 bg-accent rounded-full" />
                )}
              </button>

              <span className="text-sm text-foreground/50">
                {filteredProducts.length} of {MEN_PRODUCTS.length} products
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-foreground/40" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3 py-2 border rounded-full text-sm bg-white focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grid Toggle */}
              <div className="hidden sm:flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => setGridView("grid")}
                  className={`p-2.5 transition-colors ${
                    gridView === "grid" ? "bg-primary text-white" : "bg-white hover:bg-gray-50"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridView("list")}
                  className={`p-2.5 transition-colors ${
                    gridView === "list" ? "bg-primary text-white" : "bg-white hover:bg-gray-50"
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
                          onClick={() => setPriceRange(range)}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            priceRange.label === range.label
                              ? "bg-accent/10 text-secondary font-medium"
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
                      {materials.map((mat) => (
                        <button
                          key={mat}
                          onClick={() => setSelectedMaterial(mat)}
                          className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedMaterial === mat
                              ? "bg-accent/10 text-secondary font-medium"
                              : "hover:bg-gray-50 text-foreground/70"
                          }`}
                        >
                          {mat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3">Size</h4>
                    <div className="flex flex-wrap gap-2">
                      {["S", "M", "L", "XL", "XXL"].map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                          className={`w-11 h-11 border rounded-lg text-xs font-medium transition-all ${
                            selectedSize === size
                              ? "bg-primary text-white border-primary"
                              : "hover:border-accent text-foreground/70"
                          }`}
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
                        { name: "Brown", hex: "#8B4513" },
                        { name: "Black", hex: "#111827" },
                        { name: "Blue", hex: "#2563EB" },
                        { name: "Gold", hex: "#D4AF37" },
                        { name: "Green", hex: "#059669" },
                        { name: "White", hex: "#F9FAFB" },
                        { name: "Gray", hex: "#6B7280" },
                      ].map((color) => (
                        <button
                          key={color.name}
                          className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-accent hover:scale-110 transition-all"
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                          aria-label={`Filter by ${color.name}`}
                        />
                      ))}
                    </div>

                    {/* Clear Filters */}
                    <button
                      onClick={() => {
                        setPriceRange(priceRanges[0]);
                        setSelectedMaterial("All");
                        setSelectedSize(null);
                      }}
                      className="mt-4 text-xs text-red-500 hover:underline"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <motion.div
            layout
            className={
              gridView === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`group ${
                    gridView === "list"
                      ? "flex gap-6 glass-card-solid p-4 hover:shadow-luxury transition-shadow"
                      : ""
                  }`}
                >
                  {/* Product Image */}
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-gray-50 ${
                      gridView === "list" ? "w-44 h-44 flex-shrink-0" : "aspect-[3/4]"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                      <div className="w-16 h-16 gradient-gold rounded-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>

                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className={`px-2.5 py-1 text-white text-xs font-medium rounded-full ${
                          product.badge === "Sale" ? "bg-red-500" :
                          product.badge === "New" ? "bg-green-500" :
                          product.badge === "Exclusive" || product.badge === "Rare" ? "bg-purple-600" :
                          product.badge === "Premium" || product.badge === "Limited Edition" ? "bg-amber-600" :
                          "bg-primary"
                        }`}>
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Discount */}
                    {product.compareAt && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                          -{Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                        </span>
                      </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <button
                          onClick={() => handleWishlist(product)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                            isInWishlist(product.id)
                              ? "bg-red-500 text-white"
                              : "bg-white hover:bg-accent hover:text-white"
                          }`}
                          aria-label="Add to wishlist"
                        >
                          <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all"
                          aria-label="Add to cart"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className={gridView === "list" ? "flex-1 flex flex-col justify-center" : "mt-4 px-1"}>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-secondary font-medium tracking-wide uppercase">
                        {product.material}
                      </p>
                    </div>

                    <Link href={`/products/${product.slug}`}>
                      <h3 className="text-base font-semibold mt-1 group-hover:text-secondary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    {gridView === "list" && (
                      <p className="text-sm text-foreground/50 mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
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

                    {/* Sizes Preview */}
                    <div className="flex items-center gap-1 mt-2">
                      {product.sizes.map((size) => (
                        <span
                          key={size}
                          className="text-[10px] px-1.5 py-0.5 border border-gray-200 rounded text-foreground/40"
                        >
                          {size}
                        </span>
                      ))}
                    </div>

                    {gridView === "list" && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Add to Cart
                        </button>
                        <Link
                          href={`/products/${product.slug}`}
                          className="px-4 py-2 border text-sm rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          View Details
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Filter className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-foreground/50 mt-2">
                Try adjusting your filters to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setPriceRange(priceRanges[0]);
                  setSelectedMaterial("All");
                  setSelectedSize(null);
                }}
                className="mt-4 text-sm text-secondary hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
