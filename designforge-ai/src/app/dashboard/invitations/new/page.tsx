"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EVENT_TYPES } from "@/lib/constants";
import {
  ChevronLeft,
  Sparkles,
  Mail,
  Calendar,
  Clock,
  MapPin,
  Users,
  QrCode,
  Palette,
  ImagePlus,
  Loader2,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function NewInvitationPage() {
  const [form, setForm] = useState({
    eventName: "",
    eventType: "",
    eventDate: "",
    eventTime: "",
    venue: "",
    theme: "",
    customInstructions: "",
    rsvpEnabled: true,
    qrEnabled: false,
  });
  const [generating, setGenerating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.eventName) errs.eventName = "Event name is required";
    if (!form.eventType) errs.eventType = "Event type is required";
    if (!form.eventDate) errs.eventDate = "Event date is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setGenerating(true);
    setTimeout(() => {
      window.location.href = "/dashboard/invitations";
    }, 2000);
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="p-4 lg:p-8 max-w-4xl mx-auto space-y-8">
      <motion.div variants={itemVariants}>
        <Link href="/dashboard/invitations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" />
          Back to Invitations
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Create New Invitation</h1>
        <p className="text-muted-foreground mt-1">Fill in the details and let AI generate a beautiful invitation.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            Event Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Event Name"
                placeholder="e.g., Sarah & Alex Wedding"
                value={form.eventName}
                onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                error={errors.eventName}
                icon={<Mail className="w-4 h-4" />}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">Event Type</label>
              <div className="relative">
                <select
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                  className={cn(
                    "w-full h-10 rounded-lg bg-card border px-3 text-sm text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-ring transition-all",
                    errors.eventType ? "border-error" : "border-border"
                  )}
                >
                  <option value="">Select type...</option>
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-[-90deg] pointer-events-none" />
              </div>
              {errors.eventType && <p className="text-xs text-error mt-1">{errors.eventType}</p>}
            </div>
            <div>
              <Input
                label="Event Date"
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                error={errors.eventDate}
                icon={<Calendar className="w-4 h-4" />}
              />
            </div>
            <div>
              <Input
                label="Event Time (optional)"
                type="time"
                value={form.eventTime}
                onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                icon={<Clock className="w-4 h-4" />}
              />
            </div>
            <div>
              <Input
                label="Venue (optional)"
                placeholder="e.g., The Grand Ballroom"
                value={form.venue}
                onChange={(e) => setForm({ ...form, venue: e.target.value })}
                icon={<MapPin className="w-4 h-4" />}
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            Design Preferences
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Theme / Style (optional)"
                placeholder="e.g., Rustic, Modern, Vintage"
                value={form.theme}
                onChange={(e) => setForm({ ...form, theme: e.target.value })}
                icon={<Palette className="w-4 h-4" />}
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                Custom Instructions (optional)
              </label>
              <textarea
                placeholder="Any specific design requirements, colors, or elements you'd like to include..."
                value={form.customInstructions}
                onChange={(e) => setForm({ ...form, customInstructions: e.target.value })}
                rows={3}
                className="w-full rounded-xl bg-card border border-border p-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
              />
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl glass border border-border/50 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-secondary" />
            Features
          </h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Enable RSVP</p>
                  <p className="text-xs text-muted-foreground">Allow guests to respond to your invitation</p>
                </div>
              </div>
              <div className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                form.rsvpEnabled ? "bg-primary" : "bg-card border border-border"
              )}>
                <div
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
                    form.rsvpEnabled ? "translate-x-[18px]" : "translate-x-0.5"
                  )}
                />
                <input
                  type="checkbox"
                  checked={form.rsvpEnabled}
                  onChange={(e) => setForm({ ...form, rsvpEnabled: e.target.checked })}
                  className="sr-only"
                />
              </div>
            </label>
            <label className="flex items-center justify-between p-4 rounded-xl bg-card border border-border cursor-pointer hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Generate QR Code</p>
                  <p className="text-xs text-muted-foreground">Add a QR code for easy sharing</p>
                </div>
              </div>
              <div className={cn(
                "w-10 h-6 rounded-full transition-colors relative",
                form.qrEnabled ? "bg-primary" : "bg-card border border-border"
              )}>
                <div
                  className={cn(
                    "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm",
                    form.qrEnabled ? "translate-x-[18px]" : "translate-x-0.5"
                  )}
                />
                <input
                  type="checkbox"
                  checked={form.qrEnabled}
                  onChange={(e) => setForm({ ...form, qrEnabled: e.target.checked })}
                  className="sr-only"
                />
              </div>
            </label>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center justify-end gap-4">
          <Link href="/dashboard/invitations">
            <Button type="button" variant="secondary">Cancel</Button>
          </Link>
          <Button type="submit" variant="gradient" size="lg" loading={generating}>
            <Sparkles className="w-4 h-4 mr-2" />
            {generating ? "Generating..." : "Generate Invitation"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
}
