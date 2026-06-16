"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { allTemplates } from "@/data/templates";
import TemplatePreview from "@/components/template-preview";
import {
  ArrowLeft,
  Edit3,
  Download,
  Share2,
  Crown,
  Check,
  Printer,
  Star,
  Layout,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function InvitationDetailPage() {
  const params = useParams();
  const tmpl = allTemplates.find((t) => t.id === params.id);

  const [copied, setCopied] = useState(false);

  const shareUrl = tmpl && typeof window !== "undefined" ? `${window.location.origin}/dashboard/invitations/${tmpl.id}` : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!tmpl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center mb-6">
          <Crown className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Template Not Found</h2>
        <p className="text-muted-foreground mb-8">This template doesn&apos;t exist or has been deleted.</p>
        <Link href="/dashboard/invitations">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Templates
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 max-w-6xl mx-auto">
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/invitations">
          <Button variant="ghost" size="sm" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <span className="text-sm text-muted-foreground">/ {tmpl.category}</span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="relative rounded-2xl overflow-hidden glass border border-border/50 group bg-card">
            <div className="aspect-[4/3] w-full">
              {tmpl.image ? (
                <img src={tmpl.image} alt={tmpl.title} className="w-full h-full object-cover" />
              ) : (
                <TemplatePreview style={tmpl.style} />
              )}
            </div>
            <div className="absolute top-4 left-4">
              <span className={cn(
                "px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r shadow-lg",
                "from-primary to-secondary"
              )}>
                {tmpl.category}
              </span>
            </div>
            {tmpl.premium && (
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1.5 rounded-full text-xs font-medium text-amber-400 bg-amber-400/20 backdrop-blur-sm border border-amber-400/30 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" /> Premium
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-5">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{tmpl.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{tmpl.category} Template</p>
          </div>

          <div className="glass rounded-2xl border border-border/50 p-5 space-y-4">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Downloads</p>
                <p className="text-sm text-muted-foreground">{tmpl.downloads.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Status</p>
                <p className="text-sm text-muted-foreground">{tmpl.popular ? "Popular" : "Standard"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Type</p>
                <p className="text-sm text-muted-foreground">{tmpl.premium ? "Premium" : "Free"}</p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl border border-border/50 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/editor/canva/new?image=${encodeURIComponent(tmpl.image || "")}&title=${encodeURIComponent(tmpl.title)}`}>
                <Button variant="gradient" size="sm" className="w-full rounded-xl">
                  <Layout className="w-4 h-4 mr-2" />
                  Canva Edit
                </Button>
              </Link>
              <Link href={`/editor/new?image=${encodeURIComponent(tmpl.image || "")}&title=${encodeURIComponent(tmpl.title)}`}>
                <Button variant="outline" size="sm" className="w-full rounded-xl">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Classic Edit
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={() => window.print()}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" className="w-full rounded-xl" onClick={handleCopyLink}>
                {copied ? <Check className="w-4 h-4 mr-2 text-success" /> : <Share2 className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Share"}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
