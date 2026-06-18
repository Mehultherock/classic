"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, Sparkles, Search, Layout,
  Mail, Calendar, Clock, MapPin, User, AtSign,
  ImageIcon, Loader2, Check, ArrowRight, Crown,
} from "lucide-react";
import { invitationTemplates, templateCategories, type InvitationTemplate } from "@/data/invitation-templates";
import { buildAIPrompt, type FormValues } from "@/lib/ai-prompt-builder";

const categoryIcons: Record<string, string> = {
  Wedding: "💍", Birthday: "🎂", Engagement: "💎", Anniversary: "💕",
  "Baby Shower": "👶", Housewarming: "🏠", Graduation: "🎓", Corporate: "💼",
  Festival: "🎉", Farewell: "👋", Retirement: "🌴", Reception: "🥂",
  "Bridal Shower": "👰", "Kids Party": "🎈", Conference: "📊",
};

const steps = ["Category", "Template", "Details", "Generate"];

export default function NewInvitationFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<InvitationTemplate | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    let list = invitationTemplates;
    if (selectedCategory) list = list.filter((t) => t.category === selectedCategory);
    if (search) list = list.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [selectedCategory, search]);

  const handleSelectTemplate = (t: InvitationTemplate) => {
    setSelectedTemplate(t);
    const fv: Record<string, string> = {};
    t.fields.forEach((f) => { fv[f.id] = f.default; });
    setForm(fv);
    setStep(2);
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setGenerating(true);
    const values: FormValues = {
      eventName: form["event-name"] || "",
      hostName: form["host-name"] || "",
      date: form["date"] || "",
      time: form["time"] || "",
      venue: form["venue"] || "",
      rsvp: form["rsvp"] || "",
    };
    const { imagePrompt } = buildAIPrompt(selectedTemplate, values);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt, type: "image", style: selectedTemplate.style }),
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedImage(data.imageUrl || data.result || null);
      }
    } catch {}
    setGenerating(false);
    setStep(3);
  };

  const handleOpenEditor = () => {
    const t = selectedTemplate;
    if (!t) return;
    const params = new URLSearchParams({ template: t.id, title: form["event-name"] || t.name });
    Object.entries(form).forEach(([k, v]) => params.set(k, v));
    router.push(`/editor/canva2/new?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link href="/dashboard/invitations" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ChevronLeft className="w-4 h-4" /> Back to Invitations
        </Link>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                i === step ? "bg-primary text-white" : i < step ? "bg-primary/20 text-primary" : "bg-surface-hover text-muted-foreground"
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : <span className="w-3.5 h-3.5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">{i + 1}</span>}
                {s}
              </div>
              {i < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="category" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-foreground">What occasion are you celebrating?</h1>
                <p className="text-muted-foreground">Choose a category to get started</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {templateCategories.map((cat) => {
                  const count = invitationTemplates.filter((t) => t.category === cat).length;
                  const premiumCount = invitationTemplates.filter((t) => t.category === cat && t.premium).length;
                  return (
                    <button key={cat} onClick={() => { setSelectedCategory(cat); setStep(1); }}
                      className="relative p-5 rounded-2xl border border-border hover:border-primary/40 bg-card hover:shadow-lg transition-all text-left group text-center">
                      <span className="text-4xl block mb-2">{categoryIcons[cat] || "🎯"}</span>
                      <p className="text-sm font-semibold text-foreground">{cat}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{count} templates{premiumCount > 0 && ` · ${premiumCount} premium`}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="template" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                    {categoryIcons[selectedCategory || ""]} {selectedCategory} Templates
                  </h2>
                  <p className="text-sm text-muted-foreground">Select a template to customize</p>
                </div>
                <button onClick={() => setStep(0)} className="text-sm text-muted-foreground hover:text-foreground underline">Change category</button>
              </div>
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search templates..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredTemplates.map((t) => (
                  <button key={t.id} onClick={() => handleSelectTemplate(t)}
                    className="relative group text-left rounded-2xl border border-border hover:border-primary/40 bg-card overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-[4/3] bg-surface flex items-center justify-center p-4"
                      style={{ background: t.background.type === "color" ? t.background.value : undefined }}>
                      <Layout className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground truncate">{t.name}</p>
                        {t.premium && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{t.style.replace("-", " ")} · {t.orientation}</p>
                    </div>
                    {t.premium && <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-amber-500/90 text-white text-[9px] font-bold">PRO</div>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && selectedTemplate && (
            <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Fill in the details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTemplate.fields.map((f) => (
                    <div key={f.id} className={f.id === "event-name" ? "md:col-span-2" : ""}>
                      <label className="text-sm font-medium text-foreground block mb-1.5">{f.label}</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          {f.id === "event-name" ? <Mail className="w-4 h-4" /> :
                           f.id === "host-name" ? <User className="w-4 h-4" /> :
                           f.id === "date" ? <Calendar className="w-4 h-4" /> :
                           f.id === "time" ? <Clock className="w-4 h-4" /> :
                           f.id === "venue" ? <MapPin className="w-4 h-4" /> :
                           <AtSign className="w-4 h-4" />}
                        </div>
                        <input type="text" value={form[f.id] || ""} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })}
                          placeholder={f.default}
                          className="w-full h-11 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="h-11 px-6 rounded-xl border border-border text-sm text-foreground hover:bg-surface-hover transition-all">Back</button>
                  <button onClick={handleGenerate} disabled={generating}
                    className="flex-1 h-11 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {generating ? "Generating..." : "Generate with AI"}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Template Preview</h3>
                <div className="aspect-[4/3] rounded-2xl border border-border bg-surface flex items-center justify-center p-6"
                  style={{ background: selectedTemplate.background.type === "color" ? selectedTemplate.background.value : undefined }}>
                  <div className="text-center">
                    <p className="text-lg font-bold" style={{ color: selectedTemplate.colors.primary }}>{form["event-name"] || "Event Name"}</p>
                    <p className="text-xs mt-1" style={{ color: selectedTemplate.colors.muted }}>{form["host-name"] || "Host Name"}</p>
                    <div className="w-16 h-px mx-auto my-3" style={{ background: selectedTemplate.colors.accent, opacity: 0.4 }} />
                    <p className="text-sm" style={{ color: selectedTemplate.colors.text }}>{form["date"] || "Date"}</p>
                    <p className="text-xs" style={{ color: selectedTemplate.colors.muted }}>{form["time"] || "Time"}</p>
                    <p className="text-xs mt-1" style={{ color: selectedTemplate.colors.text }}>{form["venue"] || "Venue"}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-surface-hover text-[10px] text-muted-foreground">{selectedTemplate.category}</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-hover text-[10px] text-muted-foreground">{selectedTemplate.style}</span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-hover text-[10px] text-muted-foreground">{selectedTemplate.orientation}</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="generate" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Your invitation is ready!</h2>
                <p className="text-muted-foreground">Open the editor to refine and download</p>
              </div>
              <div className="max-w-md mx-auto aspect-[4/3] rounded-2xl border border-border bg-surface flex items-center justify-center">
                {generatedImage ? (
                  <img src={generatedImage} alt="Generated invitation" className="w-full h-full object-contain rounded-2xl" />
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">AI generation completed</p>
                    <p className="text-xs text-muted-foreground mt-1">Open the editor to see your design</p>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-3">
                <button onClick={() => setStep(2)} className="h-11 px-6 rounded-xl border border-border text-sm text-foreground hover:bg-surface-hover transition-all">Back to edit</button>
                <button onClick={handleOpenEditor}
                  className="h-11 px-8 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-2">
                  Open in Editor <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
