"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Sparkles,
  Wand2,
  FileText,
  ImageIcon,
  Sliders,
  Play,
  ArrowRight,
  Zap,
  Palette,
} from "lucide-react";

const features = [
  { icon: Sparkles, label: "AI Design Generation" },
  { icon: FileText, label: "AI Templates" },
  { icon: Wand2, label: "AI Text Writer" },
  { icon: ImageIcon, label: "AI Image Creator" },
  { icon: Sliders, label: "Real-Time Editing" },
];

const floatingElements = [
  { icon: Palette, color: "text-primary", delay: 0, x: -120, y: -60 },
  { icon: Zap, color: "text-secondary", delay: 0.2, x: 140, y: -40 },
  { icon: Sparkles, color: "text-accent", delay: 0.4, x: -80, y: 80 },
  { icon: Wand2, color: "text-primary-light", delay: 0.6, x: 100, y: 70 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Hero() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 px-4"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-12 lg:gap-16"
      >
        <div className="flex-1 text-center lg:text-left">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              AI-Powered Design Platform
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight tracking-tight"
          >
            Create Stunning{" "}
            <span className="gradient-text">Invitations, Posters</span>
            <br />
            <span className="gradient-text">& Graphics</span> with AI
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl lg:mx-0 mx-auto leading-relaxed"
          >
            Transform your ideas into professional designs in seconds.
            No design skills needed — just describe what you want and let AI
            bring it to life.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center lg:justify-start gap-3 mt-8"
          >
            {features.map((feature) => (
              <div
                key={feature.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <feature.icon className="w-3.5 h-3.5 text-primary" />
                <span>{feature.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10"
          >
            <Link
              href="/dashboard/invitations/new"
              className={cn(
                "group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white",
                "bg-gradient-to-r from-primary via-primary-light to-primary bg-[length:200%_100%] animate-gradient",
                "hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 hover:scale-[1.02]",
                "bg-[length:200%_100%] hover:bg-right-bottom"
              )}
              style={{
                backgroundSize: "200% 100%",
                animation: "gradient-shift 3s ease infinite",
              }}
            >
              <Sparkles className="w-5 h-5" />
              Create Invitation
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold glass-strong hover:bg-white/10 transition-all duration-300 group"
            >
              <Play className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              Browse Templates
            </Link>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-sm text-muted-foreground"
          >
            No credit card required • Free forever plan available
          </motion.p>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex-1 relative w-full max-w-lg lg:max-w-none"
        >
          <div className="relative aspect-[4/3] w-full">
            <div className="absolute inset-0 rounded-2xl glass-strong overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
              <div className="p-6 sm:p-8 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-error" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <div className="ml-auto flex gap-2">
                    <div className="w-16 h-2 rounded-full bg-primary/30" />
                    <div className="w-8 h-2 rounded-full bg-muted" />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-4 flex flex-col gap-2">
                    <div className="w-full h-20 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Palette className="w-8 h-8 text-primary" />
                    </div>
                    <div className="w-3/4 h-2 rounded bg-muted" />
                    <div className="w-1/2 h-2 rounded bg-muted" />
                  </div>
                  <div className="glass rounded-xl p-4 flex flex-col gap-2">
                    <div className="w-full h-20 rounded-lg bg-gradient-to-br from-accent/20 to-error/20 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-accent" />
                    </div>
                    <div className="w-3/4 h-2 rounded bg-muted" />
                    <div className="w-1/2 h-2 rounded bg-muted" />
                  </div>
                  <div className="glass rounded-xl p-4 flex flex-col gap-2">
                    <div className="w-full h-20 rounded-lg bg-gradient-to-br from-success/20 to-primary/20 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-success" />
                    </div>
                    <div className="w-3/4 h-2 rounded bg-muted" />
                    <div className="w-1/2 h-2 rounded bg-muted" />
                  </div>
                  <div className="glass rounded-xl p-4 flex flex-col gap-2">
                    <div className="w-full h-20 rounded-lg bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                      <Wand2 className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="w-3/4 h-2 rounded bg-muted" />
                    <div className="w-1/2 h-2 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>

            {floatingElements.map((el, i) => (
              <motion.div
                key={i}
                className="absolute hidden lg:block"
                style={{ top: "50%", left: "50%" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: el.x,
                  y: el.y,
                }}
                transition={{
                  delay: 1 + el.delay,
                  duration: 0.6,
                  ease: "easeOut" as const,
                }}
              >
                <motion.div
                  className={cn(
                    "w-12 h-12 rounded-xl glass-strong flex items-center justify-center",
                    el.color
                  )}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + el.delay,
                    repeat: Infinity,
                    ease: "easeInOut" as const,
                    delay: el.delay,
                  }}
                >
                  <el.icon className="w-5 h-5" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
