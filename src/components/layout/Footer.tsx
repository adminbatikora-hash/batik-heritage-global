"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Globe,
  Camera,
  MessageCircle,
  Play,
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Men Collection", href: "/collections/men-batik" },
    { name: "Women Collection", href: "/collections/women-batik" },
    { name: "New Arrivals", href: "/collections/new-arrivals" },
    { name: "Best Sellers", href: "/collections/best-sellers" },
    { name: "Sale", href: "/collections/sale" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Artisans", href: "/about#artisans" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
  ],
  support: [
    { name: "Contact Us", href: "/contact" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "FAQ", href: "/faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

const socialLinks = [
  { icon: Globe, href: "https://facebook.com", label: "Facebook" },
  { icon: Camera, href: "https://instagram.com", label: "Instagram" },
  { icon: MessageCircle, href: "https://twitter.com", label: "Twitter" },
  { icon: Play, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-luxury mx-auto px-4 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-display font-bold">
                Join Our Heritage Circle
              </h3>
              <p className="text-white/60 mt-2">
                Get exclusive access to new collections, artisan stories, and
                special offers.
              </p>
            </div>
            <div className="w-full lg:w-auto">
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 lg:w-80 px-6 py-3.5 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 gradient-gold rounded-full font-medium text-white hover:shadow-gold transition-all flex items-center gap-2"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Batik Heritage Global"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-white/50 text-sm mt-4 leading-relaxed">
              Bringing authentic Indonesian Batik to the world. Each piece tells
              a story of tradition, craftsmanship, and heritage.
            </p>
            <div className="flex items-center space-x-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent/20 hover:text-accent transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/50 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/50">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Jl. Malioboro No. 123, Yogyakarta, Indonesia</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+62 274 123 456</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@batikheritage.global</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-luxury mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/40">
              © {new Date().getFullYear()} Batik Heritage Global. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-xs text-white/40 hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">We accept:</span>
              <div className="flex gap-1">
                {["Visa", "MC", "PayPal", "Amex"].map((card) => (
                  <span
                    key={card}
                    className="px-2 py-1 bg-white/10 rounded text-[10px] text-white/60"
                  >
                    {card}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
