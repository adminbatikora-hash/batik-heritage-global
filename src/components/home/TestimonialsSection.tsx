"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "New York, USA",
    rating: 5,
    text: "The quality of the batik is absolutely stunning. I've never seen such intricate hand-drawn patterns. It arrived beautifully packaged and the silk feels luxurious against my skin.",
    avatar: "SM",
    product: "Royal Parang Silk Dress",
  },
  {
    id: 2,
    name: "James Thompson",
    location: "London, UK",
    rating: 5,
    text: "I ordered a batik shirt for a special event and received so many compliments. The craftsmanship is evident in every detail. Will definitely be ordering more.",
    avatar: "JT",
    product: "Kawung Premium Shirt",
  },
  {
    id: 3,
    name: "Yuki Tanaka",
    location: "Tokyo, Japan",
    rating: 5,
    text: "Beautiful artisan work that blends traditional Indonesian heritage with modern fashion. The shipping was fast and the packaging made it feel like a luxury gift.",
    avatar: "YT",
    product: "Mega Mendung Scarf",
  },
  {
    id: 4,
    name: "Marie Dubois",
    location: "Paris, France",
    rating: 5,
    text: "Exquisite! The colors are even more vibrant in person. This is truly wearable art. I appreciate the card explaining the cultural significance of the pattern.",
    avatar: "MD",
    product: "Truntum Evening Gown",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-background">
      <div className="container-luxury mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-widest text-secondary uppercase">
            What Our Customers Say
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3">
            Trusted by <span className="gradient-text-gold">5000+</span>{" "}
            Customers
          </h2>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
            Read authentic reviews from customers around the world who cherish
            our handcrafted batik pieces.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card-solid p-8 hover:shadow-luxury transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-accent/30 mb-4" />

              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/70 leading-relaxed mb-6">
                &quot;{testimonial.text}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-foreground/50">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-secondary bg-accent/10 px-3 py-1 rounded-full">
                  {testimonial.product}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
