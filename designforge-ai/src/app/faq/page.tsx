"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  X,
  Plus,
  Sparkles,
  ArrowRight,
  Mail,
  MessageCircle,
} from "lucide-react";

const categories = [
  "All",
  "Getting Started",
  "Features",
  "Pricing & Billing",
  "Account & Security",
  "Technical",
];

const faqs = [
  {
    category: "Getting Started",
    q: "What is DesignForge AI?",
    a: "DesignForge AI is a premium AI-powered design platform that lets you create professional invitations, posters, flyers, banners, social media graphics, and more. Simply describe what you want, and our AI generates stunning designs in seconds.",
  },
  {
    category: "Getting Started",
    q: "How does the AI design generation work?",
    a: "Just type a description of the design you want, choose your preferred style and colors, and our AI creates multiple variations instantly. You can then customize any element using our real-time editor.",
  },
  {
    category: "Getting Started",
    q: "Is there a free plan available?",
    a: "Yes! We offer a free plan that includes 5 AI generations per day, access to limited templates, and basic export options. It's perfect for trying out the platform with no commitment required.",
  },
  {
    category: "Getting Started",
    q: "Do I need design experience to use DesignForge AI?",
    a: "Not at all! DesignForge AI is designed for everyone, from beginners to professional designers. Our AI handles the heavy lifting, and our intuitive editor makes customization a breeze.",
  },
  {
    category: "Getting Started",
    q: "How do I create my first design?",
    a: "Simply sign up for a free account, click 'Create New Design', describe what you want, and our AI will generate stunning options for you. You can also start from one of our 10,000+ templates.",
  },
  {
    category: "Features",
    q: "Can I use my own images in designs?",
    a: "Absolutely! You can upload your own images and use them in any design. Our AI enhancement tools can also remove backgrounds, upscale, and edit your images seamlessly.",
  },
  {
    category: "Features",
    q: "What file formats can I export?",
    a: "We support PNG, JPG, PDF, and Print Ready PDF formats. Pro and Business users get access to HD exports with higher resolution and print-quality outputs.",
  },
  {
    category: "Features",
    q: "Are the designs copyright-free?",
    a: "Yes, all designs created using DesignForge AI are yours to use commercially. You retain full rights to any designs you create on our platform.",
  },
  {
    category: "Features",
    q: "Can I collaborate with my team?",
    a: "Yes! Our Business plan includes team collaboration features, shared workspaces, and brand kits. Team members can work together on designs in real-time.",
  },
  {
    category: "Features",
    q: "What templates are available?",
    a: "We offer over 10,000 professionally designed templates across categories including invitations, posters, social media graphics, flyers, banners, certificates, and greeting cards for every occasion.",
  },
  {
    category: "Features",
    q: "Does DesignForge AI have AI image generation?",
    a: "Yes! Our AI image generator creates unique illustrations, backgrounds, and graphics based on your text descriptions. Available on Pro and Business plans.",
  },
  {
    category: "Features",
    q: "Can I remove backgrounds from images?",
    a: "Yes! Our AI background remover tool lets you remove, replace, or edit image backgrounds with a single click.",
  },
  {
    category: "Pricing & Billing",
    q: "How does billing work?",
    a: "We offer monthly and yearly billing options. Yearly plans save you 17% compared to monthly billing. You can upgrade, downgrade, or cancel your subscription at any time.",
  },
  {
    category: "Pricing & Billing",
    q: "Can I get a refund?",
    a: "Yes! We offer a 14-day money-back guarantee on all paid plans. If you're not satisfied, contact our support team for a full refund.",
  },
  {
    category: "Pricing & Billing",
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual Business plans.",
  },
  {
    category: "Pricing & Billing",
    q: "Can I switch plans mid-cycle?",
    a: "Yes! You can upgrade at any time and the new features will be available immediately. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    category: "Account & Security",
    q: "How do I reset my password?",
    a: "Click 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. You can also update your password in account settings.",
  },
  {
    category: "Account & Security",
    q: "Is my data secure?",
    a: "Absolutely. We use industry-standard encryption, secure servers, and follow best practices for data protection. Your designs and personal information are always safe with us.",
  },
  {
    category: "Technical",
    q: "What AI models power the platform?",
    a: "We use state-of-the-art AI models including GPT-4o for design generation, DALL-E 3 for image creation, and specialized models for enhancement tasks, ensuring the highest quality outputs.",
  },
  {
    category: "Technical",
    q: "Is there a mobile app?",
    a: "DesignForge AI is fully responsive and works great on mobile browsers. We're also developing native iOS and Android apps — stay tuned!",
  },
  {
    category: "Technical",
    q: "What browsers are supported?",
    a: "We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Chrome or Firefox.",
  },
  {
    category: "Technical",
    q: "How do I contact support?",
    a: "You can reach us via live chat on our website, email us at support@designforge.ai, or fill out the contact form. Pro and Business users get priority support with faster response times.",
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

export default function FAQPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs = faqs.filter(
    (faq) =>
      (activeCategory === "All" || faq.category === activeCategory) &&
      (faq.q.toLowerCase().includes(search.toLowerCase()) ||
        faq.a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="min-h-screen pt-24 pb-16">
      <section ref={ref} className="px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">FAQ</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold">
              Got <span className="gradient-text">Questions?</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about DesignForge AI.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(null);
              }}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl glass-strong text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(null);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  activeCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
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
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground mb-1 block">
                      {faq.category}
                    </span>
                    <span className="text-sm font-medium leading-relaxed">{faq.q}</span>
                  </div>
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
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No questions found</h3>
                <p className="text-muted-foreground mb-2">
                  No results for &ldquo;{search}&rdquo;
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                  className="text-primary hover:text-primary-light text-sm transition-colors"
                >
                  Clear search
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 glass rounded-2xl p-8 sm:p-10 text-center"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Email Support</p>
                  <a
                    href="mailto:support@designforge.ai"
                    className="text-sm text-primary hover:text-primary-light transition-colors"
                  >
                    support@designforge.ai
                  </a>
                </div>
              </div>
              <div className="hidden sm:block w-px h-12 bg-border" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
