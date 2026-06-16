export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  plan: "free" | "pro" | "business";
  email_verified: boolean;
}

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: "invitation" | "poster" | "flyer" | "banner" | "certificate" | "greeting_card" | "social_media" | "custom";
  thumbnail_url?: string;
  width: number;
  height: number;
  elements: DesignElement[];
  ai_generated: boolean;
  template_id?: string;
  folder_id?: string;
  status: "draft" | "completed" | "archived";
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface DesignElement {
  id: string;
  type: "text" | "image" | "shape" | "icon" | "frame" | "sticker" | "illustration";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  properties: Record<string, unknown>;
  animations?: AnimationProperties;
}

export interface TextProperties {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  textAlign: "left" | "center" | "right";
  lineHeight: number;
  letterSpacing: number;
  textDecoration?: "underline" | "line-through" | "none";
  fontStyle?: "normal" | "italic";
  textTransform?: "uppercase" | "lowercase" | "capitalize" | "none";
  shadow?: TextShadow;
  gradient?: TextGradient;
}

export interface TextShadow {
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
}

export interface TextGradient {
  type: "linear" | "radial";
  colors: string[];
  angle?: number;
}

export interface ImageProperties {
  src: string;
  alt?: string;
  crop?: { x: number; y: number; width: number; height: number };
  filters?: Record<string, number>;
  borderRadius?: number;
  border?: { color: string; width: number };
}

export interface ShapeProperties {
  shapeType: "rectangle" | "circle" | "triangle" | "star" | "heart" | "line" | "arrow";
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export interface AnimationProperties {
  type: "fade" | "slide" | "bounce" | "zoom" | "flip" | "rotate";
  duration: number;
  delay: number;
  direction?: "left" | "right" | "up" | "down";
}

export interface Template {
  id: string;
  title: string;
  description?: string;
  category: string;
  subcategory?: string;
  type: string;
  thumbnail_url: string;
  preview_url?: string;
  width: number;
  height: number;
  elements: DesignElement[];
  tags: string[];
  premium: boolean;
  popular: boolean;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  type: "design" | "text" | "image" | "color" | "font";
  prompt: string;
  result: unknown;
  model: string;
  tokens_used: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: "free" | "pro" | "business";
  status: "active" | "canceled" | "past_due" | "trialing";
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  owner_id: string;
  members: TeamMember[];
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "owner" | "admin" | "editor" | "viewer";
  joined_at: string;
}

export interface RSVPResponse {
  id: string;
  invitation_id: string;
  guest_name: string;
  guest_email?: string;
  status: "attending" | "declined" | "maybe";
  guests_count: number;
  message?: string;
  created_at: string;
}

export interface Invitation {
  id: string;
  user_id: string;
  title: string;
  event_type: string;
  event_name: string;
  event_date: string;
  event_time?: string;
  venue?: string;
  theme?: string;
  color_palette?: string[];
  style_preference?: string;
  custom_instructions?: string;
  project_id?: string;
  rsvp_enabled: boolean;
  qr_enabled: boolean;
  share_link?: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "design" | "team" | "payment" | "system" | "promotion";
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, unknown>;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: "succeeded" | "failed" | "pending" | "refunded";
  payment_method: "stripe" | "razorpay" | "paypal";
  payment_intent_id: string;
  description?: string;
  created_at: string;
}

export interface Analytics {
  id: string;
  date: string;
  total_users: number;
  new_users: number;
  active_users: number;
  total_projects: number;
  ai_generations: number;
  downloads: number;
  revenue: number;
  conversions: number;
}
