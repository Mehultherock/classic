"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Crown,
  Sparkles,
  Download,
  Eye,
  Heart,
  Share2,
  Info,
  Ruler,
  Tag,
  Layers,
} from "lucide-react";
import TemplatePreview, { getTemplateStyle } from "@/components/template-preview";

const allTemplateData = [
  { t: "Elegant Wedding Invitation", c: "Wedding", pr: true, po: true, co: "from-pink-500/30 to-rose-500/30" },
  { t: "Rustic Wedding Invitation", c: "Wedding", pr: false, po: false, co: "from-amber-500/30 to-orange-500/30" },
  { t: "Modern Wedding RSVP Card", c: "Wedding", pr: true, po: true, co: "from-slate-500/30 to-gray-500/30" },
  { t: "Save the Date Card", c: "Wedding", pr: false, po: true, co: "from-pink-500/30 to-purple-500/30" },
  { t: "Wedding Thank You Card", c: "Wedding", pr: true, po: false, co: "from-rose-500/30 to-red-500/30" },
  { t: "Wedding Program Brochure", c: "Wedding", pr: false, po: false, co: "from-green-500/30 to-emerald-500/30" },
  { t: "Bridal Shower Invitation", c: "Wedding", pr: true, po: false, co: "from-fuchsia-500/30 to-pink-500/30" },
  { t: "Engagement Party Invitation", c: "Engagement", pr: false, po: true, co: "from-yellow-500/30 to-amber-500/30" },
  { t: "Kids Birthday Invitation", c: "Birthday", pr: false, po: true, co: "from-sky-500/30 to-blue-500/30" },
  { t: "18th Birthday Poster", c: "Birthday", pr: true, po: true, co: "from-purple-500/30 to-violet-500/30" },
  { t: "30th Birthday Flyer", c: "Birthday", pr: false, po: false, co: "from-gray-500/30 to-slate-500/30" },
  { t: "50th Birthday Invitation", c: "Birthday", pr: true, po: false, co: "from-gold-500/30 to-yellow-500/30" },
  { t: "Surprise Party Banner", c: "Birthday", pr: false, po: false, co: "from-orange-500/30 to-red-500/30" },
  { t: "Corporate Business Card", c: "Business", pr: true, po: true, co: "from-blue-500/30 to-cyan-500/30" },
  { t: "Company Letterhead", c: "Business", pr: false, po: false, co: "from-indigo-500/30 to-blue-500/30" },
  { t: "Business Proposal Cover", c: "Business", pr: true, po: false, co: "from-slate-500/30 to-gray-500/30" },
  { t: "Invoice Template", c: "Business", pr: false, po: true, co: "from-green-500/30 to-emerald-500/30" },
  { t: "Annual Report Design", c: "Business", pr: true, po: false, co: "from-primary/30 to-secondary/30" },
  { t: "Marketing Brochure", c: "Business", pr: false, po: false, co: "from-cyan-500/30 to-teal-500/30" },
  { t: "Professional Resume", c: "Business", pr: true, po: true, co: "from-gray-500/30 to-slate-500/30" },
  { t: "Graduation Certificate", c: "Education", pr: false, po: true, co: "from-green-500/30 to-emerald-500/30" },
  { t: "Class Schedule Template", c: "Education", pr: false, po: false, co: "from-sky-500/30 to-blue-500/30" },
  { t: "Lesson Plan Template", c: "Education", pr: true, po: false, co: "from-teal-500/30 to-cyan-500/30" },
  { t: "School Event Poster", c: "Education", pr: true, po: true, co: "from-red-500/30 to-rose-500/30" },
  { t: "Instagram Story Set", c: "Events", pr: true, po: true, co: "from-purple-500/30 to-violet-500/30" },
  { t: "Facebook Cover Design", c: "Events", pr: false, po: false, co: "from-blue-500/30 to-indigo-500/30" },
  { t: "YouTube Thumbnail Pack", c: "Events", pr: true, po: true, co: "from-red-500/30 to-rose-500/30" },
  { t: "LinkedIn Banner Pro", c: "Events", pr: false, po: false, co: "from-blue-500/30 to-cyan-500/30" },
  { t: "Restaurant Menu Design", c: "Food & Drink", pr: true, po: true, co: "from-amber-500/30 to-yellow-500/30" },
  { t: "Cafe Flyer Template", c: "Food & Drink", pr: false, po: false, co: "from-brown-500/30 to-amber-500/30" },
  { t: "Recipe Card Design", c: "Food & Drink", pr: true, po: false, co: "from-green-500/30 to-lime-500/30" },
  { t: "Travel Brochure Design", c: "Travel", pr: false, po: true, co: "from-sky-500/30 to-blue-500/30" },
  { t: "Vacation Photo Card", c: "Travel", pr: true, po: false, co: "from-cyan-500/30 to-teal-500/30" },
  { t: "Sports Tournament Poster", c: "Sports", pr: false, po: true, co: "from-yellow-500/30 to-orange-500/30" },
  { t: "Fitness Challenge Flyer", c: "Fitness", pr: true, po: false, co: "from-lime-500/30 to-green-500/30" },
  { t: "Yoga Retreat Poster", c: "Fitness", pr: false, po: true, co: "from-purple-500/30 to-pink-500/30" },
  { t: "Album Cover Template", c: "Music", pr: true, po: true, co: "from-purple-500/30 to-pink-500/30" },
  { t: "Concert Poster Design", c: "Music", pr: false, po: false, co: "from-red-500/30 to-orange-500/30" },
  { t: "Christmas Greeting Card", c: "Festivals", pr: false, po: true, co: "from-red-500/30 to-green-500/30" },
  { t: "Diwali Festival Poster", c: "Festivals", pr: true, po: false, co: "from-orange-500/30 to-yellow-500/30" },
  { t: "New Year Celebration Card", c: "Festivals", pr: true, po: true, co: "from-gold-500/30 to-yellow-500/30" },
  { t: "App UI Mockup", c: "Technology", pr: true, po: true, co: "from-blue-500/30 to-indigo-500/30" },
  { t: "Tech Conference Banner", c: "Technology", pr: false, po: false, co: "from-cyan-500/30 to-blue-500/30" },
  { t: "Fashion Lookbook", c: "Fashion", pr: true, po: false, co: "from-fuchsia-500/30 to-pink-500/30" },
  { t: "Beauty Product Label", c: "Beauty", pr: false, po: true, co: "from-pink-500/30 to-rose-500/30" },
  { t: "Property Listing Flyer", c: "Real Estate", pr: false, po: true, co: "from-blue-500/30 to-cyan-500/30" },
  { t: "Pet Adoption Poster", c: "Pets", pr: false, po: true, co: "from-amber-500/30 to-orange-500/30" },
  { t: "Nature Photography Card", c: "Nature", pr: true, po: false, co: "from-green-500/30 to-emerald-500/30" },
];

const allTemplates = allTemplateData.map((t, i) => ({
  id: i + 1,
  title: t.t,
  category: t.c,
  premium: t.pr,
  popular: t.po,
  downloads: Math.floor(Math.random() * 5000) + 100,
  color: t.co,
  style: getTemplateStyle(t.c),
  dimensions: t.c === "Events" ? "1080 x 1920" : t.c === "Business" ? "800 x 500" : "1200 x 1600",
  description: `Professionally designed ${t.c.toLowerCase()} template perfect for your next project. Fully customizable with our drag-and-drop editor.`,
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const template = allTemplates.find((t) => t.id === id);
  const related = allTemplates.filter((t) => t.category === template?.category && t.id !== id).slice(0, 4);

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Template not found</h2>
          <p className="text-gray-400 mb-6">This template doesn&apos;t exist or has been removed.</p>
          <Link href="/templates" className="text-primary hover:underline">Browse templates</Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to templates
            </button>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-8">
            <motion.div variants={itemVariants} className="lg:col-span-3">
              <div className="relative glass rounded-2xl overflow-hidden">
                <div className="aspect-[4/3] bg-gradient-to-br from-[#0a0a12] to-[#1a0a12] relative">
                  <TemplatePreview style={template.style} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                  {template.premium && (
                    <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30">
                      <Crown className="w-3.5 h-3.5 text-accent" />
                      <span className="text-xs font-semibold text-accent">Premium</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">{template.category}</span>
                  {template.popular && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-semibold text-primary">Popular</span>
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mb-3">
                  {template.title}
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Ruler className="w-3.5 h-3.5" />
                    <span className="text-xs">Dimensions</span>
                  </div>
                  <p className="text-sm font-medium text-white">{template.dimensions}</p>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="text-xs">Category</span>
                  </div>
                  <p className="text-sm font-medium text-white">{template.category}</p>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Download className="w-3.5 h-3.5" />
                    <span className="text-xs">Downloads</span>
                  </div>
                  <p className="text-sm font-medium text-white">{template.downloads.toLocaleString()}</p>
                </div>
                <div className="glass rounded-xl p-3">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span className="text-xs">Style</span>
                  </div>
                  <p className="text-sm font-medium text-white capitalize">{template.style}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Link
                  href={template.premium ? "/pricing" : "/editor/new"}
                  className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-center hover:from-purple-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-purple-500/25"
                >
                  {template.premium ? "Upgrade to Use" : "Use This Template"}
                </Link>
                <button className="px-4 py-3.5 rounded-xl glass-strong text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="px-4 py-3.5 rounded-xl glass-strong text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="glass rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-white mb-1">Pro Tip</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Customize every element — change colors, fonts, images, and layout with our intuitive drag-and-drop editor. No design skills needed.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {related.length > 0 && (
            <motion.div variants={itemVariants} className="mt-16">
              <h2 className="text-2xl font-display font-bold text-white mb-6">
                More <span className="gradient-text">{template.category}</span> Templates
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((t) => (
                  <Link
                    key={t.id}
                    href={`/templates/${t.id}`}
                    className="group block"
                  >
                    <div className="glass rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                      <div className="relative aspect-[4/3] bg-gradient-to-br from-[#0a0a12] to-[#1a0a12]">
                        <TemplatePreview style={t.style} />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center">
                            <Eye className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{t.category}</p>
                        <p className="text-sm font-medium group-hover:text-primary transition-colors">{t.title}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
