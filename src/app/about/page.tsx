import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About Us | Our Heritage Story",
  description:
    "Learn about Batikora's mission to bring authentic Indonesian Batik to the world while supporting artisan communities.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <AboutContent />
      <Footer />
    </main>
  );
}
