"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Palette, Shield } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 items-center justify-center p-12">
        <div className="absolute inset-0">
          <motion.div
            className="absolute -top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px]"
            animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" as const }}
          />
          <motion.div
            className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-secondary/10 blur-[120px]"
            animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" as const }}
          />
          <motion.div
            className="absolute top-1/4 right-1/4 w-20 h-20 border border-primary/20 rounded-xl"
            animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
          />
          <motion.div
            className="absolute top-1/3 left-1/3 w-16 h-16 border border-secondary/20 rounded-full"
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" as const }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-24 h-24 border border-accent/20 rotate-45 rounded-lg"
            animate={{ rotate: [45, 405] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" as const }}
          />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-8">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/25">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
              <span className="gradient-text">DesignForge AI</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Create professional designs in seconds with the power of artificial intelligence
            </p>
          </motion.div>

          <motion.div
            className="mt-12 space-y-5 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {[
              { icon: Zap, text: "AI-powered design generation in seconds" },
              { icon: Palette, text: "Professional templates at your fingertips" },
              { icon: Shield, text: "High-quality exports for any platform" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.15 }}
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text font-display">DesignForge AI</span>
            </div>
            <p className="text-sm text-muted-foreground">Sign in to continue creating</p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
}
