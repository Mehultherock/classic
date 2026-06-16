"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { allTemplates, templateCategories } from "@/data/templates";
import TemplatePreview from "@/components/template-preview";
import {
  Plus,
  Search,
  Layout,
  Crown,
  Download,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const categoryIcons: Record<string, string> = {
  Wedding: "💍", Birthday: "🎂", Engagement: "💎",
  "Baby Shower": "👶", Graduation: "🎓", Farewell: "👋",
  Business: "💼", Events: "📅", Festivals: "🎉",
  Sports: "⚽", Education: "📚", "Food & Drink": "🍽️",
  Travel: "✈️", Music: "🎵", Fashion: "👗",
  Technology: "💻", "Real Estate": "🏠", Fitness: "💪",
  Beauty: "💄", Pets: "🐾", Nature: "🌿",
  Party: "🎉", Holiday: "🎊", Seasonal: "🌸",
  Religious: "⛪", Baby: "👶",
};

export default function InvitationsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allTemplates.filter((tmpl) => {
    const matchCategory = activeCategory === "All" || tmpl.category === activeCategory;
    const matchSearch = search.trim() === "" || tmpl.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">Browse {allTemplates.length} professionally designed templates across 22 categories.</p>
        </div>
        <Link href="/editor/new">
          <Button variant="gradient">
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {templateCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const icon = cat === "All" ? <Layout className="w-4 h-4" /> : (
            <span className="text-base leading-none">{categoryIcons[cat] || "📄"}</span>
          );
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0",
                isActive
                  ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25"
                  : "glass text-muted-foreground hover:text-foreground hover:bg-white/10"
              )}
            >
              {icon}
              {cat}
            </button>
          );
        })}
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
            <Layout className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No templates found</h3>
          <p className="text-muted-foreground max-w-sm mb-8">Try adjusting your search or select a different category.</p>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((tmpl) => (
            <motion.div key={tmpl.id} variants={itemVariants} className="rounded-2xl glass border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <Link href={`/dashboard/invitations/${tmpl.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-card">
                  {tmpl.image ? (
                    <img src={tmpl.image} alt={tmpl.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                  ) : (
                    <div className="w-full h-full scale-[0.85] origin-center">
                      <TemplatePreview style={tmpl.style} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-gradient-to-r shadow-lg",
                      "from-primary to-secondary"
                    )}>
                      {tmpl.category}
                    </span>
                  </div>
                  {tmpl.premium && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 rounded-full text-[10px] font-medium text-amber-400 bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 flex items-center gap-1">
                        <Crown className="w-3 h-3" /> Premium
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-sm font-semibold text-white drop-shadow-lg">{tmpl.title}</h3>
                    <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1">
                      <Download className="w-3 h-3" /> {tmpl.downloads.toLocaleString()} downloads
                    </p>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{tmpl.category}</span>
                    {tmpl.popular && (
                      <span className="text-[10px] text-primary font-medium">Popular</span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
