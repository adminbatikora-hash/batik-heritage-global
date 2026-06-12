"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  Minus,
  Plus,
  ChevronRight,
  Globe,
  Package,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { SUPPORTED_COUNTRIES, SHIPPING_METHODS } from "@/lib/constants";
import toast from "react-hot-toast";

// Mock product data
const PRODUCT_DATA = {
  id: "1",
  name: "Royal Parang Silk Shirt",
  slug: "royal-parang-silk-shirt",
  sku: "BTK-MEN-001",
  price: 189,
  compareAt: 249,
  description:
    "The Royal Parang pattern is one of the most prestigious motifs in Indonesian Batik, historically reserved for royalty. This premium silk shirt features hand-drawn Parang patterns using traditional canting tools, created over 30 days of meticulous work by master artisan Pak Hadi from Yogyakarta.",
  material: "100% Pure Silk",
  weight: "250g",
  category: "Men Batik",
  stock: 15,
  rating: 4.9,
  reviewCount: 128,
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Navy", hex: "#0F172A" },
    { name: "Dark Brown", hex: "#3D2914" },
    { name: "Black", hex: "#111827" },
  ],
  images: ["/products/batik-shirt-1.jpg"],
  features: [
    "Hand-drawn using traditional canting",
    "100% pure mulberry silk",
    "Natural dye process",
    "30+ days of artisan work",
    "Certificate of authenticity included",
    "UNESCO Heritage recognized pattern",
  ],
};

interface ProductDetailProps {
  slug: string;
}

export default function ProductDetail({ slug }: ProductDetailProps) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRODUCT_DATA.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description");

  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const product = PRODUCT_DATA;
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor.name,
      quantity,
      sku: product.sku,
      slug: product.slug,
    });
    toast.success("Added to cart!");
  };

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
      });
      toast.success("Added to wishlist!");
    }
  };

  return (
    <section className="section-padding bg-background">
      <div className="container-luxury mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-8">
          <Link href="/" className="hover:text-secondary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/collections" className="hover:text-secondary">Collections</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 gradient-gold rounded-3xl mx-auto opacity-30" />
                  <p className="text-foreground/30 mt-4 text-sm">Product Image</p>
                </div>
              </div>
              {/* Discount Badge */}
              {product.compareAt && (
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-full">
                    Save ${product.compareAt - product.price}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            <div className="flex gap-3 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl bg-gray-100 border-2 border-transparent hover:border-accent cursor-pointer transition-all"
                />
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-secondary font-medium tracking-wide uppercase">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-4xl font-display font-bold mt-2">
                {product.name}
              </h1>
              <p className="text-xs text-foreground/40 mt-1">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-accent text-accent"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-foreground/50">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price}</span>
              {product.compareAt && (
                <>
                  <span className="text-xl text-foreground/40 line-through">
                    ${product.compareAt}
                  </span>
                  <span className="px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                    {Math.round(
                      ((product.compareAt - product.price) / product.compareAt) * 100
                    )}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-foreground/60 leading-relaxed">
              {product.description.substring(0, 200)}...
            </p>

            {/* Color Selection */}
            <div>
              <p className="text-sm font-medium mb-3">
                Color: <span className="text-foreground/60">{selectedColor.name}</span>
              </p>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor.name === color.name
                        ? "border-accent scale-110 shadow-gold"
                        : "border-gray-200 hover:border-accent/50"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium">Size</p>
                <button className="text-xs text-secondary hover:underline">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-4 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "bg-primary text-white border-primary"
                        : "border-gray-200 hover:border-accent text-foreground/70"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-sm font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-3 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-foreground/40">
                  {product.stock} in stock
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 btn-gold"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={`p-4 border-2 rounded-full transition-all ${
                  inWishlist
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-gray-200 text-foreground/60 hover:border-accent hover:text-accent"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Buy Now */}
            <Link href="/checkout" className="btn-primary w-full text-center block">
              Buy Now
            </Link>

            {/* Shipping Calculator */}
            <div className="glass-card-solid p-6">
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <Globe className="w-4 h-4 text-secondary" />
                International Shipping Calculator
              </h4>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-3 border rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="">Select your country</option>
                {SUPPORTED_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
              {selectedCountry && (
                <div className="mt-4 space-y-2">
                  {SHIPPING_METHODS.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="text-sm font-medium">{method.name}</p>
                        <p className="text-xs text-foreground/50">{method.days}</p>
                      </div>
                      <span className="text-sm font-bold">
                        {method.id === "standard" ? "Free" : `$${15 + Math.random() * 20 | 0}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto text-secondary" />
                <p className="text-xs text-foreground/50 mt-1">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto text-secondary" />
                <p className="text-xs text-foreground/50 mt-1">Secure Payment</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto text-secondary" />
                <p className="text-xs text-foreground/50 mt-1">Easy Returns</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mt-20">
          <div className="flex gap-8 border-b mb-8">
            {(["description", "reviews", "shipping"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-medium capitalize transition-colors border-b-2 ${
                  activeTab === tab
                    ? "border-accent text-secondary"
                    : "border-transparent text-foreground/50 hover:text-foreground/80"
                }`}
              >
                {tab}
                {tab === "reviews" && ` (${product.reviewCount})`}
              </button>
            ))}
          </div>

          {activeTab === "description" && (
            <div className="prose max-w-none">
              <p className="text-foreground/70 leading-relaxed mb-6">
                {product.description}
              </p>
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-foreground/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="glass-card-solid p-4 text-center">
                  <Package className="w-5 h-5 mx-auto text-secondary mb-1" />
                  <p className="text-xs text-foreground/50">Material</p>
                  <p className="text-sm font-medium">{product.material}</p>
                </div>
                <div className="glass-card-solid p-4 text-center">
                  <Package className="w-5 h-5 mx-auto text-secondary mb-1" />
                  <p className="text-xs text-foreground/50">Weight</p>
                  <p className="text-sm font-medium">{product.weight}</p>
                </div>
                <div className="glass-card-solid p-4 text-center">
                  <Package className="w-5 h-5 mx-auto text-secondary mb-1" />
                  <p className="text-xs text-foreground/50">Stock</p>
                  <p className="text-sm font-medium">{product.stock} pcs</p>
                </div>
                <div className="glass-card-solid p-4 text-center">
                  <Package className="w-5 h-5 mx-auto text-secondary mb-1" />
                  <p className="text-xs text-foreground/50">Category</p>
                  <p className="text-sm font-medium">{product.category}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {[
                { name: "Sarah M.", rating: 5, text: "Absolutely stunning quality! The silk feels incredible.", date: "2 weeks ago" },
                { name: "James T.", rating: 5, text: "Perfect fit, amazing batik pattern. Worth every penny.", date: "1 month ago" },
                { name: "Maria L.", rating: 4, text: "Beautiful shirt. Slightly longer delivery but packaging was premium.", date: "1 month ago" },
              ].map((review, i) => (
                <div key={i} className="glass-card-solid p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {review.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.name}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, j) => (
                            <Star key={j} className="w-3 h-3 fill-accent text-accent" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-foreground/40">{review.date}</span>
                  </div>
                  <p className="text-sm text-foreground/70 mt-3">{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-4">
              <p className="text-foreground/70">
                We ship to over 50 countries worldwide. All orders include premium
                packaging with a certificate of authenticity.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {SHIPPING_METHODS.map((method) => (
                  <div key={method.id} className="glass-card-solid p-5">
                    <h4 className="font-semibold">{method.name}</h4>
                    <p className="text-sm text-foreground/50 mt-1">
                      Estimated delivery: {method.days}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
