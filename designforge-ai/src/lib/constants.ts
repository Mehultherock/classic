export const APP_NAME = "DesignForge AI";
export const APP_TAGLINE = "Create Professional Designs in Seconds with AI";
export const APP_DESCRIPTION =
  "Generate professional designs instantly for weddings, birthdays, businesses, schools, festivals, marketing campaigns, and social media.";

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    generationsPerDay: 5,
    watermark: true,
    hdExports: false,
    premiumTemplates: false,
    aiImageGen: false,
    teamCollaboration: false,
  },
  pro: {
    name: "Pro",
    price: 19,
    generationsPerDay: -1,
    watermark: false,
    hdExports: true,
    premiumTemplates: true,
    aiImageGen: true,
    teamCollaboration: false,
  },
  business: {
    name: "Business",
    price: 49,
    generationsPerDay: -1,
    watermark: false,
    hdExports: true,
    premiumTemplates: true,
    aiImageGen: true,
    teamCollaboration: true,
  },
} as const;

export const EVENT_TYPES = [
  "Birthday",
  "Wedding",
  "Engagement",
  "Anniversary",
  "Baby Shower",
  "Graduation",
  "Farewell",
  "School Event",
  "Sports Event",
  "Corporate Event",
  "Festival Event",
] as const;

export const POSTER_TYPES = [
  "Event Posters",
  "Product Posters",
  "Festival Posters",
  "Movie Posters",
  "School Posters",
  "Sale Posters",
  "Marketing Posters",
  "Advertisement Posters",
] as const;

export const TEMPLATE_CATEGORIES = [
  "Wedding",
  "Birthday",
  "Engagement",
  "Anniversary",
  "Baby Shower",
  "Graduation",
  "Farewell",
  "Business",
  "Events",
  "Festivals",
  "Promotions",
  "Sales",
  "Sports",
  "Education",
  "Food & Drink",
  "Travel",
  "Health & Wellness",
  "Fashion",
  "Music",
  "Technology",
  "Real Estate",
  "Nonprofit",
  "Religion",
  "Photography",
  "Fitness",
  "Beauty",
  "Automotive",
  "Pets",
  "Nature",
  "Art & Creative",
  "Finance",
  "Legal",
] as const;

export const TEMPLATE_STYLES = [
  "Modern",
  "Classic",
  "Minimal",
  "Vintage",
  "Luxury",
  "Playful",
  "Elegant",
  "Bold",
  "Rustic",
  "Bohemian",
  "Corporate",
  "Art Deco",
  "Neon",
  "Watercolor",
  "Geometric",
  "Hand-drawn",
  "Gradient",
  "Typography",
  "Pastel",
  "Dark",
] as const;

export const TEMPLATE_MOODS = [
  "Romantic",
  "Joyful",
  "Professional",
  "Luxurious",
  "Fun",
  "Serene",
  "Dramatic",
  "Whimsical",
  "Earthy",
  "Energetic",
] as const;

export const TEMPLATE_TYPES = [
  "invitation",
  "poster",
  "flyer",
  "banner",
  "certificate",
  "greeting_card",
  "social_media",
] as const;

export const EXPORT_FORMATS = ["PNG", "JPG", "PDF", "Print Ready PDF"] as const;

export const SOCIAL_PLATFORMS = [
  "Instagram",
  "Facebook",
  "LinkedIn",
  "YouTube",
  "Twitter/X",
  "Pinterest",
] as const;

export const AI_MODELS = {
  design: "gpt-4o",
  image: "dall-e-3",
  text: "gpt-4o",
  enhancement: "stable-diffusion-xl",
} as const;

export const CANVAS_SIZES = {
  instagram: { width: 1080, height: 1080, label: "Instagram Square" },
  facebook: { width: 1200, height: 630, label: "Facebook Cover" },
  youtube: { width: 1280, height: 720, label: "YouTube Thumbnail" },
  twitter: { width: 1200, height: 675, label: "Twitter/X Post" },
  linkedin: { width: 1200, height: 627, label: "LinkedIn Cover" },
  poster: { width: 816, height: 1056, label: "Poster (A3)" },
  flyer: { width: 612, height: 792, label: "Flyer (Letter)" },
  banner: { width: 1200, height: 400, label: "Banner" },
  invitation: { width: 600, height: 800, label: "Invitation" },
  certificate: { width: 1200, height: 900, label: "Certificate" },
  custom: { width: 800, height: 600, label: "Custom" },
} as const;
