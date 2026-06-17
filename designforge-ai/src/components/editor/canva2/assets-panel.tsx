"use client";

import { useState, useRef, useCallback } from "react";
import { Search, Image, Sticker, Upload, Grid3X3 } from "lucide-react";
import stickers, { stickerCategories } from "@/data/stickers";
import { useProjectStore } from "@/store/project-store";
import { useEditorStore } from "@/store/editor-store";
import type { DesignElement } from "@/types";

export default function AssetsPanel() {
  const [tab, setTab] = useState<"stickers" | "images">("stickers");
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const fileRef = useRef<HTMLInputElement>(null);

  const currentProject = useProjectStore((s) => s.currentProject);
  const addElement = useProjectStore((s) => s.addElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);

  const addToCanvas = useCallback((type: "sticker" | "image", src: string, w: number, h: number) => {
    const zIndex = (currentProject?.elements?.length ?? 0) + 1;
    const el: DesignElement = {
      id: `el_${type}_${Date.now()}`,
      type,
      x: 50, y: 50,
      width: w, height: h,
      rotation: 0, opacity: 1,
      zIndex,
      locked: false, visible: true,
      properties: { src, borderRadius: 0, filters: {} },
    };
    if (currentProject?.elements) {
      pushHistory([...currentProject.elements]);
    }
    addElement(el);
  }, [currentProject, pushHistory, addElement]);

  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      addToCanvas("image", src, 300, 200);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [addToCanvas]);

  const filtered = tab === "stickers"
    ? stickers.filter((s) => (cat === "All" || s.category === cat) && s.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const stockImages = [
    { name: "Warm Background", src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400", w: 400, h: 300 },
    { name: "Elegant Pattern", src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400", w: 400, h: 300 },
    { name: "Floral", src: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400", w: 400, h: 300 },
    { name: "Golden Texture", src: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=400", w: 400, h: 300 },
    { name: "Nature", src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400", w: 400, h: 300 },
    { name: "Abstract", src: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400", w: 400, h: 300 },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 pb-0 flex gap-1 border-b border-border">
        <button className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${tab === "stickers" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setTab("stickers")}>
          <Sticker className="w-3.5 h-3.5" /> Stickers
        </button>
        <button className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${tab === "images" ? "text-foreground border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`} onClick={() => setTab("images")}>
          <Image className="w-3.5 h-3.5" /> Images
        </button>
      </div>

      <div className="p-3 pb-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" placeholder={`Search ${tab}...`} value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-surface border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring" />
        </div>
      </div>

      {tab === "stickers" && (
        <div className="flex gap-1.5 p-3 pb-1.5 overflow-x-auto">
          {stickerCategories.map((c) => (
            <button key={c} className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all flex-shrink-0 ${cat === c ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground bg-surface-hover"}`} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-3 pt-1.5">
        {tab === "stickers" && (
          <div className="grid grid-cols-3 gap-2">
            {filtered.map((s) => (
              <button key={s.id} onClick={() => addToCanvas("sticker", s.src, s.width, s.height)}
                className="aspect-square rounded-xl border border-border hover:border-primary/40 bg-card flex items-center justify-center p-3 transition-all hover:shadow-md"
                title={s.name}>
                <img src={s.src} alt={s.name} className="w-full h-full object-contain pointer-events-none" />
              </button>
            ))}
            {filtered.length === 0 && <p className="col-span-3 text-xs text-muted-foreground text-center py-8">No stickers found</p>}
          </div>
        )}

        {tab === "images" && (
          <div className="space-y-3">
            <button onClick={() => fileRef.current?.click()}
              className="w-full h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/40 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground transition-all">
              <Upload className="w-5 h-5" />
              <span className="text-xs font-medium">Upload your image</span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />

            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Stock Images</p>
            <div className="grid grid-cols-2 gap-2">
              {stockImages.map((img, i) => (
                <button key={i} onClick={() => addToCanvas("image", img.src, img.w, img.h)}
                  className="aspect-[4/3] rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:shadow-md"
                  title={img.name}>
                  <img src={img.src} alt={img.name} className="w-full h-full object-cover pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
