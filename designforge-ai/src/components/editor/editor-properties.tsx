"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  BringToFront,
  SendToBack,
  ChevronDown,
} from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { useEditorStore } from "@/store/editor-store";
import type { DesignElement, TextProperties, ImageProperties, ShapeProperties } from "@/types";

const fonts = [
  "Inter", "Roboto", "Poppins", "Playfair Display", "Montserrat",
  "Open Sans", "Lato", "Merriweather", "Oswald", "Raleway",
  "Calistoga", "JetBrains Mono",
];

export default function EditorProperties() {
  const currentProject = useProjectStore((s) => s.currentProject);
  const selectedElements = useProjectStore((s) => s.selectedElements);
  const updateElement = useProjectStore((s) => s.updateElement);
  const removeElement = useProjectStore((s) => s.removeElement);
  const clearSelection = useProjectStore((s) => s.clearSelection);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const selectedElement = useMemo(
    () =>
      currentProject?.elements.find((el) =>
        selectedElements.includes(el.id)
      ) ?? null,
    [currentProject?.elements, selectedElements]
  );

  const updateProp = useCallback(
    (key: string, value: unknown) => {
      if (!selectedElement) return;
      pushHistory([...(currentProject?.elements || [])]);
      updateElement(selectedElement.id, { [key]: value });
    },
    [selectedElement, currentProject, pushHistory, updateElement]
  );

  const updateProperties = useCallback(
    (props: Record<string, unknown>) => {
      if (!selectedElement) return;
      pushHistory([...(currentProject?.elements || [])]);
      updateElement(selectedElement.id, {
        properties: { ...selectedElement.properties, ...props },
      });
    },
    [selectedElement, currentProject, pushHistory, updateElement]
  );

  const handleDelete = useCallback(() => {
    if (!selectedElement) return;
    pushHistory([...(currentProject?.elements || [])]);
    removeElement(selectedElement.id);
    clearSelection();
  }, [selectedElement, currentProject, pushHistory, removeElement, clearSelection]);

  const moveLayer = useCallback(
    (direction: "up" | "down" | "front" | "back") => {
      if (!selectedElement || !currentProject) return;
      const sorted = [...currentProject.elements].sort(
        (a, b) => a.zIndex - b.zIndex
      );
      const idx = sorted.findIndex((el) => el.id === selectedElement.id);
      if (idx === -1) return;

      let newZIndex = selectedElement.zIndex;
      switch (direction) {
        case "up":
          if (idx < sorted.length - 1) {
            newZIndex = sorted[idx + 1].zIndex;
            updateElement(sorted[idx + 1].id, { zIndex: selectedElement.zIndex });
          }
          break;
        case "down":
          if (idx > 0) {
            newZIndex = sorted[idx - 1].zIndex;
            updateElement(sorted[idx - 1].id, { zIndex: selectedElement.zIndex });
          }
          break;
        case "front":
          newZIndex = Math.max(...currentProject.elements.map((e) => e.zIndex)) + 1;
          break;
        case "back":
          newZIndex = Math.min(...currentProject.elements.map((e) => e.zIndex)) - 1;
          break;
      }
      updateElement(selectedElement.id, { zIndex: newZIndex });
    },
    [selectedElement, currentProject, updateElement]
  );

  if (!selectedElement) {
    return (
      <div className="w-72 glass border-l border-border p-4 flex flex-col gap-4 overflow-y-auto z-30">
        <div className="text-sm text-muted-foreground text-center mt-20">
          Select an element to edit its properties
        </div>
      </div>
    );
  }

  const textProps = selectedElement.properties as unknown as TextProperties;
  const imageProps = selectedElement.properties as unknown as ImageProperties;
  const shapeProps = selectedElement.properties as unknown as ShapeProperties;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-72 glass border-l border-border p-4 flex flex-col gap-4 overflow-y-auto z-30"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground capitalize">
          {selectedElement.type}
        </h3>
        <button
          className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-error hover:bg-error/10 transition-all"
          onClick={handleDelete}
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Position & Size
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <PropertyInput
            label="X"
            value={Math.round(selectedElement.x)}
            onChange={(v) => updateProp("x", v)}
          />
          <PropertyInput
            label="Y"
            value={Math.round(selectedElement.y)}
            onChange={(v) => updateProp("y", v)}
          />
          <PropertyInput
            label="W"
            value={Math.round(selectedElement.width)}
            onChange={(v) => updateProp("width", Math.max(10, v))}
          />
          <PropertyInput
            label="H"
            value={Math.round(selectedElement.height)}
            onChange={(v) => updateProp("height", Math.max(10, v))}
          />
          <PropertyInput
            label="Rot"
            value={Math.round(selectedElement.rotation)}
            onChange={(v) => updateProp("rotation", v)}
            suffix="°"
          />
          <div className="flex items-center justify-center">
            <button
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                selectedElement.locked
                  ? "bg-primary/20 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
              }`}
              onClick={() => updateProp("locked", !selectedElement.locked)}
              title={selectedElement.locked ? "Unlock" : "Lock"}
            >
              {selectedElement.locked ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Opacity
        </h4>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round((selectedElement.opacity ?? 1) * 100)}
          onChange={(e) => updateProp("opacity", parseInt(e.target.value) / 100)}
          className="w-full h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer accent-primary"
        />
        <div className="text-xs text-muted-foreground text-right">
          {Math.round((selectedElement.opacity ?? 1) * 100)}%
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Layer
        </h4>
        <div className="grid grid-cols-4 gap-1">
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all flex items-center justify-center"
            onClick={() => moveLayer("front")}
            title="Bring to front"
          >
            <BringToFront className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all flex items-center justify-center"
            onClick={() => moveLayer("up")}
            title="Move up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all flex items-center justify-center"
            onClick={() => moveLayer("down")}
            title="Move down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all flex items-center justify-center"
            onClick={() => moveLayer("back")}
            title="Send to back"
          >
            <SendToBack className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {selectedElement.type === "text" && textProps && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Text
          </h4>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Font</label>
            <div className="relative">
              <select
                className="w-full h-9 rounded-lg bg-surface border border-border text-xs text-foreground px-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                value={textProps.fontFamily || "Inter"}
                onChange={(e) => updateProperties({ fontFamily: e.target.value })}
              >
                {fonts.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <PropertyInput
              label="Size"
              type="number"
              value={textProps.fontSize || 24}
              onChange={(v) => updateProperties({ fontSize: Math.max(1, v) })}
            />
            <PropertyInput
              label="Weight"
              type="number"
              value={textProps.fontWeight || 400}
              onChange={(v) => updateProperties({ fontWeight: v })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={textProps.color || "#ffffff"}
                onChange={(e) => updateProperties({ color: e.target.value })}
                className="w-9 h-9 rounded-lg border border-border bg-surface cursor-pointer"
              />
              <input
                type="text"
                value={textProps.color || "#ffffff"}
                onChange={(e) => updateProperties({ color: e.target.value })}
                className="flex-1 h-9 rounded-lg bg-surface border border-border px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex gap-1">
            <ToggleButton
              active={textProps.fontWeight === 700}
              onClick={() =>
                updateProperties({
                  fontWeight: textProps.fontWeight === 700 ? 400 : 700,
                })
              }
            >
              <Bold className="w-3.5 h-3.5" />
            </ToggleButton>
            <ToggleButton
              active={textProps.fontStyle === "italic"}
              onClick={() =>
                updateProperties({
                  fontStyle: textProps.fontStyle === "italic" ? "normal" : "italic",
                })
              }
            >
              <Italic className="w-3.5 h-3.5" />
            </ToggleButton>
            <ToggleButton
              active={textProps.textDecoration === "underline"}
              onClick={() =>
                updateProperties({
                  textDecoration:
                    textProps.textDecoration === "underline" ? "none" : "underline",
                })
              }
            >
              <Underline className="w-3.5 h-3.5" />
            </ToggleButton>
          </div>

          <div className="flex gap-1">
            <ToggleButton
              active={textProps.textAlign === "left"}
              onClick={() => updateProperties({ textAlign: "left" })}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </ToggleButton>
            <ToggleButton
              active={textProps.textAlign === "center"}
              onClick={() => updateProperties({ textAlign: "center" })}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </ToggleButton>
            <ToggleButton
              active={textProps.textAlign === "right"}
              onClick={() => updateProperties({ textAlign: "right" })}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </ToggleButton>
          </div>

          <PropertyInput
            label="Line Height"
            type="number"
            value={textProps.lineHeight || 1.5}
            step={0.1}
            onChange={(v) => updateProperties({ lineHeight: v })}
          />
          <PropertyInput
            label="Letter Spacing"
            type="number"
            value={textProps.letterSpacing || 0}
            onChange={(v) => updateProperties({ letterSpacing: v })}
          />
        </div>
      )}

      {selectedElement.type === "image" && imageProps && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Image
          </h4>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Image URL</label>
            <input
              type="text"
              value={imageProps.src || ""}
              onChange={(e) => updateProperties({ src: e.target.value })}
              className="w-full h-9 rounded-lg bg-surface border border-border px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://..."
            />
          </div>

          <PropertyInput
            label="Border Radius"
            type="number"
            value={imageProps.borderRadius ?? 0}
            onChange={(v) => updateProperties({ borderRadius: v })}
          />

          {imageProps.filters && (
            <>
              {["brightness", "contrast", "saturate"].map((filter) => (
                <div key={filter} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">
                      {filter}
                    </span>
                    <span className="text-foreground">
                      {imageProps.filters?.[filter] ?? 100}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={imageProps.filters?.[filter] ?? 100}
                    onChange={(e) =>
                      updateProperties({
                        filters: {
                          ...imageProps.filters,
                          [filter]: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer accent-primary"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {selectedElement.type === "shape" && shapeProps && (
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Shape
          </h4>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Type</label>
            <div className="relative">
              <select
                className="w-full h-9 rounded-lg bg-surface border border-border text-xs text-foreground px-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                value={shapeProps.shapeType || "rectangle"}
                onChange={(e) => updateProperties({ shapeType: e.target.value })}
              >
                {["rectangle", "circle", "triangle", "star", "heart", "line", "arrow"].map(
                  (t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  )
                )}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Fill Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={shapeProps.fillColor || "#6366f1"}
                onChange={(e) => updateProperties({ fillColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-border bg-surface cursor-pointer"
              />
              <input
                type="text"
                value={shapeProps.fillColor || "#6366f1"}
                onChange={(e) => updateProperties({ fillColor: e.target.value })}
                className="flex-1 h-9 rounded-lg bg-surface border border-border px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Stroke Color</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={shapeProps.strokeColor || "#000000"}
                onChange={(e) => updateProperties({ strokeColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-border bg-surface cursor-pointer"
              />
              <input
                type="text"
                value={shapeProps.strokeColor || ""}
                onChange={(e) => updateProperties({ strokeColor: e.target.value })}
                className="flex-1 h-9 rounded-lg bg-surface border border-border px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="None"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <PropertyInput
              label="Stroke Width"
              type="number"
              value={shapeProps.strokeWidth ?? 0}
              onChange={(v) => updateProperties({ strokeWidth: Math.max(0, v) })}
            />
            <PropertyInput
              label="Border Radius"
              type="number"
              value={shapeProps.borderRadius ?? 0}
              onChange={(v) => updateProperties({ borderRadius: Math.max(0, v) })}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}

function PropertyInput({
  label,
  value,
  onChange,
  type = "number",
  step,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  type?: string;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          step={step}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full h-9 rounded-lg bg-surface border border-border px-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
        active
          ? "bg-primary/20 text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
