"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Upload,
  Eraser,
  Download,
  Plus,
  Check,
  Loader2,
  ImageIcon,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export default function AIBackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [dragOver, setDragOver] = useState(false);
  const [addedToDesign, setAddedToDesign] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);
      setProcessedImage(null);
      setShowComparison(false);
      setAddedToDesign(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleRemoveBackground = useCallback(async () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);

    await new Promise((r) => setTimeout(r, 3000));

    setProcessedImage(image);
    setShowComparison(true);
    setIsProcessing(false);
  }, [image]);

  const handleSliderMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const pos = ((clientX - rect.left) / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, pos)));
    },
    []
  );

  const handleDownload = useCallback(() => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.href = processedImage;
    link.download = "background-removed.png";
    link.click();
  }, [processedImage]);

  const handleAddToDesign = useCallback(() => {
    setAddedToDesign(true);
    setTimeout(() => setAddedToDesign(false), 2000);
  }, []);

  const handleReset = useCallback(() => {
    setImage(null);
    setProcessedImage(null);
    setShowComparison(false);
    setSliderPosition(50);
    setAddedToDesign(false);
    setError(null);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass">
          <Eraser className="w-4 h-4 text-success" />
          <span className="text-sm text-muted-foreground">AI Background Remover</span>
        </div>
        <h2 className="text-3xl font-display font-bold">
          Remove Backgrounds <span className="gradient-text">Instantly</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Upload an image and let AI remove the background with precision.
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        {!image ? (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-white/[0.02]"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-medium">
                  Drop image here or click to upload
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports PNG, JPG, WEBP - Max 10MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-error/10 border border-error/30 text-error text-sm">
                {error}
              </div>
            )}

            <div
              ref={containerRef}
              className="relative rounded-xl overflow-hidden bg-surface aspect-square max-w-md mx-auto select-none"
              onMouseMove={showComparison ? handleSliderMove : undefined}
              onTouchMove={showComparison ? handleSliderMove : undefined}
            >
              {showComparison && processedImage ? (
                <>
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="absolute inset-0 w-full h-full object-contain"
                    draggable={false}
                  />
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={image}
                      alt="Original"
                      className="absolute inset-0 w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg cursor-ew-resize"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                      <div className="flex gap-0.5">
                        <ArrowLeft className="w-3 h-3 text-foreground" />
                        <ArrowRight className="w-3 h-3 text-foreground" />
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-black/60 text-[10px] text-white">
                    Original
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/60 text-[10px] text-white">
                    Processed
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full">
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-3">
                      <div className="relative">
                        <Loader2 className="w-12 h-12 animate-spin text-primary" />
                        <Eraser className="w-5 h-5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-white text-sm font-medium">Removing background...</p>
                      <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                          animate={{ x: ["-100%", "200%"] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as const }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {!showComparison && (
                <button
                  onClick={handleRemoveBackground}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-success text-white font-medium hover:bg-success/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Eraser className="w-4 h-4" />
                      Remove Background
                    </>
                  )}
                </button>
              )}

              {showComparison && (
                <>
                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover:bg-primary-dark transition-all duration-200"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleAddToDesign}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl glass text-foreground font-medium hover:bg-white/10 transition-all duration-200"
                  >
                    {addedToDesign ? (
                      <>
                        <Check className="w-4 h-4 text-success" />
                        Added
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Add to Design
                      </>
                    )}
                  </button>
                </>
              )}

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
