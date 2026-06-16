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
  HelpCircle,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
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
      { text: "Team collaboration", included: false },
      { text: "Priority support", included: false },
      { text: "Brand kit", included: false },
    ],
  },
  {
    name: "Pro",
    description: "For professionals and creators",
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
      { text: "API access", included: true },
      { text: "Custom fonts", included: true },
      { text: "Advanced export options", included: true },
    ],
  },
  {
    name: "Business",
    description: "For teams and organizations",
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
      { text: "API access", included: true },
      { text: "Custom fonts", included: true },
      { text: "Advanced export options", included: true },
    ],
  },
];

const comparisonFeatures = [
  { label: "AI Generations", free: "5/day", pro: "Unlimited", business: "Unlimited" },
  { label: "Watermark", free: "Yes", pro: "No", business: "No" },
  { label: "HD Exports", free: "No", pro: "Yes", business: "Yes" },
  { label: "Premium Templates", free: "No", pro: "Yes", business: "Yes" },
  { label: "AI Image Generation", free: "No", pro: "Yes", business: "Yes" },
  { label: "Team Collaboration", free: "No", pro: "No", business: "Yes" },
  { label: "Brand Kit", free: "No", pro: "No", business: "Yes" },
  { label: "Priority Support", free: "No", pro: "Yes", business: "Yes" },
  { label: "API Access", free: "No", pro: "Yes", business: "Yes" },
  { label: "Custom Fonts", free: "No", pro: "Yes", business: "Yes" },
];

const faqs = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect at the start of the next billing cycle.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes, we offer a 14-day free trial of our Pro plan. No credit card required to start your trial.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards, PayPal, and bank transfers (for annual Business plans).",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team for a full refund.",
  },
  {
    q: "What happens if I exceed my plan limits?",
    a: "Free users can upgrade to Pro or Business for unlimited access. Paid plans have no generation limits.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <main className="min-h-screen pt-24 pb-16">
      <section ref={ref} className="px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Simple Pricing</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold">
              Choose Your <span className="gradient-text">Plan</span>
            </h1>
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
                className="relative w-12 h-6 rounded-full transition-colors"
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

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-20">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                className={cn("relative group", plan.popular && "lg:-mt-4 lg:mb-4")}
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
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold font-display">
                          ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        {plan.monthlyPrice > 0 && (
                          <span className="text-muted-foreground text-sm">/mo</span>
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
                      <div key={feature.text} className="flex items-center gap-3 text-sm">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-success flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            feature.included ? "text-foreground" : "text-muted-foreground/50"
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

          <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-20">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-10">
              Compare <span className="gradient-text">Features</span>
            </h2>
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 sm:p-5 font-semibold text-foreground">Feature</th>
                      <th className="p-4 sm:p-5 font-semibold text-center text-foreground">Free</th>
                      <th className="p-4 sm:p-5 font-semibold text-center text-primary">Pro</th>
                      <th className="p-4 sm:p-5 font-semibold text-center text-foreground">Business</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((feature, i) => (
                      <tr key={feature.label} className={cn("border-b border-border/50", i % 2 === 0 && "bg-card/30")}>
                        <td className="p-4 sm:p-5 text-muted-foreground">{feature.label}</td>
                        <td className="p-4 sm:p-5 text-center text-muted-foreground">{feature.free}</td>
                        <td className="p-4 sm:p-5 text-center font-medium text-foreground">{feature.pro}</td>
                        <td className="p-4 sm:p-5 text-center font-medium text-foreground">{feature.business}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="max-w-3xl mx-auto mb-20">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-center mb-10">
              Pricing <span className="gradient-text">FAQ</span>
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={cn(
                    "glass rounded-xl overflow-hidden transition-all duration-300",
                    openFaq === i && "glass-strong"
                  )}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <span className="text-sm font-medium leading-relaxed">{faq.q}</span>
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                        openFaq === i ? "bg-primary/20 text-primary rotate-45" : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="w-full h-px bg-border mb-4" />
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative glass-strong rounded-3xl p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-display font-bold">
                Ready to Get <span className="gradient-text">Started?</span>
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Join 50,000+ creators. Start for free, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-primary via-primary-light to-primary hover:shadow-[0_0_40px_rgba(99,102,241,0.6)] transition-all duration-300 hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5" />
                  Start Designing Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold glass hover:bg-white/10 transition-all duration-300"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
