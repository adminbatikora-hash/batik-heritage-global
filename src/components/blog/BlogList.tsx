"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, Calendar } from "lucide-react";

const blogPosts = [
  {
    id: "1",
    title: "The Ancient Art of Batik: A Journey Through 1000 Years",
    slug: "ancient-art-of-batik",
    excerpt:
      "Discover the fascinating history of Indonesian Batik, from royal courts to UNESCO recognition.",
    category: "Batik History",
    readTime: 8,
    date: "December 5, 2024",
    featured: true,
  },
  {
    id: "2",
    title: "Meet Pak Hadi: Master Artisan of Yogyakarta",
    slug: "meet-pak-hadi-artisan",
    excerpt:
      "A behind-the-scenes look at one of Indonesia's most celebrated batik artisans and his 40-year journey.",
    category: "Artisan Stories",
    readTime: 6,
    date: "November 28, 2024",
    featured: false,
  },
  {
    id: "3",
    title: "How to Style Batik for Modern Fashion",
    slug: "style-batik-modern-fashion",
    excerpt:
      "Tips and inspiration for incorporating authentic batik into your contemporary wardrobe.",
    category: "Fashion Trends",
    readTime: 5,
    date: "November 20, 2024",
    featured: false,
  },
  {
    id: "4",
    title: "Understanding Batik Patterns: What They Mean",
    slug: "understanding-batik-patterns",
    excerpt:
      "Each batik pattern carries deep cultural significance. Learn the stories behind the most iconic motifs.",
    category: "Indonesian Culture",
    readTime: 7,
    date: "November 15, 2024",
    featured: false,
  },
  {
    id: "5",
    title: "Sustainable Fashion: The Batik Way",
    slug: "sustainable-fashion-batik",
    excerpt:
      "How traditional batik production methods align with modern sustainability principles.",
    category: "Fashion Trends",
    readTime: 6,
    date: "November 8, 2024",
    featured: false,
  },
  {
    id: "6",
    title: "Caring for Your Batik: Maintenance Guide",
    slug: "caring-for-batik-guide",
    excerpt:
      "Essential tips for washing, storing, and maintaining your premium batik pieces for lasting beauty.",
    category: "Batik History",
    readTime: 4,
    date: "November 1, 2024",
    featured: false,
  },
];

const categories = [
  "All",
  "Batik History",
  "Indonesian Culture",
  "Fashion Trends",
  "Artisan Stories",
];

export default function BlogList() {
  return (
    <section className="section-padding bg-background">
      <div className="container-luxury mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium tracking-widest text-secondary uppercase">
            Our Blog
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3">
            Heritage <span className="gradient-text-gold">Stories</span>
          </h1>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
            Explore the rich world of Indonesian Batik through stories, culture,
            and fashion.
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white border hover:bg-accent/10 hover:border-accent/30 transition-all"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Post */}
        {blogPosts[0] && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <Link href={`/blog/${blogPosts[0].slug}`}>
              <div className="group grid lg:grid-cols-2 gap-8 glass-card-solid p-6 lg:p-8 hover:shadow-luxury transition-all">
                <div className="aspect-[16/9] lg:aspect-auto rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="w-20 h-20 gradient-gold rounded-2xl opacity-30" />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                    {blogPosts[0].category} • Featured
                  </span>
                  <h2 className="text-2xl lg:text-3xl font-display font-bold mt-3 group-hover:text-secondary transition-colors">
                    {blogPosts[0].title}
                  </h2>
                  <p className="text-foreground/60 mt-3">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-6 text-sm text-foreground/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {blogPosts[0].date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blogPosts[0].readTime} min read
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Blog Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.slice(1).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="group glass-card-solid p-5 h-full hover:shadow-luxury transition-all">
                  <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-primary/5 to-accent/10 flex items-center justify-center mb-4">
                    <div className="w-12 h-12 gradient-gold rounded-xl opacity-30" />
                  </div>
                  <span className="text-xs font-medium text-secondary uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-semibold mt-2 group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-foreground/60 mt-2 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-xs text-foreground/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime} min
                    </span>
                    <span className="text-xs font-medium text-secondary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
