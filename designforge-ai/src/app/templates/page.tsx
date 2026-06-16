"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Sparkles,
  Crown,
  Eye,
  Heart,
  Search,
  Layout,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import TemplatePreview, { getTemplateStyle } from "@/components/template-preview";

const allCategories = [
  "All",
  "Wedding", "Birthday", "Engagement", "Anniversary",
  "Baby Shower", "Graduation", "Farewell",
  "Business", "Events", "Festivals", "Promotions", "Sales", "Sports",
  "Education", "Food & Drink", "Travel", "Music", "Fashion",
  "Technology", "Real Estate", "Fitness", "Beauty", "Pets",
  "Nature", "Art & Creative", "Finance", "Legal",
];

const allTemplateData = [
  // Weddings
  { t: "Elegant Wedding Invitation", c: "Wedding", pr: true, po: true, co: "from-pink-500/30 to-rose-500/30" },
  { t: "Rustic Wedding Invitation", c: "Wedding", pr: false, po: false, co: "from-amber-500/30 to-orange-500/30" },
  { t: "Modern Wedding RSVP Card", c: "Wedding", pr: true, po: true, co: "from-slate-500/30 to-gray-500/30" },
  { t: "Save the Date Card", c: "Wedding", pr: false, po: true, co: "from-pink-500/30 to-purple-500/30" },
  { t: "Wedding Thank You Card", c: "Wedding", pr: true, po: false, co: "from-rose-500/30 to-red-500/30" },
  { t: "Wedding Program Brochure", c: "Wedding", pr: false, po: false, co: "from-green-500/30 to-emerald-500/30" },
  { t: "Bridal Shower Invitation", c: "Wedding", pr: true, po: false, co: "from-fuchsia-500/30 to-pink-500/30" },
  { t: "Engagement Party Invitation", c: "Engagement", pr: false, po: true, co: "from-yellow-500/30 to-amber-500/30" },

  // Birthdays
  { t: "Kids Birthday Invitation", c: "Birthday", pr: false, po: true, co: "from-sky-500/30 to-blue-500/30" },
  { t: "18th Birthday Poster", c: "Birthday", pr: true, po: true, co: "from-purple-500/30 to-violet-500/30" },
  { t: "30th Birthday Flyer", c: "Birthday", pr: false, po: false, co: "from-gray-500/30 to-slate-500/30" },
  { t: "50th Birthday Invitation", c: "Birthday", pr: true, po: false, co: "from-gold-500/30 to-yellow-500/30" },
  { t: "Surprise Party Banner", c: "Birthday", pr: false, po: false, co: "from-orange-500/30 to-red-500/30" },

  // Business
  { t: "Corporate Business Card", c: "Business", pr: true, po: true, co: "from-blue-500/30 to-cyan-500/30" },
  { t: "Company Letterhead", c: "Business", pr: false, po: false, co: "from-indigo-500/30 to-blue-500/30" },
  { t: "Business Proposal Cover", c: "Business", pr: true, po: false, co: "from-slate-500/30 to-gray-500/30" },
  { t: "Invoice Template", c: "Business", pr: false, po: true, co: "from-green-500/30 to-emerald-500/30" },
  { t: "Annual Report Design", c: "Business", pr: true, po: false, co: "from-primary/30 to-secondary/30" },
  { t: "Marketing Brochure", c: "Business", pr: false, po: false, co: "from-cyan-500/30 to-teal-500/30" },
  { t: "Professional Resume", c: "Business", pr: true, po: true, co: "from-gray-500/30 to-slate-500/30" },

  // Education
  { t: "Graduation Certificate", c: "Education", pr: false, po: true, co: "from-green-500/30 to-emerald-500/30" },
  { t: "Class Schedule Template", c: "Education", pr: false, po: false, co: "from-sky-500/30 to-blue-500/30" },
  { t: "Lesson Plan Template", c: "Education", pr: true, po: false, co: "from-teal-500/30 to-cyan-500/30" },
  { t: "Quiz & Worksheet", c: "Education", pr: false, po: false, co: "from-orange-500/30 to-amber-500/30" },
  { t: "School Event Poster", c: "Education", pr: true, po: true, co: "from-red-500/30 to-rose-500/30" },

  // Social Media
  { t: "Instagram Story Set", c: "Events", pr: true, po: true, co: "from-purple-500/30 to-violet-500/30" },
  { t: "Facebook Cover Design", c: "Events", pr: false, po: false, co: "from-blue-500/30 to-indigo-500/30" },
  { t: "YouTube Thumbnail Pack", c: "Events", pr: true, po: true, co: "from-red-500/30 to-rose-500/30" },
  { t: "LinkedIn Banner Pro", c: "Events", pr: false, po: false, co: "from-blue-500/30 to-cyan-500/30" },
  { t: "TikTok Video Template", c: "Events", pr: true, po: false, co: "from-teal-500/30 to-green-500/30" },
  { t: "Pinterest Pin Design", c: "Events", pr: false, po: false, co: "from-red-500/30 to-orange-500/30" },

  // Food & Drink
  { t: "Restaurant Menu Design", c: "Food & Drink", pr: true, po: true, co: "from-amber-500/30 to-yellow-500/30" },
  { t: "Cafe Flyer Template", c: "Food & Drink", pr: false, po: false, co: "from-brown-500/30 to-amber-500/30" },
  { t: "Recipe Card Design", c: "Food & Drink", pr: true, po: false, co: "from-green-500/30 to-lime-500/30" },
  { t: "Wine Label Template", c: "Food & Drink", pr: false, po: true, co: "from-red-500/30 to-purple-500/30" },
  { t: "Food Truck Banner", c: "Food & Drink", pr: true, po: false, co: "from-orange-500/30 to-red-500/30" },

  // Travel
  { t: "Travel Brochure Design", c: "Travel", pr: false, po: true, co: "from-sky-500/30 to-blue-500/30" },
  { t: "Vacation Photo Card", c: "Travel", pr: true, po: false, co: "from-cyan-500/30 to-teal-500/30" },
  { t: "Hotel Flyer Template", c: "Travel", pr: false, po: false, co: "from-gold-500/30 to-amber-500/30" },
  { t: "Travel Instagram Story", c: "Travel", pr: true, po: true, co: "from-emerald-500/30 to-green-500/30" },

  // Sports & Fitness
  { t: "Sports Tournament Poster", c: "Sports", pr: false, po: true, co: "from-yellow-500/30 to-orange-500/30" },
  { t: "Fitness Challenge Flyer", c: "Fitness", pr: true, po: false, co: "from-lime-500/30 to-green-500/30" },
  { t: "Yoga Retreat Poster", c: "Fitness", pr: false, po: true, co: "from-purple-500/30 to-pink-500/30" },
  { t: "Gym Membership Card", c: "Fitness", pr: true, po: false, co: "from-red-500/30 to-orange-500/30" },
  { t: "Team Jersey Design", c: "Sports", pr: false, po: false, co: "from-blue-500/30 to-red-500/30" },

  // Music
  { t: "Album Cover Template", c: "Music", pr: true, po: true, co: "from-purple-500/30 to-pink-500/30" },
  { t: "Concert Poster Design", c: "Music", pr: false, po: false, co: "from-red-500/30 to-orange-500/30" },
  { t: "Playlist Cover Art", c: "Music", pr: true, po: false, co: "from-teal-500/30 to-cyan-500/30" },
  { t: "Music Festival Flyer", c: "Music", pr: false, po: true, co: "from-yellow-500/30 to-red-500/30" },
  { t: "Podcast Cover Design", c: "Music", pr: true, po: false, co: "from-orange-500/30 to-amber-500/30" },

  // Festivals & Events
  { t: "Christmas Greeting Card", c: "Festivals", pr: false, po: true, co: "from-red-500/30 to-green-500/30" },
  { t: "Diwali Festival Poster", c: "Festivals", pr: true, po: false, co: "from-orange-500/30 to-yellow-500/30" },
  { t: "Easter Card Design", c: "Festivals", pr: false, po: false, co: "from-pink-500/30 to-purple-500/30" },
  { t: "New Year Celebration Card", c: "Festivals", pr: true, po: true, co: "from-gold-500/30 to-yellow-500/30" },
  { t: "Halloween Party Flyer", c: "Festivals", pr: false, po: false, co: "from-orange-500/30 to-black-500/30" },
  { t: "Thanksgiving Card", c: "Festivals", pr: true, po: false, co: "from-amber-500/30 to-brown-500/30" },

  // Technology
  { t: "App UI Mockup", c: "Technology", pr: true, po: true, co: "from-blue-500/30 to-indigo-500/30" },
  { t: "Tech Conference Banner", c: "Technology", pr: false, po: false, co: "from-cyan-500/30 to-blue-500/30" },
  { t: "Software Launch Poster", c: "Technology", pr: true, po: false, co: "from-green-500/30 to-teal-500/30" },
  { t: "Website Hero Design", c: "Technology", pr: false, po: true, co: "from-primary/30 to-secondary/30" },
  { t: "Startup Pitch Deck", c: "Technology", pr: true, po: false, co: "from-indigo-500/30 to-purple-500/30" },

  // Fashion & Beauty
  { t: "Fashion Lookbook", c: "Fashion", pr: true, po: false, co: "from-fuchsia-500/30 to-pink-500/30" },
  { t: "Beauty Product Label", c: "Beauty", pr: false, po: true, co: "from-pink-500/30 to-rose-500/30" },
  { t: "Salon Price List", c: "Beauty", pr: true, po: false, co: "from-purple-500/30 to-violet-500/30" },
  { t: "Clothing Tag Design", c: "Fashion", pr: false, po: false, co: "from-gray-500/30 to-slate-500/30" },
  { t: "Makeup Tutorial Cover", c: "Beauty", pr: true, po: false, co: "from-rose-500/30 to-pink-500/30" },

  // Real Estate
  { t: "Property Listing Flyer", c: "Real Estate", pr: false, po: true, co: "from-blue-500/30 to-cyan-500/30" },
  { t: "Open House Banner", c: "Real Estate", pr: true, po: false, co: "from-green-500/30 to-emerald-500/30" },
  { t: "Real Estate Business Card", c: "Real Estate", pr: false, po: false, co: "from-gray-500/30 to-slate-500/30" },
  { t: "For Sale Sign Design", c: "Real Estate", pr: true, po: true, co: "from-red-500/30 to-orange-500/30" },

  // Pets & Animals
  { t: "Pet Adoption Poster", c: "Pets", pr: false, po: true, co: "from-amber-500/30 to-orange-500/30" },
  { t: "Pet ID Card Template", c: "Pets", pr: true, po: false, co: "from-blue-500/30 to-cyan-500/30" },
  { t: "Veterinary Clinic Flyer", c: "Pets", pr: false, po: false, co: "from-green-500/30 to-teal-500/30" },
  { t: "Pet Birthday Card", c: "Pets", pr: true, po: false, co: "from-pink-500/30 to-purple-500/30" },

  // Nature
  { t: "Nature Photography Card", c: "Nature", pr: true, po: false, co: "from-green-500/30 to-emerald-500/30" },
  { t: "Garden Club Flyer", c: "Nature", pr: false, po: false, co: "from-lime-500/30 to-green-500/30" },
  { t: "Environmental Poster", c: "Nature", pr: true, po: true, co: "from-teal-500/30 to-cyan-500/30" },
  { t: "Plant Care Guide", c: "Nature", pr: false, po: false, co: "from-green-500/30 to-amber-500/30" },
];

const colors = [
  "from-pink-500/30 to-rose-500/30",
  "from-blue-500/30 to-cyan-500/30",
  "from-purple-500/30 to-violet-500/30",
  "from-amber-500/30 to-orange-500/30",
  "from-green-500/30 to-emerald-500/30",
  "from-primary/30 to-secondary/30",
  "from-red-500/30 to-rose-500/30",
  "from-teal-500/30 to-cyan-500/30",
];

const allTemplates = allTemplateData.map((t, i) => ({
  id: i + 1,
  title: t.t,
  category: t.c,
  premium: t.pr,
  popular: t.po,
  downloads: Math.floor(Math.random() * 5000) + 100,
  color: t.co || colors[i % colors.length],
  style: getTemplateStyle(t.c),
}));

const ITEMS_PER_PAGE = 12;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function TemplatesPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = allTemplates.filter((t) => {
    const matchCategory = activeCategory === "All" || t.category === activeCategory;
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen pt-24 pb-16">
      <section ref={ref} className="px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <Layout className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">10,000+ Templates</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold">
              Design <span className="gradient-text">Templates</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse thousands of professionally designed templates for every occasion.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-10 py-3.5 rounded-xl glass-strong text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  activeCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {paginated.map((template) => (
              <Link
                key={template.id}
                href={`/templates/${template.id}`}
                className="group block"
              >
                <div className="glass rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] to-[#1a0a12]" />
                    <TemplatePreview style={template.style} />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                    {template.premium && (
                      <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30">
                        <Crown className="w-3 h-3 text-accent" />
                        <span className="text-xs font-medium text-accent">Premium</span>
                      </div>
                    )}
                    {template.popular && !template.premium && (
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-xs font-medium text-primary">Popular</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white hover:scale-110 transition-transform">
                          <Eye className="w-4 h-4" />
                        </div>
                        <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white hover:scale-110 transition-transform">
                          <Heart className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        {template.category}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {template.downloads.toLocaleString()} downloads
                      </p>
                    </div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">
                      {template.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>

          {filtered.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-20">
              <Search className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All");
                }}
                className="text-primary hover:text-primary-light transition-colors text-sm"
              >
                Clear all filters
              </button>
            </motion.div>
          )}

          {totalPages > 1 && (
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 mt-12"
            >
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200",
                    currentPage === i + 1
                      ? "bg-primary text-white"
                      : "glass-strong text-muted-foreground hover:text-foreground hover:bg-white/10"
                  )}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </section>
    </main>
  );
}
