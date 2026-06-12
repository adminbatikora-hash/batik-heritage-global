"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Globe,
} from "lucide-react";
import { NAV_LINKS, CURRENCIES } from "@/lib/constants";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import { t } from "@/lib/translations";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const cartCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const { currency, setCurrency } = useCurrencyStore();
  const { language } = useLanguageStore();
  const tr = t(language);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-2 text-center">
        <p className="tracking-wider">
          {tr.topBar}
        </p>
      </div>

      {/* Main Navbar */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glass-nav shadow-glass"
            : "bg-white/95 backdrop-blur-sm"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-luxury mx-auto">
          <div className="flex items-center justify-between h-20 px-4 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Batik Heritage Global"
                width={140}
                height={40}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() =>
                    "children" in link ? setActiveDropdown(link.name) : null
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center space-x-1 text-sm font-medium text-foreground/80 hover:text-secondary transition-colors py-2"
                  >
                    <span>{link.name}</span>
                    {"children" in link && (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {"children" in link && (
                    <AnimatePresence>
                      {activeDropdown === link.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-1 w-56 glass-card-solid p-4 shadow-luxury rounded-xl"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-secondary hover:bg-accent/5 rounded-lg transition-all"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-3">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* Currency Switcher */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center space-x-1 text-sm text-foreground/70 hover:text-secondary transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span>{currency}</span>
                </button>
                <AnimatePresence>
                  {currencyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full right-0 mt-2 w-48 glass-card-solid p-2 shadow-luxury rounded-xl"
                    >
                      {CURRENCIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => {
                            setCurrency(c.code);
                            setCurrencyOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-all ${
                            currency === c.code
                              ? "bg-accent/10 text-secondary"
                              : "text-foreground/70 hover:bg-gray-50"
                          }`}
                        >
                          <span>{c.flag}</span>
                          <span>{c.code}</span>
                          <span className="text-foreground/40">
                            {c.symbol}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-foreground/70 hover:text-secondary transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-foreground/70 hover:text-secondary transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2 text-foreground/70 hover:text-secondary transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Account */}
              <Link
                href="/account"
                className="p-2 text-foreground/70 hover:text-secondary transition-colors hidden md:block"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-foreground/70 hover:text-secondary transition-colors lg:hidden"
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t"
            >
              <div className="px-4 py-6 space-y-4">
                {NAV_LINKS.map((link) => (
                  <div key={link.name}>
                    <Link
                      href={link.href}
                      className="block text-base font-medium text-foreground/80 hover:text-secondary py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                    {"children" in link && (
                      <div className="pl-4 space-y-2 mt-2">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block text-sm text-foreground/60 hover:text-secondary py-1"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="pt-4 border-t flex items-center space-x-4">
                  <Link
                    href="/account"
                    className="text-sm text-foreground/70 hover:text-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {tr.nav.myAccount}
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-32"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="glass-card-solid p-6 shadow-luxury">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                  <input
                    type="text"
                    placeholder={tr.nav.searchPlaceholder}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                    autoFocus
                  />
                </div>
                <div className="mt-4 text-sm text-foreground/50">
                  <p>{tr.nav.popularSearches}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
