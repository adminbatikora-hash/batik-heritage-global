"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2 } from "lucide-react";
import { useLanguageStore, Language } from "@/store/useLanguageStore";

const languages: { code: Language; name: string; flag: string }[] = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-foreground/70 hover:text-secondary transition-colors"
        aria-label="Switch language"
      >
        <Globe2 className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-44 glass-card-solid p-2 shadow-luxury rounded-xl z-50"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    language === lang.code
                      ? "bg-accent/10 text-secondary font-medium"
                      : "text-foreground/70 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.name}</span>
                  {language === lang.code && (
                    <span className="ml-auto w-2 h-2 bg-accent rounded-full" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
