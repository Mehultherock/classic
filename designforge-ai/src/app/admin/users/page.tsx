"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDate } from "@/lib/utils";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Edit3,
  Ban,
  Trash2,
  Mail,
  Crown,
  X,
  UserCheck,
  Users,
  TrendingUp,
  UserPlus,
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

const plans = ["All Plans", "Free", "Pro", "Business"] as const;

const usersData = [
  { id: "1", name: "John Doe", email: "john@example.com", plan: "Pro", status: "active", date: new Date("2025-05-01"), projects: 12, lastActive: new Date("2025-06-10"), avatar: null },
  { id: "2", name: "Sarah Smith", email: "sarah@example.com", plan: "Free", status: "active", date: new Date("2025-04-15"), projects: 3, lastActive: new Date("2025-06-09"), avatar: null },
  { id: "3", name: "Acme Corporation", email: "acme@corp.com", plan: "Business", status: "active", date: new Date("2025-03-20"), projects: 48, lastActive: new Date("2025-06-10"), avatar: null },
  { id: "4", name: "Mike Johnson", email: "mike@example.com", plan: "Pro", status: "suspended", date: new Date("2025-02-10"), projects: 7, lastActive: new Date("2025-05-28"), avatar: null },
  { id: "5", name: "Emily Davis", email: "emily@example.com", plan: "Free", status: "active", date: new Date("2025-06-01"), projects: 1, lastActive: new Date("2025-06-08"), avatar: null },
  { id: "6", name: "Robert Wilson", email: "robert@example.com", plan: "Pro", status: "active", date: new Date("2025-01-05"), projects: 25, lastActive: new Date("2025-06-10"), avatar: null },
  { id: "7", name: "Lisa Brown", email: "lisa@example.com", plan: "Business", status: "active", date: new Date("2024-12-01"), projects: 67, lastActive: new Date("2025-06-10"), avatar: null },
  { id: "8", name: "Alex Turner", email: "alex@example.com", plan: "Free", status: "suspended", date: new Date("2025-03-15"), projects: 2, lastActive: new Date("2025-05-15"), avatar: null },
];

const ITEMS_PER_PAGE = 5;

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

function UserDetailModal({ user, onClose }: { user: typeof usersData[0] | null; onClose: () => void }) {
  if (!user) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-20 px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg rounded-2xl glass-strong border border-border/50 shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">User Details</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card text-muted-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xl font-bold text-white">
                {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xl font-bold text-foreground">{user.name}</h4>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="mt-2">
                  <PlanBadge plan={user.plan} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-card/50 border border-border/30">
                <p className="text-xs text-muted-foreground">Status</p>
                <span className={cn(
                  "inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-lg text-xs font-medium border",
                  user.status === "active" ? "text-success bg-success/10 border-success/20" : "text-error bg-error/10 border-error/20"
                )}>
                  <span className={cn("w-1.5 h-1.5 rounded-full", user.status === "active" ? "bg-success" : "bg-error")} />
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-card/50 border border-border/30">
                <p className="text-xs text-muted-foreground">Total Projects</p>
                <p className="text-lg font-bold text-foreground mt-1">{user.projects}</p>
              </div>
              <div className="p-4 rounded-xl bg-card/50 border border-border/30">
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="text-sm font-medium text-foreground mt-1">{formatDate(user.date)}</p>
              </div>
              <div className="p-4 rounded-xl bg-card/50 border border-border/30">
                <p className="text-xs text-muted-foreground">Last Active</p>
                <p className="text-sm font-medium text-foreground mt-1">{formatDate(user.lastActive)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="h-9 px-4 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors flex items-center gap-2">
                <Edit3 className="w-4 h-4" /> Edit User
              </button>
              <button className="h-9 px-4 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors flex items-center gap-2">
                <Crown className="w-4 h-4" /> Change Plan
              </button>
              <button className="h-9 px-4 rounded-lg bg-warning/10 text-warning text-sm font-medium hover:bg-warning/20 transition-colors flex items-center gap-2">
                <Ban className="w-4 h-4" /> Suspend
              </button>
              <button className="h-9 px-4 rounded-lg bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
              <button className="h-9 px-4 rounded-lg bg-info/10 text-info text-sm font-medium hover:bg-info/20 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" /> Send Email
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<typeof plans[number]>("All Plans");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<typeof usersData[0] | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = usersData.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesPlan = planFilter === "All Plans" || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage and monitor all platform users.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: usersData.length.toString(), icon: Users, color: "from-primary to-secondary" },
          { label: "Active", value: usersData.filter(u => u.status === "active").length.toString(), icon: UserCheck, color: "from-success to-emerald-500" },
          { label: "Pro & Business", value: usersData.filter(u => u.plan !== "Free").length.toString(), icon: TrendingUp, color: "from-accent to-orange-500" },
          { label: "New This Month", value: "3", icon: UserPlus, color: "from-info to-blue-500" },
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
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {plans.map((p) => (
            <button
              key={p}
              onClick={() => { setPlanFilter(p); setCurrentPage(1); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
                planFilter === p
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">User</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Plan</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden md:table-cell">Created</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Projects</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Last Active</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-border/30 hover:bg-card/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
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
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{formatDate(user.date)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">{user.projects}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">{formatDate(user.lastActive)}</td>
                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === user.id ? null : user.id); }}
                      className="p-1.5 rounded-lg hover:bg-card text-muted-foreground transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {openMenuId === user.id && (
                      <div
                        className="absolute right-6 top-12 w-44 rounded-xl glass border border-border/50 shadow-xl overflow-hidden z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {[
                          { icon: Edit3, label: "Edit User", color: "text-foreground" },
                          { icon: Crown, label: "Change Plan", color: "text-accent" },
                          { icon: Ban, label: "Suspend", color: "text-warning" },
                          { icon: Trash2, label: "Delete", color: "text-error" },
                          { icon: Mail, label: "Send Email", color: "text-info" },
                        ].map((action) => (
                          <button
                            key={action.label}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors hover:bg-card"
                            onClick={() => setOpenMenuId(null)}
                          >
                            <action.icon className={cn("w-4 h-4", action.color)} />
                            <span className={action.color}>{action.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length === 0 && (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No users found matching your filters.</p>
          </div>
        )}
      </motion.div>

      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} users
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "w-9 h-9 rounded-lg text-sm font-medium border transition-colors",
                  currentPage === page
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
    </motion.div>
  );
}
