"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Eye,
  Crown,
  ArrowRight,
  Layout,
  GraduationCap,
  Music,
  Plane,
  Shirt,
  Smartphone,
  Building2,
  Camera,
  Dumbbell,
  PawPrint,
  Palette,
} from "lucide-react";

const categories = [
  {
    title: "Invitations",
    icon: Heart,
    items: [
      "Wedding", "Birthday", "Engagement", "Anniversary",
      "Baby Shower", "Graduation", "Farewell", "Housewarming",
      "Engagement Party", "Bridal Shower", "Bachelor Party",
    ],
    color: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
  },
  {
    title: "Posters",
    icon: Layout,
    items: [
      "Business", "Events", "Festivals", "Promotions",
      "Sales", "Sports", "Movie", "Concert", "Conference",
      "Webinar", "Charity", "Political",
    ],
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
  },
  {
    title: "Social Media",
    icon: Eye,
    items: [
      "Instagram Post", "Instagram Story", "Facebook Cover",
      "Facebook Post", "LinkedIn Banner", "YouTube Thumbnail",
      "Twitter/X Header", "Pinterest Pin", "TikTok Video",
      "Twitch Overlay", "Discord Banner",
    ],
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
  },
  {
    title: "Education",
    icon: GraduationCap,
    items: [
      "Certificate", "Lesson Plan", "Class Schedule", "Quiz",
      "Flashcard", "Report Card", "Syllabus", "Study Guide",
    ],
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
  },
  {
    title: "Music & Entertainment",
    icon: Music,
    items: [
      "Album Cover", "Playlist Cover", "Concert Poster",
      "Festival Flyer", "Band Logo", "Podcast Cover",
      "Mixtape Cover", "Event Ticket",
    ],
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
  },
  {
    title: "Travel & Hospitality",
    icon: Plane,
    items: [
      "Travel Brochure", "Hotel Menu", "Tour Poster",
      "Vacation Card", "Travel Itinerary", "Airbnb Guide",
      "Destination Flyer", "Travel Vlog Cover",
    ],
    color: "from-sky-500/20 to-blue-500/20",
    borderColor: "border-sky-500/30",
  },
  {
    title: "Fashion & Beauty",
    icon: Shirt,
    items: [
      "Lookbook", "Price Tag", "Style Guide", "Fashion Poster",
      "Salon Menu", "Beauty Flyer", "Product Label",
      "Brand Guide",
    ],
    color: "from-fuchsia-500/20 to-pink-500/20",
    borderColor: "border-fuchsia-500/30",
  },
  {
    title: "Tech & Business",
    icon: Smartphone,
    items: [
      "Business Card", "Invoice", "Letterhead", "Proposal",
      "Presentation", "Resume", "Cover Letter", "Newsletter",
      "App UI Mockup", "Website Hero",
    ],
    color: "from-indigo-500/20 to-purple-500/20",
    borderColor: "border-indigo-500/30",
  },
];

interface TemplateCard {
  title: string;
  category: string;
  premium: boolean;
  style: TemplateStyle;
}

const templateCards: TemplateCard[] = [
  { title: "Elegant Wedding Invitation", category: "Invitations", premium: true, style: "wedding" },
  { title: "Modern Business Poster", category: "Posters", premium: false, style: "business" },
  { title: "Instagram Story Bundle", category: "Social Media", premium: true, style: "social" },
  { title: "Birthday Party Flyer", category: "Invitations", premium: false, style: "birthday" },
  { title: "Music Festival Poster", category: "Posters", premium: true, style: "music" },
  { title: "LinkedIn Banner Set", category: "Social Media", premium: false, style: "social" },
  { title: "Graduation Certificate", category: "Education", premium: false, style: "certificate" },
  { title: "Album Cover Design", category: "Music & Entertainment", premium: true, style: "music" },
  { title: "Travel Brochure", category: "Travel & Hospitality", premium: false, style: "travel" },
  { title: "Fashion Lookbook", category: "Fashion & Beauty", premium: true, style: "fashion" },
  { title: "Tech Conference Banner", category: "Tech & Business", premium: true, style: "tech" },
  { title: "Baby Shower Invitation", category: "Invitations", premium: false, style: "baby" },
  { title: "Concert Flyer", category: "Music & Entertainment", premium: true, style: "music" },
  { title: "Hotel Menu Card", category: "Travel & Hospitality", premium: false, style: "travel" },
  { title: "Business Card Pro", category: "Tech & Business", premium: true, style: "business" },
  { title: "Christmas Greeting Card", category: "Festivals", premium: false, style: "festival" },
  { title: "YouTube Thumbnail Pack", category: "Social Media", premium: true, style: "social" },
  { title: "Sports Tournament Poster", category: "Posters", premium: false, style: "sports" },
  { title: "Restaurant Menu Design", category: "Food & Drink", premium: true, style: "food" },
  { title: "Fitness Challenge Poster", category: "Posters", premium: false, style: "fitness" },
];

import TemplatePreview, { type TemplateStyle } from "@/components/template-preview";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function TemplatesMarketplace() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/[0.02] to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Layout className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              10,000+ Templates
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Professional <span className="gradient-text">Templates</span>{" "}
            for Every Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from thousands of beautifully designed templates tailored
            for every occasion and platform.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {categories.map((category) => (
            <motion.div
              key={category.title}
              variants={itemVariants}
            >
              <div className="glass rounded-2xl p-6 sm:p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                    <category.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-semibold">{category.title}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <Link
                      key={item}
                      href={`/templates?category=${item.toLowerCase()}`}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-sm border glass hover:bg-white/10 transition-all duration-200",
                        category.borderColor
                      )}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {templateCards.map((template) => (
            <Link
              key={template.title}
              href="/templates"
              className="group block"
            >
              <div className="glass rounded-2xl overflow-hidden hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a12] to-[#1a0a12]" />
                  <TemplatePreview style={template.style} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                  {template.premium && (
                    <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30">
                      <Crown className="w-3 h-3 text-accent" />
                      <span className="text-xs font-medium text-accent">
                        Premium
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center text-white hover:scale-110 transition-transform">
                        <Heart className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      {template.category}
                    </p>
                  </div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {template.title}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="text-center mt-12"
        >
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold glass-strong hover:bg-white/10 transition-all duration-300 group"
          >
            Browse All Templates
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
