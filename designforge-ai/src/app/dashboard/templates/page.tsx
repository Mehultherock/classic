"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { TEMPLATE_CATEGORIES } from "@/lib/constants";
import {
  LayoutTemplate,
  Search,
  Sparkles,
  Download,
  Eye,
  ChevronDown,
  Crown,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import TemplatePreview, { getTemplateStyle } from "@/components/template-preview";

const allTemplates = [
  { id: "t1", title: "Elegant Wedding Invitation", category: "Wedding", type: "invitation", premium: false, popular: true, downloads: 1240, color: "from-pink-500 to-rose-500" },
  { id: "t2", title: "Modern Birthday Card", category: "Birthday", type: "greeting_card", premium: false, popular: true, downloads: 980, color: "from-purple-500 to-indigo-500" },
  { id: "t3", title: "Corporate Flyer Pro", category: "Business", type: "flyer", premium: true, popular: true, downloads: 2340, color: "from-blue-500 to-cyan-500" },
  { id: "t4", title: "Festival Celebration", category: "Festivals", type: "poster", premium: false, popular: false, downloads: 560, color: "from-orange-500 to-red-500" },
  { id: "t5", title: "Tech Conference Banner", category: "Events", type: "banner", premium: true, popular: true, downloads: 1870, color: "from-primary to-secondary" },
  { id: "t6", title: "Graduation Certificate", category: "Education", type: "certificate", premium: false, popular: false, downloads: 720, color: "from-green-500 to-emerald-500" },
  { id: "t7", title: "Engagement Announcement", category: "Engagement", type: "invitation", premium: true, popular: false, downloads: 430, color: "from-yellow-500 to-amber-500" },
  { id: "t8", title: "Baby Shower Invite", category: "Baby Shower", type: "invitation", premium: false, popular: true, downloads: 1580, color: "from-sky-500 to-blue-500" },
  { id: "t9", title: "Sports Tournament Poster", category: "Sports", type: "poster", premium: false, popular: false, downloads: 320, color: "from-red-500 to-orange-500" },
  { id: "t10", title: "Product Launch Banner", category: "Promotions", type: "banner", premium: true, popular: true, downloads: 2100, color: "from-violet-500 to-purple-500" },
  { id: "t11", title: "Sale Promotion Flyer", category: "Sales", type: "flyer", premium: false, popular: false, downloads: 890, color: "from-rose-500 to-red-500" },
  { id: "t12", title: "Farewell Party Invite", category: "Farewell", type: "invitation", premium: false, popular: false, downloads: 450, color: "from-teal-500 to-cyan-500" },
  { id: "t13", title: "Restaurant Menu Design", category: "Food & Drink", type: "flyer", premium: true, popular: true, downloads: 3120, color: "from-amber-500 to-yellow-500" },
  { id: "t14", title: "Travel Brochure", category: "Travel", type: "flyer", premium: false, popular: false, downloads: 670, color: "from-sky-500 to-blue-500" },
  { id: "t15", title: "Album Cover Template", category: "Music", type: "poster", premium: true, popular: true, downloads: 1890, color: "from-purple-500 to-pink-500" },
  { id: "t16", title: "Fashion Lookbook", category: "Fashion", type: "poster", premium: true, popular: false, downloads: 450, color: "from-fuchsia-500 to-pink-500" },
  { id: "t17", title: "Fitness Challenge Flyer", category: "Fitness", type: "flyer", premium: false, popular: true, downloads: 1340, color: "from-lime-500 to-green-500" },
  { id: "t18", title: "Real Estate Listing", category: "Real Estate", type: "flyer", premium: false, popular: false, downloads: 890, color: "from-blue-500 to-cyan-500" },
  { id: "t19", title: "Pet Adoption Poster", category: "Pets", type: "poster", premium: true, popular: false, downloads: 560, color: "from-amber-500 to-orange-500" },
  { id: "t20", title: "Diwali Festival Card", category: "Festivals", type: "greeting_card", premium: false, popular: true, downloads: 2450, color: "from-orange-500 to-yellow-500" },
  { id: "t21", title: "Startup Pitch Deck", category: "Technology", type: "presentation", premium: true, popular: true, downloads: 1780, color: "from-indigo-500 to-purple-500" },
  { id: "t22", title: "Christmas Greeting Card", category: "Festivals", type: "greeting_card", premium: false, popular: true, downloads: 3200, color: "from-red-500 to-green-500" },
  { id: "t23", title: "Salon Price List", category: "Beauty", type: "flyer", premium: false, popular: false, downloads: 430, color: "from-pink-500 to-rose-500" },
  { id: "t24", title: "Concert Poster", category: "Music", type: "poster", premium: true, popular: true, downloads: 2670, color: "from-red-500 to-orange-500" },
  { id: "t25", title: "YouTube Thumbnail Pack", category: "Social Media", type: "social_media", premium: true, popular: true, downloads: 1950, color: "from-red-500 to-rose-500" },
  { id: "t26", title: "Anniversary Invitation", category: "Anniversary", type: "invitation", premium: false, popular: false, downloads: 340, color: "from-gold-500 to-yellow-500" },
  { id: "t27", title: "App UI Mockup", category: "Technology", type: "social_media", premium: true, popular: false, downloads: 1120, color: "from-blue-500 to-indigo-500" },
  { id: "t28", title: "Instagram Story Set", category: "Social Media", type: "social_media", premium: false, popular: true, downloads: 2890, color: "from-purple-500 to-violet-500" },
  { id: "t29", title: "Open House Banner", category: "Real Estate", type: "banner", premium: true, popular: false, downloads: 780, color: "from-green-500 to-emerald-500" },
  { id: "t30", title: "Lesson Plan Template", category: "Education", type: "certificate", premium: false, popular: false, downloads: 210, color: "from-teal-500 to-cyan-500" },
];

const templatesWithStyle = allTemplates.map((t) => ({
  ...t,
  style: getTemplateStyle(t.category),
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [showPremium, setShowPremium] = useState(false);
  const [catDropdown, setCatDropdown] = useState(false);

  const filtered = templatesWithStyle.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "all" || t.category === category;
    const matchPremium = !showPremium || t.premium;
    return matchSearch && matchCategory && matchPremium;
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">Browse our curated collection of professional templates.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
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
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => { setCatDropdown(!catDropdown); }}
              className="h-10 px-4 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <LayoutTemplate className="w-4 h-4" />
              {category === "all" ? "Category" : category}
              <ChevronDown className="w-3 h-3" />
            </button>
            {catDropdown && (
              <div className="absolute top-12 left-0 w-48 rounded-xl glass border border-border/50 shadow-xl overflow-hidden z-10 max-h-60 overflow-y-auto">
                <button
                  onClick={() => { setCategory("all"); setCatDropdown(false); }}
                  className={cn("w-full px-4 py-2 text-sm text-left transition-colors", category === "all" ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-card")}
                >
                  All Categories
                </button>
                {TEMPLATE_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => { setCategory(c); setCatDropdown(false); }}
                    className={cn("w-full px-4 py-2 text-sm text-left transition-colors", category === c ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-card")}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowPremium(!showPremium)}
            className={cn(
              "h-10 px-4 rounded-xl border text-sm flex items-center gap-2 transition-colors",
              showPremium ? "border-accent bg-accent/10 text-accent" : "border-border bg-card text-muted-foreground hover:text-foreground"
            )}
          >
            <Crown className="w-4 h-4" />
            Premium
          </button>
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
            <LayoutTemplate className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No templates found</h3>
          <p className="text-muted-foreground max-w-sm mb-8">Try adjusting your search or filter criteria.</p>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((template) => (
              <motion.div
                key={template.id}
                variants={itemVariants}
                className="rounded-2xl glass border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
              >
                <Link href={`/editor/new?template=${template.id}`}>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] to-[#1a0a12]" />
                    <TemplatePreview style={template.style} />
                    {template.premium && (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-accent text-[10px] font-bold text-accent-foreground flex items-center gap-1 shadow-lg">
                        <Crown className="w-3 h-3" />
                        PRO
                      </div>
                    )}
                    {template.popular && (
                      <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-primary/80 backdrop-blur-sm text-[10px] font-bold text-white flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Popular
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <span className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Eye className="w-5 h-5 text-white" />
                        </span>
                        <span className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Download className="w-5 h-5 text-white" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{template.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground capitalize">{template.category} &middot; {template.type.replace("_", " ")}</p>
                      <p className="text-xs text-muted-foreground">{template.downloads.toLocaleString()} downloads</p>
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
