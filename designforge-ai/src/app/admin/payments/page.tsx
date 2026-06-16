"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatDate, formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  X,
  RotateCcw,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Receipt,
  MoreHorizontal,
  Eye,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const statuses = ["All", "succeeded", "pending", "failed", "refunded"] as const;

const paymentsData = [
  { id: "p1", user: "Acme Corporation", email: "acme@corp.com", amount: 49, plan: "Business", status: "succeeded", date: new Date("2025-06-10"), method: "Stripe", card: "···· 4242" },
  { id: "p2", user: "John Doe", email: "john@example.com", amount: 19, plan: "Pro", status: "succeeded", date: new Date("2025-06-09"), method: "PayPal", card: "—" },
  { id: "p3", user: "Robert Wilson", email: "robert@example.com", amount: 19, plan: "Pro", status: "pending", date: new Date("2025-06-08"), method: "Stripe", card: "···· 1234" },
  { id: "p4", user: "Mike Johnson", email: "mike@example.com", amount: 19, plan: "Pro", status: "refunded", date: new Date("2025-06-07"), method: "Stripe", card: "···· 5678" },
  { id: "p5", user: "Lisa Brown", email: "lisa@example.com", amount: 49, plan: "Business", status: "succeeded", date: new Date("2025-06-06"), method: "PayPal", card: "—" },
  { id: "p6", user: "Sarah Smith", email: "sarah@example.com", amount: 0, plan: "Free", status: "failed", date: new Date("2025-06-05"), method: "—", card: "—" },
  { id: "p7", user: "Emily Davis", email: "emily@example.com", amount: 19, plan: "Pro", status: "succeeded", date: new Date("2025-06-04"), method: "Stripe", card: "···· 9012" },
  { id: "p8", user: "Alex Turner", email: "alex@example.com", amount: 0, plan: "Free", status: "pending", date: new Date("2025-06-03"), method: "—", card: "—" },
];

function PaymentDetailsModal({ payment, onClose }: { payment: typeof paymentsData[0] | null; onClose: () => void }) {
  if (!payment) return null;
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
            <div className="flex items-center gap-3">
              <Receipt className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Payment Details</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-card text-muted-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="text-sm font-mono text-foreground">#DF-{payment.id.toUpperCase()}</p>
              </div>
              <span className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border capitalize",
                payment.status === "succeeded" && "text-success bg-success/10 border-success/20",
                payment.status === "pending" && "text-warning bg-warning/10 border-warning/20",
                payment.status === "failed" && "text-error bg-error/10 border-error/20",
                payment.status === "refunded" && "text-info bg-info/10 border-info/20",
              )}>
                {payment.status}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-card/50 border border-border/30">
              <p className="text-xs text-muted-foreground mb-1">Amount</p>
              <p className="text-3xl font-bold text-foreground">{formatCurrency(payment.amount)}</p>
              <p className="text-sm text-muted-foreground mt-1">{payment.plan} Plan · {payment.method}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-card/50 border border-border/30">
                <p className="text-xs text-muted-foreground">Customer</p>
                <p className="text-sm font-medium text-foreground mt-1">{payment.user}</p>
                <p className="text-xs text-muted-foreground">{payment.email}</p>
              </div>
              <div className="p-4 rounded-xl bg-card/50 border border-border/30">
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-medium text-foreground mt-1">{formatDate(payment.date)}</p>
              </div>
            </div>

            {payment.status === "succeeded" && (
              <button className="w-full h-10 rounded-lg bg-warning/10 text-warning text-sm font-medium hover:bg-warning/20 transition-colors flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Issue Refund
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<typeof statuses[number]>("All");
  const [selectedPayment, setSelectedPayment] = useState<typeof paymentsData[0] | null>(null);

  const filtered = paymentsData.filter((p) => {
    const matchesSearch = p.user.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const succeeded = paymentsData.filter(p => p.status === "succeeded");
  const totalRevenue = succeeded.reduce((sum, p) => sum + p.amount, 0);
  const refunded = paymentsData.filter(p => p.status === "refunded").length;
  const pending = paymentsData.filter(p => p.status === "pending").length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Payment Management</h1>
        <p className="text-muted-foreground mt-1">Track revenue, manage transactions, and process refunds.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign, color: "from-success to-emerald-500", change: "+12.5%" },
          { label: "Transactions", value: paymentsData.length.toString(), icon: CreditCard, color: "from-primary to-secondary", change: `${succeeded.length} succeeded` },
          { label: "Refunded", value: refunded.toString(), icon: ArrowDownRight, color: "from-info to-blue-500", change: `${((refunded / paymentsData.length) * 100).toFixed(1)}% rate` },
          { label: "Pending", value: pending.toString(), icon: Clock, color: "from-accent to-orange-500", change: "Requires attention" },
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

      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by user or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize",
                statusFilter === s
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
              )}
            >
              {s}
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
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Amount</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Plan</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Method</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-border/30 hover:bg-card/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedPayment(payment)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{payment.user}</p>
                      <p className="text-xs text-muted-foreground">{payment.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-sm font-semibold",
                      payment.amount === 0 ? "text-muted-foreground" : "text-foreground"
                    )}>
                      {payment.amount === 0 ? "—" : formatCurrency(payment.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium border",
                      payment.plan === "Free" && "bg-card text-muted-foreground border-border",
                      payment.plan === "Pro" && "bg-primary/10 text-primary border-primary/20",
                      payment.plan === "Business" && "bg-accent/10 text-accent border-accent/20",
                    )}>
                      {payment.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border capitalize",
                      payment.status === "succeeded" && "text-success bg-success/10 border-success/20",
                      payment.status === "pending" && "text-warning bg-warning/10 border-warning/20",
                      payment.status === "failed" && "text-error bg-error/10 border-error/20",
                      payment.status === "refunded" && "text-info bg-info/10 border-info/20",
                    )}>
                      {payment.status === "succeeded" && <CheckCircle className="w-3 h-3" />}
                      {payment.status === "pending" && <Clock className="w-3 h-3" />}
                      {payment.status === "failed" && <XCircle className="w-3 h-3" />}
                      {payment.status === "refunded" && <RotateCcw className="w-3 h-3" />}
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden md:table-cell">{formatDate(payment.date)}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground hidden lg:table-cell">{payment.method}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedPayment(payment); }}
                      className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <CreditCard className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No payments found matching your filters.</p>
          </div>
        )}
      </motion.div>

      <PaymentDetailsModal payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
    </motion.div>
  );
}
