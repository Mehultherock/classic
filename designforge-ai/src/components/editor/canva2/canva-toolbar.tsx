"use client";

import { useRef, useCallback } from "react";
import { MousePointer2, Type, Image, Square, Upload, Undo2, Redo2, ZoomIn, ZoomOut, History } from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { useProjectStore } from "@/store/project-store";
import type { DesignElement } from "@/types";

const tools = [
  { id: "select" as const, icon: MousePointer2, label: "Select (V)" },
  { id: "text" as const, icon: Type, label: "Text (T)" },
  { id: "image" as const, icon: Image, label: "Image" },
  { id: "shape" as const, icon: Square, label: "Shape" },
  { id: "upload" as const, icon: Upload, label: "Upload" },
];

export default function Canva2Toolbar() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const historyIndex = useEditorStore((s) => s.historyIndex);
  const history = useEditorStore((s) => s.history);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentProject = useProjectStore((s) => s.currentProject);
  const addElement = useProjectStore((s) => s.addElement);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addElement({
        id: `el_${Date.now()}`, type: "image",
        x: 50, y: 50, width: 300, height: 200,
        rotation: 0, opacity: 1, zIndex: (currentProject?.elements?.length ?? 0) + 1,
        locked: false, visible: true,
        properties: { src: ev.target?.result as string, borderRadius: 0, filters: {} },
      } as DesignElement);
      setActiveTool("select");
    };
    reader.readAsDataURL(file);
  }, [currentProject, addElement, setActiveTool]);

  return (
    <div className="w-14 flex flex-col items-center py-3 gap-1 glass border-r border-border z-30">
      {tools.map((tool) => (
        <button key={tool.id}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
            activeTool === tool.id ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
          }`}
          onClick={() => { if (tool.id === "upload") fileInputRef.current?.click(); else setActiveTool(tool.id); }}
          title={tool.label}
        >
          <tool.icon className="w-4.5 h-4.5" />
        </button>
      ))}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} onClick={(e) => { (e.target as HTMLInputElement).value = ""; }} />

      <div className="w-8 h-px bg-border my-2" />
      <button className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all disabled:opacity-30" onClick={undo} disabled={historyIndex < 0} title="Undo"><Undo2 className="w-4.5 h-4.5" /></button>
      <button className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all disabled:opacity-30" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo"><Redo2 className="w-4.5 h-4.5" /></button>
      <div className="w-8 h-px bg-border my-2" />
      <button className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover" onClick={() => setZoom(zoom + 0.1)} title="Zoom In"><ZoomIn className="w-4.5 h-4.5" /></button>
      <button className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover" onClick={() => setZoom(zoom - 0.1)} title="Zoom Out"><ZoomOut className="w-4.5 h-4.5" /></button>
      <div className="mt-auto text-[10px] text-muted-foreground text-center px-1"><History className="w-3.5 h-3.5 mx-auto mb-0.5" /><span>{historyIndex + 1}/{history.length}</span></div>
    </div>
  );
}
