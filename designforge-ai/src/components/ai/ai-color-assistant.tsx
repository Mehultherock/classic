"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Palette,
  Sparkles,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Paintbrush,
} from "lucide-react";

interface ColorPalette {
  id: string;
  name: string;
  colors: { hex: string; name: string }[];
  harmony: string;
  mood: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const paletteVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function AIColorAssistant() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 2000));

    const samplePalettes: ColorPalette[] = [
      {
        id: "pal_1",
        name: "Sunset Serenity",
        colors: [
          { hex: "#FF6B6B", name: "Coral" },
          { hex: "#FFE66D", name: "Sunny" },
          { hex: "#4ECDC4", name: "Teal" },
          { hex: "#292F36", name: "Charcoal" },
          { hex: "#F7FFF7", name: "Off White" },
        ],
        harmony: "Complementary with warm accent",
        mood: "Warm, energetic, and calming",
      },
      {
        id: "pal_2",
        name: "Ocean Dream",
        colors: [
          { hex: "#0A2463", name: "Deep Blue" },
          { hex: "#3E92CC", name: "Sky Blue" },
          { hex: "#7FD1B9", name: "Mint" },
          { hex: "#E8F1F5", name: "Ice" },
          { hex: "#1E1B18", name: "Dark" },
        ],
        harmony: "Analogous blue scheme",
        mood: "Calm, professional, and trustworthy",
      },
      {
        id: "pal_3",
        name: "Forest Earth",
        colors: [
          { hex: "#2D6A4F", name: "Forest" },
          { hex: "#52B788", name: "Leaf" },
          { hex: "#95D5B2", name: "Sage" },
          { hex: "#D8F3DC", name: "Pale Mint" },
          { hex: "#B5838D", name: "Rose" },
        ],
        harmony: "Split-complementary green",
        mood: "Natural, fresh, and organic",
      },
      {
        id: "pal_4",
        name: "Royal Luxe",
        colors: [
          { hex: "#7209B7", name: "Royal Purple" },
          { hex: "#F72585", name: "Magenta" },
          { hex: "#4CC9F0", name: "Cyan" },
          { hex: "#1A1A2E", name: "Midnight" },
          { hex: "#E8E8E8", name: "Silver" },
        ],
        harmony: "Triadic vibrant scheme",
        mood: "Luxurious, bold, and creative",
      },
      {
        id: "pal_5",
        name: "Golden Hour",
        colors: [
          { hex: "#E07A5F", name: "Terracotta" },
          { hex: "#F2CC8F", name: "Sand" },
          { hex: "#3D405B", name: "Slate" },
          { hex: "#81B29A", name: "Sage" },
          { hex: "#F4F1DE", name: "Cream" },
        ],
        harmony: "Warm neutral palette",
        mood: "Cozy, elegant, and timeless",
      },
    ];

    setPalettes(samplePalettes);
    setIsGenerating(false);
  }, [prompt]);

  const handleCopyHex = useCallback(async (hex: string) => {
    await navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  }, []);

  const handleApplyToDesign = useCallback((id: string) => {
    setAppliedId(id);
    setTimeout(() => setAppliedId(null), 2000);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI Color Assistant</span>
        </div>
        <h2 className="text-3xl font-display font-bold">
          Smart <span className="gradient-text">Color Palettes</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Discover beautiful color harmonies tailored to your mood and theme.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the mood/theme..."
            rows={2}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all duration-200"
          />
          <Palette className="absolute right-4 top-4 w-5 h-5 text-muted-foreground/40" />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Palettes...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Color Palettes
            </>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {palettes.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {palettes.map((palette) => (
              <motion.div
                key={palette.id}
                variants={paletteVariants}
                layout
                className="glass rounded-2xl overflow-hidden group"
              >
                <div className="flex h-24">
                  {palette.colors.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => handleCopyHex(color.hex)}
                      title={`${color.name} - ${color.hex}`}
                      className="flex-1 relative group/color transition-all duration-200 hover:flex-[1.5]"
                      style={{ backgroundColor: color.hex }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity duration-200">
                        {copiedHex === color.hex ? (
                          <Check className="w-4 h-4 text-white drop-shadow-lg" />
                        ) : (
                          <Copy className="w-4 h-4 text-white drop-shadow-lg" />
                        )}
                      </div>
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 opacity-0 group-hover/color:opacity-100 transition-opacity duration-200">
                        <span className="text-[10px] font-mono text-white bg-black/50 px-1 rounded">
                          {color.hex}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{palette.name}</h4>
                    <button
                      onClick={() => handleApplyToDesign(palette.id)}
                      className={cn(
                        "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                        appliedId === palette.id
                          ? "bg-success/20 text-success"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      )}
                    >
                      {appliedId === palette.id ? (
                        <>
                          <Check className="w-3 h-3" /> Applied
                        </>
                      ) : (
                        <>
                          <Paintbrush className="w-3 h-3" /> Apply to Design
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {palette.colors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => handleCopyHex(color.hex)}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-surface text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {color.hex}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <p>
                      <span className="text-foreground/60">Harmony: </span>
                      {palette.harmony}
                    </p>
                    <p>
                      <span className="text-foreground/60">Mood: </span>
                      {palette.mood}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
