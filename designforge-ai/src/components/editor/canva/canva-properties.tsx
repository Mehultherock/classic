"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import { Trash2, Lock, Unlock, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { useEditorStore } from "@/store/editor-store";
import type { DesignElement, TextProperties, ImageProperties, ShapeProperties } from "@/types";

const fonts = [
  "Inter", "Roboto", "Poppins", "Playfair Display", "Montserrat",
  "Open Sans", "Lato", "Merriweather", "Oswald", "Raleway",
  "Calistoga", "JetBrains Mono", "Pacifico", "Lobster", "Dancing Script",
];

export default function CanvaProperties() {
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

  const pushAndUpdate = useCallback(
    (key: string, value: unknown) => {
      if (!selectedElement) return;
      pushHistory([...(currentProject?.elements || [])]);
      updateElement(selectedElement.id, { [key]: value });
    },
    [selectedElement, currentProject, pushHistory, updateElement]
  );

  const pushAndUpdateProps = useCallback(
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
        <div className="flex gap-1">
          <button
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover transition-all"
            onClick={() => pushAndUpdate("locked", !selectedElement.locked)}
            title={selectedElement.locked ? "Unlock" : "Lock"}
          >
            {selectedElement.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
          <button
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-error hover:bg-error/10 transition-all"
            onClick={handleDelete}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <Section label="Position & Size">
        <div className="grid grid-cols-2 gap-2">
          <PropInput label="X" value={Math.round(selectedElement.x)} onChange={(v) => pushAndUpdate("x", v)} />
          <PropInput label="Y" value={Math.round(selectedElement.y)} onChange={(v) => pushAndUpdate("y", v)} />
          <PropInput label="W" value={Math.round(selectedElement.width)} onChange={(v) => pushAndUpdate("width", Math.max(10, v))} />
          <PropInput label="H" value={Math.round(selectedElement.height)} onChange={(v) => pushAndUpdate("height", Math.max(10, v))} />
          <PropInput label="Rot" value={Math.round(selectedElement.rotation)} onChange={(v) => pushAndUpdate("rotation", v)} suffix="°" />
        </div>
      </Section>

      <Section label="Opacity">
        <input
          type="range" min="0" max="100"
          value={Math.round((selectedElement.opacity ?? 1) * 100)}
          onChange={(e) => pushAndUpdate("opacity", parseInt(e.target.value) / 100)}
          className="w-full h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer accent-primary"
        />
        <div className="text-xs text-muted-foreground text-right">
          {Math.round((selectedElement.opacity ?? 1) * 100)}%
        </div>
      </Section>

      {selectedElement.type === "text" && textProps && (
        <>
          <Section label="Text">
            <textarea
              value={textProps.content}
              onChange={(e) => pushAndUpdateProps({ content: e.target.value })}
              className="w-full h-20 rounded-lg bg-surface border border-border p-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </Section>

          <Section label="Font">
            <select
              value={textProps.fontFamily || "Inter"}
              onChange={(e) => pushAndUpdateProps({ fontFamily: e.target.value })}
              className="w-full h-9 rounded-lg bg-surface border border-border text-xs text-foreground px-2 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Section>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Size</label>
              <input
                type="number" value={textProps.fontSize || 24}
                onChange={(e) => pushAndUpdateProps({ fontSize: Math.max(1, parseInt(e.target.value) || 12) })}
                className="w-full h-9 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] text-muted-foreground">Weight</label>
              <select
                value={textProps.fontWeight || 400}
                onChange={(e) => pushAndUpdateProps({ fontWeight: parseInt(e.target.value) })}
                className="w-full h-9 rounded-lg bg-surface border border-border text-xs text-foreground px-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={300}>Light</option>
                <option value={400}>Regular</option>
                <option value={500}>Medium</option>
                <option value={600}>Semi Bold</option>
                <option value={700}>Bold</option>
                <option value={800}>Extra Bold</option>
              </select>
            </div>
          </div>

          <Section label="Color">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div
                  className="w-9 h-9 rounded-lg border border-border cursor-pointer"
                  style={{ background: textProps.color || "#ffffff" }}
                  onClick={() => {}}
                />
                <div className="absolute top-10 left-0 z-50">
                  <HexColorPicker
                    color={textProps.color || "#ffffff"}
                    onChange={(c) => pushAndUpdateProps({ color: c })}
                    style={{ width: 180, height: 140 }}
                  />
                </div>
              </div>
              <input
                type="text"
                value={textProps.color || "#ffffff"}
                onChange={(e) => pushAndUpdateProps({ color: e.target.value })}
                className="flex-1 h-9 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </Section>

          <div className="flex gap-1">
            <ToggleBtn
              active={textProps.fontWeight === 700}
              onClick={() => pushAndUpdateProps({ fontWeight: textProps.fontWeight === 700 ? 400 : 700 })}
            ><Bold className="w-3.5 h-3.5" /></ToggleBtn>
            <ToggleBtn
              active={textProps.fontStyle === "italic"}
              onClick={() => pushAndUpdateProps({ fontStyle: textProps.fontStyle === "italic" ? "normal" : "italic" })}
            ><Italic className="w-3.5 h-3.5" /></ToggleBtn>
            <ToggleBtn
              active={textProps.textDecoration === "underline"}
              onClick={() => pushAndUpdateProps({ textDecoration: textProps.textDecoration === "underline" ? "none" : "underline" })}
            ><Underline className="w-3.5 h-3.5" /></ToggleBtn>
          </div>

          <div className="flex gap-1">
            <ToggleBtn active={textProps.textAlign === "left"} onClick={() => pushAndUpdateProps({ textAlign: "left" })}><AlignLeft className="w-3.5 h-3.5" /></ToggleBtn>
            <ToggleBtn active={textProps.textAlign === "center"} onClick={() => pushAndUpdateProps({ textAlign: "center" })}><AlignCenter className="w-3.5 h-3.5" /></ToggleBtn>
            <ToggleBtn active={textProps.textAlign === "right"} onClick={() => pushAndUpdateProps({ textAlign: "right" })}><AlignRight className="w-3.5 h-3.5" /></ToggleBtn>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-muted-foreground">Line Height</label>
            <input
              type="number" step={0.1} value={textProps.lineHeight || 1.5}
              onChange={(e) => pushAndUpdateProps({ lineHeight: parseFloat(e.target.value) || 1.5 })}
              className="w-full h-9 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </>
      )}

      {selectedElement.type === "image" && imageProps && (
        <Section label="Image URL">
          <input
            type="text" value={imageProps.src || ""}
            onChange={(e) => pushAndUpdateProps({ src: e.target.value })}
            className="w-full h-9 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="https://..."
          />
          <label className="text-[11px] text-muted-foreground mt-2 block">Border Radius</label>
          <input
            type="number" value={imageProps.borderRadius ?? 0}
            onChange={(e) => pushAndUpdateProps({ borderRadius: Math.max(0, parseInt(e.target.value) || 0) })}
            className="w-full h-9 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Section>
      )}

      {selectedElement.type === "shape" && shapeProps && (
        <>
          <Section label="Shape Type">
            <select
              value={shapeProps.shapeType || "rectangle"}
              onChange={(e) => pushAndUpdateProps({ shapeType: e.target.value })}
              className="w-full h-9 rounded-lg bg-surface border border-border text-xs text-foreground px-2 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {["rectangle", "circle", "triangle", "star", "heart", "line", "arrow"].map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </Section>

          <Section label="Fill Color">
            <div className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-lg border border-border cursor-pointer"
                style={{ background: shapeProps.fillColor || "#6366f1" }}
              />
              <input
                type="text" value={shapeProps.fillColor || "#6366f1"}
                onChange={(e) => pushAndUpdateProps({ fillColor: e.target.value })}
                className="flex-1 h-9 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </Section>

          <Section label="Stroke Width">
            <input
              type="number" value={shapeProps.strokeWidth ?? 0}
              onChange={(e) => pushAndUpdateProps({ strokeWidth: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full h-9 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Section>
        </>
      )}
    </motion.div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</h4>
      {children}
    </div>
  );
}

function PropInput({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-muted-foreground">{label}</label>
      <div className="relative">
        <input
          type="number" value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full h-9 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{suffix}</span>}
      </div>
    </div>
  );
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
        active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
