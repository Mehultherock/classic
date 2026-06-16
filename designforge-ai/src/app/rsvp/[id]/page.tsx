"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from "qrcode.react";
import {
  Sparkles,
  Check,
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Send,
  PartyPopper,
  Loader2,
  AlertTriangle,
} from "lucide-react";

interface InvitationData {
  id: string;
  title: string;
  event_name: string;
  event_date: string;
  event_time?: string;
  venue?: string;
  rsvp_enabled: boolean;
  share_link?: string;
  theme?: string;
}

export default function RSVPPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    guest_name: "",
    guest_email: "",
    status: "attending" as "attending" | "declined" | "maybe",
    guests_count: 1,
    message: "",
  });

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const res = await fetch(`/api/invitations?share_link=${id}`);
        if (!res.ok) throw new Error("Invitation not found");
        const data = await res.json();
        const inv = data.invitations?.[0];
        if (!inv) throw new Error("Invitation not found");
        setInvitation(inv);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchInvitation();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          share_link: id,
          ...form,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit RSVP");
      setSubmitted(true);
    } catch (err) {
      console.error("RSVP error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Invitation Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This invitation link may be invalid or has expired.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold glass-strong hover:bg-white/10 transition-all"
          >
            Go Home
          </a>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: "attending", label: "Attending", icon: Check, color: "text-success", bg: "bg-success/10" },
    { value: "declined", label: "Declined", icon: X, color: "text-error", bg: "bg-error/10" },
    { value: "maybe", label: "Maybe", icon: Users, color: "text-accent", bg: "bg-accent/10" },
  ] as const;

  const shareUrl = invitation.share_link || `${window.location.origin}/rsvp/${id}`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-strong rounded-3xl p-8 sm:p-12 text-center overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-success/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                  <PartyPopper className="w-10 h-10 text-success" />
                </div>
              </motion.div>
              <h2 className="text-3xl font-bold font-display mb-2">RSVP Confirmed!</h2>
              <p className="text-muted-foreground mb-2">
                Thank you, {form.guest_name}!
              </p>
              <p className="text-sm text-muted-foreground">
                {form.status === "attending"
                  ? "We look forward to seeing you!"
                  : form.status === "maybe"
                  ? "We hope you can make it!"
                  : "We're sorry you can't make it."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="glass-strong rounded-3xl overflow-hidden">
                <div className="relative p-8 sm:p-12 pb-6 text-center bg-gradient-to-b from-primary/10 to-transparent">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary" />
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25 mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold font-display mb-3">
                    {invitation.event_name || "You're Invited!"}
                  </h1>
                  <p className="text-muted-foreground mb-6">{invitation.title}</p>

                  <div className="flex flex-wrap justify-center gap-4 text-sm">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{new Date(invitation.event_date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</span>
                    </div>
                    {invitation.event_time && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
                        <Clock className="w-4 h-4 text-secondary" />
                        <span>{invitation.event_time}</span>
                      </div>
                    )}
                    {invitation.venue && (
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span>{invitation.venue}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 sm:p-12 pt-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">
                          Your Name <span className="text-error">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Enter your name"
                          value={form.guest_name}
                          onChange={(e) => setForm({ ...form, guest_name: e.target.value })}
                          className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted-foreground">
                          Email (optional)
                        </label>
                        <input
                          type="email"
                          placeholder="you@example.com"
                          value={form.guest_email}
                          onChange={(e) => setForm({ ...form, guest_email: e.target.value })}
                          className="w-full h-11 px-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">
                        RSVP Status <span className="text-error">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {statusOptions.map((option) => {
                          const Icon = option.icon;
                          const isActive = form.status === option.value;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setForm({ ...form, status: option.value })}
                              className={cn(
                                "flex flex-col items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all duration-200",
                                isActive
                                  ? `${option.bg} ${option.color} border-current`
                                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/50"
                              )}
                            >
                              <Icon className="w-5 h-5" />
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">
                        Number of Guests
                      </label>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, guests_count: Math.max(1, form.guests_count - 1) })}
                          className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="text-2xl font-bold font-display w-12 text-center">
                          {form.guests_count}
                        </span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, guests_count: Math.min(10, form.guests_count + 1) })}
                          className="w-10 h-10 rounded-xl glass-strong flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-muted-foreground">
                        Message (optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Add a personal message..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {submitting ? "Submitting..." : "Send RSVP"}
                    </button>
                  </form>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="glass rounded-2xl p-4 inline-flex items-center gap-4">
                  <QRCodeSVG
                    value={shareUrl}
                    size={80}
                    bgColor="transparent"
                    fgColor="#818cf8"
                    level="L"
                  />
                  <div className="text-left">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Scan for check-in
                    </p>
                    <p className="text-[10px] text-muted-foreground/60">
                      Present this QR code at the event for quick check-in.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
