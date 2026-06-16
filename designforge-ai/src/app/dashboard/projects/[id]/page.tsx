"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit3,
  Download,
  Copy,
  Trash2,
  Share2,
  Image,
  FileText,
  Printer,
  ExternalLink,
  Check,
  Palette,
  Clock,
  Mail,
  Layout,
  MoreHorizontal,
  Loader2,
} from "lucide-react";

const dummyProject = {
  id: "1",
  title: "Sarah & Alex Wedding",
  type: "invitation" as const,
  status: "completed" as const,
  width: 600,
  height: 800,
  description: "Elegant wedding invitation with floral patterns and gold accents",
  created_at: "2025-05-01T00:00:00Z",
  updated_at: "2025-06-10T00:00:00Z",
  thumbnail_url: null,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const exportFormats = [
  { format: "PNG", icon: Image, desc: "High quality PNG" },
  { format: "JPG", icon: Image, desc: "Compressed JPG" },
  { format: "PDF", icon: FileText, desc: "Vector PDF" },
  { format: "Print PDF", icon: Printer, desc: "CMYK Print Ready" },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);
  const project = dummyProject;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => {
      window.location.href = "/dashboard/projects";
    }, 1500);
  };

  const handleExport = (format: string) => {
    setExporting(format);
    setTimeout(() => setExporting(null), 2000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-8"
    >
      <motion.div variants={itemVariants}>
        <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{project.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={cn(
                "text-xs font-medium px-2.5 py-1 rounded-full capitalize border",
                project.status === "completed" ? "text-success bg-success/10 border-success/20" :
                project.status === "draft" ? "text-accent bg-accent/10 border-accent/20" :
                "text-muted-foreground bg-card border-border/50"
              )}>
                {project.status}
              </span>
              <span className="text-sm text-muted-foreground capitalize">{project.type}</span>
              {project.description && (
                <span className="text-sm text-muted-foreground hidden sm:inline">&middot; {project.description}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/editor/${params.id}`}>
              <Button variant="gradient">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit in Editor
              </Button>
            </Link>
            <button
              onClick={handleCopyLink}
              className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Share2 className="w-4 h-4" />}
            </button>
            <div className="relative group">
              <button className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-12 w-44 rounded-xl glass border border-border/50 shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <div className="p-2 space-y-0.5">
                  <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                    <Copy className="w-4 h-4" /> Duplicate Project
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {deleting ? "Deleting..." : "Delete Project"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 overflow-hidden">
            <div
              className="w-full bg-gradient-to-br from-card to-surface-hover flex items-center justify-center"
              style={{ aspectRatio: `${project.width}/${project.height}`, maxHeight: 500 }}
            >
              <div className="text-center">
                <Palette className="w-16 h-16 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground/60 text-sm">
                  Preview
                </p>
                <p className="text-xs text-muted-foreground/40 mt-1">
                  {project.width} x {project.height}px
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Download</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {exportFormats.map(({ format, icon: Icon, desc }) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  disabled={exporting === format}
                  className="rounded-xl glass border border-border/50 p-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 text-center"
                >
                  {exporting === format ? (
                    <Loader2 className="w-8 h-8 text-primary mx-auto mb-2 animate-spin" />
                  ) : (
                    <Icon className="w-8 h-8 text-muted-foreground mx-auto mb-2 group-hover:text-primary transition-colors" />
                  )}
                  <p className="text-sm font-medium text-foreground">{format}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Project Info</h2>
            <div className="space-y-3">
              <div>
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="text-sm text-foreground capitalize mt-0.5">{project.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Dimensions</p>
                        <p className="text-sm text-foreground mt-0.5">{project.width} x {project.height}px</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm text-foreground mt-0.5">{formatDate(project.created_at)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Last Modified</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <p className="text-sm text-foreground">{formatDate(project.updated_at)}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Share</h2>
                    <p className="text-sm text-muted-foreground">Share this project with others for collaboration or preview.</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={`${typeof window !== "undefined" ? window.location.origin : ""}/preview/${params.id}`}
                        className="flex-1 h-10 px-3 rounded-lg bg-card border border-border text-xs text-muted-foreground focus:outline-none"
                      />
                      <Button variant="secondary" size="sm" onClick={handleCopyLink}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Preview
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        }
