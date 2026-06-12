import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0F172A",
          50: "#E8EDF5",
          100: "#C5D0E6",
          200: "#8FA1CD",
          300: "#5972B4",
          400: "#2F4A8A",
          500: "#0F172A",
          600: "#0D1424",
          700: "#0A0F1C",
          800: "#070A14",
          900: "#04060C",
        },
        secondary: {
          DEFAULT: "#B8860B",
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD54F",
          400: "#FFCA28",
          500: "#B8860B",
          600: "#A67A0A",
          700: "#8C6708",
          800: "#725406",
          900: "#584104",
        },
        accent: {
          DEFAULT: "#D4AF37",
          50: "#FBF6E3",
          100: "#F5E9B8",
          200: "#EEDC8C",
          300: "#E8CF60",
          400: "#DEC04B",
          500: "#D4AF37",
          600: "#C49E2E",
          700: "#A88524",
          800: "#8C6C1B",
          900: "#705413",
        },
        background: "#F8F9FA",
        foreground: "#111827",
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.15)",
          light: "rgba(255, 255, 255, 0.25)",
          dark: "rgba(0, 0, 0, 0.15)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 10s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "pulse-gold": "pulse-gold 2s ease-in-out infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-down": "slide-down 0.5s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-gold": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "glass-lg": "0 16px 64px 0 rgba(31, 38, 135, 0.1)",
        gold: "0 4px 20px rgba(212, 175, 55, 0.3)",
        "gold-lg": "0 8px 40px rgba(212, 175, 55, 0.4)",
        luxury: "0 20px 60px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
