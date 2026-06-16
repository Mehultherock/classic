"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Lock,
  Bell,
  Moon,
  Sun,
  Camera,
  Loader2,
  Check,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "password", label: "Password", icon: Lock },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "theme", label: "Theme", icon: Moon },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function ProfileTab() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  const [email] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold text-white">
            {getInitials(name || "U")}
          </div>
          <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-6 h-6 text-white" />
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Profile Photo</h3>
          <p className="text-sm text-muted-foreground">Click to upload a new photo</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} icon={<User className="w-4 h-4" />} />
        <Input label="Email" value={email} disabled icon={<User className="w-4 h-4" />} />
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} variant="gradient">
          {saved ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saved ? "Saved" : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}

function PasswordTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    setSaving(true);
    setTimeout(() => setSaving(false), 1000);
  };

  return (
    <div className="space-y-4 max-w-md">
      <Input
        label="Current Password"
        type={showCurrent ? "text" : "password"}
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        rightIcon={
          <button onClick={() => setShowCurrent(!showCurrent)}>
            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />
      <Input
        label="New Password"
        type={showNew ? "text" : "password"}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
        rightIcon={
          <button onClick={() => setShowNew(!showNew)}>
            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />
      <Input
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon={<Lock className="w-4 h-4" />}
      />
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving} variant="gradient">
          <Save className="w-4 h-4 mr-2" />
          Update Password
        </Button>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    designUpdates: true,
    teamActivity: true,
    billingAlerts: true,
    promotions: false,
    weeklyDigest: true,
    marketingEmails: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggles = [
    { key: "designUpdates" as const, label: "Design Updates", desc: "When your AI designs are ready" },
    { key: "teamActivity" as const, label: "Team Activity", desc: "When team members make changes" },
    { key: "billingAlerts" as const, label: "Billing Alerts", desc: "Payment confirmations and warnings" },
    { key: "promotions" as const, label: "Promotions & Tips", desc: "New features and design tips" },
    { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Weekly summary of your activity" },
    { key: "marketingEmails" as const, label: "Marketing Emails", desc: "Special offers and updates" },
  ];

  return (
    <div className="space-y-3 max-w-lg">
      {toggles.map((t) => (
        <label key={t.key} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/30 transition-colors">
          <div>
            <p className="text-sm font-medium text-foreground">{t.label}</p>
            <p className="text-xs text-muted-foreground">{t.desc}</p>
          </div>
          <div className={cn("w-10 h-6 rounded-full transition-colors relative shrink-0", settings[t.key] ? "bg-primary" : "bg-muted")}>
            <div className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm", settings[t.key] ? "translate-x-[18px]" : "translate-x-0.5")} />
            <input type="checkbox" checked={settings[t.key]} onChange={() => toggle(t.key)} className="sr-only" />
          </div>
        </label>
      ))}
    </div>
  );
}

function ThemeTab() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="space-y-4 max-w-md">
      <p className="text-sm text-muted-foreground">Choose your preferred appearance for the dashboard.</p>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setTheme("dark")}
          className={cn(
            "p-6 rounded-xl border text-center transition-all duration-200",
            theme === "dark" ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
          )}
        >
          <Moon className={cn("w-8 h-8 mx-auto mb-3", theme === "dark" ? "text-primary" : "text-muted-foreground")} />
          <p className={cn("font-medium", theme === "dark" ? "text-primary" : "text-foreground")}>Dark</p>
          <p className="text-xs text-muted-foreground mt-1">Easy on the eyes</p>
        </button>
        <button
          onClick={() => setTheme("light")}
          className={cn(
            "p-6 rounded-xl border text-center transition-all duration-200",
            theme === "light" ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/30"
          )}
        >
          <Sun className={cn("w-8 h-8 mx-auto mb-3", theme === "light" ? "text-primary" : "text-muted-foreground")} />
          <p className={cn("font-medium", theme === "light" ? "text-primary" : "text-foreground")}>Light</p>
          <p className="text-xs text-muted-foreground mt-1">Bright and clean</p>
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const ActiveComponent: React.ComponentType = {
    profile: ProfileTab,
    password: PasswordTab,
    notifications: NotificationsTab,
    theme: ThemeTab,
  }[activeTab] as React.ComponentType;

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-2 border-b border-border/50 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-card border border-transparent"
              )}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      <motion.div key={activeTab} variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6">
        <ActiveComponent />
      </motion.div>
    </motion.div>
  );
}
