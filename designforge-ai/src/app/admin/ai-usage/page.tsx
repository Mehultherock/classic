"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Cpu,
  BarChart3,
  Activity,
  Zap,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Layers,
  Sliders,
  Save,
  RotateCcw,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const modelsData = [
  { name: "GPT-4o (Design)", usage: 3452, percentage: 41, color: "from-primary to-secondary" },
  { name: "DALL-E 3 (Image)", usage: 2187, percentage: 26, color: "from-accent to-orange-500" },
  { name: "Stable Diffusion XL", usage: 1567, percentage: 19, color: "from-success to-emerald-500" },
  { name: "GPT-4o (Copy)", usage: 1226, percentage: 14, color: "from-info to-blue-500" },
];

const topUsers = [
  { name: "Acme Corporation", email: "acme@corp.com", generations: 847, plan: "Business" },
  { name: "Lisa Brown", email: "lisa@example.com", generations: 623, plan: "Business" },
  { name: "Robert Wilson", email: "robert@example.com", generations: 451, plan: "Pro" },
  { name: "John Doe", email: "john@example.com", generations: 328, plan: "Pro" },
  { name: "Emily Davis", email: "emily@example.com", generations: 156, plan: "Free" },
];

export default function AIUsagePage() {
  const [rateLimit, setRateLimit] = useState(100);
  const [dailyQuota, setDailyQuota] = useState(5000);

  const weeklyData = [
    { label: "Mon", value: 4200 },
    { label: "Tue", value: 3800 },
    { label: "Wed", value: 5100 },
    { label: "Thu", value: 4600 },
    { label: "Fri", value: 6100 },
    { label: "Sat", value: 5400 },
    { label: "Sun", value: 3900 },
  ];
  const maxWeekly = Math.max(...weeklyData.map(d => d.value));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">AI Usage Monitoring</h1>
        <p className="text-muted-foreground mt-1">Track AI generation usage, model performance, and rate limits.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Generations", value: "8,432", icon: Cpu, color: "from-primary to-secondary", change: "+23% this month" },
          { label: "Today", value: "412", icon: Zap, color: "from-accent to-orange-500", change: "On track (+12%)" },
          { label: "Active Users", value: "187", icon: Users, color: "from-success to-emerald-500", change: "Using AI today" },
          { label: "Avg Response", value: "1.2s", icon: Clock, color: "from-info to-blue-500", change: "Within threshold" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl glass border border-border/50 p-4 hover:border-primary/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center", stat.color)}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Usage by Model
            </h2>
            <span className="text-xs text-muted-foreground">Total: 8,432</span>
          </div>
          <div className="space-y-4">
            {modelsData.map((model) => (
              <div key={model.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{model.name}</span>
                  <span className="text-sm text-muted-foreground">{model.usage.toLocaleString()} ({model.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-card overflow-hidden">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r transition-all duration-500", model.color)}
                    style={{ width: `${model.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Weekly AI Usage
            </h2>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          <div className="flex items-end justify-between h-48 pt-4">
            {weeklyData.map((d) => (
              <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-[10px] text-muted-foreground font-medium">{(d.value / 1000).toFixed(1)}k</span>
                <div className="w-full flex justify-center">
                  <div
                    className="w-6 sm:w-8 rounded-lg bg-gradient-to-t from-primary to-secondary transition-all duration-500"
                    style={{ height: `${(d.value / maxWeekly) * 140}px` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-info" />
              Top Users by Usage
            </h2>
          </div>
          <div className="space-y-3">
            {topUsers.map((user, i) => (
              <div key={user.name} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white",
                  i === 0 ? "bg-gradient-to-br from-accent to-orange-500" :
                  i === 1 ? "bg-gradient-to-br from-primary to-secondary" :
                  "bg-gradient-to-br from-card to-surface-hover border border-border text-muted-foreground"
                )}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{user.generations}</p>
                  <p className={cn(
                    "text-[10px] font-medium",
                    user.plan === "Business" ? "text-accent" : user.plan === "Pro" ? "text-primary" : "text-muted-foreground"
                  )}>{user.plan}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Sliders className="w-5 h-5 text-warning" />
              Rate Limiting Controls
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-foreground">Max Requests per User per Minute</label>
                <span className="text-sm font-medium text-foreground">{rateLimit}</span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                value={rateLimit}
                onChange={(e) => setRateLimit(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-card cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>10</span>
                <span>500</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-foreground">Daily Global Quota</label>
                <span className="text-sm font-medium text-foreground">{dailyQuota.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={1000}
                max={50000}
                step={1000}
                value={dailyQuota}
                onChange={(e) => setDailyQuota(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none bg-card cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1,000</span>
                <span>50,000</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-card/50 border border-border/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Current Usage: 72% of daily quota</p>
                <p className="text-xs text-muted-foreground mt-0.5">Estimated 3,600 generations used today out of {dailyQuota.toLocaleString()} limit.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
              <button className="h-10 px-6 rounded-xl bg-card border border-border text-sm text-foreground hover:border-primary/30 transition-colors flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
