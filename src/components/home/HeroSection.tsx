"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { HERO_STATS } from "@/lib/constants";
import { useLanguageStore } from "@/store/useLanguageStore";
import { t } from "@/lib/translations";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const { language } = useLanguageStore();
  const tr = t(language);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

        {/* Animated Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -20, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl"
        />

        {/* Floating Glass Shapes */}
        <motion.div
          animate={{ y: [-20, 20, -20], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-32 left-[15%] w-32 h-32 glass-card rounded-2xl opacity-50"
        />
        <motion.div
          animate={{ y: [20, -20, 20], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-[10%] w-24 h-24 glass-card rounded-full opacity-40"
        />
        <motion.div
          animate={{ y: [10, -30, 10], rotate: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[60%] left-[5%] w-20 h-20 glass-card rounded-xl opacity-30"
        />

        {/* Batik Pattern Overlay */}
        <div className="absolute inset-0 batik-pattern-bg opacity-30" />
      </div>

      {/* Content */}
      <motion.div style={{ y, opacity }} className="relative z-10 w-full">
        <div className="container-luxury mx-auto px-4 lg:px-8 py-20 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-secondary">
                    {tr.hero.badge}
                  </span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight"
              >
                {tr.hero.title}{" "}
                <span className="gradient-text-gold">{tr.hero.titleHighlight}</span> {tr.hero.titleEnd}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-6 text-lg text-foreground/60 max-w-xl mx-auto lg:mx-0"
              >
                {tr.hero.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link href="/collections" className="btn-gold group">
                  {tr.hero.shopCollection}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/about" className="btn-outline">
                  {tr.hero.exploreHeritage}
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6"
              >
                {[
                  { value: "5000+", label: tr.hero.stats.customers },
                  { value: "50+", label: tr.hero.stats.countries },
                  { value: "100%", label: tr.hero.stats.authentic },
                  { value: "Free", label: tr.hero.stats.shipping },
                ].map((stat, index) => (
                  <div
                    key={stat.label}
                    className="text-center lg:text-left"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.1, type: "spring" }}
                    >
                      <p className="text-2xl font-bold gradient-text-gold">
                        {stat.value}
                      </p>
                      <p className="text-xs text-foreground/50 mt-1">
                        {stat.label}
                      </p>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - 3D Glass Card Display */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main Glass Card */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-8 glass-card-solid rounded-3xl p-8 shadow-luxury overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5" />
                  <div className="relative z-10 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 gradient-gold rounded-2xl flex items-center justify-center mb-6">
                      <span className="text-4xl font-display text-white font-bold">
                        B
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-primary">
                      Premium Collection
                    </h3>
                    <p className="text-sm text-foreground/50 mt-2">
                      Handcrafted Masterpieces
                    </p>
                    <div className="mt-6 flex gap-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 border border-accent/30"
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating Accent Cards */}
                <motion.div
                  animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-4 -right-4 w-32 h-32 glass-card rounded-2xl p-4 shadow-glass flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-2xl font-bold text-secondary">50+</p>
                    <p className="text-[10px] text-foreground/50">Countries</p>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
                  transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -bottom-4 -left-4 w-36 h-24 glass-card rounded-2xl p-4 shadow-glass flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-lg font-bold text-secondary">⭐ 4.9</p>
                    <p className="text-[10px] text-foreground/50">
                      Customer Rating
                    </p>
                  </div>
                </motion.div>

                {/* Gold Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-accent/20"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-foreground/20 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
