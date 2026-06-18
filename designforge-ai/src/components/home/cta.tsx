"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
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

export default function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-4xl mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="relative glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

          <div className="relative">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
            >
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Get Started Free
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold leading-tight"
            >
              Ready to Create{" "}
              <span className="gradient-text">Something Amazing?</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Join 50,000+ creators who are already designing stunning graphics
              with AI. Start for free — no credit card required.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
            >
              <Link
                href="/dashboard/invitations/new"
                className={cn(
                  "group relative inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-semibold text-white",
                  "bg-gradient-to-r from-primary via-primary-light to-primary",
                  "hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all duration-300 hover:scale-[1.02]"
                )}
              >
                <Sparkles className="w-5 h-5" />
                Create Your Invitation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/templates"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold glass hover:bg-white/10 transition-all duration-300"
              >
                Browse Templates
              </Link>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-sm text-muted-foreground"
            >
              Free plan includes 5 AI generations per day • No credit card
              required • Cancel anytime
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
