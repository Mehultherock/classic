"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import TemplatePreview, { getTemplateStyle } from "@/components/template-preview";
import {
  LayoutTemplate,
  Upload,
  Grid3X3,
  List,
  Search,
  Edit3,
  Star,
  Flame,
  Trash2,
  X,
  Plus,
  FolderTree,
  Image,
  Eye,
  ExternalLink,
  MoreHorizontal,
  Check,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const categories = ["All", "Wedding", "Birthday", "Engagement", "Anniversary", "Business", "Events", "Festivals", "Education", "Social Media", "Food & Drink", "Travel", "Music", "Fashion", "Fitness", "Real Estate", "Pets", "Beauty", "Technology", "Sports"];

const templatesData = [
  { id: "1", name: "Elegant Wedding Invitation", category: "Wedding", type: "invitation", premium: true, popular: true, downloads: 1247, date: new Date("2025-05-01"), thumbnail: null },
  { id: "2", name: "Summer Sale Banner", category: "Business", type: "banner", premium: false, popular: false, downloads: 856, date: new Date("2025-05-10"), thumbnail: null },
  { id: "3", name: "Birthday Celebration Poster", category: "Birthday", type: "poster", premium: true, popular: true, downloads: 2103, date: new Date("2025-04-20"), thumbnail: null },
  { id: "4", name: "Corporate Flyer Pro", category: "Business", type: "flyer", premium: true, popular: false, downloads: 567, date: new Date("2025-06-01"), thumbnail: null },
  { id: "5", name: "Diwali Festival Card", category: "Festivals", type: "greeting_card", premium: false, popular: true, downloads: 3421, date: new Date("2025-03-15"), thumbnail: null },
  { id: "6", name: "Instagram Story Bundle", category: "Social Media", type: "social_media", premium: false, popular: false, downloads: 789, date: new Date("2025-06-05"), thumbnail: null },
  { id: "7", name: "Graduation Certificate", category: "Education", type: "certificate", premium: true, popular: false, downloads: 432, date: new Date("2025-05-20"), thumbnail: null },
  { id: "8", name: "Tech Conference Banner", category: "Events", type: "banner", premium: false, popular: true, downloads: 1654, date: new Date("2025-04-10"), thumbnail: null },
  { id: "9", name: "Restaurant Menu Design", category: "Food & Drink", type: "flyer", premium: true, popular: true, downloads: 2341, date: new Date("2025-06-08"), thumbnail: null },
  { id: "10", name: "Fashion Lookbook Collection", category: "Fashion", type: "poster", premium: true, popular: false, downloads: 678, date: new Date("2025-05-15"), thumbnail: null },
  { id: "11", name: "Travel Brochure - Paris", category: "Travel", type: "flyer", premium: false, popular: true, downloads: 1890, date: new Date("2025-04-22"), thumbnail: null },
  { id: "12", name: "Music Album Cover", category: "Music", type: "poster", premium: true, popular: false, downloads: 1456, date: new Date("2025-06-02"), thumbnail: null },
  { id: "13", name: "Fitness Challenge 30 Days", category: "Fitness", type: "poster", premium: false, popular: true, downloads: 2678, date: new Date("2025-05-28"), thumbnail: null },
  { id: "14", name: "Real Estate Property Listing", category: "Real Estate", type: "flyer", premium: false, popular: false, downloads: 345, date: new Date("2025-06-10"), thumbnail: null },
  { id: "15", name: "Pet Adoption Drive", category: "Pets", type: "poster", premium: true, popular: true, downloads: 1234, date: new Date("2025-04-15"), thumbnail: null },
  { id: "16", name: "Christmas Greeting Card", category: "Festivals", type: "greeting_card", premium: false, popular: true, downloads: 4567, date: new Date("2025-03-20"), thumbnail: null },
  { id: "17", name: "App UI Mockup Kit", category: "Technology", type: "social_media", premium: true, popular: false, downloads: 2345, date: new Date("2025-06-07"), thumbnail: null },
  { id: "18", name: "Beauty Salon Price List", category: "Beauty", type: "flyer", premium: false, popular: false, downloads: 567, date: new Date("2025-05-05"), thumbnail: null },
  { id: "19", name: "Concert Event Poster", category: "Music", type: "poster", premium: true, popular: true, downloads: 3456, date: new Date("2025-04-30"), thumbnail: null },
  { id: "20", name: "New Year Celebration Card", category: "Festivals", type: "greeting_card", premium: true, popular: true, downloads: 5678, date: new Date("2025-02-28"), thumbnail: null },
];

function TemplatePreviewModal({ template, onClose }: { template: typeof templatesData[0] | null; onClose: () => void }) {
  if (!template) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl rounded-2xl glass-strong border border-border/50 shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{template.category} · {template.type.replace("_", " ")}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card text-muted-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="aspect-video bg-gradient-to-br from-[#0a0a12] to-[#1a0a12] flex items-center justify-center">
            <TemplatePreview style={getTemplateStyle(template.category)} />
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Downloads:</span>
                <span className="text-sm font-medium text-foreground">{template.downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Added:</span>
                <span className="text-sm font-medium text-foreground">{formatDate(template.date)}</span>
              </div>
              {template.premium && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border text-accent bg-accent/10 border-accent/20">
                  <Star className="w-3 h-3" /> Premium
                </span>
              )}
              {template.popular && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border text-primary bg-primary/10 border-primary/20">
                  <Flame className="w-3 h-3" /> Popular
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit Template
              </button>
              <button className="h-9 px-4 rounded-lg bg-card border border-border text-sm text-foreground hover:border-primary/30 transition-colors flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Preview Live
              </button>
              <button className="h-9 px-4 rounded-lg bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function TemplatesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templatesData[0] | null>(null);

  const filtered = templatesData.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || t.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Template Management</h1>
          <p className="text-muted-foreground mt-1">Manage design templates, categories, and flags.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-xl bg-card border border-border text-sm text-foreground hover:border-primary/30 transition-colors flex items-center gap-2">
            <FolderTree className="w-4 h-4" />
            Categories
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Upload Template
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                category === c
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 ml-auto bg-card rounded-xl border border-border p-1">
          <button
            onClick={() => setView("grid")}
            className={cn("p-2 rounded-lg transition-colors", view === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-2 rounded-lg transition-colors", view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {view === "grid" ? (
        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="rounded-2xl glass border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="aspect-[4/3] relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] to-[#1a0a12]" />
                <TemplatePreview style={getTemplateStyle(template.category)} />
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedTemplate(template); }}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {template.premium && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-accent/90 text-white flex items-center gap-1">
                      <Star className="w-3 h-3" /> Premium
                    </span>
                  )}
                  {template.popular && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-primary/90 text-white flex items-center gap-1">
                      <Flame className="w-3 h-3" /> Popular
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{template.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground capitalize">{template.category}</span>
                  <span className="text-xs text-muted-foreground">{template.downloads.toLocaleString()} downloads</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Template</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Category</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden md:table-cell">Type</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden md:table-cell">Flags</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Downloads</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Date</th>
                  <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((template) => (
                  <tr key={template.id} className="border-t border-border/30 hover:bg-card/50 transition-colors cursor-pointer" onClick={() => setSelectedTemplate(template)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                          <Image className="w-5 h-5 text-primary/40" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{template.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{template.category}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize hidden md:table-cell">{template.type.replace("_", " ")}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex gap-1.5">
                        {template.premium && <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-accent/10 text-accent border border-accent/20 flex items-center gap-1"><Star className="w-3 h-3" />Premium</span>}
                        {template.popular && <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary border border-primary/20 flex items-center gap-1"><Flame className="w-3 h-3" />Popular</span>}
                        {!template.premium && !template.popular && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">{template.downloads.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">{formatDate(template.date)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={(e) => { e.stopPropagation(); setSelectedTemplate(template); }} className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-primary transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-error transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      <TemplatePreviewModal template={selectedTemplate} onClose={() => setSelectedTemplate(null)} />
    </motion.div>
  );
}
