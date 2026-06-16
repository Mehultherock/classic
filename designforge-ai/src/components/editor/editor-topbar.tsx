"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Monitor,
  Tablet,
  Smartphone,
  Share2,
  Download,
  Save,
  Undo2,
  Redo2,
  Check,
  Loader2,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { useProjectStore } from "@/store/project-store";
import { exportToPNG, exportToJPG, exportToPDF, autoSave } from "./editor-actions";
import type { Project } from "@/types";

type DeviceType = "desktop" | "tablet" | "mobile";

interface EditorTopbarProps {
  onSave?: (project: Project) => Promise<void>;
}

export default function EditorTopbar({ onSave }: EditorTopbarProps) {
  const router = useRouter();
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [showDownload, setShowDownload] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showUnsaved, setShowUnsaved] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");

  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const historyIndex = useEditorStore((s) => s.historyIndex);
  const history = useEditorStore((s) => s.history);
  const showGrid = useEditorStore((s) => s.showGrid);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const currentProject = useProjectStore((s) => s.currentProject);
  const setCurrentProject = useProjectStore((s) => s.setCurrentProject);

  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentProject) {
      setTitle(currentProject.title);
    }
  }, [currentProject]);

  const handleBack = useCallback(() => {
    if (history.length > 0) {
      setShowUnsaved(true);
    } else {
      router.push("/dashboard/projects");
    }
  }, [history.length, router]);

  const handleSave = useCallback(async () => {
    if (!currentProject || !onSave) return;
    setSaving(true);
    try {
      pushHistory([...currentProject.elements]);
      await autoSave(currentProject, onSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setSaving(false);
    }
  }, [currentProject, onSave, pushHistory]);

  const handleTitleChange = useCallback(
    (newTitle: string) => {
      setTitle(newTitle);
      if (currentProject) {
        setCurrentProject({ ...currentProject, title: newTitle });
      }
    },
    [currentProject, setCurrentProject]
  );

  const handleDownload = useCallback(
    async (format: "png" | "jpg" | "pdf") => {
      const el = document.querySelector("[data-editor-canvas]") as HTMLElement;
      if (!el || !currentProject) return;
      const filename = currentProject.title || "design";
      try {
        if (format === "png") await exportToPNG(el, filename);
        else if (format === "jpg") await exportToJPG(el, filename);
        else await exportToPDF(el, filename);
      } catch (error) {
        console.error("Export failed:", error);
      }
      setShowDownload(false);
    },
    [currentProject]
  );

  const deviceIcon = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone,
  };

  const deviceCycle: DeviceType[] = ["desktop", "tablet", "mobile"];

  return (
    <div className="h-12 glass border-b border-border flex items-center justify-between px-4 z-30 shrink-0">
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
          onClick={handleBack}
          title="Back to dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingTitle(false);
            }}
            className="h-8 px-2 rounded-lg bg-surface border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring max-w-[200px]"
          />
        ) : (
          <button
            className="text-sm font-medium text-foreground hover:text-primary transition-colors max-w-[200px] truncate"
            onClick={() => setEditingTitle(true)}
            title="Click to edit title"
          >
            {title || "Untitled"}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
            showGrid
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
          }`}
          onClick={toggleGrid}
          title="Toggle grid"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all disabled:opacity-30"
          onClick={undo}
          disabled={historyIndex < 0}
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all disabled:opacity-30"
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
          onClick={() => {
            const idx = deviceCycle.indexOf(device);
            setDevice(deviceCycle[(idx + 1) % deviceCycle.length]);
          }}
          title={`Device: ${device}`}
        >
          {(() => {
            const Icon = deviceIcon[device];
            return <Icon className="w-4 h-4" />;
          })()}
        </button>

        <div className="flex items-center gap-0.5 text-xs text-muted-foreground bg-surface rounded-lg px-2 h-8">
          <span>{Math.round(zoom * 100)}%</span>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <div className="relative">
          <button
            className="h-8 px-3 rounded-lg glass-strong text-xs text-foreground flex items-center gap-1.5 hover:bg-surface-hover transition-all"
            onClick={() => setShowDownload(!showDownload)}
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          {showDownload && (
            <div className="absolute right-0 top-full mt-1 glass-strong rounded-xl p-1.5 min-w-[120px] z-50">
              {[
                { label: "PNG", format: "png" as const },
                { label: "JPG", format: "jpg" as const },
                { label: "PDF", format: "pdf" as const },
              ].map(({ label, format }) => (
                <button
                  key={format}
                  className="w-full px-3 py-2 rounded-lg text-xs text-foreground hover:bg-surface-hover transition-all text-left"
                  onClick={() => handleDownload(format)}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
          title="Share"
        >
          <Share2 className="w-4 h-4" />
        </button>

        <button
          className="h-8 px-3 rounded-lg bg-primary text-white text-xs font-medium flex items-center gap-1.5 hover:bg-primary-dark transition-all disabled:opacity-50"
          onClick={handleSave}
          disabled={saving || !currentProject}
        >
          {saving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : saved ? (
            <Check className="w-3.5 h-3.5" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          {saving ? "Saving..." : saved ? "Saved" : "Save"}
        </button>
      </div>

      {showUnsaved && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-strong rounded-2xl p-6 max-w-sm w-full mx-4"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Unsaved changes
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              You have unsaved changes. Are you sure you want to leave?
            </p>
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
                onClick={() => setShowUnsaved(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm bg-primary text-white hover:bg-primary-dark transition-all"
                onClick={() => router.push("/dashboard/projects")}
              >
                Leave
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
