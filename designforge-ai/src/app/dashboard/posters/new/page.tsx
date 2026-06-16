"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POSTER_TYPES } from "@/lib/constants";
import {
  ChevronLeft,
  Sparkles,
  Image,
  Palette,
  Loader2,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function NewPosterPage() {
  const [form, setForm] = useState({
    title: "",
    posterType: "",
    tagline: "",
    description: "",
    colorScheme: "",
    customInstructions: "",
  });
  const [generating, setGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title) errs.title = "Poster title is required";
    if (!form.posterType) errs.posterType = "Poster type is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setGenerating(true);
    setTimeout(() => {
      window.location.href = "/dashboard/posters";
    }, 2000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <Link href="/dashboard/posters" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" />
          Back to Posters
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Create New Poster</h1>
        <p className="text-muted-foreground mt-1">Design a stunning poster with AI in seconds.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Image className="w-5 h-5 text-accent" />
            Poster Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Poster Title"
                placeholder="e.g., Summer Sale 2025"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                error={errors.title}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">Poster Type</label>
              <select
                value={form.posterType}
                onChange={(e) => setForm({ ...form, posterType: e.target.value })}
                className={cn(
                  "w-full h-10 rounded-lg bg-card border px-3 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring transition-all",
                  errors.posterType ? "border-error" : "border-border"
                )}
              >
                <option value="">Select type...</option>
                {POSTER_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.posterType && <p className="text-xs text-error mt-1">{errors.posterType}</p>}
            </div>
            <div>
              <Input
                label="Tagline (optional)"
                placeholder="Catchy tagline for your poster"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Description (optional)"
                placeholder="Brief description of what this poster is about"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div>
              <Input
                label="Color Scheme (optional)"
                placeholder="e.g., Blue & White, Warm tones"
                value={form.colorScheme}
                onChange={(e) => setForm({ ...form, colorScheme: e.target.value })}
                icon={<Palette className="w-4 h-4" />}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                Custom Instructions (optional)
              </label>
              <textarea
                placeholder="Specific design requirements, elements, or style preferences..."
                value={form.customInstructions}
                onChange={(e) => setForm({ ...form, customInstructions: e.target.value })}
                rows={3}
                className="w-full rounded-xl bg-card border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-end gap-4">
          <Link href="/dashboard/posters">
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" variant="gradient" size="lg" loading={generating}>
            <Sparkles className="w-4 h-4 mr-2" />
            {generating ? "Generating..." : "Generate Poster"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
