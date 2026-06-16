"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Download, FileImage, FileText, Eye, Check } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { useEditorStore } from "@/store/editor-store";
import type { Project } from "@/types";

interface CanvaTopbarProps {
  onSave: (project: Project) => Promise<void>;
}

export default function CanvaTopbar({ onSave }: CanvaTopbarProps) {
  const currentProject = useProjectStore((s) => s.currentProject);
  const history = useEditorStore((s) => s.history);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleSave = useCallback(async () => {
    if (!currentProject) return;
    setSaving(true);
    try {
      await onSave(currentProject);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [currentProject, onSave]);

  const exportPNG = useCallback(() => {
    const stage = document.querySelector(".konva-container .konvajs-content canvas") as HTMLCanvasElement;
    if (!stage) return;
    const link = document.createElement("a");
    link.download = `${currentProject?.title || "design"}.png`;
    link.href = stage.toDataURL("image/png");
    link.click();
  }, [currentProject]);

  const exportPDF = useCallback(async () => {
    const stage = document.querySelector(".konva-container .konvajs-content canvas") as HTMLCanvasElement;
    if (!stage) return;
    const { default: jsPDF } = await import("jspdf");
    const imgData = stage.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: (currentProject?.width || 800) > (currentProject?.height || 600) ? "landscape" : "portrait",
      unit: "px",
      format: [currentProject?.width || 800, currentProject?.height || 600],
    });
    pdf.addImage(imgData, "PNG", 0, 0, currentProject?.width || 800, currentProject?.height || 600);
    pdf.save(`${currentProject?.title || "design"}.pdf`);
  }, [currentProject]);

  const hasUnsaved = history.length > 0;

  return (
    <div className="h-14 flex items-center justify-between px-4 glass border-b border-border z-30">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/projects"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
          onClick={(e) => {
            if (hasUnsaved && !confirm("You have unsaved changes. Leave anyway?")) {
              e.preventDefault();
            }
          }}
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <h2 className="text-sm font-medium text-foreground truncate max-w-[200px]">
          {currentProject?.title || "Untitled Design"}
        </h2>
        {hasUnsaved && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" title="Unsaved changes" />}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2">
          <button
            className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all flex items-center gap-1.5"
            onClick={exportPNG}
            title="Export PNG"
          >
            <FileImage className="w-3.5 h-3.5" />
            PNG
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all flex items-center gap-1.5"
            onClick={exportPDF}
            title="Export PDF"
          >
            <FileText className="w-3.5 h-3.5" />
            PDF
          </button>
        </div>

        <button
          className="px-4 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50"
          onClick={handleSave}
          disabled={saving}
        >
          {saved ? (
            <><Check className="w-3.5 h-3.5" /> Saved</>
          ) : (
            <><Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}</>
          )}
        </button>
      </div>
    </div>
  );
}
