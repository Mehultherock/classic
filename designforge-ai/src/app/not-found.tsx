"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-3xl" />
        <div className="relative text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-[200px] font-bold leading-none bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent select-none">
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-500" />
              <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">
                Page Not Found
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-500" />
            </div>

            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              This design doesn&apos;t exist yet. Let&apos;s get you back to
              creating something amazing.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-purple-500/25"
              >
                Go Home
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-12 flex items-center justify-center gap-2 text-gray-600 text-sm"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Lost in the designverse
          </motion.div>
        </div>
      </div>
    </div>
  );
}
