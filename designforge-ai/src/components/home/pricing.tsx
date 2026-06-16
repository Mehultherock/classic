"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Sparkles,
  Check,
  X,
  Zap,
  Building2,
  Crown,
  ArrowRight,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    icon: Sparkles,
    monthlyPrice: 0,
    yearlyPrice: 0,
    popular: false,
    cta: "Get Started",
    href: "/signup",
    features: [
      { text: "5 AI generations/day", included: true },
      { text: "Watermarked downloads", included: true },
      { text: "Limited templates", included: true },
      { text: "Basic export formats", included: true },
      { text: "HD exports", included: false },
      { text: "Premium templates", included: false },
      { text: "AI image generation", included: false },
      { text: "No watermark", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For professionals and creators",
    icon: Crown,
    monthlyPrice: 19,
    yearlyPrice: 190,
    popular: true,
    cta: "Start Pro Trial",
    href: "/signup?plan=pro",
    features: [
      { text: "Unlimited AI generations", included: true },
      { text: "HD exports", included: true },
      { text: "Premium templates", included: true },
      { text: "AI image generation", included: true },
      { text: "No watermark", included: true },
      { text: "Priority support", included: true },
      { text: "Team collaboration", included: false },
      { text: "Brand kit", included: false },
    ],
  },
  {
    name: "Business",
    description: "For teams and organizations",
    icon: Building2,
    monthlyPrice: 49,
    yearlyPrice: 490,
    popular: false,
    cta: "Contact Sales",
    href: "/signup?plan=business",
    features: [
      { text: "Unlimited AI generations", included: true },
      { text: "HD exports", included: true },
      { text: "Premium templates", included: true },
      { text: "AI image generation", included: true },
      { text: "No watermark", included: true },
      { text: "Priority support", included: true },
      { text: "Team collaboration", included: true },
      { text: "Brand kit", included: true },
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

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
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
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Simple Pricing
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Choose Your <span className="gradient-text">Plan</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Start for free, upgrade when you need more power.
          </p>

          <div className="inline-flex items-center gap-3 mt-8 p-1 rounded-xl glass">
            <span
              className={cn(
                "text-sm px-4 py-2 rounded-lg transition-all",
                !yearly ? "bg-primary text-white" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <button
              onClick={() => setYearly(!yearly)}
              className={cn(
                "relative w-12 h-6 rounded-full transition-colors",
                yearly ? "bg-primary" : "bg-muted"
              )}
            >
              <div
                className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                  yearly ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
            <span
              className={cn(
                "text-sm px-4 py-2 rounded-lg transition-all",
                yearly ? "bg-primary text-white" : "text-muted-foreground"
              )}
            >
              Yearly
              <span className="ml-1.5 text-xs text-accent font-semibold">
                Save 17%
              </span>
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={itemVariants}
              className={cn(
                "relative group",
                plan.popular && "lg:-mt-4 lg:mb-4"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold shadow-lg shadow-primary/25">
                    <Crown className="w-3.5 h-3.5" />
                    Most Popular
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "glass rounded-2xl p-6 sm:p-8 h-full flex flex-col relative overflow-hidden",
                  "hover:-translate-y-2 transition-all duration-300",
                  plan.popular && "glass-strong ring-1 ring-primary/30"
                )}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
                )}

                <div className="relative">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary mb-4">
                    <plan.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    {plan.description}
                  </p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold font-display">
                        ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      {plan.monthlyPrice > 0 && (
                        <span className="text-muted-foreground text-sm">
                          /mo
                        </span>
                      )}
                    </div>
                    {yearly && plan.yearlyPrice > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ${plan.monthlyPrice}/mo billed annually
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3 mb-8 flex-1 relative">
                  {plan.features.map((feature) => (
                    <div
                      key={feature.text}
                      className="flex items-center gap-3 text-sm"
                    >
                      {feature.included ? (
                        <Check className="w-4 h-4 text-success flex-shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          feature.included
                            ? "text-foreground"
                            : "text-muted-foreground/50"
                        )}
                      >
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                <Link
                  href={plan.href}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group/btn relative overflow-hidden",
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02]"
                      : "glass-strong hover:bg-white/10"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
