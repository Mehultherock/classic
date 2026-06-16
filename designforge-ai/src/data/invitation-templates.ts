export interface TemplateField {
  id: string
  label: string
  default: string
  type: "text" | "multiline"
  x: number; y: number; width: number; height: number
  fontFamily: string; fontSize: number; fontWeight: number
  color: string; textAlign: "left" | "center" | "right"
  editable: boolean
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
  category: "Wedding" | "Birthday" | "Baby Shower" | "Engagement" | "Housewarming"
  thumbnail: string
  background: { type: "color" | "gradient" | "image"; value: string }
  width: number
  height: number
  fields: TemplateField[]
  decorations: TemplateDecoration[]
}

export const invitationTemplates: InvitationTemplate[] = [
  // ========== WEDDING (4) ==========
  {
    id: "wedding-elegant",
    name: "Elegant Wedding",
    category: "Wedding",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Sarah & James", type: "text", x: 80, y: 100, width: 640, height: 80, fontFamily: "Playfair Display", fontSize: 52, fontWeight: 700, color: "#be185d", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Together with their families", type: "text", x: 100, y: 190, width: 600, height: 36, fontFamily: "Inter", fontSize: 16, fontWeight: 400, color: "#9d174d", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Saturday, 15 August 2026", type: "text", x: 150, y: 280, width: 500, height: 40, fontFamily: "Playfair Display", fontSize: 22, fontWeight: 500, color: "#831843", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "5:00 PM - 10:00 PM", type: "text", x: 150, y: 320, width: 500, height: 36, fontFamily: "Inter", fontSize: 16, fontWeight: 400, color: "#9d174d", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Grand Botanical Garden", type: "text", x: 100, y: 370, width: 600, height: 36, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#831843", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP by July 15th", type: "text", x: 200, y: 440, width: 400, height: 30, fontFamily: "Inter", fontSize: 14, fontWeight: 400, color: "#9d174d", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "heart", x: 350, y: 40, width: 100, height: 50, fillColor: "#ec4899", opacity: 0.3 },
      { type: "line", x: 100, y: 250, width: 600, height: 1, strokeColor: "#ec4899", strokeWidth: 1, opacity: 0.5 },
      { type: "line", x: 100, y: 420, width: 600, height: 1, strokeColor: "#ec4899", strokeWidth: 1, opacity: 0.5 },
      { type: "shape", shapeType: "circle", x: 320, y: 470, width: 8, height: 8, fillColor: "#ec4899", opacity: 0.6 },
      { type: "shape", shapeType: "circle", x: 360, y: 470, width: 8, height: 8, fillColor: "#ec4899", opacity: 0.6 },
      { type: "shape", shapeType: "circle", x: 400, y: 470, width: 8, height: 8, fillColor: "#ec4899", opacity: 0.6 },
      { type: "shape", shapeType: "circle", x: 440, y: 470, width: 8, height: 8, fillColor: "#ec4899", opacity: 0.6 },
      { type: "shape", shapeType: "circle", x: 480, y: 470, width: 8, height: 8, fillColor: "#ec4899", opacity: 0.6 },
    ],
  },
  {
    id: "wedding-rustic",
    name: "Rustic Barn Wedding",
    category: "Wedding",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Emily & Michael", type: "text", x: 60, y: 120, width: 680, height: 80, fontFamily: "Playfair Display", fontSize: 48, fontWeight: 700, color: "#92400e", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Join us for our wedding celebration", type: "text", x: 100, y: 210, width: 600, height: 30, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#b45309", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "October 1, 2026", type: "text", x: 150, y: 290, width: 500, height: 40, fontFamily: "Playfair Display", fontSize: 24, fontWeight: 600, color: "#92400e", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "3:00 PM", type: "text", x: 150, y: 330, width: 500, height: 30, fontFamily: "Inter", fontSize: 16, fontWeight: 400, color: "#b45309", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "Sunset Ridge Barn", type: "text", x: 100, y: 380, width: 600, height: 36, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#92400e", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "Please RSVP by September 15", type: "text", x: 150, y: 450, width: 500, height: 28, fontFamily: "Inter", fontSize: 14, fontWeight: 400, color: "#b45309", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "rectangle", x: 80, y: 60, width: 640, height: 480, fillColor: "transparent", strokeColor: "#d97706", strokeWidth: 2, opacity: 0.4 },
      { type: "shape", shapeType: "circle", x: 370, y: 85, width: 60, height: 60, fillColor: "#f59e0b", opacity: 0.15 },
    ],
  },
  {
    id: "wedding-modern",
    name: "Modern Minimalist",
    category: "Wedding",
    thumbnail: "",
    background: { type: "color", value: "#f8fafc" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "ALEX & MORGAN", type: "text", x: 80, y: 140, width: 640, height: 70, fontFamily: "Montserrat", fontSize: 44, fontWeight: 800, color: "#0f172a", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Request the honor of your presence", type: "text", x: 120, y: 220, width: 560, height: 30, fontFamily: "Inter", fontSize: 14, fontWeight: 300, color: "#64748b", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "06.12.2026", type: "text", x: 200, y: 300, width: 400, height: 40, fontFamily: "Montserrat", fontSize: 28, fontWeight: 600, color: "#0f172a", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "SIX O'CLOCK IN THE EVENING", type: "text", x: 150, y: 345, width: 500, height: 24, fontFamily: "Inter", fontSize: 12, fontWeight: 400, color: "#64748b", letterSpacing: 3, textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Skyline Loft, NYC", type: "text", x: 120, y: 400, width: 560, height: 30, fontFamily: "Montserrat", fontSize: 16, fontWeight: 500, color: "#334155", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP: morganandalex@email.com", type: "text", x: 150, y: 460, width: 500, height: 24, fontFamily: "Inter", fontSize: 12, fontWeight: 400, color: "#94a3b8", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "line", x: 150, y: 270, width: 500, height: 1, strokeColor: "#cbd5e1", strokeWidth: 1 },
      { type: "line", x: 150, y: 440, width: 500, height: 1, strokeColor: "#cbd5e1", strokeWidth: 1 },
    ],
  },
  {
    id: "wedding-floral",
    name: "Floral Romance",
    category: "Wedding",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(180deg, #fdf4ff 0%, #fae8ff 40%, #f5d0fe 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Olivia & Ethan", type: "text", x: 60, y: 130, width: 680, height: 80, fontFamily: "Dancing Script", fontSize: 56, fontWeight: 700, color: "#86198f", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Together with their families, we invite you", type: "text", x: 80, y: 220, width: 640, height: 28, fontFamily: "Inter", fontSize: 14, fontWeight: 300, color: "#a21caf", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Saturday, 22nd May 2027", type: "text", x: 150, y: 300, width: 500, height: 36, fontFamily: "Playfair Display", fontSize: 22, fontWeight: 500, color: "#86198f", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "2:30 PM", type: "text", x: 320, y: 340, width: 160, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#a21caf", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Rose Garden Chapel", type: "text", x: 100, y: 390, width: 600, height: 32, fontFamily: "Playfair Display", fontSize: 18, fontWeight: 500, color: "#86198f", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "Kindly RSVP by May 1st", type: "text", x: 200, y: 450, width: 400, height: 26, fontFamily: "Inter", fontSize: 13, fontWeight: 300, color: "#a21caf", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "heart", x: 340, y: 30, width: 120, height: 60, fillColor: "#d946ef", opacity: 0.2 },
      { type: "shape", shapeType: "circle", x: 120, y: 100, width: 40, height: 40, fillColor: "#e879f9", opacity: 0.15 },
      { type: "shape", shapeType: "circle", x: 640, y: 100, width: 40, height: 40, fillColor: "#e879f9", opacity: 0.15 },
      { type: "line", x: 180, y: 270, width: 440, height: 1, strokeColor: "#d946ef", strokeWidth: 1, opacity: 0.4 },
      { type: "line", x: 180, y: 430, width: 440, height: 1, strokeColor: "#d946ef", strokeWidth: 1, opacity: 0.4 },
    ],
  },

  // ========== BIRTHDAY (4) ==========
  {
    id: "birthday-kids",
    name: "Kids Birthday Party",
    category: "Birthday",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "🎉 Leo's 5th Birthday!", type: "text", x: 60, y: 100, width: 680, height: 80, fontFamily: "Fredoka One", fontSize: 48, fontWeight: 700, color: "#ea580c", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Hosted by Sarah & Mike", type: "text", x: 120, y: 190, width: 560, height: 30, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#9a3412", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Saturday, June 20th", type: "text", x: 150, y: 270, width: 500, height: 36, fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#c2410c", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "2:00 PM - 5:00 PM", type: "text", x: 150, y: 310, width: 500, height: 28, fontFamily: "Inter", fontSize: 16, fontWeight: 400, color: "#9a3412", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "Sunny Lane Park", type: "text", x: 150, y: 360, width: 500, height: 32, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#c2410c", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "Please RSVP by June 10th", type: "text", x: 200, y: 430, width: 400, height: 26, fontFamily: "Inter", fontSize: 14, fontWeight: 400, color: "#9a3412", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "star", x: 60, y: 60, width: 50, height: 50, fillColor: "#fbbf24", opacity: 0.6 },
      { type: "shape", shapeType: "star", x: 690, y: 60, width: 40, height: 40, fillColor: "#f97316", opacity: 0.5 },
      { type: "shape", shapeType: "star", x: 60, y: 490, width: 35, height: 35, fillColor: "#fb923c", opacity: 0.4 },
      { type: "shape", shapeType: "star", x: 700, y: 490, width: 45, height: 45, fillColor: "#fbbf24", opacity: 0.5 },
      { type: "shape", shapeType: "rectangle", x: 320, y: 470, width: 160, height: 40, fillColor: "#f97316", opacity: 0.2 },
    ],
  },
  {
    id: "birthday-18th",
    name: "18th Birthday Bash",
    category: "Birthday",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2e1065 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "EIGHTEEN", type: "text", x: 100, y: 120, width: 600, height: 90, fontFamily: "Montserrat", fontSize: 64, fontWeight: 900, color: "#ffffff", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Jake's Birthday Bash", type: "text", x: 120, y: 220, width: 560, height: 36, fontFamily: "Inter", fontSize: 20, fontWeight: 500, color: "#a78bfa", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "FRIDAY, AUGUST 14", type: "text", x: 150, y: 300, width: 500, height: 36, fontFamily: "Montserrat", fontSize: 22, fontWeight: 700, color: "#ffffff", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "9:00 PM - LATE", type: "text", x: 200, y: 340, width: 400, height: 30, fontFamily: "Inter", fontSize: 16, fontWeight: 600, color: "#a78bfa", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "Club Nova, Downtown", type: "text", x: 150, y: 390, width: 500, height: 30, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#c4b5fd", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "Text Jake at (555) 123-4567", type: "text", x: 150, y: 450, width: 500, height: 26, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#8b5cf6", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "star", x: 80, y: 60, width: 60, height: 60, fillColor: "#8b5cf6", opacity: 0.3 },
      { type: "shape", shapeType: "star", x: 660, y: 60, width: 50, height: 50, fillColor: "#7c3aed", opacity: 0.3 },
      { type: "shape", shapeType: "circle", x: 370, y: 480, width: 60, height: 60, fillColor: "#6d28d9", opacity: 0.2 },
    ],
  },
  {
    id: "birthday-surprise",
    name: "Surprise Party",
    category: "Birthday",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #fce7f3 0%, #e0e7ff 50%, #dbeafe 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "SURPRISE!", type: "text", x: 140, y: 100, width: 520, height: 90, fontFamily: "Fredoka One", fontSize: 60, fontWeight: 700, color: "#db2777", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "You're invited to Mia's surprise party!", type: "text", x: 80, y: 200, width: 640, height: 30, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#831843", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Saturday, July 10th", type: "text", x: 150, y: 280, width: 500, height: 36, fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#be185d", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "7:00 PM (SHARP!)", type: "text", x: 200, y: 320, width: 400, height: 28, fontFamily: "Inter", fontSize: 16, fontWeight: 600, color: "#db2777", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Hideaway Restaurant", type: "text", x: 120, y: 370, width: 560, height: 30, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#831843", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "Shh! RSVP to Tom: (555) 987-6543", type: "text", x: 120, y: 440, width: 560, height: 26, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#9d174d", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "star", x: 60, y: 50, width: 45, height: 45, fillColor: "#ec4899", opacity: 0.4 },
      { type: "shape", shapeType: "star", x: 695, y: 50, width: 45, height: 45, fillColor: "#6366f1", opacity: 0.4 },
      { type: "shape", shapeType: "star", x: 140, y: 490, width: 35, height: 35, fillColor: "#8b5cf6", opacity: 0.3 },
      { type: "shape", shapeType: "star", x: 625, y: 490, width: 35, height: 35, fillColor: "#ec4899", opacity: 0.3 },
      { type: "line", x: 120, y: 260, width: 560, height: 1, strokeColor: "#ec4899", strokeWidth: 1, opacity: 0.5 },
      { type: "line", x: 120, y: 420, width: 560, height: 1, strokeColor: "#ec4899", strokeWidth: 1, opacity: 0.5 },
    ],
  },
  {
    id: "birthday-elegant",
    name: "Elegant Birthday",
    category: "Birthday",
    thumbnail: "",
    background: { type: "color", value: "#1c1917" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Golden Birthday", type: "text", x: 100, y: 130, width: 600, height: 80, fontFamily: "Playfair Display", fontSize: 50, fontWeight: 700, color: "#fbbf24", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Celebrating Victoria's 30th", type: "text", x: 120, y: 220, width: 560, height: 30, fontFamily: "Inter", fontSize: 16, fontWeight: 300, color: "#d4d4d4", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "December 5, 2026", type: "text", x: 150, y: 300, width: 500, height: 36, fontFamily: "Playfair Display", fontSize: 24, fontWeight: 500, color: "#fbbf24", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "7:00 PM", type: "text", x: 350, y: 340, width: 100, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#a3a3a3", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Ritz-Carlton Ballroom", type: "text", x: 120, y: 390, width: 560, height: 30, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#e5e5e5", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP to: victoria30@email.com", type: "text", x: 180, y: 450, width: 440, height: 24, fontFamily: "Inter", fontSize: 12, fontWeight: 300, color: "#78716c", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "star", x: 350, y: 40, width: 100, height: 100, fillColor: "#fbbf24", opacity: 0.1 },
      { type: "line", x: 200, y: 280, width: 400, height: 1, strokeColor: "#fbbf24", strokeWidth: 1, opacity: 0.3 },
      { type: "line", x: 200, y: 430, width: 400, height: 1, strokeColor: "#fbbf24", strokeWidth: 1, opacity: 0.3 },
    ],
  },

  // ========== BABY SHOWER (4) ==========
  {
    id: "baby-shower-classic",
    name: "Classic Baby Shower",
    category: "Baby Shower",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Welcome Baby!", type: "text", x: 100, y: 100, width: 600, height: 80, fontFamily: "Playfair Display", fontSize: 48, fontWeight: 700, color: "#166534", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Shower for Jessica & Mark", type: "text", x: 120, y: 190, width: 560, height: 30, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#15803d", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Sunday, August 8th", type: "text", x: 150, y: 270, width: 500, height: 36, fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#166534", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "2:00 PM - 5:00 PM", type: "text", x: 150, y: 310, width: 500, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#15803d", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Johnson Residence", type: "text", x: 150, y: 360, width: 500, height: 30, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#166534", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "Please RSVP by August 1st", type: "text", x: 200, y: 430, width: 400, height: 26, fontFamily: "Inter", fontSize: 14, fontWeight: 400, color: "#15803d", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "heart", x: 330, y: 40, width: 140, height: 50, fillColor: "#22c55e", opacity: 0.2 },
      { type: "shape", shapeType: "heart", x: 100, y: 480, width: 50, height: 30, fillColor: "#4ade80", opacity: 0.3 },
      { type: "shape", shapeType: "heart", x: 650, y: 480, width: 50, height: 30, fillColor: "#4ade80", opacity: 0.3 },
      { type: "line", x: 100, y: 250, width: 600, height: 1, strokeColor: "#4ade80", strokeWidth: 1, opacity: 0.5 },
      { type: "line", x: 100, y: 410, width: 600, height: 1, strokeColor: "#4ade80", strokeWidth: 1, opacity: 0.5 },
    ],
  },
  {
    id: "baby-shower-gender",
    name: "Gender Reveal",
    category: "Baby Shower",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #fdf2f8 0%, #e0e7ff 50%, #fce7f3 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "👶 Baby or Girl?", type: "text", x: 80, y: 110, width: 640, height: 80, fontFamily: "Fredoka One", fontSize: 44, fontWeight: 700, color: "#7c3aed", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Hosted by The Thompson Family", type: "text", x: 120, y: 200, width: 560, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 500, color: "#6d28d9", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Saturday, September 25th", type: "text", x: 150, y: 280, width: 500, height: 36, fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#7c3aed", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "3:00 PM", type: "text", x: 350, y: 320, width: 100, height: 28, fontFamily: "Inter", fontSize: 16, fontWeight: 400, color: "#8b5cf6", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Thompson Backyard", type: "text", x: 150, y: 370, width: 500, height: 30, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#6d28d9", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP: babyguest@email.com", type: "text", x: 200, y: 440, width: 400, height: 24, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#7c3aed", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "heart", x: 350, y: 30, width: 100, height: 50, fillColor: "#ec4899", opacity: 0.2 },
      { type: "shape", shapeType: "star", x: 250, y: 30, width: 40, height: 40, fillColor: "#6366f1", opacity: 0.2 },
      { type: "shape", shapeType: "star", x: 510, y: 30, width: 40, height: 40, fillColor: "#ec4899", opacity: 0.2 },
      { type: "shape", shapeType: "circle", x: 330, y: 470, width: 140, height: 60, fillColor: "transparent", strokeColor: "#8b5cf6", strokeWidth: 2, opacity: 0.3 },
    ],
  },
  {
    id: "baby-shower-woodland",
    name: "Woodland Theme",
    category: "Baby Shower",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #f0fdf4 0%, #fef3c7 50%, #fef9c3 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Little Explorer", type: "text", x: 100, y: 120, width: 600, height: 80, fontFamily: "Playfair Display", fontSize: 46, fontWeight: 700, color: "#92400e", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Baby Shower for Amelia", type: "text", x: 140, y: 210, width: 520, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 500, color: "#b45309", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "October 10, 2026", type: "text", x: 180, y: 290, width: 440, height: 36, fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#92400e", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "11:00 AM - 2:00 PM", type: "text", x: 180, y: 330, width: 440, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#b45309", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "Pine Grove Community Center", type: "text", x: 100, y: 380, width: 600, height: 30, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#92400e", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP by October 1st", type: "text", x: 250, y: 440, width: 300, height: 26, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#a16207", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "circle", x: 80, y: 80, width: 60, height: 60, fillColor: "#f59e0b", opacity: 0.15 },
      { type: "shape", shapeType: "circle", x: 660, y: 80, width: 50, height: 50, fillColor: "#84cc16", opacity: 0.15 },
      { type: "shape", shapeType: "circle", x: 80, y: 470, width: 40, height: 40, fillColor: "#22c55e", opacity: 0.15 },
      { type: "shape", shapeType: "circle", x: 680, y: 470, width: 45, height: 45, fillColor: "#f59e0b", opacity: 0.15 },
    ],
  },
  {
    id: "baby-shower-twins",
    name: "Twins Celebration",
    category: "Baby Shower",
    thumbnail: "",
    background: { type: "color", value: "#fdf4ff" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Double the Love", type: "text", x: 100, y: 110, width: 600, height: 80, fontFamily: "Playfair Display", fontSize: 48, fontWeight: 700, color: "#a21caf", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Celebrating Sarah & Tom's twins", type: "text", x: 120, y: 200, width: 560, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 500, color: "#86198f", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "November 14, 2026", type: "text", x: 180, y: 280, width: 440, height: 36, fontFamily: "Playfair Display", fontSize: 22, fontWeight: 600, color: "#a21caf", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "1:00 PM - 4:00 PM", type: "text", x: 180, y: 320, width: 440, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#86198f", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Garden Pavilion", type: "text", x: 200, y: 370, width: 400, height: 30, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#a21caf", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP to: doublelove@email.com", type: "text", x: 200, y: 440, width: 400, height: 24, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#c026d3", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "heart", x: 270, y: 40, width: 70, height: 40, fillColor: "#d946ef", opacity: 0.25 },
      { type: "shape", shapeType: "heart", x: 460, y: 40, width: 70, height: 40, fillColor: "#e879f9", opacity: 0.25 },
      { type: "line", x: 120, y: 260, width: 560, height: 1, strokeColor: "#d946ef", strokeWidth: 1, opacity: 0.4 },
      { type: "line", x: 120, y: 420, width: 560, height: 1, strokeColor: "#d946ef", strokeWidth: 1, opacity: 0.4 },
    ],
  },

  // ========== ENGAGEMENT (4) ==========
  {
    id: "engagement-classic",
    name: "Classic Engagement",
    category: "Engagement",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fae8ff 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "We're Engaged!", type: "text", x: 80, y: 100, width: 640, height: 80, fontFamily: "Playfair Display", fontSize: 52, fontWeight: 700, color: "#be185d", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Rachel & David", type: "text", x: 120, y: 190, width: 560, height: 40, fontFamily: "Playfair Display", fontSize: 28, fontWeight: 600, color: "#9d174d", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Engagement Party: June 26th", type: "text", x: 150, y: 280, width: 500, height: 36, fontFamily: "Inter", fontSize: 20, fontWeight: 500, color: "#831843", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "6:00 PM - 9:00 PM", type: "text", x: 150, y: 320, width: 500, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#9d174d", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Rooftop Lounge", type: "text", x: 200, y: 370, width: 400, height: 30, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#831843", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP by June 15th", type: "text", x: 250, y: 440, width: 300, height: 24, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#9d174d", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "heart", x: 200, y: 40, width: 50, height: 30, fillColor: "#f43f5e", opacity: 0.3 },
      { type: "shape", shapeType: "heart", x: 400, y: 40, width: 50, height: 30, fillColor: "#ec4899", opacity: 0.3 },
      { type: "shape", shapeType: "heart", x: 550, y: 40, width: 50, height: 30, fillColor: "#f43f5e", opacity: 0.3 },
      { type: "shape", shapeType: "circle", x: 370, y: 470, width: 60, height: 60, fillColor: "transparent", strokeColor: "#ec4899", strokeWidth: 2, opacity: 0.3 },
    ],
  },
  {
    id: "engagement-modern",
    name: "Modern Love",
    category: "Engagement",
    thumbnail: "",
    background: { type: "color", value: "#09090b" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "SHE SAID YES", type: "text", x: 80, y: 120, width: 640, height: 90, fontFamily: "Montserrat", fontSize: 56, fontWeight: 900, color: "#ffffff", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Emma & James", type: "text", x: 200, y: 220, width: 400, height: 40, fontFamily: "Playfair Display", fontSize: 30, fontWeight: 600, color: "#fbbf24", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Engagement Party: July 17", type: "text", x: 150, y: 300, width: 500, height: 32, fontFamily: "Inter", fontSize: 18, fontWeight: 400, color: "#a3a3a3", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "7:30 PM", type: "text", x: 350, y: 340, width: 100, height: 24, fontFamily: "Inter", fontSize: 14, fontWeight: 400, color: "#737373", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "Sky View Terrace", type: "text", x: 200, y: 390, width: 400, height: 28, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#d4d4d4", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP: emmajames@email.com", type: "text", x: 200, y: 450, width: 400, height: 22, fontFamily: "Inter", fontSize: 12, fontWeight: 300, color: "#525252", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "circle", x: 350, y: 40, width: 100, height: 100, fillColor: "#fbbf24", opacity: 0.08 },
      { type: "line", x: 150, y: 280, width: 500, height: 1, strokeColor: "#fbbf24", strokeWidth: 1, opacity: 0.2 },
      { type: "line", x: 150, y: 430, width: 500, height: 1, strokeColor: "#fbbf24", strokeWidth: 1, opacity: 0.2 },
    ],
  },
  {
    id: "engagement-garden",
    name: "Garden Engagement",
    category: "Engagement",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #f0fdf4 0%, #fefce8 50%, #fdf2f8 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Garden Love Story", type: "text", x: 80, y: 110, width: 640, height: 70, fontFamily: "Dancing Script", fontSize: 48, fontWeight: 700, color: "#15803d", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Hannah & Benjamin", type: "text", x: 200, y: 190, width: 400, height: 36, fontFamily: "Playfair Display", fontSize: 24, fontWeight: 600, color: "#166534", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "August 21, 2026", type: "text", x: 180, y: 280, width: 440, height: 32, fontFamily: "Inter", fontSize: 20, fontWeight: 500, color: "#15803d", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "4:00 PM", type: "text", x: 370, y: 320, width: 60, height: 24, fontFamily: "Inter", fontSize: 14, fontWeight: 400, color: "#16a34a", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "Botanical Gardens Pavilion", type: "text", x: 120, y: 370, width: 560, height: 28, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#166534", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "Kindly RSVP by August 7th", type: "text", x: 200, y: 440, width: 400, height: 22, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#22c55e", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "heart", x: 340, y: 40, width: 120, height: 50, fillColor: "#22c55e", opacity: 0.2 },
      { type: "shape", shapeType: "circle", x: 80, y: 470, width: 30, height: 30, fillColor: "#4ade80", opacity: 0.2 },
      { type: "shape", shapeType: "circle", x: 690, y: 470, width: 30, height: 30, fillColor: "#4ade80", opacity: 0.2 },
    ],
  },
  {
    id: "engagement-beach",
    name: "Beach Engagement",
    category: "Engagement",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 50%, #a5f3fc 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Beachside Yes", type: "text", x: 80, y: 100, width: 640, height: 80, fontFamily: "Playfair Display", fontSize: 50, fontWeight: 700, color: "#0369a1", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Maya & Chris", type: "text", x: 200, y: 190, width: 400, height: 36, fontFamily: "Playfair Display", fontSize: 26, fontWeight: 600, color: "#0284c7", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "September 5, 2026", type: "text", x: 180, y: 280, width: 440, height: 32, fontFamily: "Inter", fontSize: 20, fontWeight: 500, color: "#0369a1", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "4:30 PM - Sunset", type: "text", x: 180, y: 320, width: 440, height: 26, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#0284c7", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "Makena Beach, Maui", type: "text", x: 180, y: 370, width: 440, height: 28, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#0369a1", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP: beachlove@email.com", type: "text", x: 220, y: 440, width: 360, height: 22, fontFamily: "Inter", fontSize: 12, fontWeight: 400, color: "#0ea5e9", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "circle", x: 350, y: 40, width: 100, height: 80, fillColor: "transparent", strokeColor: "#0ea5e9", strokeWidth: 2, opacity: 0.3 },
      { type: "line", x: 100, y: 260, width: 600, height: 1, strokeColor: "#38bdf8", strokeWidth: 1, opacity: 0.4 },
      { type: "line", x: 100, y: 420, width: 600, height: 1, strokeColor: "#38bdf8", strokeWidth: 1, opacity: 0.4 },
      { type: "shape", shapeType: "star", x: 80, y: 460, width: 30, height: 30, fillColor: "#fbbf24", opacity: 0.4 },
      { type: "shape", shapeType: "star", x: 690, y: 460, width: 25, height: 25, fillColor: "#fbbf24", opacity: 0.4 },
    ],
  },

  // ========== HOUSEWARMING (4) ==========
  {
    id: "housewarming-cozy",
    name: "Cozy Home Party",
    category: "Housewarming",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "🏠 New Home, New Memories!", type: "text", x: 60, y: 100, width: 680, height: 80, fontFamily: "Fredoka One", fontSize: 40, fontWeight: 700, color: "#c2410c", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Hosted by Alex & Taylor", type: "text", x: 140, y: 190, width: 520, height: 28, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#9a3412", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Saturday, October 16th", type: "text", x: 150, y: 270, width: 500, height: 36, fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#c2410c", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "3:00 PM - 8:00 PM", type: "text", x: 150, y: 310, width: 500, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#9a3412", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "1428 Maple Street", type: "text", x: 200, y: 360, width: 400, height: 30, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#c2410c", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "Please RSVP by October 9th", type: "text", x: 180, y: 430, width: 440, height: 24, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#b45309", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "rectangle", x: 80, y: 50, width: 640, height: 500, fillColor: "transparent", strokeColor: "#ea580c", strokeWidth: 2, opacity: 0.3 },
      { type: "shape", shapeType: "heart", x: 360, y: 460, width: 80, height: 40, fillColor: "#f97316", opacity: 0.2 },
    ],
  },
  {
    id: "housewarming-modern",
    name: "Modern Housewarming",
    category: "Housewarming",
    thumbnail: "",
    background: { type: "color", value: "#fafafa" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "HOUSEWARMING", type: "text", x: 60, y: 110, width: 680, height: 80, fontFamily: "Montserrat", fontSize: 52, fontWeight: 800, color: "#171717", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Jessica & Ryan invite you over!", type: "text", x: 120, y: 200, width: 560, height: 30, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#525252", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Friday, November 5th", type: "text", x: 180, y: 280, width: 440, height: 36, fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#171717", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "7:00 PM", type: "text", x: 360, y: 320, width: 80, height: 26, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#525252", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "The Modern Condo, Unit 401", type: "text", x: 120, y: 370, width: 560, height: 28, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#262626", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP by Oct 28th: jessryan@email.com", type: "text", x: 120, y: 440, width: 560, height: 22, fontFamily: "Inter", fontSize: 12, fontWeight: 400, color: "#a3a3a3", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "line", x: 120, y: 260, width: 560, height: 1, strokeColor: "#d4d4d4", strokeWidth: 1 },
      { type: "line", x: 120, y: 420, width: 560, height: 1, strokeColor: "#d4d4d4", strokeWidth: 1 },
    ],
  },
  {
    id: "housewarming-garden",
    name: "Garden Housewarming",
    category: "Housewarming",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #a7f3d0 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "Welcome to Our Home", type: "text", x: 80, y: 100, width: 640, height: 80, fontFamily: "Playfair Display", fontSize: 44, fontWeight: 700, color: "#065f46", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Natalie & Chris", type: "text", x: 220, y: 190, width: 360, height: 36, fontFamily: "Playfair Display", fontSize: 24, fontWeight: 600, color: "#047857", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Saturday, November 20th", type: "text", x: 150, y: 270, width: 500, height: 36, fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#065f46", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "2:00 PM - 6:00 PM", type: "text", x: 150, y: 310, width: 500, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#047857", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "258 Oak Avenue", type: "text", x: 250, y: 360, width: 300, height: 30, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#065f46", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "RSVP: natalieandchris@email.com", type: "text", x: 150, y: 430, width: 500, height: 24, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#059669", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "heart", x: 330, y: 40, width: 140, height: 50, fillColor: "#10b981", opacity: 0.2 },
      { type: "shape", shapeType: "circle", x: 80, y: 480, width: 30, height: 30, fillColor: "#34d399", opacity: 0.3 },
      { type: "shape", shapeType: "circle", x: 690, y: 480, width: 30, height: 30, fillColor: "#34d399", opacity: 0.3 },
      { type: "line", x: 100, y: 250, width: 600, height: 1, strokeColor: "#34d399", strokeWidth: 1, opacity: 0.4 },
      { type: "line", x: 100, y: 410, width: 600, height: 1, strokeColor: "#34d399", strokeWidth: 1, opacity: 0.4 },
    ],
  },
  {
    id: "housewarming-bbq",
    name: "BBQ Housewarming",
    category: "Housewarming",
    thumbnail: "",
    background: { type: "gradient", value: "linear-gradient(135deg, #fefce8 0%, #fef9c3 50%, #fde047 100%)" },
    width: 800, height: 600,
    fields: [
      { id: "event-name", label: "Event Name", default: "🔥 BBQ Housewarming", type: "text", x: 60, y: 100, width: 680, height: 80, fontFamily: "Fredoka One", fontSize: 44, fontWeight: 700, color: "#854d0e", textAlign: "center", editable: true },
      { id: "host-name", label: "Host Name", default: "Hosted by The Martinez Family", type: "text", x: 120, y: 190, width: 560, height: 28, fontFamily: "Inter", fontSize: 16, fontWeight: 500, color: "#a16207", textAlign: "center", editable: true },
      { id: "date", label: "Date", default: "Sunday, June 27th", type: "text", x: 150, y: 270, width: 500, height: 36, fontFamily: "Inter", fontSize: 22, fontWeight: 600, color: "#854d0e", textAlign: "center", editable: true },
      { id: "time", label: "Time", default: "12:00 PM - 6:00 PM", type: "text", x: 150, y: 310, width: 500, height: 28, fontFamily: "Inter", fontSize: 15, fontWeight: 400, color: "#a16207", textAlign: "center", editable: true },
      { id: "venue", label: "Venue", default: "452 Pine Street Backyard", type: "text", x: 150, y: 360, width: 500, height: 30, fontFamily: "Inter", fontSize: 18, fontWeight: 500, color: "#854d0e", textAlign: "center", editable: true },
      { id: "rsvp", label: "RSVP", default: "Bring your appetite! RSVP by June 20th", type: "text", x: 100, y: 440, width: 600, height: 24, fontFamily: "Inter", fontSize: 13, fontWeight: 400, color: "#a16207", textAlign: "center", editable: true },
    ],
    decorations: [
      { type: "shape", shapeType: "star", x: 60, y: 60, width: 40, height: 40, fillColor: "#eab308", opacity: 0.5 },
      { type: "shape", shapeType: "star", x: 700, y: 60, width: 40, height: 40, fillColor: "#f59e0b", opacity: 0.5 },
      { type: "shape", shapeType: "star", x: 60, y: 490, width: 30, height: 30, fillColor: "#eab308", opacity: 0.4 },
      { type: "shape", shapeType: "star", x: 710, y: 490, width: 30, height: 30, fillColor: "#f59e0b", opacity: 0.4 },
      { type: "shape", shapeType: "circle", x: 360, y: 470, width: 80, height: 50, fillColor: "transparent", strokeColor: "#eab308", strokeWidth: 2, opacity: 0.3 },
    ],
  },
]
