"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Plus, X, Search, HelpCircle, Sparkles } from "lucide-react";

const faqs = [
  {
    q: "What is DesignForge AI?",
    a: "DesignForge AI is a premium AI-powered design platform that lets you create professional invitations, posters, flyers, banners, social media graphics, and more. Simply describe what you want, and our AI generates stunning designs in seconds.",
  },
  {
    q: "How does the AI design generation work?",
    a: "Just type a description of the design you want, choose your preferred style and colors, and our AI creates multiple variations instantly. You can then customize any element using our real-time editor.",
  },
  {
    q: "Is there a free plan available?",
    a: "Yes! We offer a free plan that includes 5 AI generations per day, access to limited templates, and basic export options. It's perfect for trying out the platform with no commitment required.",
  },
  {
    q: "Can I use my own images in designs?",
    a: "Absolutely! You can upload your own images and use them in any design. Our AI enhancement tools can also remove backgrounds, upscale, and edit your images seamlessly.",
  },
  {
    q: "What file formats can I export?",
    a: "We support PNG, JPG, PDF, and Print Ready PDF formats. Pro and Business users get access to HD exports with higher resolution and print-quality outputs.",
  },
  {
    q: "Are the designs copyright-free?",
    a: "Yes, all designs created using DesignForge AI are yours to use commercially. You retain full rights to any designs you create on our platform.",
  },
  {
    q: "Can I collaborate with my team?",
    a: "Yes! Our Business plan includes team collaboration features, shared workspaces, and brand kits. Team members can work together on designs in real-time.",
  },
  {
    q: "What templates are available?",
    a: "We offer over 10,000 professionally designed templates across categories including invitations, posters, social media graphics, flyers, banners, certificates, and greeting cards for every occasion.",
  },
  {
    q: "Is there a mobile app?",
    a: "DesignForge AI is fully responsive and works great on mobile browsers. We're also developing native iOS and Android apps — stay tuned!",
  },
  {
    q: "How does billing work?",
    a: "We offer monthly and yearly billing options. Yearly plans save you 17% compared to monthly billing. You can upgrade, downgrade, or cancel your subscription at any time.",
  },
  {
    q: "Can I get a refund?",
    a: "Yes! We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team for a full refund.",
  },
  {
    q: "What AI models power the platform?",
    a: "We use state-of-the-art AI models including GPT-4o for design generation, DALL-E 3 for image creation, and specialized models for enhancement tasks, ensuring the highest quality outputs.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function FAQ() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-3xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <HelpCircle className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Got <span className="gradient-text">Questions?</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about DesignForge AI.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenIndex(null);
            }}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-strong text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          {filteredFaqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                "glass rounded-xl overflow-hidden transition-all duration-300",
                openIndex === i && "glass-strong"
              )}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className="text-sm font-medium leading-relaxed">
                  {faq.q}
                </span>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                    openIndex === i
                      ? "bg-primary/20 text-primary rotate-45"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Plus className="w-4 h-4" />
                </div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" as const }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0">
                      <div className="w-full h-px bg-border mb-4" />
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">
                No questions found for &ldquo;{search}&rdquo;
              </p>
              <button
                onClick={() => setSearch("")}
                className="text-primary hover:text-primary-light text-sm mt-2 transition-colors"
              >
                Clear search
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center mt-12 glass rounded-2xl p-8"
        >
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Still have questions?</p>
          <p className="text-sm text-muted-foreground mb-6">
            Our support team is here to help.
          </p>
          <a
            href="mailto:support@designforge.ai"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold glass-strong hover:bg-white/10 transition-all duration-300"
          >
            Contact Support
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
