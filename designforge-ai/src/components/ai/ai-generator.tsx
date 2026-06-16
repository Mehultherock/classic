"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Palette,
  Wand2,
  RefreshCw,
  Download,
  Check,
  X,
  ImageIcon,
  Loader2,
  ChevronRight,
} from "lucide-react";

const designStyles = [
  "Modern",
  "Classic",
  "Minimal",
  "Vintage",
  "Luxury",
  "Playful",
  "Elegant",
  "Bold",
] as const;

const colorPalettes = [
  { name: "Ocean Blue", colors: ["#0ea5e9", "#0284c7", "#38bdf8", "#7dd3fc", "#e0f2fe"] },
  { name: "Royal Purple", colors: ["#8b5cf6", "#7c3aed", "#a78bfa", "#c4b5fd", "#ede9fe"] },
  { name: "Forest Green", colors: ["#22c55e", "#16a34a", "#4ade80", "#86efac", "#dcfce7"] },
  { name: "Sunset Orange", colors: ["#f97316", "#ea580c", "#fb923c", "#fdba74", "#ffedd5"] },
  { name: "Rose Pink", colors: ["#ec4899", "#db2777", "#f472b6", "#f9a8d4", "#fce7f3"] },
  { name: "Midnight", colors: ["#1e293b", "#334155", "#475569", "#64748b", "#94a3b8"] },
  { name: "Warm Earth", colors: ["#d97706", "#b45309", "#f59e0b", "#fbbf24", "#fef3c7"] },
  { name: "Custom", colors: ["#6366f1", "#06b6d4", "#f59e0b", "#ef4444", "#22c55e"] },
];

interface GeneratedDesign {
  id: string;
  imageUrl: string;
  style: string;
  palette: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function AIGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("Modern");
  const [selectedPalette, setSelectedPalette] = useState<string>("Ocean Blue");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedDesign[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 2500));

    const newResults: GeneratedDesign[] = Array.from({ length: 4 }, (_, i) => ({
      id: `gen_${Date.now()}_${i}`,
      imageUrl: `/api/placeholder/400/500?text=Design+${i + 1}`,
      style: selectedStyle,
      palette: selectedPalette,
    }));

    setResults(newResults);
    setIsGenerating(false);
  }, [prompt, selectedStyle, selectedPalette]);

  const handleUseDesign = useCallback((id: string) => {
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI Design Generator</span>
        </div>
        <h2 className="text-3xl font-display font-bold">
          Generate Designs with <span className="gradient-text">AI</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Describe your vision and let AI create stunning designs for any occasion.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your design..."
            rows={3}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all duration-200"
          />
          <Wand2 className="absolute right-4 top-4 w-5 h-5 text-muted-foreground/40" />
        </div>

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
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Color Palette</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {colorPalettes.map((palette) => (
              <button
                key={palette.name}
                onClick={() => setSelectedPalette(palette.name)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200",
                  selectedPalette === palette.name
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50 bg-surface"
                )}
              >
                <div className="flex -space-x-1">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs font-medium text-foreground">{palette.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Designs
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {results.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid sm:grid-cols-2 gap-6"
          >
            {results.map((design) => (
              <motion.div
                key={design.id}
                variants={itemVariants}
                layout
                className="glass rounded-2xl overflow-hidden group relative"
                onMouseEnter={() => setHoveredId(design.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="aspect-[4/5] bg-surface relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                    <ImageIcon className="w-16 h-16" />
                  </div>

                  <AnimatePresence>
                    {hoveredId === design.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3"
                      >
                        <button
                          onClick={() => handleUseDesign(design.id)}
                          className="px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                        >
                          {copiedId === design.id ? (
                            <>
                              <Check className="w-4 h-4" /> Added
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" /> Use This Design
                            </>
                          )}
                        </button>
                        <button className="p-2.5 rounded-lg glass text-white hover:bg-white/10 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{design.style}</p>
                    <p className="text-xs text-muted-foreground">{design.palette}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
