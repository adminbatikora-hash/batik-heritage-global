"use client";

import { motion } from "framer-motion";
import { Heart, Users, Globe2, Award, Leaf, Palette } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Artisan First",
    description: "We ensure fair wages and sustainable livelihoods for every artisan we work with.",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Natural dyes and eco-friendly processes that honor both heritage and planet.",
  },
  {
    icon: Award,
    title: "Authentic",
    description: "Every piece comes with a certificate of authenticity and artisan story.",
  },
  {
    icon: Globe2,
    title: "Global Reach",
    description: "Connecting Indonesian artisans to customers in over 50 countries worldwide.",
  },
];

const stats = [
  { value: "200+", label: "Artisan Partners" },
  { value: "5,000+", label: "Happy Customers" },
  { value: "50+", label: "Countries Served" },
  { value: "15+", label: "Years of Heritage" },
];

export default function AboutContent() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 batik-pattern-bg opacity-10" />
        <div className="container-luxury mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-sm font-medium tracking-widest text-accent uppercase">
              Our Story
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mt-4">
              Preserving Heritage,
              <br />
              <span className="gradient-text-gold">Empowering Artisans</span>
            </h1>
            <p className="text-white/60 mt-6 max-w-2xl mx-auto text-lg">
              We bridge the gap between Indonesia's finest batik artisans and the
              global fashion-conscious community, ensuring every piece tells a story.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-luxury mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="w-32 h-32 gradient-gold rounded-3xl opacity-30" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-display font-bold">
                From the Heart of <span className="gradient-text-gold">Java</span>
              </h2>
              <p className="text-foreground/60 mt-4 leading-relaxed">
                Founded in 2009, Batikora began with a simple mission:
                to share the extraordinary beauty of Indonesian Batik with the world
                while creating sustainable income for artisan communities.
              </p>
              <p className="text-foreground/60 mt-4 leading-relaxed">
                Our journey started in Yogyakarta, the cultural heart of Java, where
                we partnered with master batik artisans whose families have been
                creating batik for generations. Today, we work with over 200 artisans
                across Java and beyond.
              </p>
              <p className="text-foreground/60 mt-4 leading-relaxed">
                Each piece in our collection is more than just fabric — it's a canvas
                of stories, traditions, and the soul of Indonesian culture, crafted
                with techniques that have been perfected over a millennium.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-accent/5">
        <div className="container-luxury mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl lg:text-4xl font-bold gradient-text-gold">
                  {stat.value}
                </p>
                <p className="text-sm text-foreground/50 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-luxury mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold">
              Our <span className="gradient-text-gold">Values</span>
            </h2>
            <p className="text-foreground/60 mt-4 max-w-2xl mx-auto">
              Everything we do is guided by our commitment to authenticity,
              sustainability, and the empowerment of artisan communities.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-solid p-6 text-center hover:shadow-luxury transition-all"
              >
                <div className="w-14 h-14 gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg">{value.title}</h3>
                <p className="text-sm text-foreground/60 mt-2">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
