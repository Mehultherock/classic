"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer2,
  Type,
  Image,
  Square,
  Upload,
  Palette,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  History,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { useProjectStore } from "@/store/project-store";

const tools = [
  { id: "select" as const, icon: MousePointer2, label: "Select" },
  { id: "text" as const, icon: Type, label: "Text" },
  { id: "image" as const, icon: Image, label: "Image" },
  { id: "shape" as const, icon: Square, label: "Shape" },
  { id: "upload" as const, icon: Upload, label: "Upload" },
  { id: "background" as const, icon: Palette, label: "Background" },
];

const shapes = [
  { type: "rectangle", label: "Rectangle" },
  { type: "circle", label: "Circle" },
  { type: "triangle", label: "Triangle" },
  { type: "star", label: "Star" },
  { type: "heart", label: "Heart" },
  { type: "line", label: "Line" },
  { type: "arrow", label: "Arrow" },
];

export default function EditorToolbar() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const historyIndex = useEditorStore((s) => s.historyIndex);
  const history = useEditorStore((s) => s.history);

  const currentProject = useProjectStore((s) => s.currentProject);

  const handleAddShape = useCallback(
    (shapeType: string) => {
      const el = {
        id: `el_${Date.now()}`,
        type: "shape" as const,
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        rotation: 0,
        opacity: 1,
        zIndex: (currentProject?.elements?.length ?? 0) + 1,
        locked: false,
        visible: true,
        properties: {
          shapeType,
          fillColor: "#6366f1",
          strokeColor: undefined,
          strokeWidth: 0,
          borderRadius: 0,
        },
      };
      useProjectStore.getState().addElement(el);
      useEditorStore.getState().setActiveTool("select");
    },
    [currentProject]
  );

  return (
    <div className="w-14 flex flex-col items-center py-3 gap-1 glass border-r border-border z-30">
      {tools.map((tool) => (
        <button
          key={tool.id}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 relative ${
            activeTool === tool.id
              ? "bg-primary text-white shadow-lg shadow-primary/25"
              : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
          }`}
          onClick={() => setActiveTool(tool.id === "upload" ? "image" : tool.id)}
          title={tool.label}
        >
          <tool.icon className="w-4.5 h-4.5" />
        </button>
      ))}

      <div className="w-8 h-px bg-border my-2" />

      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all duration-200 disabled:opacity-30"
        onClick={undo}
        disabled={historyIndex < 0}
        title="Undo"
      >
        <Undo2 className="w-4.5 h-4.5" />
      </button>

      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all duration-200 disabled:opacity-30"
        onClick={redo}
        disabled={historyIndex >= history.length - 1}
        title="Redo"
      >
        <Redo2 className="w-4.5 h-4.5" />
      </button>

      <div className="w-8 h-px bg-border my-2" />

      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all duration-200"
        onClick={() => setZoom(zoom + 0.1)}
        title="Zoom In"
      >
        <ZoomIn className="w-4.5 h-4.5" />
      </button>

      <button
        className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all duration-200"
        onClick={() => setZoom(zoom - 0.1)}
        title="Zoom Out"
      >
        <ZoomOut className="w-4.5 h-4.5" />
      </button>

      <div className="mt-auto text-[10px] text-muted-foreground text-center px-1">
        <History className="w-3.5 h-3.5 mx-auto mb-0.5" />
        <span>
          {historyIndex + 1}/{history.length}
        </span>
      </div>

      <AnimatePresence>
        {activeTool === "shape" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute left-16 top-1/2 -translate-y-1/2 glass-strong rounded-xl p-3 z-40 min-w-[160px]"
          >
            <div className="text-xs font-medium text-muted-foreground mb-2">
              Shapes
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {shapes.map((shape) => (
                <button
                  key={shape.type}
                  className="px-3 py-2 rounded-lg text-xs text-foreground hover:bg-surface-hover transition-all duration-200 text-left"
                  onClick={() => handleAddShape(shape.type)}
                >
                  {shape.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
