"use client";

import { PenLine, Calendar, Clock, MapPin, AtSign, User } from "lucide-react";
import type { InvitationTemplate } from "@/data/invitation-templates";

const fieldMeta: Record<string, { label: string; icon: React.ReactNode }> = {
  "event-name": { label: "Event Name", icon: <PenLine className="w-3.5 h-3.5" /> },
  "host-name": { label: "Host Name", icon: <User className="w-3.5 h-3.5" /> },
  "date": { label: "Date", icon: <Calendar className="w-3.5 h-3.5" /> },
  "time": { label: "Time", icon: <Clock className="w-3.5 h-3.5" /> },
  "venue": { label: "Venue", icon: <MapPin className="w-3.5 h-3.5" /> },
  "rsvp": { label: "RSVP", icon: <AtSign className="w-3.5 h-3.5" /> },
};

export default function FieldPanel({
  template,
  values,
  onChange,
}: {
  template: InvitationTemplate | null;
  values: Record<string, string>;
  onChange: (fieldId: string, value: string) => void;
}) {
  if (!template) {
    return (
      <div className="p-4 text-center text-xs text-muted-foreground">
        Select a template to edit fields
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">Editable Fields</h3>
      {template.fields.map((field) => {
        const meta = fieldMeta[field.id];
        return (
          <div key={field.id} className="space-y-1">
            <label className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              {meta?.icon} {meta?.label || field.label}
            </label>
            <input
              type="text"
              value={values[field.id] ?? field.default}
              onChange={(e) => onChange(field.id, e.target.value)}
              className="w-full h-8 rounded-lg bg-surface border border-border px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        );
      })}
    </div>
  );
}
