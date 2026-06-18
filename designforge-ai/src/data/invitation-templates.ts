export interface TemplateField {
  id: string
  label: string
  default: string
  type: "text" | "multiline"
  x: number; y: number; width: number; height: number
  fontFamily: string; fontSize: number; fontWeight: number
  color: string; textAlign: "left" | "center" | "right"
  editable: boolean; letterSpacing?: number
}

export interface TemplateDecoration {
  type: "shape" | "image" | "line"
  shapeType?: "rectangle" | "circle" | "line" | "heart" | "star"
  x: number; y: number; width: number; height: number
  fillColor?: string; strokeColor?: string; strokeWidth?: number
  rotation?: number; opacity?: number
  src?: string
}

export interface InvitationTemplate {
  id: string
  name: string
  category: string
  thumbnail: string
  premium: boolean
  style: string
  orientation: "portrait" | "landscape" | "square"
  background: { type: "color" | "gradient" | "image"; value: string }
  width: number
  height: number
  fields: TemplateField[]
  decorations: TemplateDecoration[]
  colors: { primary: string; secondary: string; accent: string }
  aiPrompt: string
}

// ─── Category color palettes ────────────────────────────────────
const palettes: Record<string, { bg: string; grad: string; primary: string; secondary: string; accent: string; text: string; muted: string }> = {
  Wedding:       { bg: "#fdf2f8", grad: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)", primary: "#be185d", secondary: "#9d174d", accent: "#ec4899", text: "#831843", muted: "#9d174d" },
  Birthday:      { bg: "#fff7ed", grad: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)", primary: "#ea580c", secondary: "#c2410c", accent: "#f97316", text: "#9a3412", muted: "#c2410c" },
  Engagement:    { bg: "#fdf2f8", grad: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fae8ff 100%)", primary: "#be185d", secondary: "#86198f", accent: "#d946ef", text: "#831843", muted: "#a21caf" },
  Anniversary:   { bg: "#fefce8", grad: "linear-gradient(135deg, #fefce8 0%, #fef9c3 50%, #fde047 100%)", primary: "#a16207", secondary: "#854d0e", accent: "#eab308", text: "#713f12", muted: "#a16207" },
  "Baby Shower": { bg: "#f0fdf4", grad: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)", primary: "#166534", secondary: "#15803d", accent: "#22c55e", text: "#14532d", muted: "#15803d" },
  Housewarming:  { bg: "#fff7ed", grad: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)", primary: "#c2410c", secondary: "#9a3412", accent: "#f97316", text: "#7c2d12", muted: "#9a3412" },
  Graduation:    { bg: "#f0fdfa", grad: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 50%, #99f6e4 100%)", primary: "#0d9488", secondary: "#0f766e", accent: "#14b8a6", text: "#115e59", muted: "#0f766e" },
  Corporate:     { bg: "#f8fafc", grad: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)", primary: "#1e293b", secondary: "#334155", accent: "#3b82f6", text: "#0f172a", muted: "#475569" },
  Festival:      { bg: "#fef2f2", grad: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fecaca 100%)", primary: "#dc2626", secondary: "#b91c1c", accent: "#ef4444", text: "#991b1b", muted: "#b91c1c" },
  Farewell:      { bg: "#f5f3ff", grad: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)", primary: "#7c3aed", secondary: "#6d28d9", accent: "#8b5cf6", text: "#5b21b6", muted: "#6d28d9" },
  Retirement:    { bg: "#fefce8", grad: "linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #fef9c3 100%)", primary: "#4d7c0f", secondary: "#3f6212", accent: "#65a30d", text: "#365314", muted: "#3f6212" },
  Reception:     { bg: "#fdf4ff", grad: "linear-gradient(135deg, #fdf4ff 0%, #fae8ff 50%, #f5d0fe 100%)", primary: "#a21caf", secondary: "#86198f", accent: "#d946ef", text: "#701a75", muted: "#86198f" },
  "Bridal Shower": { bg: "#fce7f3", grad: "linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)", primary: "#db2777", secondary: "#be185d", accent: "#ec4899", text: "#9d174d", muted: "#be185d" },
  "Kids Party":  { bg: "#fef9c3", grad: "linear-gradient(135deg, #fef9c3 0%, #fde047 50%, #facc15 100%)", primary: "#ca8a04", secondary: "#a16207", accent: "#eab308", text: "#854d0e", muted: "#a16207" },
  Conference:    { bg: "#eff6ff", grad: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #bfdbfe 100%)", primary: "#1d4ed8", secondary: "#1e40af", accent: "#3b82f6", text: "#1e3a8a", muted: "#1e40af" },
};

// ─── Layout presets ──────────────────────────────────────────────
const layouts: Record<string, { fields: Partial<TemplateField>[]; decorations: TemplateDecoration[]; width: number; height: number }> = {
  "centered-elegant": {
    width: 800, height: 600,
    fields: [
      { id: "event-name", x: 80, y: 100, width: 640, height: 80, fontSize: 48, fontWeight: 700, textAlign: "center" },
      { id: "host-name", x: 100, y: 195, width: 600, height: 30, fontSize: 15, fontWeight: 400, textAlign: "center" },
      { id: "date", x: 150, y: 280, width: 500, height: 36, fontSize: 22, fontWeight: 600, textAlign: "center" },
      { id: "time", x: 150, y: 320, width: 500, height: 28, fontSize: 15, fontWeight: 400, textAlign: "center" },
      { id: "venue", x: 100, y: 370, width: 600, height: 30, fontSize: 18, fontWeight: 500, textAlign: "center" },
      { id: "rsvp", x: 150, y: 440, width: 500, height: 24, fontSize: 13, fontWeight: 400, textAlign: "center" },
    ],
    decorations: [
      { type: "line", x: 100, y: 260, width: 600, height: 1, strokeWidth: 1, opacity: 0.4 },
      { type: "line", x: 100, y: 420, width: 600, height: 1, strokeWidth: 1, opacity: 0.4 },
    ],
  },
  "luxury-gold": {
    width: 800, height: 600,
    fields: [
      { id: "event-name", x: 80, y: 120, width: 640, height: 90, fontSize: 50, fontWeight: 700, textAlign: "center" },
      { id: "host-name", x: 120, y: 220, width: 560, height: 30, fontSize: 16, fontWeight: 300, textAlign: "center" },
      { id: "date", x: 150, y: 300, width: 500, height: 36, fontSize: 24, fontWeight: 500, textAlign: "center" },
      { id: "time", x: 350, y: 340, width: 100, height: 28, fontSize: 15, fontWeight: 400, textAlign: "center" },
      { id: "venue", x: 120, y: 390, width: 560, height: 30, fontSize: 16, fontWeight: 500, textAlign: "center" },
      { id: "rsvp", x: 180, y: 450, width: 440, height: 22, fontSize: 12, fontWeight: 300, textAlign: "center" },
    ],
    decorations: [
      { type: "shape", shapeType: "star", x: 350, y: 35, width: 100, height: 100, opacity: 0.1 },
      { type: "line", x: 200, y: 280, width: 400, height: 1, strokeWidth: 1, opacity: 0.3 },
      { type: "line", x: 200, y: 430, width: 400, height: 1, strokeWidth: 1, opacity: 0.3 },
    ],
  },
  "modern-minimal": {
    width: 800, height: 600,
    fields: [
      { id: "event-name", x: 80, y: 140, width: 640, height: 70, fontSize: 44, fontWeight: 800, textAlign: "center", letterSpacing: 2 },
      { id: "host-name", x: 120, y: 220, width: 560, height: 30, fontSize: 14, fontWeight: 300, textAlign: "center" },
      { id: "date", x: 200, y: 300, width: 400, height: 40, fontSize: 28, fontWeight: 600, textAlign: "center" },
      { id: "time", x: 150, y: 345, width: 500, height: 24, fontSize: 12, fontWeight: 400, textAlign: "center", letterSpacing: 3 },
      { id: "venue", x: 120, y: 400, width: 560, height: 30, fontSize: 16, fontWeight: 500, textAlign: "center" },
      { id: "rsvp", x: 150, y: 460, width: 500, height: 24, fontSize: 12, fontWeight: 400, textAlign: "center" },
    ],
    decorations: [
      { type: "line", x: 150, y: 270, width: 500, height: 1, strokeWidth: 1 },
      { type: "line", x: 150, y: 440, width: 500, height: 1, strokeWidth: 1 },
    ],
  },
  "playful-colorful": {
    width: 800, height: 600,
    fields: [
      { id: "event-name", x: 60, y: 100, width: 680, height: 80, fontSize: 44, fontWeight: 700, textAlign: "center" },
      { id: "host-name", x: 120, y: 190, width: 560, height: 28, fontSize: 16, fontWeight: 500, textAlign: "center" },
      { id: "date", x: 150, y: 270, width: 500, height: 36, fontSize: 22, fontWeight: 600, textAlign: "center" },
      { id: "time", x: 150, y: 310, width: 500, height: 28, fontSize: 15, fontWeight: 400, textAlign: "center" },
      { id: "venue", x: 120, y: 360, width: 560, height: 30, fontSize: 18, fontWeight: 500, textAlign: "center" },
      { id: "rsvp", x: 150, y: 430, width: 500, height: 24, fontSize: 13, fontWeight: 400, textAlign: "center" },
    ],
    decorations: [
      { type: "shape", shapeType: "star", x: 60, y: 50, width: 40, height: 40, opacity: 0.5 },
      { type: "shape", shapeType: "star", x: 700, y: 50, width: 40, height: 40, opacity: 0.5 },
      { type: "shape", shapeType: "star", x: 60, y: 490, width: 30, height: 30, opacity: 0.4 },
      { type: "shape", shapeType: "star", x: 710, y: 490, width: 30, height: 30, opacity: 0.4 },
    ],
  },
  "dark-premium": {
    width: 800, height: 600,
    fields: [
      { id: "event-name", x: 80, y: 120, width: 640, height: 90, fontSize: 52, fontWeight: 900, textAlign: "center" },
      { id: "host-name", x: 120, y: 220, width: 560, height: 36, fontSize: 18, fontWeight: 500, textAlign: "center" },
      { id: "date", x: 150, y: 300, width: 500, height: 36, fontSize: 22, fontWeight: 700, textAlign: "center" },
      { id: "time", x: 200, y: 340, width: 400, height: 30, fontSize: 16, fontWeight: 600, textAlign: "center" },
      { id: "venue", x: 150, y: 390, width: 500, height: 30, fontSize: 18, fontWeight: 500, textAlign: "center" },
      { id: "rsvp", x: 150, y: 450, width: 500, height: 24, fontSize: 13, fontWeight: 400, textAlign: "center" },
    ],
    decorations: [
      { type: "shape", shapeType: "star", x: 80, y: 60, width: 50, height: 50, opacity: 0.3 },
      { type: "shape", shapeType: "star", x: 670, y: 60, width: 50, height: 50, opacity: 0.3 },
      { type: "shape", shapeType: "circle", x: 370, y: 480, width: 60, height: 60, opacity: 0.2 },
    ],
  },
  "flower-frame": {
    width: 800, height: 600,
    fields: [
      { id: "event-name", x: 60, y: 130, width: 680, height: 80, fontSize: 48, fontWeight: 700, textAlign: "center" },
      { id: "host-name", x: 80, y: 220, width: 640, height: 28, fontSize: 14, fontWeight: 300, textAlign: "center" },
      { id: "date", x: 150, y: 300, width: 500, height: 36, fontSize: 22, fontWeight: 500, textAlign: "center" },
      { id: "time", x: 320, y: 340, width: 160, height: 28, fontSize: 15, fontWeight: 400, textAlign: "center" },
      { id: "venue", x: 100, y: 390, width: 600, height: 32, fontSize: 18, fontWeight: 500, textAlign: "center" },
      { id: "rsvp", x: 200, y: 450, width: 400, height: 24, fontSize: 13, fontWeight: 300, textAlign: "center" },
    ],
    decorations: [
      { type: "shape", shapeType: "heart", x: 340, y: 30, width: 120, height: 60, opacity: 0.2 },
      { type: "shape", shapeType: "circle", x: 120, y: 100, width: 40, height: 40, opacity: 0.15 },
      { type: "shape", shapeType: "circle", x: 640, y: 100, width: 40, height: 40, opacity: 0.15 },
      { type: "line", x: 180, y: 270, width: 440, height: 1, strokeWidth: 1, opacity: 0.4 },
      { type: "line", x: 180, y: 430, width: 440, height: 1, strokeWidth: 1, opacity: 0.4 },
    ],
  },
  "portrait-simple": {
    width: 600, height: 800,
    fields: [
      { id: "event-name", x: 40, y: 180, width: 520, height: 80, fontSize: 40, fontWeight: 700, textAlign: "center" },
      { id: "host-name", x: 60, y: 270, width: 480, height: 30, fontSize: 14, fontWeight: 400, textAlign: "center" },
      { id: "date", x: 100, y: 360, width: 400, height: 36, fontSize: 20, fontWeight: 600, textAlign: "center" },
      { id: "time", x: 100, y: 400, width: 400, height: 28, fontSize: 14, fontWeight: 400, textAlign: "center" },
      { id: "venue", x: 60, y: 460, width: 480, height: 30, fontSize: 16, fontWeight: 500, textAlign: "center" },
      { id: "rsvp", x: 80, y: 540, width: 440, height: 24, fontSize: 12, fontWeight: 400, textAlign: "center" },
    ],
    decorations: [
      { type: "line", x: 80, y: 340, width: 440, height: 1, strokeWidth: 1, opacity: 0.4 },
      { type: "line", x: 80, y: 520, width: 440, height: 1, strokeWidth: 1, opacity: 0.4 },
    ],
  },
};

// ─── Font pairs ──────────────────────────────────────────────────
const fonts = [
  { display: "Playfair Display", body: "Inter" },
  { display: "Montserrat", body: "Inter" },
  { display: "Dancing Script", body: "Playfair Display" },
  { display: "Fredoka One", body: "Inter" },
  { display: "Poppins", body: "Open Sans" },
  { display: "Lobster", body: "Roboto" },
  { display: "Merriweather", body: "Inter" },
  { display: "Raleway", body: "Lato" },
];

// ─── Template configs ────────────────────────────────────────────
interface TemplateConfig {
  id: string; name: string; category: string; layout: string; font: number; premium?: boolean; dark?: boolean; colorOverride?: string;
}

// Helper to build a template from config
function buildTemplate(cfg: TemplateConfig): InvitationTemplate {
  const p = palettes[cfg.category] || palettes["Wedding"];
  const l = layouts[cfg.layout] || layouts["centered-elegant"];
  const f = fonts[cfg.font % fonts.length];
  const a = cfg.colorOverride || p.accent;

  const fieldDefaults: Record<string, { label: string; default: string }> = {
    "event-name": { label: "Event Name", default: cfg.category === "Wedding" ? "Together Forever" : cfg.category === "Birthday" ? "Happy Birthday!" : cfg.category === "Conference" ? "Annual Conference" : "Celebrate With Us" },
    "host-name":  { label: "Host Name", default: cfg.category === "Wedding" ? "Bride & Groom" : "Hosted by Family" },
    "date":       { label: "Date", default: "Save the Date" },
    "time":       { label: "Time", default: "Event Time" },
    "venue":      { label: "Venue", default: "Event Venue" },
    "rsvp":       { label: "RSVP", default: "RSVP Details" },
  };

  const colors = { primary: p.primary, secondary: p.secondary, accent: p.accent };
  const bg = cfg.dark ? { type: "color" as const, value: cfg.dark === true ? "#0f172a" : "#1c1917" } : { type: "gradient" as const, value: p.grad };

  const fields = l.fields.map((fl) => {
    const def = fieldDefaults[fl.id!] || { label: fl.id!, default: "" };
    const isDisplay = fl.id === "event-name";
    return {
      id: fl.id!,
      label: def.label,
      default: def.default,
      type: "text" as const,
      x: fl.x!, y: fl.y!, width: fl.width!, height: fl.height!,
      fontFamily: isDisplay ? f.display : f.body,
      fontSize: fl.fontSize!,
      fontWeight: fl.fontWeight!,
      color: cfg.dark ? (isDisplay ? colors.accent : "#d4d4d4") : (isDisplay ? colors.primary : colors.muted),
      textAlign: fl.textAlign as "center" | "left" | "right",
      editable: true,
      letterSpacing: fl.letterSpacing,
    };
  });

  // Apply category-specific default text
  const nameMap: Record<string, Record<string, string>> = {
    Wedding:     { "event-name": "Love Story Begins", "host-name": "Bride & Groom", "date": "June 15, 2026", "venue": "Grand Chapel" },
    Birthday:    { "event-name": "Happy Birthday!", "host-name": "Hosted by Family", "date": "July 20, 2026", "venue": "Party Hall" },
    Engagement:  { "event-name": "She Said Yes!", "host-name": "The Happy Couple", "date": "August 5, 2026", "venue": "Celebration Venue" },
    Anniversary: { "event-name": "Love Through Years", "host-name": "Together Forever", "date": "September 10, 2026", "venue": "Memory Lane" },
    "Baby Shower": { "event-name": "Welcome Little One", "host-name": "Mom & Dad", "date": "October 12, 2026", "venue": "Family Home" },
    Housewarming: { "event-name": "New Home Joys", "host-name": "The New Homeowners", "date": "November 5, 2026", "venue": "Our New Home" },
    Graduation:  { "event-name": "Class of 2026!", "host-name": "The Graduate", "date": "May 20, 2026", "venue": "Graduation Hall" },
    Corporate:   { "event-name": "Corporate Event", "host-name": "Company Name", "date": "Event Date", "venue": "Conference Center" },
    Festival:    { "event-name": "Festival Celebrations", "host-name": "Community Welcome", "date": "Festival Dates", "venue": "Festival Grounds" },
    Farewell:    { "event-name": "Farewell & Best Wishes", "host-name": "Your Colleagues", "date": "Farewell Date", "venue": "Office / Venue" },
    Retirement:  { "event-name": "Welcome to Retirement", "host-name": "Friends & Family", "date": "Celebration Date", "venue": "Celebration Hall" },
    Reception:   { "event-name": "Reception Celebration", "host-name": "The Newlyweds", "date": "Reception Date", "venue": "Banquet Hall" },
    "Bridal Shower": { "event-name": "Bridal Shower", "host-name": "Honoring the Bride", "date": "Shower Date", "venue": "Tea Room" },
    "Kids Party": { "event-name": "Kids Party Time!", "host-name": "Hosted by Parents", "date": "Party Date", "venue": "Play Center" },
    Conference:  { "event-name": "Annual Conference", "host-name": "Industry Leaders", "date": "Conference Dates", "venue": "Convention Center" },
  };

  const catNames = nameMap[cfg.category] || nameMap["Wedding"];
  fields.forEach((f) => {
    if (catNames[f.id]) f.default = catNames[f.id];
  });

  const decos = l.decorations.map((d) => ({
    ...d,
    fillColor: d.fillColor || a,
    strokeColor: d.strokeColor || a,
  }));

  const aiPrompt = `Create a ${cfg.style || "elegant"} ${cfg.category.toLowerCase()} invitation card with ${cfg.dark ? "dark" : "light"} background, featuring ${colors.primary} and ${colors.accent} color scheme, ${f.display} typography, and decorative elements.`;

  return {
    id: cfg.id,
    name: cfg.name,
    category: cfg.category,
    thumbnail: "",
    premium: cfg.premium || false,
    style: cfg.layout,
    orientation: l.width > l.height ? "landscape" : l.height > l.width ? "portrait" : "square",
    background: bg,
    width: l.width,
    height: l.height,
    fields,
    decorations: decos,
    colors,
    aiPrompt,
  };
}

// ====== 60+ TEMPLATE DEFINITIONS ==================================

const configs: TemplateConfig[] = [
  // ── WEDDING (10) ──
  { id: "wedding-elegant", name: "Elegant Wedding", category: "Wedding", layout: "centered-elegant", font: 0 },
  { id: "wedding-rustic", name: "Rustic Barn Wedding", category: "Wedding", layout: "centered-elegant", font: 1, colorOverride: "#d97706" },
  { id: "wedding-modern", name: "Modern Minimalist", category: "Wedding", layout: "modern-minimal", font: 1 },
  { id: "wedding-floral", name: "Floral Romance", category: "Wedding", layout: "flower-frame", font: 2 },
  { id: "wedding-luxury", name: "Luxury Gold Wedding", category: "Wedding", layout: "luxury-gold", font: 0, premium: true },
  { id: "wedding-dark", name: "Midnight Romance", category: "Wedding", layout: "dark-premium", font: 0, dark: true, premium: true },
  { id: "wedding-beach", name: "Beach Wedding", category: "Wedding", layout: "centered-elegant", font: 2 },
  { id: "wedding-garden", name: "Garden Ceremony", category: "Wedding", layout: "flower-frame", font: 0 },
  { id: "wedding-vintage", name: "Vintage Charm", category: "Wedding", layout: "luxury-gold", font: 3, colorOverride: "#d97706" },
  { id: "wedding-royal", name: "Royal Wedding", category: "Wedding", layout: "dark-premium", font: 0, premium: true, colorOverride: "#fbbf24" },

  // ── BIRTHDAY (10) ──
  { id: "birthday-kids", name: "Kids Birthday Party", category: "Birthday", layout: "playful-colorful", font: 3 },
  { id: "birthday-18th", name: "18th Birthday Bash", category: "Birthday", layout: "dark-premium", font: 1, dark: true },
  { id: "birthday-surprise", name: "Surprise Party", category: "Birthday", layout: "playful-colorful", font: 3 },
  { id: "birthday-elegant", name: "Elegant Birthday", category: "Birthday", layout: "luxury-gold", font: 0, dark: true },
  { id: "birthday-50th", name: "50th Golden Birthday", category: "Birthday", layout: "luxury-gold", font: 0, premium: true },
  { id: "birthday-sweet16", name: "Sweet Sixteen", category: "Birthday", layout: "flower-frame", font: 3, premium: true },
  { id: "birthday-unicorn", name: "Unicorn Party", category: "Birthday", layout: "playful-colorful", font: 3 },
  { id: "birthday-pool", name: "Pool Party", category: "Birthday", layout: "playful-colorful", font: 3 },
  { id: "birthday-30th", name: "30th Fabulous", category: "Birthday", layout: "dark-premium", font: 1, dark: true },
  { id: "birthday-100th", name: "100 Years Young", category: "Birthday", layout: "centered-elegant", font: 4 },

  // ── ENGAGEMENT (5) ──
  { id: "engagement-classic", name: "Classic Engagement", category: "Engagement", layout: "centered-elegant", font: 0 },
  { id: "engagement-modern", name: "Modern Love", category: "Engagement", layout: "dark-premium", font: 1, dark: true },
  { id: "engagement-garden", name: "Garden Engagement", category: "Engagement", layout: "flower-frame", font: 2 },
  { id: "engagement-beach", name: "Beach Engagement", category: "Engagement", layout: "centered-elegant", font: 4 },
  { id: "engagement-rooftop", name: "Rooftop Proposal", category: "Engagement", layout: "dark-premium", font: 1, dark: true, premium: true },

  // ── ANNIVERSARY (5) ──
  { id: "anniversary-1st", name: "First Anniversary", category: "Anniversary", layout: "centered-elegant", font: 0 },
  { id: "anniversary-25th", name: "Silver Anniversary", category: "Anniversary", layout: "luxury-gold", font: 0, premium: true },
  { id: "anniversary-50th", name: "Golden Anniversary", category: "Anniversary", layout: "luxury-gold", font: 0, premium: true, colorOverride: "#fbbf24" },
  { id: "anniversary-surprise", name: "Anniversary Surprise", category: "Anniversary", layout: "playful-colorful", font: 3 },
  { id: "anniversary-romantic", name: "Romantic Evening", category: "Anniversary", layout: "flower-frame", font: 2 },

  // ── BABY SHOWER (5) ──
  { id: "baby-classic", name: "Classic Baby Shower", category: "Baby Shower", layout: "centered-elegant", font: 0 },
  { id: "baby-gender", name: "Gender Reveal", category: "Baby Shower", layout: "playful-colorful", font: 3 },
  { id: "baby-woodland", name: "Woodland Theme", category: "Baby Shower", layout: "flower-frame", font: 0 },
  { id: "baby-twins", name: "Twins Celebration", category: "Baby Shower", layout: "centered-elegant", font: 0 },
  { id: "baby-boho", name: "Boho Baby Shower", category: "Baby Shower", layout: "flower-frame", font: 2 },

  // ── HOUSEWARMING (5) ──
  { id: "housewarming-cozy", name: "Cozy Home Party", category: "Housewarming", layout: "playful-colorful", font: 3 },
  { id: "housewarming-modern", name: "Modern Housewarming", category: "Housewarming", layout: "modern-minimal", font: 1 },
  { id: "housewarming-garden", name: "Garden Housewarming", category: "Housewarming", layout: "centered-elegant", font: 0 },
  { id: "housewarming-bbq", name: "BBQ Housewarming", category: "Housewarming", layout: "playful-colorful", font: 3 },
  { id: "housewarming-condo", name: "Condo Warming", category: "Housewarming", layout: "modern-minimal", font: 1 },

  // ── GRADUATION (5) ──
  { id: "grad-highschool", name: "High School Grad", category: "Graduation", layout: "playful-colorful", font: 1 },
  { id: "grad-college", name: "College Graduation", category: "Graduation", layout: "dark-premium", font: 1, dark: true },
  { id: "grad-masters", name: "Master's Degree", category: "Graduation", layout: "luxury-gold", font: 0, premium: true },
  { id: "grad-openhouse", name: "Graduation Party", category: "Graduation", layout: "centered-elegant", font: 4 },
  { id: "grad-phd", name: "PhD Celebration", category: "Graduation", layout: "modern-minimal", font: 1, premium: true },

  // ── CORPORATE (5) ──
  { id: "corp-annual", name: "Annual Gala", category: "Corporate", layout: "luxury-gold", font: 1, premium: true },
  { id: "corp-meeting", name: "Board Meeting", category: "Corporate", layout: "modern-minimal", font: 1 },
  { id: "corp-retreat", name: "Company Retreat", category: "Corporate", layout: "centered-elegant", font: 4 },
  { id: "corp-awards", name: "Awards Ceremony", category: "Corporate", layout: "dark-premium", font: 1, dark: true, premium: true },
  { id: "corp-party", name: "Office Party", category: "Corporate", layout: "playful-colorful", font: 4 },

  // ── FESTIVAL (10) ──
  { id: "fest-diwali", name: "Diwali Celebrations", category: "Festival", layout: "luxury-gold", font: 0, premium: true },
  { id: "fest-christmas", name: "Christmas Party", category: "Festival", layout: "playful-colorful", font: 3 },
  { id: "fest-hanukkah", name: "Hanukkah Gathering", category: "Festival", layout: "centered-elegant", font: 0 },
  { id: "fest-eid", name: "Eid Celebration", category: "Festival", layout: "luxury-gold", font: 0, premium: true },
  { id: "fest-halloween", name: "Halloween Bash", category: "Festival", layout: "dark-premium", font: 3, dark: true },
  { id: "fest-thanksgiving", name: "Thanksgiving Dinner", category: "Festival", layout: "centered-elegant", font: 0 },
  { id: "fest-newyear", name: "New Year's Eve", category: "Festival", layout: "dark-premium", font: 1, dark: true, premium: true },
  { id: "fest-ramadan", name: "Ramadan Iftar", category: "Festival", layout: "luxury-gold", font: 0 },
  { id: "fest-easter", name: "Easter Brunch", category: "Festival", layout: "playful-colorful", font: 3 },
  { id: "fest-holi", name: "Holi Color Festival", category: "Festival", layout: "playful-colorful", font: 3 },

  // ── FAREWELL (5) ──
  { id: "farewell-colleague", name: "Farewell Colleague", category: "Farewell", layout: "centered-elegant", font: 4 },
  { id: "farewell-boss", name: "Farewell Boss", category: "Farewell", layout: "modern-minimal", font: 1 },
  { id: "farewell-moving", name: "Moving Away Party", category: "Farewell", layout: "playful-colorful", font: 3 },
  { id: "farewell-retire", name: "Retirement Farewell", category: "Farewell", layout: "luxury-gold", font: 0 },
  { id: "farewell-study", name: "Study Abroad Farewell", category: "Farewell", layout: "playful-colorful", font: 3 },

  // ── RETIREMENT (5) ──
  { id: "retire-happy", name: "Happy Retirement", category: "Retirement", layout: "centered-elegant", font: 4 },
  { id: "retire-party", name: "Retirement Party", category: "Retirement", layout: "playful-colorful", font: 3 },
  { id: "retire-golf", name: "Retirement Golf Day", category: "Retirement", layout: "modern-minimal", font: 1 },
  { id: "retire-travel", name: "Travel Retirement", category: "Retirement", layout: "flower-frame", font: 0 },
  { id: "retire-dinner", name: "Retirement Dinner", category: "Retirement", layout: "luxury-gold", font: 0, premium: true },

  // ── RECEPTION (5) ──
  { id: "reception-evening", name: "Evening Reception", category: "Reception", layout: "luxury-gold", font: 0, premium: true },
  { id: "reception-cocktail", name: "Cocktail Reception", category: "Reception", layout: "dark-premium", font: 1, dark: true },
  { id: "reception-garden", name: "Garden Reception", category: "Reception", layout: "flower-frame", font: 2 },
  { id: "reception-hall", name: "Grand Ballroom", category: "Reception", layout: "centered-elegant", font: 0 },
  { id: "reception-rooftop", name: "Rooftop Reception", category: "Reception", layout: "dark-premium", font: 1, dark: true },

  // ── BRIDAL SHOWER (5) ──
  { id: "bridal-classic", name: "Classic Bridal Shower", category: "Bridal Shower", layout: "centered-elegant", font: 0 },
  { id: "bridal-tea", name: "Tea Party Shower", category: "Bridal Shower", layout: "flower-frame", font: 2 },
  { id: "bridal-brunch", name: "Bridal Brunch", category: "Bridal Shower", layout: "playful-colorful", font: 3 },
  { id: "bridal-lingerie", name: "Lingerie Shower", category: "Bridal Shower", layout: "dark-premium", font: 1, dark: true },
  { id: "bridal-garden", name: "Garden Bridal Shower", category: "Bridal Shower", layout: "flower-frame", font: 0, premium: true },

  // ── KIDS PARTY (5) ──
  { id: "kids-superhero", name: "Superhero Party", category: "Kids Party", layout: "playful-colorful", font: 3 },
  { id: "kids-princess", name: "Princess Party", category: "Kids Party", layout: "playful-colorful", font: 3 },
  { id: "kids-pirate", name: "Pirate Adventure", category: "Kids Party", layout: "playful-colorful", font: 3 },
  { id: "kids-dinosaur", name: "Dinosaur Party", category: "Kids Party", layout: "playful-colorful", font: 3 },
  { id: "kids-safari", name: "Safari Adventure", category: "Kids Party", layout: "playful-colorful", font: 3 },

  // ── CONFERENCE (5) ──
  { id: "conf-annual", name: "Annual Conference", category: "Conference", layout: "modern-minimal", font: 1, premium: true },
  { id: "conf-summit", name: "Leadership Summit", category: "Conference", layout: "dark-premium", font: 1, dark: true, premium: true },
  { id: "conf-workshop", name: "Workshop Series", category: "Conference", layout: "centered-elegant", font: 4 },
  { id: "conf-tech", name: "Tech Conference", category: "Conference", layout: "modern-minimal", font: 1 },
  { id: "conf-networking", name: "Networking Mixer", category: "Conference", layout: "playful-colorful", font: 4 },
];

export const invitationTemplates: InvitationTemplate[] = configs.map(buildTemplate);

export const templateCategories = [...new Set(configs.map((c) => c.category))].sort();
export const premiumTemplates = configs.filter((c) => c.premium).map((c) => c.id);
