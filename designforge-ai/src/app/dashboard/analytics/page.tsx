"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  FolderKanban,
  Sparkles,
  Download,
  Users,
  Calendar,
  ChevronDown,
  Activity,
  Eye,
  MousePointerClick,
  Share2,
} from "lucide-react";

const timeRanges = ["7 Days", "30 Days", "90 Days", "This Year"];

const stats = [
  { label: "Total Views", value: "1,247", change: "+12.5%", trend: "up", icon: Eye, color: "from-primary to-secondary" },
  { label: "AI Generations", value: "87", change: "+23.1%", trend: "up", icon: Sparkles, color: "from-accent to-orange-500" },
  { label: "Downloads", value: "342", change: "+8.3%", trend: "up", icon: Download, color: "from-success to-emerald-500" },
  { label: "Click Rate", value: "24.8%", change: "-2.1%", trend: "down", icon: MousePointerClick, color: "from-info to-blue-500" },
  { label: "Projects Created", value: "45", change: "+15.2%", trend: "up", icon: FolderKanban, color: "from-purple-500 to-pink-500" },
  { label: "Shares", value: "128", change: "+5.7%", trend: "up", icon: Share2, color: "from-secondary to-teal-500" },
];

const recentActivity = [
  { action: "Created project", detail: "Summer Sale Banner", time: "2 hours ago" },
  { action: "Downloaded", detail: "Wedding Invitation as PNG", time: "5 hours ago" },
  { action: "AI Generation", detail: "Birthday poster design", time: "1 day ago" },
  { action: "Shared", detail: "Tech Conference Poster", time: "2 days ago" },
  { action: "Team update", detail: "Alex edited Corporate Flyer", time: "3 days ago" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ChartBar({ height, label, value, max }: { height: number; label: string; value: number; max: number }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <span className="text-[10px] text-muted-foreground font-medium">{value}</span>
      <div className="w-full flex justify-center">
        <div
          className="w-6 sm:w-8 rounded-lg bg-gradient-to-t from-primary to-secondary transition-all duration-500 hover:from-primary-light hover:to-secondary"
          style={{ height: `${height}px` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [range, setRange] = useState("30 Days");
  const [rangeOpen, setRangeOpen] = useState(false);

  const weeklyData = [
    { label: "Mon", value: 12 },
    { label: "Tue", value: 18 },
    { label: "Wed", value: 8 },
    { label: "Thu", value: 22 },
    { label: "Fri", value: 15 },
    { label: "Sat", value: 25 },
    { label: "Sun", value: 10 },
  ];

  const maxVal = Math.max(...weeklyData.map((d) => d.value));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 max-w-6xl mx-auto space-y-8">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your design performance and activity.</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setRangeOpen(!rangeOpen)}
            className="h-10 px-4 rounded-xl bg-card border border-border text-sm text-foreground flex items-center gap-2 hover:border-primary/30 transition-colors"
          >
            <Calendar className="w-4 h-4 text-muted-foreground" />
            {range}
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {rangeOpen && (
            <div className="absolute top-12 right-0 w-40 rounded-xl glass border border-border/50 shadow-xl overflow-hidden z-10">
              {timeRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => { setRange(r); setRangeOpen(false); }}
                  className={cn(
                    "w-full px-4 py-2.5 text-sm text-left transition-colors",
                    range === r ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-card"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl glass border border-border/50 p-4 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className={cn(
                  "text-[10px] font-medium flex items-center gap-0.5",
                  stat.trend === "up" ? "text-success" : "text-error"
                )}>
                  {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Weekly Activity
            </h2>
          </div>
          <div className="flex items-end justify-between h-40 pt-4">
            {weeklyData.map((d) => (
              <ChartBar key={d.label} height={(d.value / maxVal) * 120} label={d.label} value={d.value} max={maxVal} />
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((act, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary/50 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{act.action}</span>
                    {act.detail && <span className="text-muted-foreground"> - {act.detail}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
