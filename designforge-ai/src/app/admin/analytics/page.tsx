"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  LayoutTemplate,
  FolderKanban,
  Download,
  Calendar,
  ChevronDown,
  FileText,
  Activity,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const dateRanges = ["7 Days", "30 Days", "90 Days", "This Year", "All Time"];

const stats = [
  { label: "Total Users", value: "12,847", change: "+18.2%", trend: "up", icon: Users, color: "from-primary to-secondary" },
  { label: "Total Revenue", value: "$284,391", change: "+24.7%", trend: "up", icon: DollarSign, color: "from-success to-emerald-500" },
  { label: "Projects Created", value: "31,204", change: "+31.5%", trend: "up", icon: FolderKanban, color: "from-accent to-orange-500" },
  { label: "Template Downloads", value: "18,936", change: "+15.3%", trend: "up", icon: Download, color: "from-info to-blue-500" },
];

function ChartBar({ height, label, value, max, color }: { height: number; label: string; value: number | string; max: number; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <span className="text-[10px] text-muted-foreground font-medium">{value}</span>
      <div className="w-full flex justify-center">
        <div
          className={cn("w-6 sm:w-8 rounded-lg bg-gradient-to-t transition-all duration-500", color)}
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

  const userGrowthData = [
    { label: "Jan", value: 1200 },
    { label: "Feb", value: 1800 },
    { label: "Mar", value: 2400 },
    { label: "Apr", value: 3100 },
    { label: "May", value: 4000 },
    { label: "Jun", value: 5200 },
  ];

  const revenueData = [
    { label: "Jan", value: 18500 },
    { label: "Feb", value: 22300 },
    { label: "Mar", value: 28700 },
    { label: "Apr", value: 34100 },
    { label: "May", value: 42900 },
    { label: "Jun", value: 51200 },
  ];

  const projectsData = [
    { label: "Mon", value: 145 },
    { label: "Tue", value: 198 },
    { label: "Wed", value: 167 },
    { label: "Thu", value: 234 },
    { label: "Fri", value: 289 },
    { label: "Sat", value: 312 },
    { label: "Sun", value: 201 },
  ];

  const templatePopularity = [
    { name: "Birthday Poster", downloads: 2103, percentage: 100 },
    { name: "Diwali Card", downloads: 1856, percentage: 88 },
    { name: "Wedding Invite", downloads: 1542, percentage: 73 },
    { name: "Tech Banner", downloads: 1208, percentage: 57 },
    { name: "Summer Sale", downloads: 987, percentage: 47 },
  ];

  const maxUserGrowth = Math.max(...userGrowthData.map(d => d.value));
  const maxRevenue = Math.max(...revenueData.map(d => d.value));
  const maxProjects = Math.max(...projectsData.map(d => d.value));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Advanced platform analytics and trends.</p>
        </div>
        <div className="flex items-center gap-3">
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
                {dateRanges.map((r) => (
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
          <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <TrendingUp className="w-3 h-3" />
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
              <Users className="w-5 h-5 text-primary" />
              User Growth
            </h2>
          </div>
          <div className="flex items-end justify-between h-48 pt-4">
            {userGrowthData.map((d) => (
              <ChartBar
                key={d.label}
                height={(d.value / maxUserGrowth) * 140}
                label={d.label}
                value={d.value}
                max={maxUserGrowth}
                color="from-primary to-secondary"
              />
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              Revenue
            </h2>
          </div>
          <div className="flex items-end justify-between h-48 pt-4">
            {revenueData.map((d) => (
              <ChartBar
                key={d.label}
                height={(d.value / maxRevenue) * 140}
                label={d.label}
                value={`$${(d.value / 1000).toFixed(0)}k`}
                max={maxRevenue}
                color="from-success to-emerald-500"
              />
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-accent" />
              Project Creation Trends
            </h2>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          <div className="flex items-end justify-between h-48 pt-4">
            {projectsData.map((d) => (
              <ChartBar
                key={d.label}
                height={(d.value / maxProjects) * 140}
                label={d.label}
                value={d.value}
                max={maxProjects}
                color="from-accent to-orange-500"
              />
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-info" />
              Template Popularity
            </h2>
          </div>
          <div className="space-y-4">
            {templatePopularity.map((t) => (
              <div key={t.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{t.name}</span>
                  <span className="text-sm text-muted-foreground">{t.downloads.toLocaleString()} downloads</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-card overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-info to-blue-500 transition-all duration-500"
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
