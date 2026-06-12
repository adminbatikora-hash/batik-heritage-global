import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Batikora. We're here to help with orders, custom requests, and any questions.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ContactForm />
      <Footer />
    </main>
  );
}
