"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  Sparkles,
  Loader2,
  Download,
  Plus,
  Check,
  RefreshCw,
} from "lucide-react";

const imageStyles = [
  { id: "illustration", label: "Illustration" },
  { id: "realistic", label: "Realistic" },
  { id: "watercolor", label: "Watercolor" },
  { id: "oil-painting", label: "Oil Painting" },
  { id: "sketch", label: "Sketch" },
  { id: "3d-render", label: "3D Render" },
  { id: "pixel-art", label: "Pixel Art" },
] as const;

const aspectRatios = [
  { id: "square", label: "Square", ratio: "1:1" },
  { id: "landscape", label: "Landscape", ratio: "16:9" },
  { id: "portrait", label: "Portrait", ratio: "4:5" },
] as const;

interface GeneratedImage {
  id: string;
  url: string;
  style: string;
  aspectRatio: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function AIImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string>("illustration");
  const [selectedRatio, setSelectedRatio] = useState<string>("square");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 3000));

    const newResults: GeneratedImage[] = Array.from({ length: 4 }, (_, i) => ({
      id: `img_${Date.now()}_${i}`,
      url: `/api/placeholder/400/400?text=Image+${i + 1}`,
      style: selectedStyle,
      aspectRatio: selectedRatio,
    }));

    setResults(newResults);
    setIsGenerating(false);
  }, [prompt, selectedStyle, selectedRatio]);

  const handleAddToDesign = useCallback((id: string) => {
    setAddedId(id);
    setTimeout(() => setAddedId(null), 2000);
  }, []);

  const handleDownload = useCallback((url: string) => {
    console.log("Downloading:", url);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">AI Image Generator</span>
        </div>
        <h2 className="text-3xl font-display font-bold">
          Create Stunning <span className="gradient-text">Images</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Generate unique images from text descriptions using AI.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-5">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={3}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all duration-200 pr-10"
          />
          <ImageIcon className="absolute right-4 top-4 w-5 h-5 text-muted-foreground/40" />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Style</label>
          <div className="flex flex-wrap gap-2">
            {imageStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  selectedStyle === style.id
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/25"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-white/[0.06]"
                )}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Aspect Ratio</label>
          <div className="grid grid-cols-3 gap-3">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.id}
                onClick={() => setSelectedRatio(ratio.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-4 rounded-xl border transition-all duration-200",
                  selectedRatio === ratio.id
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/50 bg-surface"
                )}
              >
                <div
                  className={cn(
                    "rounded bg-muted mb-1",
                    ratio.id === "square" && "w-8 h-8",
                    ratio.id === "landscape" && "w-10 h-6",
                    ratio.id === "portrait" && "w-6 h-10"
                  )}
                />
                <span className="text-sm font-medium text-foreground">{ratio.label}</span>
                <span className="text-xs text-muted-foreground">{ratio.ratio}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-accent to-primary text-accent-foreground font-semibold shadow-lg shadow-accent/25 hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ImageIcon className="w-5 h-5" />
              Generate Image
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
            className="grid sm:grid-cols-2 gap-5"
          >
            <div className="sm:col-span-2">
              <h3 className="text-lg font-semibold mb-1">Generated Images</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {results.length} images generated
              </p>
            </div>
            {results.map((image) => (
              <motion.div
                key={image.id}
                variants={itemVariants}
                layout
                className="glass rounded-2xl overflow-hidden group relative"
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className={cn(
                  "bg-surface relative overflow-hidden",
                  image.aspectRatio === "square" && "aspect-square",
                  image.aspectRatio === "landscape" && "aspect-video",
                  image.aspectRatio === "portrait" && "aspect-[4/5]"
                )}>
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
                    <ImageIcon className="w-20 h-20" />
                  </div>

                  <AnimatePresence>
                    {hoveredId === image.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center gap-3"
                      >
                        <button
                          onClick={() => handleAddToDesign(image.id)}
                          className="px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/80 transition-colors flex items-center gap-2"
                        >
                          {addedId === image.id ? (
                            <>
                              <Check className="w-4 h-4" /> Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" /> Add to Design
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDownload(image.url)}
                          className="p-2.5 rounded-lg glass text-white hover:bg-white/10 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="p-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground capitalize">{image.style.replace("-", " ")}</span>
                  <span className="text-xs text-muted-foreground uppercase">{image.aspectRatio}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
