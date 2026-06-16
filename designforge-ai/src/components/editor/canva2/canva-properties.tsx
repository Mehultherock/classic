"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { HexColorPicker } from "react-colorful";
import { Trash2, Lock, Unlock, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { useEditorStore } from "@/store/editor-store";
import type { TextProperties, ImageProperties, ShapeProperties } from "@/types";

const fonts = [
  "Inter", "Roboto", "Poppins", "Playfair Display", "Montserrat",
  "Open Sans", "Lato", "Merriweather", "Oswald", "Raleway",
  "Fredoka One", "Dancing Script", "Pacifico", "Lobster", "JetBrains Mono",
];

export default function Canva2Properties() {
  const currentProject = useProjectStore((s) => s.currentProject);
  const selectedElements = useProjectStore((s) => s.selectedElements);
  const updateElement = useProjectStore((s) => s.updateElement);
  const removeElement = useProjectStore((s) => s.removeElement);
  const clearSelection = useProjectStore((s) => s.clearSelection);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const el = useMemo(() => currentProject?.elements.find((e) => selectedElements.includes(e.id)) ?? null, [currentProject?.elements, selectedElements]);

  const pushAndUpdate = useCallback((key: string, value: unknown) => {
    if (!el) return;
    pushHistory([...(currentProject?.elements || [])]);
    updateElement(el.id, { [key]: value });
  }, [el, currentProject, pushHistory, updateElement]);

  const pushAndUpdateProps = useCallback((props: Record<string, unknown>) => {
    if (!el) return;
    pushHistory([...(currentProject?.elements || [])]);
    updateElement(el.id, { properties: { ...el.properties, ...props } });
  }, [el, currentProject, pushHistory, updateElement]);

  const handleDelete = useCallback(() => {
    if (!el) return;
    pushHistory([...(currentProject?.elements || [])]);
    removeElement(el.id);
    clearSelection();
  }, [el, currentProject, pushHistory, removeElement, clearSelection]);

  if (!el) return (
    <div className="w-72 glass border-l border-border p-4 flex flex-col gap-4 overflow-y-auto z-30">
      <div className="text-sm text-muted-foreground text-center mt-20">Select an element to edit</div>
    </div>
  );

  const tp = el.properties as unknown as TextProperties;
  const ip = el.properties as unknown as ImageProperties;
  const sp = el.properties as unknown as ShapeProperties;

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-72 glass border-l border-border p-4 flex flex-col gap-3 overflow-y-auto z-30">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground capitalize">{el.type}</h3>
        <div className="flex gap-1">
          <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-hover" onClick={() => pushAndUpdate("locked", !el.locked)} title={el.locked ? "Unlock" : "Lock"}>
            {el.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>
          <button className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-error hover:bg-error/10" onClick={handleDelete} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>

      <Section label="Position">
        <div className="grid grid-cols-2 gap-2">
          <PropInput label="X" value={Math.round(el.x)} onChange={(v) => pushAndUpdate("x", v)} />
          <PropInput label="Y" value={Math.round(el.y)} onChange={(v) => pushAndUpdate("y", v)} />
          <PropInput label="W" value={Math.round(el.width)} onChange={(v) => pushAndUpdate("width", Math.max(10, v))} />
          <PropInput label="H" value={Math.round(el.height)} onChange={(v) => pushAndUpdate("height", Math.max(10, v))} />
          <PropInput label="Rot" value={Math.round(el.rotation)} onChange={(v) => pushAndUpdate("rotation", v)} suffix="°" />
        </div>
      </Section>

      <Section label="Opacity">
        <input type="range" min="0" max="100" value={Math.round((el.opacity ?? 1) * 100)} onChange={(e) => pushAndUpdate("opacity", parseInt(e.target.value) / 100)} className="w-full h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer accent-primary" />
        <div className="text-xs text-muted-foreground text-right">{Math.round((el.opacity ?? 1) * 100)}%</div>
      </Section>

      {el.type === "text" && tp && (
        <>
          <Section label="Content">
            <textarea value={tp.content} onChange={(e) => pushAndUpdateProps({ content: e.target.value })} className="w-full h-16 rounded-lg bg-surface border border-border p-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
          </Section>
          <Section label="Font">
            <select value={tp.fontFamily || "Inter"} onChange={(e) => pushAndUpdateProps({ fontFamily: e.target.value })} className="w-full h-8 rounded-lg bg-surface border border-border text-xs text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring">
              {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </Section>
          <div className="grid grid-cols-2 gap-2">
            <div><label className="text-[11px] text-muted-foreground">Size</label>
              <input type="number" value={tp.fontSize || 24} onChange={(e) => pushAndUpdateProps({ fontSize: Math.max(1, parseInt(e.target.value) || 12) })} className="w-full h-8 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div><label className="text-[11px] text-muted-foreground">Weight</label>
              <select value={tp.fontWeight || 400} onChange={(e) => pushAndUpdateProps({ fontWeight: parseInt(e.target.value) })} className="w-full h-8 rounded-lg bg-surface border border-border text-xs text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring">
                <option value={300}>Light</option><option value={400}>Regular</option><option value={500}>Medium</option>
                <option value={600}>Semi Bold</option><option value={700}>Bold</option><option value={800}>Extra Bold</option>
              </select>
            </div>
          </div>
          <Section label="Color">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg border border-border cursor-pointer" style={{ background: tp.color || "#fff" }} />
                <div className="absolute top-9 left-0 z-50"><HexColorPicker color={tp.color || "#fff"} onChange={(c) => pushAndUpdateProps({ color: c })} style={{ width: 160, height: 120 }} /></div>
              </div>
              <input type="text" value={tp.color || "#fff"} onChange={(e) => pushAndUpdateProps({ color: e.target.value })} className="flex-1 h-8 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </Section>
          <div className="flex gap-1">
            <ToggleBtn active={tp.fontWeight === 700} onClick={() => pushAndUpdateProps({ fontWeight: tp.fontWeight === 700 ? 400 : 700 })}><Bold className="w-3 h-3" /></ToggleBtn>
            <ToggleBtn active={tp.fontStyle === "italic"} onClick={() => pushAndUpdateProps({ fontStyle: tp.fontStyle === "italic" ? "normal" : "italic" })}><Italic className="w-3 h-3" /></ToggleBtn>
            <ToggleBtn active={tp.textDecoration === "underline"} onClick={() => pushAndUpdateProps({ textDecoration: tp.textDecoration === "underline" ? "none" : "underline" })}><Underline className="w-3 h-3" /></ToggleBtn>
          </div>
          <div className="flex gap-1">
            <ToggleBtn active={tp.textAlign === "left"} onClick={() => pushAndUpdateProps({ textAlign: "left" })}><AlignLeft className="w-3 h-3" /></ToggleBtn>
            <ToggleBtn active={tp.textAlign === "center"} onClick={() => pushAndUpdateProps({ textAlign: "center" })}><AlignCenter className="w-3 h-3" /></ToggleBtn>
            <ToggleBtn active={tp.textAlign === "right"} onClick={() => pushAndUpdateProps({ textAlign: "right" })}><AlignRight className="w-3 h-3" /></ToggleBtn>
          </div>
          <div><label className="text-[11px] text-muted-foreground">Line Height</label>
            <input type="number" step={0.1} value={tp.lineHeight || 1.5} onChange={(e) => pushAndUpdateProps({ lineHeight: parseFloat(e.target.value) || 1.5 })} className="w-full h-8 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
        </>
      )}

      {el.type === "image" && ip && (
        <Section label="Image URL">
          <input type="text" value={ip.src || ""} onChange={(e) => pushAndUpdateProps({ src: e.target.value })} className="w-full h-8 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          <label className="text-[11px] text-muted-foreground mt-2 block">Border Radius</label>
          <input type="number" value={ip.borderRadius ?? 0} onChange={(e) => pushAndUpdateProps({ borderRadius: Math.max(0, parseInt(e.target.value) || 0) })} className="w-full h-8 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
        </Section>
      )}

      {el.type === "shape" && sp && (
        <>
          <Section label="Type">
            <select value={sp.shapeType || "rectangle"} onChange={(e) => pushAndUpdateProps({ shapeType: e.target.value })} className="w-full h-8 rounded-lg bg-surface border border-border text-xs text-foreground px-2 focus:outline-none focus:ring-1 focus:ring-ring">
              {["rectangle", "circle", "triangle", "star", "heart", "line", "arrow"].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </Section>
          <Section label="Fill Color">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border border-border" style={{ background: sp.fillColor || "#6366f1" }} />
              <input type="text" value={sp.fillColor || "#6366f1"} onChange={(e) => pushAndUpdateProps({ fillColor: e.target.value })} className="flex-1 h-8 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </Section>
          <div><label className="text-[11px] text-muted-foreground">Stroke Width</label>
            <input type="number" value={sp.strokeWidth ?? 0} onChange={(e) => pushAndUpdateProps({ strokeWidth: Math.max(0, parseInt(e.target.value) || 0) })} className="w-full h-8 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
        </>
      )}
    </motion.div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</h4>{children}</div>;
}

function PropInput({ label, value, onChange, suffix }: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return <div className="space-y-0.5"><label className="text-[11px] text-muted-foreground">{label}</label>
    <div className="relative"><input type="number" value={value} onChange={(e) => onChange(parseFloat(e.target.value) || 0)} className="w-full h-8 rounded-lg bg-surface border border-border px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
    {suffix && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">{suffix}</span>}</div></div>;
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-surface-hover"}`} onClick={onClick}>{children}</button>;
}
