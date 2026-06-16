"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TemplatePreview, { getTemplateStyle } from "@/components/template-preview";
import {
  Plus,
  Image,
  Search,
  MoreVertical,
  Calendar,
} from "lucide-react";

const dummyPosters = [
  { id: "1", title: "Summer Sale 2025", category: "Sale Posters", created_at: "2025-06-10T00:00:00Z" },
  { id: "2", title: "Tech Conference 2025", category: "Event Posters", created_at: "2025-06-08T00:00:00Z" },
  { id: "3", title: "New Product Launch", category: "Product Posters", created_at: "2025-06-05T00:00:00Z" },
  { id: "4", title: "Festival Celebration", category: "Festival Posters", created_at: "2025-06-01T00:00:00Z" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function PostersPage() {
  const [search, setSearch] = useState("");
  const [posters] = useState(dummyPosters);
  const filtered = posters.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 space-y-6">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Posters</h1>
          <p className="text-muted-foreground mt-1">Browse and manage your poster designs.</p>
        </div>
        <Link href="/dashboard/posters/new">
          <Button variant="gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Poster
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search posters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/20 to-orange-500/20 flex items-center justify-center mb-6">
            <Image className="w-10 h-10 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No posters yet</h3>
          <p className="text-muted-foreground max-w-sm mb-8">Create eye-catching posters for your events and promotions.</p>
          <Link href="/dashboard/posters/new">
            <Button variant="gradient" size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Poster
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((poster) => (
            <motion.div key={poster.id} variants={itemVariants} className="rounded-2xl glass border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
              <Link href={`/dashboard/posters/${poster.id}`}>
                <div className="aspect-[4/3]">
                  <TemplatePreview style={getTemplateStyle(poster.category)} />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{poster.title}</h3>
                  <p className="text-sm text-muted-foreground capitalize mt-0.5">{poster.category}</p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(poster.created_at)}
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
