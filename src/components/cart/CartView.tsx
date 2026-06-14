"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import toast from "react-hot-toast";

export default function CartView() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
  } = useCartStore();
  const [couponInput, setCouponInput] = useState("");

  const subtotal = getSubtotal();
  const shipping = subtotal > 150 ? 0 : 15;
  const discountAmount = discount > 0 ? subtotal * (discount / 100) : 0;
  const total = subtotal + shipping - discountAmount;

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    // Simulated coupon validation
    if (couponInput.toUpperCase() === "BATIK10") {
      applyCoupon(couponInput.toUpperCase(), 10);
      toast.success("Coupon applied! 10% discount");
    } else if (couponInput.toUpperCase() === "HERITAGE20") {
      applyCoupon(couponInput.toUpperCase(), 20);
      toast.success("Coupon applied! 20% discount");
    } else {
      toast.error("Invalid coupon code");
    }
    setCouponInput("");
  };

  if (items.length === 0) {
    return (
      <section className="section-padding bg-background min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <ShoppingBag className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
          <h2 className="text-2xl font-display font-bold">Your Cart is Empty</h2>
          <p className="text-foreground/50 mt-2">
            Discover our premium batik collection and add items to your cart.
          </p>
          <Link href="/collections" className="btn-gold mt-8 inline-flex">
            Shop Now
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-luxury mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold mb-8"
        >
          Shopping Cart ({items.length} items)
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={`${item.id}-${item.size}-${item.color}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card-solid p-4 sm:p-6 flex gap-4"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden relative">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-10 h-10 gradient-gold rounded-lg opacity-30" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/products/${item.slug}`}
                          className="font-semibold text-sm sm:text-base hover:text-secondary transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-foreground/50 mt-1">
                          {item.size && `Size: ${item.size}`}
                          {item.color && ` | Color: ${item.color}`}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="p-2 text-foreground/40 hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1, item.size, item.color)
                          }
                          className="p-2 hover:bg-gray-50 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-2 text-sm font-medium min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1, item.size, item.color)
                          }
                          className="p-2 hover:bg-gray-50 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="text-sm text-foreground/50 hover:text-red-500 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card-solid p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-6">Order Summary</h3>

              {/* Coupon */}
              <div className="mb-6">
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {couponCode} (-{discount}%)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon code"
                      className="flex-1 px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-foreground/60">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {shipping === 0 && (
                  <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded-lg">
                    <Truck className="w-3 h-3" />
                    Free shipping on orders over $150
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">${total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-gold w-full text-center mt-6 block"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Link>

              <Link
                href="/collections"
                className="block text-center text-sm text-foreground/50 hover:text-secondary mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
