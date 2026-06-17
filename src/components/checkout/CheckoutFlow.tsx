"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  Lock,
  PartyPopper,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { SUPPORTED_COUNTRIES } from "@/lib/constants";
import PayPalProvider from "./PayPalProvider";
import PayPalCheckoutButton from "./PayPalCheckoutButton";

interface ShippingRate {
  carrier: string;
  carrierLogo: string;
  service: string;
  serviceName: string;
  price: number;
  currency: string;
  estimatedDays: string;
  description?: string;
}

interface ShippingRatesResponse {
  country: string;
  isDomestic: boolean;
  availableCarriers: string[];
  rates: ShippingRate[];
  totalOptions: number;
}

const steps = [
  { id: 1, name: "Information", icon: User },
  { id: 2, name: "Shipping", icon: MapPin },
  { id: 3, name: "Payment", icon: CreditCard },
  { id: 4, name: "Review", icon: CheckCircle },
];

export default function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paypalOrderId, setPaypalOrderId] = useState("");
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [availableCarriers, setAvailableCarriers] = useState<string[]>([]);
  const [loadingRates, setLoadingRates] = useState(false);
  const [selectedRateIndex, setSelectedRateIndex] = useState(-1);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const { items, getSubtotal, getTotalWeight, discount, clearCart } = useCartStore();
  const subtotal = getSubtotal();
  const totalWeight = getTotalWeight();

  // Get selected shipping rate price
  const selectedRate = selectedRateIndex >= 0 ? shippingRates[selectedRateIndex] : null;
  const shippingCost = selectedRate?.price ?? 0;
  const discountAmount = discount > 0 ? subtotal * (discount / 100) : 0;
  const total = subtotal + shippingCost - discountAmount;

  // Fetch shipping rates when country changes
  const fetchShippingRates = useCallback(async (countryCode: string) => {
    if (!countryCode) {
      setShippingRates([]);
      setSelectedRateIndex(-1);
      return;
    }

    setLoadingRates(true);
    try {
      const params = new URLSearchParams({
        country: countryCode,
        city: formData.city || "",
        postalCode: formData.postalCode || "",
        weight: totalWeight.toFixed(2),
      });

      const res = await fetch(`/api/shipping/rates?${params.toString()}`);
      if (res.ok) {
        const data: ShippingRatesResponse = await res.json();
        setShippingRates(data.rates);
        setAvailableCarriers(data.availableCarriers);
        // Auto-select the first (cheapest) rate
        if (data.rates.length > 0) {
          setSelectedRateIndex(0);
        }
      }
    } catch (error) {
      console.error("Failed to fetch shipping rates:", error);
    } finally {
      setLoadingRates(false);
    }
  }, [formData.city, formData.postalCode, totalWeight]);

  useEffect(() => {
    if (formData.country) {
      fetchShippingRates(formData.country);
    }
  }, [formData.country, fetchShippingRates]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setCurrentStep(Math.min(4, currentStep + 1));
  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

  const handlePaymentSuccess = (details: {
    captureId: string;
    paypalOrderId: string;
    whatsappUrl?: string;
  }) => {
    setPaypalOrderId(details.paypalOrderId);
    setOrderComplete(true);
    clearCart();

    // Open WhatsApp notification to admin
    if (details.whatsappUrl) {
      window.open(details.whatsappUrl, "_blank");
    }
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    setTimeout(() => setPaymentError(""), 5000);
  };

  // Order Complete Screen
  if (orderComplete) {
    return (
      <section className="section-padding">
        <div className="container-luxury mx-auto max-w-2xl text-center py-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <PartyPopper className="w-12 h-12 text-green-600" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold mb-4">
            Order Confirmed!
          </h1>
          <p className="text-foreground/60 mb-2">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <p className="text-sm text-foreground/40 mb-8">
            PayPal Transaction ID: {paypalOrderId}
          </p>
          <p className="text-sm text-foreground/60 mb-8">
            We&apos;ve sent a confirmation email to{" "}
            <strong>{formData.email}</strong>. You can track your order in your
            account.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/account"
              className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/collections"
              className="px-6 py-3 border rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding">
      <div className="container-luxury mx-auto max-w-5xl">
        {/* Steps Indicator */}
        <div className="flex items-center justify-center mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  currentStep >= step.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-foreground/40"
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:block">
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card-solid p-8"
            >
              {/* Step 1: Customer Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-display font-bold mb-6">
                    Customer Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping Address & Method */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-display font-bold mb-6">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 bg-white"
                      >
                        <option value="">Select Country</option>
                        {SUPPORTED_COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        name="address1"
                        value={formData.address1}
                        onChange={handleChange}
                        placeholder="Street address"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        name="address2"
                        value={formData.address2}
                        onChange={handleChange}
                        placeholder="Apartment, suite, etc."
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Shipping Method Selection - Real-time from Carriers */}
                  <h3 className="text-lg font-semibold mt-8 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Method
                  </h3>

                  {!formData.country && (
                    <p className="text-sm text-foreground/50 italic">
                      Please select a country to see available shipping options.
                    </p>
                  )}

                  {loadingRates && (
                    <div className="flex items-center gap-2 py-4">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-foreground/60">
                        Fetching live rates from carriers...
                      </span>
                    </div>
                  )}

                  {!loadingRates && formData.country && shippingRates.length > 0 && (
                    <>
                      <p className="text-xs text-foreground/50 mb-3">
                        Available carriers: {availableCarriers.join(", ")}
                        <span className="ml-2">• Package weight: {totalWeight.toFixed(1)} kg</span>
                      </p>
                      <div className="space-y-3">
                        {shippingRates.map((rate, idx) => (
                          <label
                            key={`${rate.carrier}-${rate.service}`}
                            className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                              selectedRateIndex === idx
                                ? "border-accent bg-accent/5"
                                : "border-gray-200 hover:border-accent/50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shippingRate"
                                checked={selectedRateIndex === idx}
                                onChange={() => setSelectedRateIndex(idx)}
                                className="text-accent focus:ring-accent"
                              />
                              <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-lg flex-shrink-0">
                                <Image
                                  src={rate.carrierLogo}
                                  alt={rate.carrier}
                                  width={28}
                                  height={28}
                                  className="object-contain"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {rate.serviceName}
                                </p>
                                <p className="text-xs text-foreground/50">
                                  {rate.carrier} • {rate.estimatedDays}
                                </p>
                              </div>
                            </div>
                            <span className="font-semibold text-sm">
                              ${rate.price.toFixed(2)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}

                  {!loadingRates && formData.country && shippingRates.length === 0 && (
                    <p className="text-sm text-red-500">
                      No shipping options available for this destination. Please check your address or contact support.
                    </p>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-display font-bold mb-6">
                    Payment
                  </h2>

                  {items.length === 0 && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                      Your cart is empty. Please add items before proceeding to payment.
                    </div>
                  )}

                  {paymentError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                      {paymentError}
                    </div>
                  )}

                  {/* Order Summary Before Payment */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground/60">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-sm text-green-600 mb-1">
                        <span>Discount</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foreground/60">
                        Shipping
                        {selectedRate && (
                          <span className="text-foreground/40 ml-1">
                            ({selectedRate.serviceName})
                          </span>
                        )}
                      </span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `$${shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* PayPal Buttons */}
                  <div className="border rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-foreground/60">
                        Secure payment powered by PayPal
                      </span>
                    </div>

                    <PayPalProvider>
                      <PayPalCheckoutButton
                        amount={total}
                        items={items.map((item) => ({
                          id: item.id,
                          name: item.name,
                          price: item.price,
                          quantity: item.quantity,
                          sku: item.sku,
                          size: item.size,
                          color: item.color,
                          image: item.image,
                        }))}
                        shippingAddress={{
                          firstName: formData.firstName,
                          lastName: formData.lastName,
                          address1: formData.address1,
                          address2: formData.address2,
                          city: formData.city,
                          state: formData.state,
                          postalCode: formData.postalCode,
                          country: formData.country,
                        }}
                        shippingMethod={selectedRate?.serviceName || "Standard"}
                        shippingCost={shippingCost}
                        discount={discountAmount}
                        subtotal={subtotal}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </PayPalProvider>

                    <p className="text-xs text-foreground/40 mt-4 text-center">
                      You can pay with PayPal balance, credit card, or debit
                      card through PayPal.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mt-4 text-xs text-foreground/50">
                    <Lock className="w-3 h-3" />
                    Your payment information is encrypted and secure.
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-display font-bold mb-6">
                    Review Your Order
                  </h2>
                  <div className="space-y-6">
                    {/* Items */}
                    <div>
                      <h3 className="font-semibold mb-3">
                        Items ({items.length})
                      </h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div
                            key={`${item.id}-${item.color}`}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {item.name}
                              </p>
                              <p className="text-xs text-foreground/50">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="font-semibold text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h3 className="font-semibold text-sm mb-2">
                        Shipping To
                      </h3>
                      <p className="text-sm text-foreground/70">
                        {formData.firstName} {formData.lastName}
                        <br />
                        {formData.address1}
                        {formData.address2 && `, ${formData.address2}`}
                        <br />
                        {formData.city}, {formData.state} {formData.postalCode}
                        <br />
                        {SUPPORTED_COUNTRIES.find(
                          (c) => c.code === formData.country
                        )?.name || formData.country}
                      </p>
                      {selectedRate && (
                        <p className="text-sm text-foreground/60 mt-2">
                          <Truck className="w-3.5 h-3.5 inline mr-1" />
                          {selectedRate.serviceName}
                          {` — ${selectedRate.estimatedDays}`}
                          <span className="ml-2 font-medium">
                            ${selectedRate.price.toFixed(2)}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Proceed to payment */}
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="btn-gold w-full text-center"
                    >
                      Proceed to Payment — ${total.toFixed(2)}
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                {currentStep > 1 ? (
                  <button
                    onClick={prevStep}
                    className="px-6 py-3 border rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                ) : (
                  <div />
                )}
                {currentStep < 3 && (
                  <button onClick={nextStep} className="btn-primary">
                    Continue
                  </button>
                )}
                {currentStep === 3 && <div />}
              </div>
            </motion.div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card-solid p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color}`}
                    className="flex justify-between"
                  >
                    <span className="text-foreground/60 truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `$${shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {selectedRate && (
                    <p className="text-xs text-foreground/40">
                      {selectedRate.carrier} — {selectedRate.estimatedDays}
                    </p>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
