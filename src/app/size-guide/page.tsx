import { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Ruler, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Size Guide | Batikora",
  description:
    "Find your perfect fit with our comprehensive size guide for men and women batik clothing.",
};

const menSizes = [
  { size: "XS", chest: "32-34", waist: "26-28", hip: "33-35", shoulder: "16" },
  { size: "S", chest: "34-36", waist: "28-30", hip: "35-37", shoulder: "17" },
  { size: "M", chest: "36-38", waist: "30-32", hip: "37-39", shoulder: "18" },
  { size: "L", chest: "38-40", waist: "32-34", hip: "39-41", shoulder: "19" },
  { size: "XL", chest: "40-42", waist: "34-36", hip: "41-43", shoulder: "20" },
  { size: "XXL", chest: "42-44", waist: "36-38", hip: "43-45", shoulder: "21" },
];

const womenSizes = [
  { size: "XS", chest: "30-32", waist: "24-26", hip: "33-35", shoulder: "14" },
  { size: "S", chest: "32-34", waist: "26-28", hip: "35-37", shoulder: "15" },
  { size: "M", chest: "34-36", waist: "28-30", hip: "37-39", shoulder: "15.5" },
  { size: "L", chest: "36-38", waist: "30-32", hip: "39-41", shoulder: "16" },
  { size: "XL", chest: "38-40", waist: "32-34", hip: "41-43", shoulder: "16.5" },
  { size: "XXL", chest: "40-42", waist: "34-36", hip: "43-45", shoulder: "17" },
];

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/80 text-white py-16 mb-12">
          <div className="container mx-auto px-4 text-center">
            <Ruler className="w-12 h-12 mx-auto mb-4 text-accent" />
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              Size Guide
            </h1>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto text-lg">
              Find your perfect fit. All measurements are in inches.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
          {/* Men's Sizes */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Men&apos;s Sizes</h2>
            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Size</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Chest (in)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Waist (in)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Hip (in)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {menSizes.map((s) => (
                    <tr key={s.size} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-secondary">{s.size}</td>
                      <td className="px-6 py-4 text-sm">{s.chest}</td>
                      <td className="px-6 py-4 text-sm">{s.waist}</td>
                      <td className="px-6 py-4 text-sm">{s.hip}</td>
                      <td className="px-6 py-4 text-sm">{s.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Women's Sizes */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Women&apos;s Sizes</h2>
            <div className="overflow-hidden rounded-2xl border">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Size</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Bust (in)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Waist (in)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Hip (in)</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {womenSizes.map((s) => (
                    <tr key={s.size} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-secondary">{s.size}</td>
                      <td className="px-6 py-4 text-sm">{s.chest}</td>
                      <td className="px-6 py-4 text-sm">{s.waist}</td>
                      <td className="px-6 py-4 text-sm">{s.hip}</td>
                      <td className="px-6 py-4 text-sm">{s.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* How to Measure */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">How to Measure</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border rounded-2xl">
                <h3 className="font-semibold mb-3">Chest / Bust</h3>
                <p className="text-sm text-foreground/60">
                  Measure around the fullest part of your chest/bust, keeping the tape level and snug but not tight.
                </p>
              </div>
              <div className="p-6 border rounded-2xl">
                <h3 className="font-semibold mb-3">Waist</h3>
                <p className="text-sm text-foreground/60">
                  Measure around your natural waistline (the narrowest part of your torso), keeping the tape comfortably loose.
                </p>
              </div>
              <div className="p-6 border rounded-2xl">
                <h3 className="font-semibold mb-3">Hip</h3>
                <p className="text-sm text-foreground/60">
                  Measure around the fullest part of your hips, approximately 8 inches below your waist.
                </p>
              </div>
              <div className="p-6 border rounded-2xl">
                <h3 className="font-semibold mb-3">Shoulder</h3>
                <p className="text-sm text-foreground/60">
                  Measure from the edge of one shoulder to the other, across the back.
                </p>
              </div>
            </div>
          </section>

          {/* Tips */}
          <section className="p-8 bg-accent/5 border border-accent/20 rounded-2xl">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold">Fit Tips</h3>
                <ul className="mt-3 space-y-2 text-sm text-foreground/70">
                  <li>• Our batik clothing tends to have a relaxed, comfortable fit.</li>
                  <li>• If you&apos;re between sizes, we recommend choosing your usual size.</li>
                  <li>• For a more fitted look, consider sizing down.</li>
                  <li>• Custom sizing is available for most products — contact us for details.</li>
                  <li>• Free exchanges available if the size doesn&apos;t work out.</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
