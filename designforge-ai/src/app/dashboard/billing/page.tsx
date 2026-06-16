"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/constants";
import {
  CreditCard,
  Sparkles,
  Check,
  Download,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Clock,
  Loader2,
} from "lucide-react";

const planFeatures = {
  free: ["5 AI generations/day", "Standard quality exports", "Basic templates", "Watermark on exports"],
  pro: ["Unlimited AI generations", "HD exports", "Premium templates", "No watermark", "AI image generation", "Priority support"],
  business: ["Everything in Pro", "Team collaboration (up to 10)", "Advanced analytics", "Dedicated support", "Custom branding", "API access"],
};

const paymentHistory = [
  { id: "1", date: "2025-06-01T00:00:00Z", amount: 19, currency: "USD", status: "succeeded", description: "Pro Plan - Monthly" },
  { id: "2", date: "2025-05-01T00:00:00Z", amount: 19, currency: "USD", status: "succeeded", description: "Pro Plan - Monthly" },
  { id: "3", date: "2025-04-01T00:00:00Z", amount: 19, currency: "USD", status: "succeeded", description: "Pro Plan - Monthly" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BillingPage() {
  const { user } = useAuthStore();
  const currentPlan = user?.plan || "free";
  const [loading, setLoading] = useState<string | null>(null);

  const plans = ["free", "pro", "business"] as const;

  const handleUpgrade = (plan: string) => {
    if (plan === currentPlan) return;
    setLoading(plan);
    setTimeout(() => setLoading(null), 2000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Billing</h1>
        <p className="text-muted-foreground mt-1">Manage your subscription and payment history.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <h2 className="text-2xl font-bold text-foreground capitalize">{currentPlan}</h2>
              <p className="text-sm text-muted-foreground">
                {currentPlan === "free"
                  ? "Free plan with limited features"
                  : `$${PLANS[currentPlan as keyof typeof PLANS].price}/month`}
              </p>
            </div>
          </div>
          {currentPlan !== "business" && (
            <Button
              variant="premium"
              onClick={() => handleUpgrade(currentPlan === "free" ? "pro" : "business")}
              loading={loading === (currentPlan === "free" ? "pro" : "business")}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {currentPlan === "free" ? "Upgrade to Pro" : "Upgrade to Business"}
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const planData = PLANS[plan as keyof typeof PLANS];
          const isCurrent = plan === currentPlan;
          const isUpgrade =
            plans.indexOf(plan as typeof plans[number]) > plans.indexOf(currentPlan as typeof plans[number]);
          return (
            <div
              key={plan}
              className={cn(
                "relative rounded-2xl border p-6 transition-all duration-300",
                isCurrent
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "glass border-border/50 hover:border-primary/30"
              )}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-xs font-medium text-white">
                  Current Plan
                </div>
              )}
              {plan === "pro" && !isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-accent text-xs font-medium text-accent-foreground">
                  Popular
                </div>
              )}
              <div className="text-center mb-6 pt-2">
                <h3 className="text-xl font-bold text-foreground capitalize">{plan}</h3>
                <p className="text-3xl font-bold text-foreground mt-2">
                  ${planData.price}
                  <span className="text-sm text-muted-foreground font-normal">/month</span>
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                {planFeatures[plan as keyof typeof planFeatures].map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-success mt-0.5 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              {!isCurrent && (
                <Button
                  variant={isUpgrade ? "gradient" : "secondary"}
                  className="w-full"
                  onClick={() => handleUpgrade(plan)}
                  loading={loading === plan}
                >
                  {isUpgrade ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Upgrade
                    </>
                  ) : (
                    "Downgrade"
                  )}
                </Button>
              )}
              {isCurrent && (
                <Button variant="secondary" className="w-full" disabled>
                  Current Plan
                </Button>
              )}
            </div>
          );
        })}
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Payment History</h2>
          <Button variant="secondary" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Description</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Amount</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((p) => (
                <tr key={p.id} className="border-b border-border/30 hover:bg-card/50 transition-colors">
                  <td className="py-3 px-2 text-foreground">{formatDate(p.date)}</td>
                  <td className="py-3 px-2 text-muted-foreground">{p.description}</td>
                  <td className="py-3 px-2 text-foreground font-medium">{formatCurrency(p.amount, p.currency)}</td>
                  <td className="py-3 px-2">
                    <span className={cn(
                      "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                      p.status === "succeeded" ? "text-success bg-success/10" :
                      p.status === "failed" ? "text-error bg-error/10" :
                      "text-accent bg-accent/10"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <button className="text-primary hover:underline text-xs flex items-center gap-1 ml-auto">
                      <Download className="w-3 h-3" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
