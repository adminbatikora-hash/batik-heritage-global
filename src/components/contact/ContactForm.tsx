"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock, MessageSquare, Send } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Jl. Malioboro No. 123", "Yogyakarta, Indonesia 55271"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+62 274 123 456", "+1 (800) BATIKORA"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["hello@batikora.com", "support@batikora.com"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon-Fri: 9AM - 6PM (WIB)", "Sat: 9AM - 3PM (WIB)"],
  },
];

export default function ContactForm() {
  return (
    <section className="section-padding bg-background">
      <div className="container-luxury mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-widest text-secondary uppercase">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mt-3">
            Contact <span className="gradient-text-gold">Us</span>
          </h1>
          <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
            Have questions about our products, need custom orders, or want to learn
            more? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-solid p-6 flex gap-4"
              >
                <div className="w-12 h-12 gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <info.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{info.title}</h3>
                  {info.details.map((detail) => (
                    <p key={detail} className="text-sm text-foreground/60 mt-1">
                      {detail}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-card-solid p-8"
          >
            <h2 className="text-xl font-display font-bold flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-secondary" />
              Send us a Message
            </h2>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Subject</label>
                <select className="w-full px-4 py-3 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-accent/50">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Custom Order Request</option>
                  <option>Wholesale Inquiry</option>
                  <option>Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Message</label>
                <textarea
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none"
                />
              </div>
              <button type="submit" className="btn-gold">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
