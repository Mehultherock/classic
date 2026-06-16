"use client";

import { useState } from "react";
import { Search, Grid3X3, Layout } from "lucide-react";
import { invitationTemplates, type InvitationTemplate } from "@/data/invitation-templates";

const categories = ["All", "Wedding", "Birthday", "Baby Shower", "Engagement", "Housewarming"];

export default function TemplateGallery({
  onSelect,
  selectedId,
}: {
  onSelect: (template: InvitationTemplate) => void;
  selectedId: string | null;
}) {
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  const filtered = invitationTemplates.filter((t) => {
    const matchCat = activeCat === "All" || t.category === activeCat;
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
          <Layout className="w-4 h-4 text-primary" /> Templates
        </h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text" placeholder="Search..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-surface border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex gap-1.5 p-3 pb-1.5 overflow-x-auto">
        {categories.map((cat) => (
          <button key={cat}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              activeCat === cat ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground bg-surface-hover"
            }`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-3 pt-1.5 space-y-2">
        {filtered.map((t) => (
          <button key={t.id}
            onClick={() => onSelect(t)}
            className={`w-full text-left p-2.5 rounded-xl border transition-all ${
              selectedId === t.id
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/30 bg-card"
            }`}
          >
            <div className="w-full aspect-[4/3] rounded-lg mb-1.5 overflow-hidden bg-surface"
              style={{ background: t.background.type === "color" ? t.background.value : undefined }}>
              <div className="w-full h-full flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-muted-foreground/30" />
              </div>
            </div>
            <p className="text-xs font-medium text-foreground truncate">{t.name}</p>
            <p className="text-[10px] text-muted-foreground">{t.category}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
