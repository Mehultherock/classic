"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, ImageIcon, FileImage, FileText, Loader2 } from "lucide-react";
import Link from "next/link";
import { useProjectStore } from "@/store/project-store";

export default function Canva2Topbar({ title }: { title?: string }) {
  const currentProject = useProjectStore((s) => s.currentProject);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = useCallback(async (format: "png" | "jpg" | "pdf") => {
    setExporting(format);
    try {
      const stage = document.querySelector(".konva-container .konvajs-content canvas") as HTMLCanvasElement | null;
      if (!stage) { console.warn("Stage canvas not found"); setExporting(null); return; }

      const dataUrl = stage.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 1);

      if (format === "pdf") {
        const { jsPDF } = await import("jspdf");
        const pdf = new jsPDF({ orientation: currentProject?.width && currentProject.width > currentProject?.height ? "l" : "p", unit: "px", format: [currentProject?.width || 800, currentProject?.height || 600] });
        pdf.addImage(dataUrl, "PNG", 0, 0, currentProject?.width || 800, currentProject?.height || 600);
        pdf.save(`${currentProject?.name || "invitation"}.pdf`);
      } else {
        const link = document.createElement("a");
        link.download = `${currentProject?.name || "invitation"}.${format}`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error("Export failed:", err);
    }
    setExporting(null);
  }, [currentProject]);

  const exportOpts = [
    { id: "png" as const, label: "PNG", icon: ImageIcon },
    { id: "jpg" as const, label: "JPG", icon: FileImage },
    { id: "pdf" as const, label: "PDF", icon: FileText },
  ];

  return (
    <div className="h-12 px-4 flex items-center justify-between glass border-b border-border z-40 shrink-0">
      <div className="flex items-center gap-3">
        <Link href="/projects" className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all">
          <ArrowLeft className="w-4.5 h-4.5" />
        </Link>
        <div className="w-px h-5 bg-border" />
        <h1 className="text-sm font-medium text-foreground truncate max-w-[200px]">{title || currentProject?.name || "Invitation Editor"}</h1>
      </div>
      <div className="flex items-center gap-2">
        {exportOpts.map((opt) => (
          <button key={opt.id}
            className="h-8 px-3 rounded-lg bg-surface border border-border text-xs font-medium text-foreground hover:bg-surface-hover transition-all flex items-center gap-1.5 disabled:opacity-50"
            onClick={() => handleExport(opt.id)} disabled={!!exporting}
          >
            {exporting === opt.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <opt.icon className="w-3.5 h-3.5" />}
            {exporting === opt.id ? "Exporting..." : opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
