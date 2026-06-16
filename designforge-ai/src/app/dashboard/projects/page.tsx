"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TemplatePreview, { getTemplateStyle } from "@/components/template-preview";
import {
  Plus,
  Search,
  Filter,
  FolderKanban,
  MoreVertical,
  Edit3,
  Copy,
  Archive,
  Trash2,
  Clock,
  ChevronDown,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ProjectCard({ project, onDelete }: { project: ProjectData; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const templateStyle = getTemplateStyle(project.type);

  return (
    <motion.div variants={itemVariants} className="relative group">
      <Link href={`/dashboard/projects/${project.id}`}>
        <div className="rounded-2xl glass border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
          <div className="aspect-[4/3]">
            {project.thumbnail_url ? (
              <img src={project.thumbnail_url} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <TemplatePreview style={templateStyle} />
            )}
          </div>
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-full capitalize border",
                    project.status === "completed" ? "text-success bg-success/10 border-success/20" :
                    project.status === "draft" ? "text-accent bg-accent/10 border-accent/20" :
                    "text-muted-foreground bg-card border-border/50"
                  )}>
                    {project.status}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">{project.type}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{formatDate(project.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
            className="w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 w-48 rounded-xl glass border border-border/50 shadow-xl overflow-hidden z-10">
              <div className="p-2 space-y-0.5">
                <button onClick={(e) => { e.preventDefault(); }} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
                <button onClick={(e) => { e.preventDefault(); }} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                  <Copy className="w-4 h-4" /> Duplicate
                </button>
                <hr className="border-border/50 my-1" />
                <button onClick={(e) => { e.preventDefault(); onDelete(project.id); }} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="rounded-2xl glass border border-border/50 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-card" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-card rounded w-3/4" />
        <div className="h-3 bg-card rounded w-1/2" />
        <div className="h-3 bg-card rounded w-1/3" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      variants={itemVariants}
      className="col-span-full flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
        <FolderKanban className="w-10 h-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">No projects yet</h3>
      <p className="text-muted-foreground max-w-sm mb-8">
        Create your first design project to get started. Choose from templates or generate with AI.
      </p>
      <Link href="/dashboard/projects/new">
        <Button variant="gradient" size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Create Your First Project
        </Button>
      </Link>
    </motion.div>
  );
}

interface ProjectData {
  id: string;
  title: string;
  type: string;
  status: string;
  updated_at: string;
  created_at: string;
  thumbnail_url?: string | null;
}

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeDropdown, setTypeDropdown] = useState(false);
  const [statusDropdown, setStatusDropdown] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/projects?sort=updated_at&order=desc&limit=50");
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = useMemo(() => projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  }), [search, typeFilter, statusFilter, projects]);

  const handleDelete = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Projects</h1>
          <p className="text-muted-foreground mt-1">Manage and organize all your design projects.</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button variant="gradient">
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => { setTypeDropdown(!typeDropdown); setStatusDropdown(false); }}
              className="h-10 px-4 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {typeFilter === "all" ? "Type" : typeFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            {typeDropdown && (
              <div className="absolute top-12 right-0 w-40 rounded-xl glass border border-border/50 shadow-xl overflow-hidden z-10">
                {["all", "invitation", "poster", "banner", "flyer", "certificate", "social_media"].map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTypeFilter(t); setTypeDropdown(false); }}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left transition-colors capitalize",
                      typeFilter === t ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-card"
                    )}
                  >
                    {t === "all" ? "All Types" : t.replace("_", " ")}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => { setStatusDropdown(!statusDropdown); setTypeDropdown(false); }}
              className="h-10 px-4 rounded-xl bg-card border border-border text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              {statusFilter === "all" ? "Status" : statusFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            {statusDropdown && (
              <div className="absolute top-12 right-0 w-40 rounded-xl glass border border-border/50 shadow-xl overflow-hidden z-10">
                {["all", "draft", "completed", "archived"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setStatusDropdown(false); }}
                    className={cn(
                      "w-full px-4 py-2 text-sm text-left transition-colors capitalize",
                      statusFilter === s ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-card"
                    )}
                  >
                    {s === "all" ? "All Status" : s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {error ? (
        <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-error/20 to-rose-500/20 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-error" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Could not load projects</h3>
          <p className="text-muted-foreground text-sm mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
        </motion.div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <ProjectSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
