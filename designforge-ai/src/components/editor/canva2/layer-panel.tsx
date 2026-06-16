"use client";

import { useProjectStore } from "@/store/project-store";
import { GripVertical, Eye, EyeOff, Lock, Unlock, Trash2 } from "lucide-react";

export default function LayerPanel() {
  const currentProject = useProjectStore((s) => s.currentProject);
  const selectedElements = useProjectStore((s) => s.selectedElements);
  const setSelectedElements = useProjectStore((s) => s.setSelectedElements);
  const updateElement = useProjectStore((s) => s.updateElement);
  const removeElement = useProjectStore((s) => s.removeElement);

  const sorted = [...(currentProject?.elements || [])].sort((a, b) => b.zIndex - a.zIndex);

  const typeLabel = (type: string) => {
    switch (type) {
      case "text": return "Text"; case "image": return "Image"; case "shape": return "Shape"; default: return type;
    }
  };

  return (
    <div className="p-3">
      <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Layers</h3>
      {sorted.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No elements yet</p>
      ) : (
        <div className="space-y-1">
          {sorted.map((el) => (
            <div key={el.id}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all text-xs ${
                selectedElements.includes(el.id)
                  ? "bg-primary/15 text-foreground ring-1 ring-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
              onClick={() => setSelectedElements([el.id])}
            >
              <GripVertical className="w-3 h-3 shrink-0 opacity-40" />
              <span className="flex-1 truncate">
                {typeLabel(el.type)}
                {el.type === "text" && `: ${(el.properties as Record<string, unknown>)?.content as string || ""}`}
              </span>
              <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-surface-hover shrink-0"
                onClick={(e) => { e.stopPropagation(); updateElement(el.id, { visible: !el.visible }); }}
              >
                {el.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 opacity-40" />}
              </button>
              <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-surface-hover shrink-0"
                onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }}
              >
                {el.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3 opacity-40" />}
              </button>
              <button
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-error/10 text-muted-foreground hover:text-error shrink-0"
                onClick={(e) => { e.stopPropagation(); removeElement(el.id); }}
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
