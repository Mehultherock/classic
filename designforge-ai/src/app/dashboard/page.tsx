"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import TemplatePreview, { getTemplateStyle } from "@/components/template-preview";
import {
  FolderKanban,
  Sparkles,
  Download,
  Users,
  Plus,
  Mail,
  Image,
  Palette,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Clock,
} from "lucide-react";

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

const recentProjects = [
  { id: "1", title: "Sarah & Alex Wedding", type: "invitation", updatedAt: new Date("2025-06-10"), thumbnail: null },
  { id: "2", title: "Summer Sale Banner", type: "banner", updatedAt: new Date("2025-06-09"), thumbnail: null },
  { id: "3", title: "Tech Conference 2025", type: "poster", updatedAt: new Date("2025-06-08"), thumbnail: null },
  { id: "4", title: "Birthday Invitation", type: "invitation", updatedAt: new Date("2025-06-07"), thumbnail: null },
];

const quickStats = [
  { label: "Total Projects", value: "12", icon: FolderKanban, change: "+2 this week", color: "from-primary to-secondary" },
  { label: "AI Generations Today", value: "3", icon: Sparkles, change: "2 remaining", color: "from-accent to-orange-500" },
  { label: "Downloads", value: "47", icon: Download, change: "+12 this month", color: "from-success to-emerald-500" },
  { label: "Team Members", value: "3", icon: Users, change: "+1 this week", color: "from-info to-blue-500" },
];

export default function DashboardOverview() {
  const { user } = useAuthStore();
  const plan = user?.plan || "free";
  const isFree = plan === "free";
  const generationsUsed = 3;
  const generationsLimit = 5;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0] || "Creator"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your designs today.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl glass border border-border/50 p-5 hover:border-primary/30 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">{stat.change}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", stat.color)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br", stat.color)} />
            </div>
          );
        })}
      </motion.div>

      {isFree && (
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl gradient-card p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-accent" />
                    <h3 className="text-lg font-semibold text-foreground">Free Plan</h3>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">AI Generations Today</span>
                      <span className="text-foreground font-medium">{generationsUsed} of {generationsLimit} used</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-card overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-orange-500 transition-all duration-500"
                        style={{ width: `${(generationsUsed / generationsLimit) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {generationsUsed >= generationsLimit
                        ? "You've used all your generations today. Upgrade for unlimited!"
                        : `${generationsLimit - generationsUsed} generations remaining today`}
                    </p>
                  </div>
                </div>
                <Link href="/dashboard/billing">
                  <Button variant="premium" size="lg">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard/invitations/new">
            <div className="rounded-2xl glass border border-border/50 p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">New Invitation</h3>
              <p className="text-sm text-muted-foreground mt-1">Create a beautiful invitation with AI</p>
            </div>
          </Link>
          <Link href="/dashboard/posters/new">
            <div className="rounded-2xl glass border border-border/50 p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Image className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">New Poster</h3>
              <p className="text-sm text-muted-foreground mt-1">Design a stunning poster instantly</p>
            </div>
          </Link>
          <Link href="/dashboard/projects/new">
            <div className="rounded-2xl glass border border-border/50 p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-success to-emerald-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">New Design</h3>
              <p className="text-sm text-muted-foreground mt-1">Start a fresh design from scratch</p>
            </div>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recent Projects</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentProjects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
              <div className="rounded-2xl glass border border-border/50 overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group">
                <div className="aspect-[4/3]">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <TemplatePreview style={getTemplateStyle(project.type)} />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{formatDate(project.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
