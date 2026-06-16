"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Sparkles,
  Wand2,
  ImageIcon,
  Sliders,
  FileText,
  Mail,
  Megaphone,
  Captions,
  Quote,
  Shapes,
  Mountain,
  Trees,
  Package,
  Presentation,
  Eraser,
  ZoomIn,
  Paintbrush,
  Move3D,
  Smartphone,
  ArrowRight,
} from "lucide-react";

const featureCategories = [
  {
    title: "AI Design Generator",
    description: "Create stunning designs from simple text prompts",
    icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/10",
    items: [
      "Invitations",
      "Posters",
      "Flyers",
      "Banners",
      "Certificates",
      "Greeting Cards",
    ],
  },
  {
    title: "AI Content Generator",
    description: "Generate compelling copy for any occasion",
    icon: FileText,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    items: [
      "Invitation Text",
      "Event Descriptions",
      "Marketing Copy",
      "Captions",
      "Quotes",
    ],
  },
  {
    title: "AI Image Generator",
    description: "Create unique visuals powered by AI",
    icon: ImageIcon,
    color: "text-accent",
    bgColor: "bg-accent/10",
    items: [
      "Illustrations",
      "Backgrounds",
      "Decorations",
      "Product Graphics",
      "Event Graphics",
    ],
  },
  {
    title: "AI Enhancement Tools",
    description: "Polish and perfect your designs",
    icon: Wand2,
    color: "text-success",
    bgColor: "bg-success/10",
    items: [
      "Background Removal",
      "Upscaling",
      "Magic Eraser",
      "Object Replace",
      "Smart Resize",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Everything You Need
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Powerful{" "}
            <span className="gradient-text">AI Design Tools</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From generation to export, every tool is designed to help you create
            professional designs in record time.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCategories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
              className="group"
            >
              <div className="glass rounded-2xl p-6 sm:p-8 h-full hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                <div
                  className={cn(
                    "inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5",
                    category.bgColor,
                    category.color
                  )}
                >
                  <category.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {category.description}
                </p>
                <ul className="space-y-2.5">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground group-hover/item:text-foreground transition-colors"
                    >
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full flex-shrink-0",
                          category.color.replace("text", "bg")
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="text-center mt-12"
        >
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-light transition-colors font-medium group"
          >
            Explore all features
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
