"use client";

import { useState, useEffect } from "react";
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

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAt: number | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  material: string | null;
  image: string;
  stock: number;
}

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best-selling" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

const priceRanges = [
  { label: "All Prices", min: 0, max: 9999 },
  { label: "Under $150", min: 0, max: 150 },
  { label: "$150 - $250", min: 150, max: 250 },
  { label: "$250 - $400", min: 250, max: 400 },
  { label: "$400+", min: 400, max: 9999 },
];

interface Props {
  slug: string;
  title: string;
  description: string;
  heroGradient: string;
}

export default function CategoryCollection({ slug, title, description, heroGradient }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState(priceRanges[0]);
  const [gridView, setGridView] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  useEffect(() => {
    fetchProducts();
  }, [slug, sort, priceRange]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("limit", "50");
      params.set("sort", sort);
      params.set("category", slug);
      if (priceRange.min > 0) params.set("minPrice", String(priceRange.min));
      if (priceRange.max < 9999) params.set("maxPrice", String(priceRange.max));

      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const mapped: Product[] = data.products.map((p: { id: string; name: string; slug: string; price: number; compareAt: number | null; rating: number; reviewCount: number; featured: boolean; material: string | null; images: { url: string }[]; stock: number }) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: Number(p.price),
          compareAt: p.compareAt ? Number(p.compareAt) : null,
          rating: Number(p.rating) || 0,
          reviewCount: p.reviewCount || 0,
          featured: p.featured,
          material: p.material,
          image: p.images?.[0]?.url || "",
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

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: "M",
      quantity: 1,
      sku: "",
      slug: product.slug,
    });
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e: React.MouseEvent, product: Product) => {
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
              <span>{products.length} Products</span>
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
              </button>

              <span className="text-sm text-foreground/50">
                {products.length} products
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
                <div className="glass-card-solid p-6">
                  <h4 className="font-semibold text-sm mb-3">Price Range</h4>
                  <div className="flex flex-wrap gap-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setPriceRange(range)}
                        className={`px-4 py-2 rounded-full text-sm transition-colors ${
                          priceRange.label === range.label
                            ? "bg-accent/10 text-secondary font-medium border border-accent"
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

          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Filter className="w-12 h-12 mx-auto text-foreground/20 mb-4" />
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-foreground/50 mt-2">
                Try adjusting your filters or check back later for new products.
              </p>
              <button
                onClick={() => setPriceRange(priceRanges[0])}
                className="mt-4 text-sm text-secondary hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          ) : (
            /* Products Grid */
            <motion.div
              layout
              className={
                gridView === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              <AnimatePresence mode="popLayout">
                {products.map((product, index) => (
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
                    <Link href={`/products/${product.slug}`} className="block">
                      <div
                        className={`relative overflow-hidden rounded-2xl bg-gray-50 ${
                          gridView === "list" ? "w-44 h-44 flex-shrink-0" : "aspect-[3/4]"
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
                            <div className="w-16 h-16 gradient-gold rounded-xl opacity-20" />
                          </div>
                        )}

                        {/* Featured Badge */}
                        {product.featured && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="px-2.5 py-1 bg-primary text-white text-xs font-medium rounded-full">
                              Featured
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
                              onClick={(e) => handleWishlist(e, product)}
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
                              onClick={(e) => handleAddToCart(e, product)}
                              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all"
                              aria-label="Add to cart"
                            >
                              <ShoppingBag className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className={gridView === "list" ? "flex-1 flex flex-col justify-center" : "mt-4 px-1"}>
                      {product.material && (
                        <p className="text-xs text-secondary font-medium tracking-wide uppercase">
                          {product.material}
                        </p>
                      )}

                      <Link href={`/products/${product.slug}`}>
                        <h3 className="text-base font-semibold mt-1 group-hover:text-secondary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
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

                      {gridView === "list" && (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
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
          )}
        </div>
      </section>
    </div>
  );
}
