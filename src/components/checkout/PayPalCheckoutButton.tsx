"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PayPalCheckoutButtonProps {
  amount: number;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    sku?: string;
    size?: string;
    color?: string;
    image?: string;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingMethod: string;
  shippingCost: number;
  discount: number;
  subtotal: number;
  onSuccess: (details: { captureId: string; paypalOrderId: string; whatsappUrl?: string }) => void;
  onError: (error: string) => void;
}

export default function PayPalCheckoutButton({
  amount,
  items,
  shippingAddress,
  shippingMethod,
  shippingCost,
  discount,
  subtotal,
  onSuccess,
  onError,
}: PayPalCheckoutButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [processing, setProcessing] = useState(false);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-foreground/40" />
        <span className="ml-2 text-sm text-foreground/50">Loading PayPal...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {processing && (
        <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-sm font-medium">Processing payment...</span>
        </div>
      )}
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "gold",
          shape: "rect",
          label: "pay",
          height: 50,
        }}
        createOrder={async () => {
          try {
            if (amount <= 0) {
              onError("Order amount must be greater than $0. Please add items to cart.");
              throw new Error("Invalid amount");
            }

            const res = await fetch("/api/paypal/create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount,
                currency: "USD",
              }),
            });

            const data = await res.json();

            if (!res.ok) {
              console.error("Create order failed:", data);
              onError(data.error || "Failed to create PayPal order. Please try again.");
              throw new Error(data.error || "Failed to create order");
            }

            return data.id;
          } catch (err) {
            if (!(err instanceof Error && err.message === "Invalid amount")) {
              onError("Failed to create PayPal order. Please try again.");
            }
            throw err;
          }
        }}
        onApprove={async (data) => {
          setProcessing(true);
          try {
            const res = await fetch("/api/paypal/capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderID: data.orderID,
                orderData: {
                  subtotal,
                  shipping: shippingCost,
                  discount,
                  total: amount,
                  shippingMethod,
                  shippingAddress,
                  items: items.map((item) => ({
                    productId: item.id,
                    name: item.name,
                    sku: item.sku || "N/A",
                    price: item.price,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    image: item.image,
                  })),
                },
              }),
            });

            if (!res.ok) {
              throw new Error("Failed to capture payment");
            }

            const captureData = await res.json();

            if (captureData.status === "COMPLETED") {
              onSuccess({
                captureId: captureData.captureId,
                paypalOrderId: captureData.paypalOrderId,
                whatsappUrl: captureData.whatsappUrl,
              });
            } else {
              onError("Payment was not completed. Please try again.");
            }
          } catch (err) {
            onError("Payment processing failed. Please try again.");
          } finally {
            setProcessing(false);
          }
        }}
        onError={(err) => {
          console.error("PayPal error:", err);
          onError("PayPal encountered an error. Please try again.");
        }}
        onCancel={() => {
          // User cancelled — no action needed
        }}
      />
    </div>
  );
}
