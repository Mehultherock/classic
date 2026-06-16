import { randomUUID, createHash } from "crypto";

const TEMPLATES = [
  // === WEDDING ===
  { title: "Classic Romance Wedding Invitation", category: "Wedding", subcategory: "Invitation", type: "invitation", width: 1200, height: 1600, premium: false, popular: true, style: "Elegant" },
  { title: "Modern Floral Wedding Invite", category: "Wedding", subcategory: "Invitation", type: "invitation", width: 1200, height: 1600, premium: true, popular: false, style: "Modern" },
  { title: "Vintage Lace Wedding Card", category: "Wedding", subcategory: "Invitation", type: "invitation", width: 1200, height: 1600, premium: false, popular: false, style: "Vintage" },
  { title: "Wedding Thank You Card", category: "Wedding", subcategory: "Thank You", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Classic" },
  { title: "Save the Date Wedding Poster", category: "Wedding", subcategory: "Save the Date", type: "poster", width: 1600, height: 1200, premium: true, popular: true, style: "Luxury" },
  { title: "Wedding Program Brochure", category: "Wedding", subcategory: "Program", type: "flyer", width: 1000, height: 1400, premium: false, popular: false, style: "Elegant" },
  { title: "Boho Wedding Invitation Suite", category: "Wedding", subcategory: "Invitation", type: "invitation", width: 1200, height: 1600, premium: true, popular: false, style: "Bohemian" },
  { title: "Gold Foil Wedding Invite", category: "Wedding", subcategory: "Invitation", type: "invitation", width: 1200, height: 1600, premium: true, popular: true, style: "Luxury" },
  { title: "Rustic Wedding Menu Card", category: "Wedding", subcategory: "Menu", type: "card", width: 800, height: 1100, premium: false, popular: false, style: "Rustic" },
  { title: "Wedding Seating Chart Template", category: "Wedding", subcategory: "Seating", type: "poster", width: 2000, height: 1400, premium: false, popular: false, style: "Classic" },

  // === BIRTHDAY ===
  { title: "Kids Birthday Party Invitation", category: "Birthday", subcategory: "Kids", type: "invitation", width: 1200, height: 1600, premium: false, popular: true, style: "Playful" },
  { title: "70s Disco Birthday Poster", category: "Birthday", subcategory: "Adult", type: "poster", width: 1600, height: 1200, premium: false, popular: false, style: "Bold" },
  { title: "Elegant 50th Birthday Invite", category: "Birthday", subcategory: "Adult", type: "invitation", width: 1200, height: 1600, premium: true, popular: false, style: "Elegant" },
  { title: "Balloon Animal Birthday Card", category: "Birthday", subcategory: "Kids", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Playful" },
  { title: "Minimal 21st Birthday Invitation", category: "Birthday", subcategory: "Adult", type: "invitation", width: 1200, height: 1600, premium: false, popular: true, style: "Minimal" },
  { title: "Birthday Social Media Banner", category: "Birthday", subcategory: "Social Media", type: "social", width: 1500, height: 500, premium: false, popular: false, style: "Gradient" },
  { title: "Unicorn Birthday Party Invite", category: "Birthday", subcategory: "Kids", type: "invitation", width: 1200, height: 1600, premium: false, popular: false, style: "Playful" },

  // === BUSINESS ===
  { title: "Corporate Business Card", category: "Business", subcategory: "Branding", type: "card", width: 800, height: 500, premium: false, popular: true, style: "Corporate" },
  { title: "Modern Company Letterhead", category: "Business", subcategory: "Branding", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Modern" },
  { title: "Business Proposal Cover Page", category: "Business", subcategory: "Proposal", type: "flyer", width: 1600, height: 1200, premium: true, popular: false, style: "Corporate" },
  { title: "Professional Invoice Template", category: "Business", subcategory: "Finance", type: "flyer", width: 1600, height: 1200, premium: false, popular: true, style: "Minimal" },
  { title: "Company Profile Brochure", category: "Business", subcategory: "Branding", type: "flyer", width: 1000, height: 1400, premium: true, popular: false, style: "Corporate" },
  { title: "Business Thank You Card", category: "Business", subcategory: "Branding", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Minimal" },
  { title: "Meeting Agenda Template", category: "Business", subcategory: "Meeting", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Corporate" },

  // === EVENTS ===
  { title: "Music Festival Poster", category: "Events", subcategory: "Festival", type: "poster", width: 1600, height: 2000, premium: false, popular: true, style: "Neon" },
  { title: "Charity Gala Invitation", category: "Events", subcategory: "Gala", type: "invitation", width: 1200, height: 1600, premium: true, popular: false, style: "Elegant" },
  { title: "Networking Event Flyer", category: "Events", subcategory: "Networking", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Modern" },
  { title: "Conference Speaker Banner", category: "Events", subcategory: "Conference", type: "banner", width: 2000, height: 1000, premium: false, popular: false, style: "Corporate" },
  { title: "Product Launch Invitation", category: "Events", subcategory: "Launch", type: "invitation", width: 1200, height: 1600, premium: true, popular: false, style: "Bold" },

  // === EDUCATION ===
  { title: "Graduation Invitation Card", category: "Education", subcategory: "Graduation", type: "invitation", width: 1200, height: 1600, premium: false, popular: true, style: "Classic" },
  { title: "School Event Flyer", category: "Education", subcategory: "School", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Playful" },
  { title: "Certificate of Achievement", category: "Education", subcategory: "Certificate", type: "certificate", width: 2000, height: 1400, premium: false, popular: true, style: "Classic" },
  { title: "Class Schedule Template", category: "Education", subcategory: "Schedule", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Minimal" },
  { title: "Educational Workshop Poster", category: "Education", subcategory: "Workshop", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Modern" },
  { title: "Preschool Graduation Certificate", category: "Education", subcategory: "Certificate", type: "certificate", width: 2000, height: 1400, premium: false, popular: false, style: "Playful" },
  { title: "Online Course Promo Banner", category: "Education", subcategory: "Online", type: "banner", width: 2000, height: 1000, premium: true, popular: false, style: "Modern" },

  // === MUSIC ===
  { title: "Concert Tour Poster", category: "Music", subcategory: "Concert", type: "poster", width: 1600, height: 2000, premium: false, popular: true, style: "Neon" },
  { title: "Album Cover Art Template", category: "Music", subcategory: "Album", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Art Deco" },
  { title: "Music Festival Lineup Poster", category: "Music", subcategory: "Festival", type: "poster", width: 1600, height: 2000, premium: true, popular: true, style: "Bold" },
  { title: "Open Mic Night Flyer", category: "Music", subcategory: "Open Mic", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Dark" },
  { title: "DJ Mix Album Cover", category: "Music", subcategory: "Album", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Neon" },
  { title: "Music Lesson Promo Poster", category: "Music", subcategory: "Lessons", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Modern" },

  // === TRAVEL ===
  { title: "Travel Agency Brochure", category: "Travel", subcategory: "Agency", type: "flyer", width: 1000, height: 1400, premium: false, popular: false, style: "Modern" },
  { title: "Vacation Rental Flyer", category: "Travel", subcategory: "Rental", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Minimal" },
  { title: "Flight Deal Promo Poster", category: "Travel", subcategory: "Deals", type: "poster", width: 1600, height: 2000, premium: false, popular: true, style: "Gradient" },
  { title: "Travel Instagram Story", category: "Travel", subcategory: "Social", type: "social", width: 1080, height: 1920, premium: false, popular: false, style: "Watercolor" },
  { title: "Passport Invitation Template", category: "Travel", subcategory: "Invitation", type: "invitation", width: 1200, height: 1600, premium: true, popular: false, style: "Vintage" },

  // === FASHION ===
  { title: "Fashion Sale Poster", category: "Fashion", subcategory: "Sale", type: "poster", width: 1600, height: 2000, premium: false, popular: true, style: "Bold" },
  { title: "Lookbook Page Template", category: "Fashion", subcategory: "Lookbook", type: "flyer", width: 1600, height: 1200, premium: true, popular: false, style: "Minimal" },
  { title: "Fashion Brand Business Card", category: "Fashion", subcategory: "Branding", type: "card", width: 800, height: 500, premium: false, popular: false, style: "Elegant" },
  { title: "Clothing Line Tag Template", category: "Fashion", subcategory: "Tags", type: "card", width: 600, height: 900, premium: false, popular: false, style: "Minimal" },
  { title: "Fashion Week Invitation", category: "Fashion", subcategory: "Event", type: "invitation", width: 1200, height: 1600, premium: true, popular: false, style: "Luxury" },

  // === TECHNOLOGY ===
  { title: "Tech Conference Banner", category: "Technology", subcategory: "Conference", type: "banner", width: 2000, height: 1000, premium: false, popular: true, style: "Modern" },
  { title: "App Launch Poster", category: "Technology", subcategory: "Launch", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Neon" },
  { title: "Software Webinar Flyer", category: "Technology", subcategory: "Webinar", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Gradient" },
  { title: "Hackathon Event Poster", category: "Technology", subcategory: "Hackathon", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Bold" },
  { title: "SaaS Product Card", category: "Technology", subcategory: "Product", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Modern" },
  { title: "Startup Pitch Deck Cover", category: "Technology", subcategory: "Pitch", type: "flyer", width: 1600, height: 1200, premium: true, popular: false, style: "Corporate" },

  // === REAL ESTATE ===
  { title: "For Sale Property Flyer", category: "Real Estate", subcategory: "For Sale", type: "flyer", width: 1600, height: 1200, premium: false, popular: true, style: "Modern" },
  { title: "Open House Invitation", category: "Real Estate", subcategory: "Open House", type: "invitation", width: 1200, height: 1600, premium: false, popular: false, style: "Elegant" },
  { title: "Real Estate Business Card", category: "Real Estate", subcategory: "Branding", type: "card", width: 800, height: 500, premium: false, popular: false, style: "Corporate" },
  { title: "Property Listing Social Post", category: "Real Estate", subcategory: "Social", type: "social", width: 1080, height: 1080, premium: false, popular: false, style: "Minimal" },
  { title: "Luxury Property Brochure", category: "Real Estate", subcategory: "Luxury", type: "flyer", width: 1000, height: 1400, premium: true, popular: false, style: "Luxury" },

  // === FESTIVALS ===
  { title: "Diwali Celebration Poster", category: "Festivals", subcategory: "Diwali", type: "poster", width: 1600, height: 2000, premium: false, popular: true, style: "Bold" },
  { title: "Christmas Party Invitation", category: "Festivals", subcategory: "Christmas", type: "invitation", width: 1200, height: 1600, premium: false, popular: true, style: "Classic" },
  { title: "Eid Mubarak Greeting Card", category: "Festivals", subcategory: "Eid", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Elegant" },
  { title: "New Year Party Flyer", category: "Festivals", subcategory: "New Year", type: "flyer", width: 1600, height: 1200, premium: false, popular: true, style: "Neon" },
  { title: "Halloween Event Poster", category: "Festivals", subcategory: "Halloween", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Dark" },
  { title: "Holi Color Festival Banner", category: "Festivals", subcategory: "Holi", type: "banner", width: 2000, height: 1000, premium: false, popular: false, style: "Playful" },
  { title: "Thanksgiving Dinner Menu", category: "Festivals", subcategory: "Thanksgiving", type: "card", width: 800, height: 1100, premium: false, popular: false, style: "Rustic" },
  { title: "Hanukkah Greeting Card", category: "Festivals", subcategory: "Hanukkah", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Classic" },

  // === FOOD & DRINK ===
  { title: "Restaurant Menu Template", category: "Food & Drink", subcategory: "Menu", type: "flyer", width: 1000, height: 1400, premium: false, popular: true, style: "Modern" },
  { title: "Cafe Grand Opening Banner", category: "Food & Drink", subcategory: "Opening", type: "banner", width: 2000, height: 1000, premium: false, popular: false, style: "Minimal" },
  { title: "Cocktail Menu Card", category: "Food & Drink", subcategory: "Drinks", type: "card", width: 800, height: 1100, premium: false, popular: false, style: "Dark" },
  { title: "Food Delivery Promo Poster", category: "Food & Drink", subcategory: "Promo", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Bold" },
  { title: "Recipe Card Template", category: "Food & Drink", subcategory: "Recipe", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Rustic" },
  { title: "Bakery Price List Flyer", category: "Food & Drink", subcategory: "Bakery", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Playful" },

  // === FITNESS ===
  { title: "Gym Membership Promo Poster", category: "Fitness", subcategory: "Gym", type: "poster", width: 1600, height: 2000, premium: false, popular: true, style: "Bold" },
  { title: "Yoga Retreat Flyer", category: "Fitness", subcategory: "Yoga", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Minimal" },
  { title: "Workout Schedule Template", category: "Fitness", subcategory: "Schedule", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Modern" },
  { title: "Personal Trainer Business Card", category: "Fitness", subcategory: "Training", type: "card", width: 800, height: 500, premium: false, popular: false, style: "Gradient" },
  { title: "Fitness Challenge Social Post", category: "Fitness", subcategory: "Social", type: "social", width: 1080, height: 1080, premium: false, popular: false, style: "Bold" },

  // === BEAUTY ===
  { title: "Salon Service Menu", category: "Beauty", subcategory: "Salon", type: "flyer", width: 1600, height: 1200, premium: false, popular: true, style: "Elegant" },
  { title: "Makeup Brand Promo Poster", category: "Beauty", subcategory: "Makeup", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Luxury" },
  { title: "Nail Art Price List", category: "Beauty", subcategory: "Nails", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Playful" },
  { title: "Spa Gift Card Template", category: "Beauty", subcategory: "Spa", type: "card", width: 800, height: 500, premium: false, popular: false, style: "Elegant" },
  { title: "Beauty Product Label", category: "Beauty", subcategory: "Product", type: "card", width: 600, height: 900, premium: true, popular: false, style: "Minimal" },

  // === PETS ===
  { title: "Pet Adoption Flyer", category: "Pets", subcategory: "Adoption", type: "flyer", width: 1600, height: 1200, premium: false, popular: true, style: "Playful" },
  { title: "Dog Grooming Business Card", category: "Pets", subcategory: "Grooming", type: "card", width: 800, height: 500, premium: false, popular: false, style: "Modern" },
  { title: "Pet Sitting Service Flyer", category: "Pets", subcategory: "Sitting", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Playful" },
  { title: "Pet Birthday Party Invitation", category: "Pets", subcategory: "Party", type: "invitation", width: 1200, height: 1600, premium: false, popular: false, style: "Playful" },
  { title: "Veterinary Clinic Poster", category: "Pets", subcategory: "Vet", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Minimal" },

  // === SPORTS ===
  { title: "Sports Tournament Bracket", category: "Sports", subcategory: "Tournament", type: "poster", width: 2000, height: 1400, premium: false, popular: true, style: "Bold" },
  { title: "Team Roster Template", category: "Sports", subcategory: "Team", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Modern" },
  { title: "Sports Event Ticket Template", category: "Sports", subcategory: "Tickets", type: "card", width: 1800, height: 800, premium: false, popular: false, style: "Bold" },
  { title: "Tryout Announcement Poster", category: "Sports", subcategory: "Tryouts", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Corporate" },
  { title: "Championship Banner", category: "Sports", subcategory: "Championship", type: "banner", width: 2000, height: 1000, premium: true, popular: false, style: "Bold" },

  // === HEALTH ===
  { title: "Wellness Workshop Flyer", category: "Health & Wellness", subcategory: "Workshop", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Minimal" },
  { title: "Medical Conference Poster", category: "Health & Wellness", subcategory: "Conference", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Corporate" },
  { title: "Health Awareness Social Post", category: "Health & Wellness", subcategory: "Awareness", type: "social", width: 1080, height: 1080, premium: false, popular: false, style: "Modern" },
  { title: "Pharmacy Promo Flyer", category: "Health & Wellness", subcategory: "Pharmacy", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Gradient" },
  { title: "Mental Health Poster Template", category: "Health & Wellness", subcategory: "Mental Health", type: "poster", width: 1600, height: 2000, premium: false, popular: true, style: "Minimal" },

  // === NONPROFIT ===
  { title: "Fundraising Campaign Poster", category: "Nonprofit", subcategory: "Fundraising", type: "poster", width: 1600, height: 2000, premium: false, popular: true, style: "Modern" },
  { title: "Volunteer Recruitment Flyer", category: "Nonprofit", subcategory: "Volunteer", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Playful" },
  { title: "Charity Event Invitation", category: "Nonprofit", subcategory: "Event", type: "invitation", width: 1200, height: 1600, premium: false, popular: false, style: "Elegant" },
  { title: "Donation Thank You Card", category: "Nonprofit", subcategory: "Donation", type: "card", width: 1000, height: 1000, premium: false, popular: false, style: "Classic" },

  // === PHOTOGRAPHY ===
  { title: "Photography Portfolio Flyer", category: "Photography", subcategory: "Portfolio", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Minimal" },
  { title: "Photo Session Price List", category: "Photography", subcategory: "Pricing", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Elegant" },
  { title: "Photography Business Card", category: "Photography", subcategory: "Branding", type: "card", width: 800, height: 500, premium: false, popular: true, style: "Modern" },
  { title: "Photo Gallery Invitation", category: "Photography", subcategory: "Exhibition", type: "invitation", width: 1200, height: 1600, premium: false, popular: false, style: "Dark" },

  // === AUTOMOTIVE ===
  { title: "Car Wash Promo Flyer", category: "Automotive", subcategory: "Car Wash", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Bold" },
  { title: "Auto Repair Service Poster", category: "Automotive", subcategory: "Repair", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Corporate" },
  { title: "Car Sale Event Banner", category: "Automotive", subcategory: "Sales", type: "banner", width: 2000, height: 1000, premium: false, popular: true, style: "Bold" },
  { title: "Detailing Service Price Card", category: "Automotive", subcategory: "Detailing", type: "card", width: 800, height: 500, premium: false, popular: false, style: "Modern" },

  // === NATURE ===
  { title: "Nature Conservation Poster", category: "Nature", subcategory: "Conservation", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Watercolor" },
  { title: "Garden Club Flyer", category: "Nature", subcategory: "Gardening", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Rustic" },
  { title: "Outdoor Adventure Banner", category: "Nature", subcategory: "Adventure", type: "banner", width: 2000, height: 1000, premium: false, popular: false, style: "Bold" },
  { title: "Botanical Event Invitation", category: "Nature", subcategory: "Event", type: "invitation", width: 1200, height: 1600, premium: true, popular: false, style: "Watercolor" },

  // === ART & CREATIVE ===
  { title: "Art Exhibition Poster", category: "Art & Creative", subcategory: "Exhibition", type: "poster", width: 1600, height: 2000, premium: false, popular: true, style: "Art Deco" },
  { title: "Creative Workshop Flyer", category: "Art & Creative", subcategory: "Workshop", type: "flyer", width: 1600, height: 1200, premium: false, popular: false, style: "Hand-drawn" },
  { title: "Artist Business Card", category: "Art & Creative", subcategory: "Branding", type: "card", width: 800, height: 500, premium: false, popular: false, style: "Watercolor" },
  { title: "Studio Open House Invite", category: "Art & Creative", subcategory: "Open Studio", type: "invitation", width: 1200, height: 1600, premium: false, popular: false, style: "Art Deco" },
  { title: "Art Class Promo Poster", category: "Art & Creative", subcategory: "Classes", type: "poster", width: 1600, height: 2000, premium: false, popular: false, style: "Hand-drawn" },
];

const STYLES_LIST = ["Modern", "Classic", "Minimal", "Vintage", "Luxury", "Playful", "Elegant", "Bold", "Rustic", "Bohemian", "Corporate", "Art Deco", "Neon", "Watercolor", "Geometric", "Hand-drawn", "Gradient", "Typography", "Pastel", "Dark"];

const TAGS_BY_CATEGORY = {
  "Wedding": ["wedding", "bridal", "marriage", "love", "romantic", "ceremony", "reception"],
  "Birthday": ["birthday", "party", "celebration", "cake", "balloons"],
  "Business": ["business", "corporate", "professional", "branding", "office"],
  "Events": ["event", "gathering", "celebration", "conference", "festival"],
  "Education": ["education", "school", "learning", "graduation", "academic"],
  "Music": ["music", "concert", "band", "performance", "live"],
  "Travel": ["travel", "vacation", "holiday", "destination", "adventure"],
  "Fashion": ["fashion", "style", "clothing", "boutique", "trendy"],
  "Technology": ["tech", "technology", "software", "digital", "startup"],
  "Real Estate": ["real estate", "property", "housing", "realtor", "home"],
  "Festivals": ["festival", "celebration", "holiday", "cultural", "tradition"],
  "Food & Drink": ["food", "restaurant", "menu", "culinary", "drink"],
  "Fitness": ["fitness", "gym", "workout", "health", "exercise"],
  "Beauty": ["beauty", "salon", "spa", "cosmetics", "skincare"],
  "Pets": ["pets", "animals", "dogs", "cats", "veterinary"],
  "Sports": ["sports", "athletic", "team", "game", "competition"],
  "Health & Wellness": ["health", "wellness", "medical", "wellbeing", "care"],
  "Nonprofit": ["nonprofit", "charity", "volunteer", "donation", "community"],
  "Photography": ["photography", "photos", "camera", "portfolio", "session"],
  "Automotive": ["automotive", "cars", "vehicles", "auto", "repair"],
  "Nature": ["nature", "outdoor", "environment", "garden", "landscape"],
  "Art & Creative": ["art", "creative", "design", "artist", "craft"],
};

function generateValueHash(seed) {
  return createHash("md5").update(seed).digest("hex");
}

function generatePalette(category) {
  const palettes = {
    "Wedding": ["#f8e8e8", "#d4a5a5", "#8b5e5e", "#4a2c2c", "#f5f0f0"],
    "Birthday": ["#fde8d0", "#f9a8d4", "#ec4899", "#be185d", "#fef08a"],
    "Business": ["#1e3a5f", "#2d5a87", "#4a90b0", "#7ab8d0", "#f0f4f8"],
    "Events": ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#533483"],
    "Festivals": ["#dc2626", "#ea580c", "#f59e0b", "#16a34a", "#2563eb"],
    "Music": ["#0f0f0f", "#1a1a2e", "#e94560", "#533483", "#f5f5f5"],
    "Fashion": ["#1c1c1c", "#3d3d3d", "#8b5cf6", "#d8b4fe", "#faf5ff"],
    "Fitness": ["#0f172a", "#1e293b", "#22c55e", "#86efac", "#f0fdf4"],
    "Food & Drink": ["#451a03", "#78350f", "#d97706", "#fbbf24", "#fef3c7"],
    "Travel": ["#0c4a6e", "#0369a1", "#38bdf8", "#bae6fd", "#f0f9ff"],
    "Technology": ["#020617", "#0f172a", "#3b82f6", "#60a5fa", "#eff6ff"],
    "Real Estate": ["#1a2332", "#2d3a4a", "#8b7355", "#c4a97a", "#f5efe6"],
    "Education": ["#1e1b4b", "#3730a3", "#6366f1", "#a5b4fc", "#eef2ff"],
    "Pets": ["#422006", "#78350f", "#a16207", "#fde047", "#fefce8"],
    "Beauty": ["#2e1065", "#6b21a8", "#c084fc", "#e9d5ff", "#faf5ff"],
    "Sports": ["#1e293b", "#334155", "#ef4444", "#f87171", "#fef2f2"],
    "Automotive": ["#0a0a0a", "#1f2937", "#6b7280", "#9ca3af", "#f3f4f6"],
    "Nature": ["#052e16", "#166534", "#22c55e", "#bbf7d0", "#f0fdf4"],
    "Art & Creative": ["#2d1b69", "#5b21b6", "#8b5cf6", "#c4b5fd", "#f5f3ff"],
    "Photography": ["#18181b", "#27272a", "#52525b", "#a1a1aa", "#f4f4f5"],
    "Health & Wellness": ["#064e3b", "#047857", "#34d399", "#a7f3d0", "#ecfdf5"],
    "Nonprofit": ["#1c1917", "#292524", "#d97706", "#fbbf24", "#fefce8"],
  };
  return palettes[category] || ["#1e1b4b", "#3730a3", "#6366f1", "#a5b4fc", "#eef2ff"];
}

function generateSQL() {
  const rows = TEMPLATES.map((t, i) => {
    const id = randomUUID();
    const hash = generateValueHash(t.title + t.category);
    const tagList = [...(TAGS_BY_CATEGORY[t.category] || ["design", "template"]), t.style.toLowerCase(), t.subcategory.toLowerCase()];
    const tags = `{${tagList.map(t => `"${t}"`).join(",")}}`;
    const palette = generatePalette(t.category);
    const elements = JSON.stringify([
      { type: "rect", x: 0, y: 0, width: t.width, height: t.height, fill: palette[0], opacity: 1 },
      { type: "text", x: 100, y: 200, content: t.title, fontSize: 48, fontFamily: "Inter", color: "#ffffff", fontWeight: "bold" },
      { type: "text", x: 100, y: 280, content: `By DesignForge AI — ${t.style} ${t.category} Template`, fontSize: 20, fontFamily: "Inter", color: palette[3] },
    ]);
    const downloads = Math.floor(Math.random() * 5000) + 100;
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 90 * 86400000)).toISOString();
    const updatedAt = createdAt;

    return [
      `'${id}'`,
      `'${t.title.replace(/'/g, "''")}'`,
      `NULL`,
      `'${t.category}'`,
      `'${t.subcategory}'`,
      `'${t.type}'`,
      `NULL`,
      `NULL`,
      `${t.width}`,
      `${t.height}`,
      `'${elements}'::jsonb`,
      `'${tags}'`,
      `${t.premium}`,
      `${t.popular}`,
      `${downloads}`,
      `'${createdAt}'`,
      `'${updatedAt}'`,
    ].join(",\n    ");
  });

  const sql = rows.map(row =>
    `INSERT INTO templates (id, title, description, category, subcategory, type, thumbnail_url, preview_url, width, height, elements, tags, premium, popular, downloads, created_at, updated_at) VALUES (\n    ${row}\n);`
  ).join("\n\n") + "\n";

  // Also generate JSON for API-based import
  const jsonData = TEMPLATES.map((t, i) => ({
    ...t,
    tags: [...(TAGS_BY_CATEGORY[t.category] || ["design", "template"]), t.style.toLowerCase(), t.subcategory.toLowerCase()],
    palette: generatePalette(t.category),
    downloads: Math.floor(Math.random() * 5000) + 100,
  }));

  return { sql, jsonData, count: TEMPLATES.length };
}

const result = generateSQL();
console.log(result.sql);
console.log("-- Total templates:", result.count);
console.log("--");
console.log("-- To reset: TRUNCATE templates CASCADE;");
console.log("--");
console.log("-- To update searchable fields:");
console.log("-- CREATE INDEX IF NOT EXISTS idx_templates_search ON templates USING gin(to_tsvector('english', title || ' ' || category || ' ' || subcategory || ' ' || array_to_string(tags, ' ')));");

const fs = await import("fs");
const path = await import("path");
const outputDir = new URL(".", import.meta.url).pathname;
fs.writeFileSync(path.join(outputDir, "seed-templates.sql"), result.sql);
fs.writeFileSync(path.join(outputDir, "seed-templates.json"), JSON.stringify(result.jsonData, null, 2));
console.log(`\nWritten ${result.count} templates to:`);
console.log(`  - scripts/seed-templates.sql`);
console.log(`  - scripts/seed-templates.json`);
