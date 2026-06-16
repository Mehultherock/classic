"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Type,
  Sparkles,
  Check,
  Loader2,
  RefreshCw,
  LetterText,
} from "lucide-react";

const designStyles = [
  "Modern",
  "Classic",
  "Playful",
  "Elegant",
  "Minimal",
  "Bold",
  "Luxury",
] as const;

const purposes = [
  { id: "heading", label: "Heading" },
  { id: "body", label: "Body" },
  { id: "display", label: "Display" },
  { id: "accent", label: "Accent" },
] as const;

interface FontPairing {
  id: string;
  heading: { name: string; fallback: string };
  body: { name: string; fallback: string };
  style: string;
  sample: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const pairingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function AIFontAssistant() {
  const [selectedStyle, setSelectedStyle] = useState<string>("Modern");
  const [purpose, setPurpose] = useState<string>("heading");
  const [isGenerating, setIsGenerating] = useState(false);
  const [pairings, setPairings] = useState<FontPairing[]>([]);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 2000));

    const samplePairings: FontPairing[] = [
      {
        id: "font_1",
        heading: { name: "Playfair Display", fallback: "serif" },
        body: { name: "Inter", fallback: "sans-serif" },
        style: "Elegant",
        sample: "The quick brown fox jumps over the lazy dog",
      },
      {
        id: "font_2",
        heading: { name: "Space Grotesk", fallback: "sans-serif" },
        body: { name: "DM Sans", fallback: "sans-serif" },
        style: "Modern",
        sample: "The quick brown fox jumps over the lazy dog",
      },
      {
        id: "font_3",
        heading: { name: "Fraunces", fallback: "serif" },
        body: { name: "Source Sans Pro", fallback: "sans-serif" },
        style: "Classic",
        sample: "The quick brown fox jumps over the lazy dog",
      },
    ];

    setPairings(samplePairings);
    setIsGenerating(false);
  }, [selectedStyle, purpose]);

  const handleApplyFonts = useCallback((id: string) => {
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 2000);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
          <Type className="w-4 h-4 text-secondary" />
          <span className="text-sm text-muted-foreground">AI Font Assistant</span>
        </div>
        <h2 className="text-3xl font-display font-bold">
          Perfect <span className="gradient-text">Font Pairings</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Discover harmonious font combinations for your designs.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Design Style</label>
          <div className="flex flex-wrap gap-2">
            {designStyles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  selectedStyle === style
                    ? "bg-secondary text-white shadow-lg shadow-secondary/25"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Purpose</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {purposes.map((p) => (
              <button
                key={p.id}
                onClick={() => setPurpose(p.id)}
                className={cn(
                  "px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200",
                  purpose === p.id
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-secondary/50 bg-surface"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-secondary to-primary text-white font-semibold shadow-lg shadow-secondary/25 hover:shadow-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Pairings...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Font Pairings
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {pairings.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recommended Pairings</h3>
              <span className="text-xs text-muted-foreground">
                Based on {selectedStyle} style
              </span>
            </div>
            {pairings.map((pairing) => (
              <motion.div
                key={pairing.id}
                variants={pairingVariants}
                layout
                className="glass rounded-2xl p-6 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Heading
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                          {pairing.style}
                        </span>
                      </div>
                      <p className="text-xl font-bold" style={{ fontFamily: pairing.heading.name }}>
                        {pairing.heading.name}
                      </p>
                      <p
                        className="text-lg mt-1"
                        style={{ fontFamily: pairing.heading.name }}
                      >
                        {pairing.sample}
                      </p>
                    </div>

                    <div className="w-full h-px bg-border" />

                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">
                        Body
                      </p>
                      <p className="text-base font-medium" style={{ fontFamily: pairing.body.name }}>
                        {pairing.body.name}
                      </p>
                      <p
                        className="text-sm mt-1 leading-relaxed text-muted-foreground"
                        style={{ fontFamily: pairing.body.name }}
                      >
                        {pairing.sample}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => handleApplyFonts(pairing.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      appliedId === pairing.id
                        ? "bg-success/20 text-success"
                        : "bg-primary text-white hover:bg-primary-dark"
                    )}
                  >
                    {appliedId === pairing.id ? (
                      <>
                        <Check className="w-4 h-4" /> Applied
                      </>
                    ) : (
                      <>
                        <LetterText className="w-4 h-4" /> Apply Fonts
                      </>
                    )}
                  </button>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {pairing.heading.fallback} + {pairing.body.fallback}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
