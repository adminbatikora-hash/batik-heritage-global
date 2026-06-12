import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BlogList from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Blog | Batikora Stories",
  description:
    "Explore the rich history of Indonesian Batik, artisan stories, fashion trends, and cultural insights.",
};

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <BlogList />
      <Footer />
    </main>
  );
}
