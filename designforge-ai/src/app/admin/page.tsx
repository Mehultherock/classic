"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Cpu,
  Download,
  RefreshCw,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Shield,
  UserPlus,
  LayoutTemplate,
  Send,
  FileText,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const statsCards = [
  { label: "Daily Users", value: "1,284", change: "+12.5%", trend: "up", icon: Users, color: "from-primary to-secondary" },
  { label: "Revenue", value: "$12,847", change: "+8.3%", trend: "up", icon: DollarSign, color: "from-success to-emerald-500" },
  { label: "Conversions", value: "24.8%", change: "+2.1%", trend: "up", icon: TrendingUp, color: "from-accent to-orange-500" },
  { label: "AI Usage", value: "8,432", change: "+23.5%", trend: "up", icon: Cpu, color: "from-purple-500 to-pink-500" },
  { label: "Downloads", value: "3,291", change: "-4.2%", trend: "down", icon: Download, color: "from-info to-blue-500" },
  { label: "Retention", value: "78.4%", change: "+5.7%", trend: "up", icon: RefreshCw, color: "from-secondary to-teal-500" },
];

const recentUsers = [
  { id: "1", name: "John Doe", email: "john@example.com", plan: "Pro", status: "active", date: new Date("2025-06-10"), avatar: null },
  { id: "2", name: "Sarah Smith", email: "sarah@example.com", plan: "Free", status: "active", date: new Date("2025-06-09"), avatar: null },
  { id: "3", name: "Acme Corp", email: "acme@example.com", plan: "Business", status: "active", date: new Date("2025-06-08"), avatar: null },
  { id: "4", name: "Mike Johnson", email: "mike@example.com", plan: "Pro", status: "suspended", date: new Date("2025-06-07"), avatar: null },
];

const recentPayments = [
  { id: "p1", user: "Acme Corp", amount: 49, plan: "Business", status: "succeeded", date: new Date("2025-06-10"), method: "Stripe" },
  { id: "p2", user: "John Doe", amount: 19, plan: "Pro", status: "succeeded", date: new Date("2025-06-09"), method: "PayPal" },
  { id: "p3", user: "Sarah Smith", amount: 0, plan: "Free", status: "pending", date: new Date("2025-06-08"), method: "—" },
  { id: "p4", user: "Mike Johnson", amount: 19, plan: "Pro", status: "refunded", date: new Date("2025-06-07"), method: "Stripe" },
];

const systemHealth = [
  { name: "API Server", status: "operational", uptime: "99.9%", latency: "45ms" },
  { name: "AI Generation", status: "operational", uptime: "99.7%", latency: "1.2s" },
  { name: "Database", status: "operational", uptime: "100%", latency: "12ms" },
  { name: "Storage (CDN)", status: "operational", uptime: "99.9%", latency: "34ms" },
  { name: "Email Service", status: "degraded", uptime: "98.2%", latency: "2.1s" },
];

const statusIcon: Record<string, React.ElementType> = {
  operational: CheckCircle,
  degraded: AlertTriangle,
  down: XCircle,
};

function StatCard({ stat, index }: { stat: typeof statsCards[0]; index: number }) {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
  return (
    <motion.div
      variants={itemVariants}
      className="rounded-2xl glass border border-border/50 p-5 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
          <p className="text-2xl lg:text-3xl font-bold text-foreground mt-1">{stat.value}</p>
          <div className="flex items-center gap-1 mt-1">
            <TrendIcon className={cn("w-3 h-3", stat.trend === "up" ? "text-success" : "text-error")} />
            <span className={cn("text-xs font-medium", stat.trend === "up" ? "text-success" : "text-error")}>
              {stat.change}
            </span>
          </div>
        </div>
        <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center", stat.color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br", stat.color)} />
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const Icon = statusIcon[status] || AlertTriangle;
  const colors: Record<string, string> = {
    operational: "text-success bg-success/10 border-success/20",
    degraded: "text-warning bg-warning/10 border-warning/20",
    down: "text-error bg-error/10 border-error/20",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border", colors[status])}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const colors: Record<string, string> = {
    Free: "bg-card text-muted-foreground border-border",
    Pro: "bg-primary/10 text-primary border-primary/20",
    Business: "bg-accent/10 text-accent border-accent/20",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium border", colors[plan] || colors.Free)}>
      {plan}
    </span>
  );
}

function PaymentStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    succeeded: "text-success bg-success/10 border-success/20",
    pending: "text-warning bg-warning/10 border-warning/20",
    failed: "text-error bg-error/10 border-error/20",
    refunded: "text-info bg-info/10 border-info/20",
  };
  return (
    <span className={cn("px-2.5 py-1 rounded-lg text-xs font-medium border capitalize", colors[status])}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const [currentTime] = useState(new Date().toLocaleString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }));

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">{currentTime}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="h-10 px-4 rounded-xl bg-card border border-border text-sm text-foreground hover:border-primary/30 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statsCards.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Revenue Overview
            </h2>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="flex items-end justify-between h-48 pt-4">
            {[
              { label: "Mon", value: 3200 },
              { label: "Tue", value: 2800 },
              { label: "Wed", value: 4100 },
              { label: "Thu", value: 3600 },
              { label: "Fri", value: 5200 },
              { label: "Sat", value: 4800 },
              { label: "Sun", value: 3900 },
            ].map((d) => {
              const maxV = 5200;
              return (
                <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] text-muted-foreground font-medium">${(d.value / 1000).toFixed(1)}k</span>
                  <div className="w-full flex justify-center">
                    <div
                      className="w-6 sm:w-8 rounded-lg bg-gradient-to-t from-primary to-secondary transition-all duration-500 hover:from-primary-light"
                      style={{ height: `${(d.value / maxV) * 140}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent" />
              AI Usage Trend
            </h2>
            <span className="text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="flex items-end justify-between h-48 pt-4">
            {[
              { label: "Mon", value: 850 },
              { label: "Tue", value: 920 },
              { label: "Wed", value: 1100 },
              { label: "Thu", value: 780 },
              { label: "Fri", value: 1350 },
              { label: "Sat", value: 1200 },
              { label: "Sun", value: 980 },
            ].map((d) => {
              const maxV = 1350;
              return (
                <div key={d.label} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-[10px] text-muted-foreground font-medium">{d.value}</span>
                  <div className="w-full flex justify-center">
                    <div
                      className="w-6 sm:w-8 rounded-lg bg-gradient-to-t from-accent to-orange-500 transition-all duration-500"
                      style={{ height: `${(d.value / maxV) * 140}px` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 overflow-hidden">
          <div className="p-6 pb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Recent Users
            </h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">User</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Plan</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((user) => (
                  <tr key={user.id} className="border-t border-border/30 hover:bg-card/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                          {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4"><PlanBadge plan={user.plan} /></td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border",
                        user.status === "active" ? "text-success bg-success/10 border-success/20" : "text-error bg-error/10 border-error/20"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", user.status === "active" ? "bg-success" : "bg-error")} />
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(user.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 overflow-hidden">
          <div className="p-6 pb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              Recent Payments
            </h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-border/50">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">User</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Amount</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr key={payment.id} className="border-t border-border/30 hover:bg-card/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{payment.user}</p>
                        <p className="text-xs text-muted-foreground">{payment.plan}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-foreground">{payment.amount === 0 ? "—" : formatCurrency(payment.amount)}</span>
                    </td>
                    <td className="px-6 py-4"><PaymentStatusBadge status={payment.status} /></td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(payment.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-2xl glass border border-border/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="w-5 h-5 text-success" />
              System Health
            </h2>
            <span className="text-xs text-success bg-success/10 px-2.5 py-1 rounded-lg font-medium">All Systems Stable</span>
          </div>
          <div className="space-y-3">
            {systemHealth.map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-xl bg-card/50 border border-border/30">
                <div className="flex items-center gap-3">
                  <StatusBadge status={service.status} />
                  <span className="text-sm font-medium text-foreground">{service.name}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Uptime</p>
                    <p className="text-sm font-medium text-foreground">{service.uptime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Latency</p>
                    <p className="text-sm font-medium text-foreground">{service.latency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <div className="space-y-3">
            <button className="flex items-center gap-3 w-full p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 hover:bg-card transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Add New User</p>
                <p className="text-xs text-muted-foreground">Create a manual account</p>
              </div>
            </button>
            <button className="flex items-center gap-3 w-full p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 hover:bg-card transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <LayoutTemplate className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Upload Template</p>
                <p className="text-xs text-muted-foreground">Add a new design template</p>
              </div>
            </button>
            <button className="flex items-center gap-3 w-full p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 hover:bg-card transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-success to-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Send Announcement</p>
                <p className="text-xs text-muted-foreground">Email all users</p>
              </div>
            </button>
            <button className="flex items-center gap-3 w-full p-4 rounded-xl bg-card/50 border border-border/30 hover:border-primary/30 hover:bg-card transition-all group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-info to-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-foreground">Generate Report</p>
                <p className="text-xs text-muted-foreground">Export analytics data</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
