"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

export default function WishlistView() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      sku: "",
      slug: item.slug,
    });
    removeItem(item.id);
    toast.success("Moved to cart!");
  };

  if (items.length === 0) {
    return (
      <section className="section-padding bg-background min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Heart className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
          <h2 className="text-2xl font-display font-bold">Your Wishlist is Empty</h2>
          <p className="text-foreground/50 mt-2">
            Save items you love and come back to them later.
          </p>
          <Link href="/collections" className="btn-gold mt-8 inline-flex">
            Explore Collections
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-luxury mx-auto">
        <h1 className="text-3xl font-display font-bold mb-8">
          My Wishlist ({items.length} items)
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card-solid p-4 group"
            >
              <div className="relative aspect-[3/4] rounded-xl bg-gray-100 mb-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center">
                  <div className="w-12 h-12 gradient-gold rounded-xl opacity-30" />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:bg-red-50 transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-semibold text-sm group-hover:text-secondary transition-colors">
                  {item.name}
                </h3>
              </Link>
              <p className="font-bold mt-1">${item.price}</p>
              <button
                onClick={() => handleAddToCart(item)}
                className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm rounded-xl hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                Move to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
