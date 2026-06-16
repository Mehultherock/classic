"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const testimonials = [
  {
    name: "Sarah Mitchell",
    title: "Event Planner",
    company: "Mitchell Events Co.",
    avatar: "SM",
    avatarColor: "from-pink-500 to-rose-500",
    rating: 5,
    text: "DesignForge AI has completely transformed how I create invitations for my clients. What used to take hours now takes minutes. The AI understands exactly what I need.",
  },
  {
    name: "James Chen",
    title: "Marketing Director",
    company: "TechVentures Inc.",
    avatar: "JC",
    avatarColor: "from-blue-500 to-cyan-500",
    rating: 5,
    text: "We use DesignForge for all our social media graphics. The template library is incredible, and the AI generation saves our team countless hours every week.",
  },
  {
    name: "Maria Rodriguez",
    title: "Small Business Owner",
    company: "Casa Creativa",
    avatar: "MR",
    avatarColor: "from-purple-500 to-violet-500",
    rating: 5,
    text: "As a small business owner, I can't afford a full-time designer. DesignForge gives me professional-quality designs without the hefty price tag. A game-changer!",
  },
  {
    name: "David Park",
    title: "Freelance Designer",
    company: "Park Design Studio",
    avatar: "DP",
    avatarColor: "from-amber-500 to-orange-500",
    rating: 5,
    text: "The AI image generation is mind-blowing. I can create custom illustrations and backgrounds in seconds. It's like having a creative partner that never runs out of ideas.",
  },
  {
    name: "Emily Thompson",
    title: "Wedding Planner",
    company: "Forever Events",
    avatar: "ET",
    avatarColor: "from-green-500 to-emerald-500",
    rating: 5,
    text: "My clients are always amazed by the quality of invitations and stationery I produce with DesignForge. The real-time editing feature is perfect for last-minute changes.",
  },
  {
    name: "Alex Kumar",
    title: "Content Creator",
    company: "Kumar Media",
    avatar: "AK",
    avatarColor: "from-primary to-secondary",
    rating: 5,
    text: "I've tried many design tools, but DesignForge is by far the most intuitive. The AI content generator helps me write captions that perfectly match my visuals.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-4 h-4",
            i < rating ? "text-accent fill-accent" : "text-muted"
          )}
        />
      ))}
    </div>
  );
}

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

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );

  return (
    <section ref={ref} className="py-20 sm:py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Quote className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Testimonials
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold">
            Loved by{" "}
            <span className="gradient-text">Thousands</span> of Creators
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            See what our users have to say about their experience.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              className="flex gap-6"
              animate={{ x: `-${currentIndex * 33.333}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" as const }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="min-w-[calc(33.333%-16px)] shrink-0 max-lg:min-w-[calc(50%-12px)] max-sm:min-w-full"
                >
                  <div className="glass rounded-2xl p-6 sm:p-8 h-full flex flex-col relative group hover:bg-white/[0.05] transition-all duration-300">
                    <Quote className="w-8 h-8 text-primary/20 absolute top-6 right-6" />
                    <StarRating rating={testimonial.rating} />
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground flex-1">
                      {testimonial.text}
                    </p>
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-semibold",
                          testimonial.avatarColor
                        )}
                      >
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {testimonial.title}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    i === currentIndex
                      ? "bg-primary w-6"
                      : "bg-muted hover:bg-muted-foreground"
                  )}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Join 50,000+ happy creators using DesignForge AI
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
