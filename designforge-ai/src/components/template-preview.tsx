"use client";

export type TemplateStyle =
  | "wedding" | "birthday" | "business" | "social" | "education"
  | "music" | "travel" | "fashion" | "tech" | "festival"
  | "food" | "fitness" | "sports" | "baby" | "certificate";

const styleKeys: Record<string, TemplateStyle> = {
  wedding: "wedding", birthday: "birthday", engagement: "wedding",
  anniversary: "wedding", "baby shower": "baby",
  graduation: "certificate", farewell: "travel",
  business: "business", events: "social",
  festivals: "festival", promotions: "business",
  sports: "sports", education: "education",
  "food & drink": "food", travel: "travel",
  music: "music", fashion: "fashion",
  technology: "tech", "real estate": "business",
  fitness: "fitness", beauty: "fashion",
  pets: "baby", nature: "travel",
  "art & creative": "fashion", finance: "business",
  legal: "business",
};

function categoryToStyle(category: string): TemplateStyle {
  const key = category.toLowerCase().trim();
  return styleKeys[key] || "business";
}

export function getTemplateStyle(category: string): TemplateStyle {
  return categoryToStyle(category);
}

export default function TemplatePreview({ style }: { style: TemplateStyle }) {
  const base = "w-full h-full";
  switch (style) {
    case "wedding":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#1a0a1e"/>
          <rect x="20" y="20" width="360" height="260" rx="12" fill="none" stroke="#d4a0f0" strokeWidth="1" opacity="0.4"/>
          <line x1="60" y1="60" x2="340" y2="60" stroke="#f0c0e0" strokeWidth="0.5" opacity="0.6"/>
          <line x1="60" y1="240" x2="340" y2="240" stroke="#f0c0e0" strokeWidth="0.5" opacity="0.6"/>
          <text x="200" y="110" textAnchor="middle" fill="#f0d0ff" fontSize="22" fontFamily="serif" fontWeight="bold">Save the Date</text>
          <text x="200" y="145" textAnchor="middle" fill="#d4a0f0" fontSize="10" fontFamily="serif">Together with their families</text>
          <text x="200" y="170" textAnchor="middle" fill="#f0c0e0" fontSize="14" fontFamily="serif" fontWeight="bold">Sarah &amp; James</text>
          <text x="200" y="195" textAnchor="middle" fill="#d4a0f0" fontSize="9">Saturday, 15 August 2026</text>
          <circle cx="140" cy="230" r="12" fill="none" stroke="#d4a0f0" strokeWidth="1" opacity="0.5"/>
          <circle cx="200" cy="230" r="12" fill="none" stroke="#d4a0f0" strokeWidth="1" opacity="0.5"/>
          <circle cx="260" cy="230" r="12" fill="none" stroke="#d4a0f0" strokeWidth="1" opacity="0.5"/>
          <rect x="80" y="245" width="18" height="18" rx="2" fill="none" stroke="#f0c0e0" strokeWidth="0.8" opacity="0.4"/>
          <rect x="100" y="245" width="18" height="18" rx="2" fill="none" stroke="#f0c0e0" strokeWidth="0.8" opacity="0.4"/>
          <rect x="120" y="245" width="18" height="18" rx="2" fill="none" stroke="#f0c0e0" strokeWidth="0.8" opacity="0.4"/>
          <rect x="220" y="245" width="18" height="18" rx="2" fill="none" stroke="#f0c0e0" strokeWidth="0.8" opacity="0.4"/>
          <rect x="240" y="245" width="18" height="18" rx="2" fill="none" stroke="#f0c0e0" strokeWidth="0.8" opacity="0.4"/>
          <rect x="260" y="245" width="18" height="18" rx="2" fill="none" stroke="#f0c0e0" strokeWidth="0.8" opacity="0.4"/>
        </svg>
      );
    case "birthday":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#1a0a0a"/>
          <circle cx="100" cy="80" r="20" fill="#ff6b6b" opacity="0.3"/>
          <circle cx="160" cy="60" r="16" fill="#ffa502" opacity="0.3"/>
          <circle cx="220" cy="85" r="18" fill="#ff6b6b" opacity="0.3"/>
          <circle cx="280" cy="65" r="14" fill="#ffa502" opacity="0.3"/>
          <circle cx="330" cy="80" r="16" fill="#ff6b6b" opacity="0.3"/>
          <text x="200" y="140" textAnchor="middle" fill="#ff8a8a" fontSize="16" fontWeight="bold">You're Invited!</text>
          <text x="200" y="170" textAnchor="middle" fill="#ffa502" fontSize="28" fontWeight="bold">Birthday Bash</text>
          <text x="200" y="195" textAnchor="middle" fill="#fff" fontSize="9" opacity="0.6">Celebrating Alex's 25th</text>
          <text x="200" y="215" textAnchor="middle" fill="#ff8a8a" fontSize="9">Saturday, June 20 · 7 PM</text>
          <text x="200" y="235" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.4">123 Party Lane · RSVP by June 10</text>
          <polygon points="100,260 110,245 120,260" fill="#ffa502" opacity="0.2"/>
          <polygon points="280,260 290,245 300,260" fill="#ff6b6b" opacity="0.2"/>
        </svg>
      );
    case "business":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a0e1a"/>
          <rect x="30" y="30" width="340" height="240" rx="8" fill="#0f1525" stroke="#2a3a6a" strokeWidth="1"/>
          <rect x="50" y="50" width="100" height="20" rx="4" fill="#1a2540"/>
          <rect x="50" y="80" width="80" height="10" rx="3" fill="#1a2540"/>
          <rect x="50" y="100" width="100" height="10" rx="3" fill="#1a2540"/>
          <circle cx="300" cy="75" r="25" fill="#1a2a55"/>
          <text x="300" y="80" textAnchor="middle" fill="#4a7aff" fontSize="9" fontWeight="bold">LOGO</text>
          <text x="200" y="150" textAnchor="middle" fill="#4a7aff" fontSize="20" fontWeight="bold">Business Name</text>
          <text x="200" y="175" textAnchor="middle" fill="#6a8aff" fontSize="9">Professional Services</text>
          <line x1="120" y1="190" x2="280" y2="190" stroke="#2a3a6a" strokeWidth="0.5"/>
          <text x="200" y="210" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.5">contact@business.com</text>
          <text x="200" y="225" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.5">+1 (555) 123-4567</text>
          <text x="200" y="245" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.5">123 Business Ave, Suite 100</text>
        </svg>
      );
    case "social":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a0a1a"/>
          <rect x="0" y="0" width="400" height="80" fill="#1a1a3a"/>
          <rect x="15" y="15" width="50" height="50" rx="8" fill="#2a2a5a"/>
          <text x="40" y="45" textAnchor="middle" fill="#7a7aff" fontSize="8">Logo</text>
          <text x="85" y="38" fill="#fff" fontSize="13" fontWeight="bold">Brand Name</text>
          <text x="85" y="55" fill="#fff" fontSize="8" opacity="0.5">@brand_handle</text>
          <rect x="300" y="20" width="80" height="30" rx="8" fill="#4a4aff"/>
          <text x="340" y="40" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Follow</text>
          <rect x="20" y="95" width="170" height="130" rx="8" fill="#15152a"/>
          <rect x="210" y="95" width="170" height="60" rx="8" fill="#15152a"/>
          <rect x="210" y="165" width="170" height="60" rx="8" fill="#15152a"/>
          <circle cx="50" cy="125" r="15" fill="#2a2a5a"/>
          <rect x="75" y="115" width="80" height="8" rx="3" fill="#2a2a5a"/>
          <rect x="75" y="128" width="60" height="6" rx="3" fill="#2a2a5a"/>
          <rect x="75" y="140" width="90" height="6" rx="3" fill="#2a2a5a"/>
          <text x="295" y="125" textAnchor="middle" fill="#7a7aff" fontSize="14" fontWeight="bold">50% OFF</text>
          <text x="295" y="142" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.6">Limited Time</text>
          <text x="295" y="195" textAnchor="middle" fill="#7a7aff" fontSize="11" fontWeight="bold">New Collection</text>
          <text x="295" y="212" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.5">Shop Now →</text>
        </svg>
      );
    case "education":
    case "certificate":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a1a0f"/>
          <rect x="25" y="25" width="350" height="250" rx="10" fill="none" stroke="#2a6a3a" strokeWidth="2"/>
          <rect x="35" y="35" width="330" height="230" rx="8" fill="none" stroke="#2a6a3a" strokeWidth="0.5" opacity="0.5"/>
          <text x="200" y="95" textAnchor="middle" fill="#4aff6a" fontSize="10" letterSpacing="2">CERTIFICATE</text>
          <text x="200" y="125" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">OF ACHIEVEMENT</text>
          <text x="200" y="150" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.6">This is proudly presented to</text>
          <text x="200" y="175" textAnchor="middle" fill="#4aff6a" fontSize="14" fontWeight="bold">John Doe</text>
          <text x="200" y="195" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.6">For successfully completing the course</text>
          <text x="200" y="215" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Advanced Web Development</text>
          <line x1="100" y1="240" x2="300" y2="240" stroke="#2a6a3a" strokeWidth="0.5"/>
          <text x="200" y="255" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.4">Issued: June 2026</text>
        </svg>
      );
    case "music":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0f0a08"/>
          <rect width="400" height="300" fill="#ff4500" opacity="0.15"/>
          <rect x="0" y="0" width="400" height="10" fill="#ff0080" opacity="0.3"/>
          <text x="200" y="80" textAnchor="middle" fill="#ff6b3a" fontSize="12" letterSpacing="3" fontWeight="bold">MUSIC</text>
          <text x="200" y="90" textAnchor="middle" fill="#ff6b3a" fontSize="12" letterSpacing="3" fontWeight="bold">FESTIVAL</text>
          <line x1="140" y1="105" x2="260" y2="105" stroke="#ff6b3a" strokeWidth="1"/>
          <text x="200" y="135" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold">ELECTRIC</text>
          <text x="200" y="160" textAnchor="middle" fill="#ff0080" fontSize="20" fontWeight="bold">NIGHTS</text>
          <text x="200" y="185" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.5">Aug 15-17 · Central Park</text>
          <rect x="145" y="200" width="110" height="30" rx="15" fill="none" stroke="#ff4500" strokeWidth="1"/>
          <text x="200" y="220" textAnchor="middle" fill="#ff4500" fontSize="9" fontWeight="bold">GET TICKETS</text>
          <circle cx="70" cy="260" r="4" fill="#ff4500" opacity="0.5"/>
          <circle cx="100" cy="250" r="6" fill="#ff0080" opacity="0.3"/>
          <circle cx="130" cy="265" r="3" fill="#ff6b3a" opacity="0.5"/>
          <circle cx="300" cy="255" r="5" fill="#ff0080" opacity="0.4"/>
          <circle cx="330" cy="265" r="4" fill="#ff4500" opacity="0.5"/>
          <circle cx="350" cy="250" r="3" fill="#ff6b3a" opacity="0.5"/>
        </svg>
      );
    case "travel":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a1218"/>
          <rect x="0" y="0" width="400" height="180" fill="#0f1f2a"/>
          <circle cx="120" cy="90" r="25" fill="#ffd700" opacity="0.2"/>
          <circle cx="120" cy="90" r="15" fill="#ffd700" opacity="0.3"/>
          <circle cx="120" cy="90" r="5" fill="#ffd700" opacity="0.5"/>
          <text x="200" y="75" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="bold">PARIS</text>
          <text x="200" y="95" textAnchor="middle" fill="#ffd700" fontSize="10" letterSpacing="1">EXPLORE THE CITY OF LIGHT</text>
          <text x="200" y="115" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.6">5 Days · 3 Nights · Luxury Package</text>
          <line x1="80" y1="140" x2="320" y2="140" stroke="#1a3a4a" strokeWidth="1"/>
          <text x="80" y="160" textAnchor="middle" fill="#ffd700" fontSize="11" fontWeight="bold">$1,299</text>
          <text x="80" y="175" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.4">per person</text>
          <rect x="280" y="145" width="80" height="28" rx="6" fill="#ffd700" opacity="0.8"/>
          <text x="320" y="163" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">Book Now</text>
          <rect x="40" y="210" width="70" height="60" rx="6" fill="#12222a"/>
          <rect x="125" y="210" width="70" height="60" rx="6" fill="#12222a"/>
          <rect x="210" y="210" width="70" height="60" rx="6" fill="#12222a"/>
          <rect x="295" y="210" width="70" height="60" rx="6" fill="#12222a"/>
          <text x="75" y="240" textAnchor="middle" fill="#fff" fontSize="8">Eiffel</text>
          <text x="160" y="240" textAnchor="middle" fill="#fff" fontSize="8">Louvre</text>
          <text x="245" y="240" textAnchor="middle" fill="#fff" fontSize="8">Sacre</text>
          <text x="330" y="240" textAnchor="middle" fill="#fff" fontSize="8">Shopping</text>
        </svg>
      );
    case "fashion":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a0a12"/>
          <rect x="0" y="0" width="400" height="300" fill="#1a0a1a" opacity="0.5"/>
          <text x="200" y="70" textAnchor="middle" fill="#fff" fontSize="11" letterSpacing="4">SUMMER</text>
          <text x="200" y="85" textAnchor="middle" fill="#fff" fontSize="11" letterSpacing="4">COLLECTION</text>
          <line x1="140" y1="100" x2="260" y2="100" stroke="#d4a0f0" strokeWidth="0.5" opacity="0.5"/>
          <rect x="60" y="115" width="40" height="115" rx="8" fill="#2a1a3a" stroke="#3a2a4a" strokeWidth="1"/>
          <rect x="110" y="100" width="40" height="130" rx="8" fill="#1a1a2a" stroke="#2a2a4a" strokeWidth="1"/>
          <rect x="160" y="110" width="40" height="120" rx="8" fill="#3a1a2a" stroke="#4a2a3a" strokeWidth="1"/>
          <rect x="210" y="105" width="40" height="125" rx="8" fill="#1a2a1a" stroke="#2a3a2a" strokeWidth="1"/>
          <rect x="260" y="115" width="40" height="115" rx="8" fill="#2a1a1a" stroke="#3a2a2a" strokeWidth="1"/>
          <text x="200" y="260" textAnchor="middle" fill="#d4a0f0" fontSize="9">Explore the Lookbook</text>
          <line x1="160" y1="265" x2="240" y2="265" stroke="#d4a0f0" strokeWidth="0.5" opacity="0.5"/>
        </svg>
      );
    case "tech":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a0e1a"/>
          <rect x="20" y="20" width="130" height="90" rx="6" fill="#111a2a" stroke="#2a4a7a" strokeWidth="1"/>
          <rect x="30" y="30" width="110" height="20" rx="3" fill="#1a2a4a"/>
          <line x1="35" y1="65" x2="135" y2="65" stroke="#2a4a7a" strokeWidth="0.5"/>
          <rect x="30" y="75" width="50" height="6" rx="2" fill="#2a4a7a"/>
          <rect x="30" y="85" width="70" height="6" rx="2" fill="#1a2a4a"/>
          <rect x="250" y="20" width="130" height="90" rx="6" fill="#111a2a" stroke="#2a4a7a" strokeWidth="1"/>
          <rect x="260" y="30" width="110" height="20" rx="3" fill="#1a2a4a"/>
          <rect x="260" y="75" width="50" height="6" rx="2" fill="#2a4a7a"/>
          <rect x="260" y="85" width="70" height="6" rx="2" fill="#1a2a4a"/>
          <text x="200" y="150" textAnchor="middle" fill="#4a7aff" fontSize="9" letterSpacing="2">TECH CONFERENCE</text>
          <text x="200" y="175" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">DEVFEST</text>
          <text x="200" y="195" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">2026</text>
          <text x="200" y="215" textAnchor="middle" fill="#4a7aff" fontSize="8">September 10-12 · SF Convention Center</text>
          <rect x="145" y="230" width="110" height="30" rx="15" fill="#4a7aff"/>
          <text x="200" y="250" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold">Register Now</text>
        </svg>
      );
    case "festival":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a0e08"/>
          <rect x="0" y="0" width="400" height="180" fill="#1a0e08"/>
          <text x="200" y="75" textAnchor="middle" fill="#ff4a3a" fontSize="15" fontWeight="bold">MERRY CHRISTMAS</text>
          <text x="200" y="105" textAnchor="middle" fill="#fff" fontSize="10" letterSpacing="2">&amp; HAPPY NEW YEAR</text>
          <polygon points="100,140 120,95 140,140" fill="#2a6a3a" opacity="0.7"/>
          <polygon points="130,145 150,100 170,145" fill="#1a5a2a" opacity="0.7"/>
          <polygon points="160,140 180,95 200,140" fill="#2a6a3a" opacity="0.7"/>
          <polygon points="230,140 250,95 270,140" fill="#2a6a3a" opacity="0.7"/>
          <polygon points="260,145 280,100 300,145" fill="#1a5a2a" opacity="0.7"/>
          <polygon points="195,140 215,95 235,140" fill="#1a5a2a" opacity="0.7"/>
          <rect x="50" y="205" width="120" height="60" rx="6" fill="#1a1a0a"/>
          <rect x="230" y="205" width="120" height="60" rx="6" fill="#1a0a0a"/>
          <text x="110" y="235" textAnchor="middle" fill="#ffd700" fontSize="9" fontWeight="bold">DEC 25</text>
          <text x="110" y="250" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.6">Christmas Day</text>
          <text x="290" y="235" textAnchor="middle" fill="#ffd700" fontSize="9" fontWeight="bold">JAN 1</text>
          <text x="290" y="250" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.6">New Year's Day</text>
        </svg>
      );
    case "food":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a0806"/>
          <rect x="0" y="0" width="400" height="100" fill="#1a1008"/>
          <text x="200" y="45" textAnchor="middle" fill="#d4a040" fontSize="9" letterSpacing="2">FINE DINING</text>
          <text x="200" y="70" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">La Maison</text>
          <line x1="140" y1="80" x2="260" y2="80" stroke="#d4a040" strokeWidth="0.5" opacity="0.5"/>
          <rect x="20" y="120" width="110" height="60" rx="6" fill="#1a1208"/>
          <rect x="145" y="120" width="110" height="60" rx="6" fill="#1a0e08"/>
          <rect x="270" y="120" width="110" height="60" rx="6" fill="#111a0a"/>
          <text x="75" y="150" textAnchor="middle" fill="#d4a040" fontSize="8">Steak</text>
          <text x="200" y="150" textAnchor="middle" fill="#d4a040" fontSize="8">Pasta</text>
          <text x="325" y="150" textAnchor="middle" fill="#d4a040" fontSize="8">Salad</text>
          <text x="75" y="165" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.5">$28</text>
          <text x="200" y="165" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.5">$22</text>
          <text x="325" y="165" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.5">$16</text>
          <text x="200" y="215" textAnchor="middle" fill="#fff" fontSize="10" opacity="0.6">Rate: 4.8/5</text>
          <text x="200" y="240" textAnchor="middle" fill="#d4a040" fontSize="9" fontWeight="bold">Reserve a Table →</text>
          <text x="200" y="260" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.4">Open Daily 5PM - 11PM</text>
        </svg>
      );
    case "fitness":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#080c08"/>
          <rect x="0" y="0" width="400" height="80" fill="#0f1a0f"/>
          <text x="200" y="42" textAnchor="middle" fill="#4aff6a" fontSize="20" fontWeight="bold">30-DAY</text>
          <text x="200" y="65" textAnchor="middle" fill="#4aff6a" fontSize="10" letterSpacing="3">FITNESS CHALLENGE</text>
          <rect x="40" y="100" width="70" height="70" rx="8" fill="#111a11"/>
          <rect x="125" y="100" width="70" height="70" rx="8" fill="#111a11"/>
          <rect x="210" y="100" width="70" height="70" rx="8" fill="#111a11"/>
          <rect x="295" y="100" width="70" height="70" rx="8" fill="#111a11"/>
          <text x="75" y="135" textAnchor="middle" fill="#4aff6a" fontSize="9">Weights</text>
          <text x="160" y="135" textAnchor="middle" fill="#4aff6a" fontSize="9">Cardio</text>
          <text x="245" y="135" textAnchor="middle" fill="#4aff6a" fontSize="9">Yoga</text>
          <text x="330" y="135" textAnchor="middle" fill="#4aff6a" fontSize="9">Diet</text>
          <rect x="100" y="195" width="200" height="12" rx="6" fill="#1a2a1a"/>
          <rect x="100" y="195" width="120" height="12" rx="6" fill="#4aff6a" opacity="0.6"/>
          <text x="200" y="214" textAnchor="middle" fill="#fff" fontSize="7" opacity="0.5">Day 12 of 30</text>
          <rect x="140" y="230" width="120" height="30" rx="15" fill="none" stroke="#4aff6a" strokeWidth="1"/>
          <text x="200" y="249" textAnchor="middle" fill="#4aff6a" fontSize="9" fontWeight="bold">Join Free</text>
        </svg>
      );
    case "sports":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a0a08"/>
          <rect x="0" y="0" width="400" height="120" fill="#1a1a08"/>
          <text x="200" y="55" textAnchor="middle" fill="#ffd700" fontSize="10" letterSpacing="3">ANNUAL</text>
          <text x="200" y="80" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="bold">SPORTS DAY</text>
          <text x="200" y="105" textAnchor="middle" fill="#ffd700" fontSize="9">June 25-28 · City Arena</text>
          <rect x="30" y="145" width="75" height="50" rx="6" fill="#1a1a0a"/>
          <rect x="120" y="145" width="75" height="50" rx="6" fill="#111a0a"/>
          <rect x="210" y="145" width="75" height="50" rx="6" fill="#0a1a1a"/>
          <rect x="300" y="145" width="75" height="50" rx="6" fill="#1a0a0a"/>
          <text x="67" y="172" textAnchor="middle" fill="#ffd700" fontSize="9">Soccer</text>
          <text x="157" y="172" textAnchor="middle" fill="#ffd700" fontSize="9">Basketball</text>
          <text x="247" y="172" textAnchor="middle" fill="#ffd700" fontSize="9">Tennis</text>
          <text x="337" y="172" textAnchor="middle" fill="#ffd700" fontSize="9">Swimming</text>
          <rect x="140" y="220" width="120" height="30" rx="15" fill="#ffd700"/>
          <text x="200" y="240" textAnchor="middle" fill="#000" fontSize="9" fontWeight="bold">Register Now</text>
        </svg>
      );
    case "baby":
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a0a12"/>
          <rect x="0" y="0" width="400" height="160" fill="#1a0a1a"/>
          <circle cx="120" cy="80" r="30" fill="#d4a0f0" opacity="0.15"/>
          <circle cx="160" cy="70" r="22" fill="#a0d4f0" opacity="0.15"/>
          <circle cx="80" cy="90" r="20" fill="#f0a0d4" opacity="0.15"/>
          <circle cx="270" cy="75" r="25" fill="#f0d4a0" opacity="0.15"/>
          <circle cx="310" cy="85" r="20" fill="#a0f0d4" opacity="0.15"/>
          <circle cx="340" cy="70" r="18" fill="#f0a0a0" opacity="0.15"/>
          <text x="200" y="130" textAnchor="middle" fill="#f0c0ff" fontSize="22" fontFamily="serif" fontWeight="bold">Baby Shower</text>
          <text x="200" y="180" textAnchor="middle" fill="#fff" fontSize="9" opacity="0.6">Please join us for a baby shower</text>
          <text x="200" y="200" textAnchor="middle" fill="#d4a0f0" fontSize="12" fontWeight="bold">Hosted by Emily &amp; Jake</text>
          <text x="200" y="225" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.5">Sunday, July 10 · 2 PM</text>
          <text x="200" y="245" textAnchor="middle" fill="#fff" fontSize="8" opacity="0.5">123 Garden Street · RSVP by July 1</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 400 300" className={base}>
          <rect width="400" height="300" fill="#0a0a12"/>
          <text x="200" y="150" textAnchor="middle" fill="#6a6aff" fontSize="14" fontWeight="bold">Design Template</text>
          <text x="200" y="175" textAnchor="middle" fill="#fff" fontSize="9" opacity="0.5">Customize with DesignForge AI</text>
        </svg>
      );
  }
}
