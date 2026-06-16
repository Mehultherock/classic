"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  Loader2,
  RefreshCw,
  ClipboardCopy,
} from "lucide-react";

const contentTypes = [
  { id: "invitation", label: "Invitation Text", icon: FileText },
  { id: "event", label: "Event Descriptions", icon: FileText },
  { id: "marketing", label: "Marketing Copy", icon: FileText },
  { id: "captions", label: "Captions", icon: FileText },
  { id: "quotes", label: "Quotes", icon: FileText },
  { id: "greetings", label: "Greetings", icon: FileText },
] as const;

const tones = [
  "Formal",
  "Casual",
  "Romantic",
  "Fun",
  "Professional",
  "Heartfelt",
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function AICopywriter() {
  const [contentType, setContentType] = useState<string>("invitation");
  const [eventType, setEventType] = useState("");
  const [names, setNames] = useState("");
  const [date, setDate] = useState("");
  const [tone, setTone] = useState<string>("Formal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 2000));

    const samples = [
      `Join us for a wonderful celebration as we come together to honor this special occasion. Your presence will make this day truly memorable.`,
      `We invite you to share in our joy and celebrate this milestone with us. It promises to be an evening filled with laughter, love, and lasting memories.`,
      `Save the date for an unforgettable event! We can't wait to celebrate with our favorite people.`,
    ];

    setResults(samples);
    setIsGenerating(false);
  }, []);

  const handleCopy = useCallback(async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const handleUseInDesign = useCallback((text: string) => {
    console.log("Using in design:", text);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span className="text-sm text-muted-foreground">AI Copywriter</span>
        </div>
        <h2 className="text-3xl font-display font-bold">
          Write Compelling <span className="gradient-text">Content</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Generate beautiful text for invitations, events, marketing, and more.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Content Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {contentTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setContentType(type.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-200",
                  contentType === type.id
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-secondary/50 bg-surface"
                )}
              >
                <type.icon className="w-5 h-5" />
                <span className="text-xs font-medium text-center leading-tight">
                  {type.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Event Type</label>
            <input
              type="text"
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              placeholder="e.g. Wedding, Birthday, Graduation"
              className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Names</label>
            <input
              type="text"
              value={names}
              onChange={(e) => setNames(e.target.value)}
              placeholder="e.g. John & Sarah"
              className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g. March 15, 2026"
              className="w-full h-10 bg-surface border border-border rounded-lg px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Tone</label>
            <div className="flex flex-wrap gap-1.5">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                    tone === t
                      ? "bg-secondary text-white shadow-lg shadow-secondary/25"
                      : "glass text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
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
              Generating Copy...
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              Generate Copy
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
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Variations</h3>
              <span className="text-xs text-muted-foreground">
                {results.length} variations
              </span>
            </div>
            {results.map((text, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                layout
                className="glass rounded-xl p-5 group"
              >
                <p className="text-foreground leading-relaxed mb-4">{text}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(text, index)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleUseInDesign(text)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium transition-colors"
                  >
                    <ClipboardCopy className="w-3.5 h-3.5" /> Use in Design
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
