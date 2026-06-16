"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  LayoutTemplate,
  CreditCard,
  Cpu,
  FileText,
  Mail,
  Settings,
  Megaphone,
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Sparkles,
  Shield,
  Search,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/ai-usage", label: "AI Usage", icon: Cpu },
  { href: "/admin/analytics", label: "Analytics", icon: FileText },
  { href: "#", label: "Content Moderation", icon: Shield },
  { href: "#", label: "Email Campaigns", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "#", label: "Announcements", icon: Megaphone },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New User Signup", message: "John Doe just created an account.", read: false, type: "user" },
    { id: 2, title: "Payment Received", message: "$49.00 from Acme Corp (Business plan).", read: false, type: "payment" },
    { id: 3, title: "AI Usage Alert", message: "Usage has exceeded 80% of daily quota.", read: false, type: "alert" },
    { id: 4, title: "New Template Uploaded", message: "Summer Collection templates added.", read: true, type: "template" },
  ]);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 glass border-r border-border/50 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 px-6 h-16 border-b border-border/50">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-display text-lg font-bold text-foreground">DesignForge</span>
            <span className="block text-[10px] font-medium text-primary tracking-wider uppercase">Admin Panel</span>
          </div>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href !== "#" && (pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href)));
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(item.href === "#" && "pointer-events-none opacity-60")}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-card border border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card/50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 glass border-b border-border/50">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-card text-muted-foreground"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="hidden sm:flex relative flex-1 max-w-md ml-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users, templates, payments..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-medium text-primary">Admin</span>
              </div>

              <div className="relative" ref={notifRef}>
                <button
                  className="relative p-2 rounded-lg hover:bg-card text-muted-foreground transition-colors"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-error text-[10px] font-bold text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl glass border border-border/50 shadow-xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-border/50">
                        <h3 className="font-semibold text-foreground">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              "p-4 border-b border-border/50 transition-colors cursor-pointer",
                              !n.read ? "bg-primary/5" : "hover:bg-card"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn("w-2 h-2 rounded-full mt-2 shrink-0", !n.read ? "bg-primary" : "bg-transparent")} />
                              <div>
                                <p className="text-sm font-medium text-foreground">{n.title}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-border/50">
                        <button className="w-full text-xs text-primary hover:underline">View all notifications</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative" ref={profileRef}>
                <button
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-card transition-colors"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-white">
                    A
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl glass border border-border/50 shadow-xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-border/50">
                        <p className="text-sm font-medium text-foreground">Admin User</p>
                        <p className="text-xs text-muted-foreground">admin@designforge.ai</p>
                      </div>
                      <div className="p-2">
                        <Link href="/admin/settings" onClick={() => setProfileOpen(false)}>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                            <User className="w-4 h-4" />
                            Profile
                          </div>
                        </Link>
                        <Link href="/admin/settings" onClick={() => setProfileOpen(false)}>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                            <Settings className="w-4 h-4" />
                            Settings
                          </div>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-border/50">
                        <Link href="/dashboard" onClick={() => setProfileOpen(false)}>
                          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            User Dashboard
                          </div>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-border/50">
                        <button
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}
