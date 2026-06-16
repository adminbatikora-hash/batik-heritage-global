"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function PayPalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [clientId, setClientId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try env first (works in build time), then fetch from API (runtime)
    const envClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    if (envClientId && envClientId !== "" && envClientId !== "sb") {
      setClientId(envClientId);
      setLoading(false);
    } else {
      // Fetch from server at runtime
      fetch("/api/paypal/client-id")
        .then((res) => res.json())
        .then((data) => {
          setClientId(data.clientId || "");
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-foreground/40" />
        <span className="ml-2 text-sm text-foreground/50">Initializing payment...</span>
      </div>
    );
  }

  if (!clientId) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
        Payment system is temporarily unavailable. Please try again later or contact support.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
