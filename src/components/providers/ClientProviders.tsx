"use client";

import { Toaster } from "react-hot-toast";
import ChatWidget from "@/components/chat/ChatWidget";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <ChatWidget />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#0F172A",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 20px",
          },
        }}
      />
    </>
  );
}
