"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  Lock,
} from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { SUPPORTED_COUNTRIES, SHIPPING_METHODS } from "@/lib/constants";

const steps = [
  { id: 1, name: "Information", icon: User },
  { id: 2, name: "Shipping", icon: MapPin },
  { id: 3, name: "Payment", icon: CreditCard },
  { id: 4, name: "Review", icon: CheckCircle },
];

export default function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(1);
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
    shippingMethod: "standard",
  });

  const { items, getSubtotal, discount } = useCartStore();
  const subtotal = getSubtotal();
  const shippingCost = formData.shippingMethod === "standard" ? 0 : formData.shippingMethod === "express" ? 25 : 45;
  const discountAmount = discount > 0 ? subtotal * (discount / 100) : 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setCurrentStep(Math.min(4, currentStep + 1));
  const prevStep = () => setCurrentStep(Math.max(1, currentStep - 1));

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
                      <label className="block text-sm font-medium mb-1">Email</label>
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
                        <label className="block text-sm font-medium mb-1">First Name</label>
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
                        <label className="block text-sm font-medium mb-1">Last Name</label>
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
                      <label className="block text-sm font-medium mb-1">Phone</label>
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

              {/* Step 2: Shipping Address */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-display font-bold mb-6">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Country</label>
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
                      <label className="block text-sm font-medium mb-1">Address Line 1</label>
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
                      <label className="block text-sm font-medium mb-1">Address Line 2 (Optional)</label>
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
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Postal Code</label>
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

                  {/* Shipping Method Selection */}
                  <h3 className="text-lg font-semibold mt-8 mb-4">Shipping Method</h3>
                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all ${
                          formData.shippingMethod === method.id
                            ? "border-accent bg-accent/5"
                            : "border-gray-200 hover:border-accent/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            value={method.id}
                            checked={formData.shippingMethod === method.id}
                            onChange={handleChange}
                            className="text-accent focus:ring-accent"
                          />
                          <div>
                            <p className="font-medium text-sm">{method.name}</p>
                            <p className="text-xs text-foreground/50">{method.days}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-sm">
                          {method.id === "standard" ? "Free" : method.id === "express" ? "$25" : method.id === "priority" ? "$45" : "$75"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-display font-bold mb-6">
                    Payment Method
                  </h2>
                  <div className="space-y-4">
                    {/* PayPal Option */}
                    <div className="p-6 border-2 border-accent rounded-xl bg-accent/5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-[#003087] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">PP</span>
                        </div>
                        <div>
                          <p className="font-semibold">PayPal</p>
                          <p className="text-xs text-foreground/50">
                            Pay with PayPal, Credit or Debit Card
                          </p>
                        </div>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                        <p className="text-sm text-yellow-800">
                          You will be redirected to PayPal to complete your payment securely.
                        </p>
                        <button className="mt-3 px-8 py-3 bg-[#FFC439] text-[#003087] font-bold rounded-full hover:bg-[#F0B429] transition-colors">
                          Pay with PayPal
                        </button>
                      </div>
                    </div>

                    {/* Credit Card Option */}
                    <div className="p-6 border rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="w-5 h-5 text-secondary" />
                        <p className="font-semibold">Credit / Debit Card</p>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">CVC</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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
                      <h3 className="font-semibold mb-3">Items ({items.length})</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div
                            key={`${item.id}-${item.size}`}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-foreground/50">
                                {item.size} | Qty: {item.quantity}
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
                      <h3 className="font-semibold text-sm mb-2">Shipping To</h3>
                      <p className="text-sm text-foreground/70">
                        {formData.firstName} {formData.lastName}
                        <br />
                        {formData.address1}
                        {formData.address2 && `, ${formData.address2}`}
                        <br />
                        {formData.city}, {formData.state} {formData.postalCode}
                        <br />
                        {formData.country}
                      </p>
                    </div>

                    <button className="btn-gold w-full text-center">
                      Place Order — ${total.toFixed(2)}
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
                {currentStep < 4 && (
                  <button onClick={nextStep} className="btn-primary">
                    Continue
                  </button>
                )}
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
                    key={`${item.id}-${item.size}`}
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
                    <span>{shippingCost === 0 ? "Free" : `$${shippingCost}`}</span>
                  </div>
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
