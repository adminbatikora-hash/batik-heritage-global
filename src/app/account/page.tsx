import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountView from "@/components/account/AccountView";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account, orders, and preferences.",
};

export default function AccountPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <AccountView />
      <Footer />
    </main>
  );
}
