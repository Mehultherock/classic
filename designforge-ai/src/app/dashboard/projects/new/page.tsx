"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TemplatePreview, { getTemplateStyle } from "@/components/template-preview";
import { CANVAS_SIZES } from "@/lib/constants";
import {
  Sparkles,
  Palette,
  ImagePlus,
  ArrowRight,
  FileText,
  Image,
  Presentation,
  Award,
  Mail,
  Ruler,
  ChevronLeft,
  Search,
  LayoutTemplate,
  Zap,
} from "lucide-react";

const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const YoutubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>;
const TwitterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const LinkedinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;

const canvasOptions = Object.entries(CANVAS_SIZES).map(([key, val]) => ({
  key,
  ...val,
}));

const canvasIcons: Record<string, React.ElementType> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  twitter: TwitterIcon,
  linkedin: LinkedinIcon,
  poster: FileText,
  flyer: FileText,
  banner: Presentation,
  invitation: Mail,
  certificate: Award,
  custom: Ruler,
};

const sampleTemplates = [
  { id: "t1", title: "Elegant Wedding", category: "invitation", color: "from-pink-500 to-rose-500" },
  { id: "t2", title: "Modern Birthday", category: "invitation", color: "from-purple-500 to-indigo-500" },
  { id: "t3", title: "Corporate Flyer", category: "flyer", color: "from-blue-500 to-cyan-500" },
  { id: "t4", title: "Sale Banner", category: "banner", color: "from-orange-500 to-red-500" },
  { id: "t5", title: "Tech Conference", category: "poster", color: "from-primary to-secondary" },
  { id: "t6", title: "Graduation Cert", category: "certificate", color: "from-green-500 to-emerald-500" },
  { id: "t7", title: "Restaurant Menu", category: "flyer", color: "from-amber-500 to-yellow-500" },
  { id: "t8", title: "Album Cover Art", category: "poster", color: "from-purple-500 to-pink-500" },
  { id: "t9", title: "Travel Brochure", category: "flyer", color: "from-sky-500 to-blue-500" },
  { id: "t10", title: "Fitness Challenge", category: "poster", color: "from-lime-500 to-green-500" },
  { id: "t11", title: "Real Estate Flyer", category: "flyer", color: "from-blue-500 to-cyan-500" },
  { id: "t12", title: "Fashion Lookbook", category: "poster", color: "from-fuchsia-500 to-pink-500" },
].map((t) => ({ ...t, style: getTemplateStyle(t.category) }));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function NewProjectPage() {
  const [selectedSize, setSelectedSize] = useState(canvasOptions[0]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [searchTemplate, setSearchTemplate] = useState("");
  const [generating, setGenerating] = useState(false);

  const filteredTemplates = sampleTemplates.filter((t) =>
    t.title.toLowerCase().includes(searchTemplate.toLowerCase())
  );

  const handleGenerate = () => {
    if (!aiPrompt.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      window.location.href = `/editor/new`;
    }, 2000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-8"
    >
      <motion.div variants={itemVariants}>
        <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Create New Project</h1>
        <p className="text-muted-foreground mt-1">Choose a canvas size, pick a template, or generate with AI.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">1. Choose Canvas Size</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {canvasOptions.map((opt) => {
                const Icon = canvasIcons[opt.key] || Ruler;
                const isSelected = selectedSize.key === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setSelectedSize(opt)}
                    className={cn(
                      "relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                        : "border-border bg-card hover:border-primary/30 hover:bg-card/80"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-xs font-medium text-center leading-tight", isSelected ? "text-primary" : "text-muted-foreground")}>
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {opt.width} x {opt.height}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">2. Pick a Template</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchTemplate}
                  onChange={(e) => setSearchTemplate(e.target.value)}
                  className="w-48 h-9 pl-9 pr-3 rounded-lg bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredTemplates.map((t) => (
                <Link key={t.id} href={`/editor/new?template=${t.id}&size=${selectedSize.key}`}>
                  <div className={cn("rounded-xl border border-border overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer")}>
                    <div className="aspect-[4/3]">
                      <TemplatePreview style={t.style} />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-foreground truncate">{t.title}</h3>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">{t.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-2">
              <Link href={`/editor/new?size=${selectedSize.key}`}>
                <Button variant="secondary" size="sm">
                  <Palette className="w-4 h-4 mr-1.5" />
                  Start from Scratch
                </Button>
              </Link>
              <Link href="/dashboard/templates" className="text-sm text-primary hover:underline">
                Browse all templates
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              Generate with AI
            </h2>
            <p className="text-sm text-muted-foreground">
              Describe what you want to create, and our AI will design it for you instantly.
            </p>
            <div className="space-y-3">
              <textarea
                placeholder="e.g., A modern wedding invitation with gold accents and floral patterns..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
                className="w-full rounded-xl bg-card border border-border p-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  <Zap className="w-3 h-3 inline mr-1" />
                  {selectedSize.label} &middot; {selectedSize.width}x{selectedSize.height}
                </span>
                <Button
                  variant="gradient"
                  onClick={handleGenerate}
                  loading={generating}
                  disabled={!aiPrompt.trim()}
                >
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Generate
                </Button>
              </div>
            </div>
            <div className="pt-3 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Try these prompts:</p>
              <div className="flex flex-wrap gap-2">
                {["Minimalist wedding invite", "Vibrant birthday poster", "Corporate banner"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setAiPrompt(p)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6">
            <h3 className="text-sm font-semibold text-foreground mb-2">Canvas Preview</h3>
            <div
              className="w-full rounded-xl bg-card border border-border/50 flex items-center justify-center overflow-hidden"
              style={{ aspectRatio: `${selectedSize.width}/${selectedSize.height}`, maxHeight: 200 }}
            >
              <div className="text-center">
                <ImagePlus className="w-8 h-8 text-muted-foreground/40 mx-auto mb-1" />
                <p className="text-xs text-muted-foreground/60">
                  {selectedSize.width} x {selectedSize.height}px
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
