"use client";

import { useState, useRef, TouchEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Eye, Star, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import { useLanguageStore } from "@/store/useLanguageStore";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { t } from "@/lib/translations";
import toast from "react-hot-toast";

const FEATURED_PRODUCTS = [
  {
    id: "0",
    name: "Batik Tulis Mega Mendung Premium Cirebon",
    slug: "batik-tulis-mega-mendung-premium-cirebon",
    price: 275,
    compareAt: 350,
    images: ["/products/batik1.png", "/products/batik1B.png", "/products/batik1C.png"],
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
    images: ["/products/batik-shirt-1.jpg"],
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
    images: ["/products/batik-dress-1.jpg"],
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
    images: ["/products/batik-blazer-1.jpg"],
    category: "Men Batik",
    rating: 4.9,
    reviews: 74,
    badge: "Limited",
  },
];

function ProductCardSlider({ images, name }: { images: string[]; name: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
  };

  return (
    <div
      className="relative w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentIndex]}
            alt={`${name} - Image ${currentIndex + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <>
          {/* Arrows - always visible on mobile, hover on desktop */}
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            aria-label="Next image"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>

          {/* Dots indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? "bg-white w-4" : "bg-white/50"
                }`}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
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
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  const handleAddToWishlist = (e: React.MouseEvent, product: typeof FEATURED_PRODUCTS[0]) => {
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
        image: product.images[0],
        slug: product.slug,
      });
      toast.success("Added to wishlist!");
    }
  };

  const handleQuickView = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/products/${slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: typeof FEATURED_PRODUCTS[0]) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: "M",
      color: "Default",
      quantity: 1,
      sku: `BTK-${product.id}`,
      slug: product.slug,
    });
    toast.success("Added to cart!");
  };

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
                {/* Product Image Slider */}
                <ProductCardSlider images={product.images} name={product.name} />

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
                      -{Math.round(((product.compareAt - product.price) / product.compareAt) * 100)}%
                    </span>
                  </div>
                )}

                {/* Action Buttons - always visible on mobile, hover on desktop */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-y-4 sm:group-hover:translate-y-0 transition-all duration-300">
                  <button
                    onClick={(e) => handleAddToWishlist(e, product)}
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
                    onClick={(e) => handleQuickView(e, product.slug)}
                    className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent hover:text-white transition-all"
                    aria-label="Quick view"
                  >
                    <Eye className="w-4 h-4" />
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
                  <span className="text-xs text-foreground/40">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-lg font-bold">${product.price}</span>
                  {product.compareAt && (
                    <span className="text-sm text-foreground/40 line-through">${product.compareAt}</span>
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
