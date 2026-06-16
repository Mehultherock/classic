import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const colorSchema = z.object({
  prompt: z.string().min(1, "Prompt/mood is required").max(500),
  mood: z.enum(["calm", "warm", "energetic", "luxury", "natural", "playful", "professional", "dark", "pastel", "vibrant"]).optional(),
  count: z.number().min(1).max(5).optional().default(3),
  base_color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color").optional(),
});

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

const PALETTE_LIBRARY: Record<string, { name: string; colors: string[]; mood: string; description: string }[]> = {
  calm: [
    { name: "Ocean Breeze", colors: ["#0077b6", "#00b4d8", "#90e0ef", "#caf0f8", "#023e8a"], mood: "calm", description: "Serene ocean-inspired palette" },
    { name: "Lavender Fields", colors: ["#b39ddb", "#ce93d8", "#e1bee7", "#f3e5f5", "#7b1fa2"], mood: "calm", description: "Soft lavender tones for relaxation" },
    { name: "Misty Morning", colors: ["#cfd8dc", "#b0bec5", "#90a4ae", "#78909c", "#546e7a"], mood: "calm", description: "Gentle morning mist hues" },
  ],
  warm: [
    { name: "Sunset Glow", colors: ["#ff6b35", "#f7c59f", "#efefd0", "#004e89", "#1a659e"], mood: "warm", description: "Golden sunset warmth" },
    { name: "Autumn Harvest", colors: ["#d35400", "#e67e22", "#f39c12", "#d4ac0d", "#8e44ad"], mood: "warm", description: "Rich autumn colors" },
    { name: "Desert Sand", colors: ["#edc9af", "#e6b8a2", "#d5a37e", "#c68e65", "#b87b4b"], mood: "warm", description: "Earthy desert tones" },
  ],
  energetic: [
    { name: "Bold & Bright", colors: ["#ff006e", "#fb5607", "#ffbe0b", "#3a86ff", "#8338ec"], mood: "energetic", description: "High-energy vibrant palette" },
    { name: "Neon Nights", colors: ["#f72585", "#b5179e", "#7209b7", "#560bad", "#480ca8"], mood: "energetic", description: "Electric neon colors" },
  ],
  luxury: [
    { name: "Midnight Luxe", colors: ["#0b090a", "#161a1d", "#660708", "#a4161a", "#ba1826"], mood: "luxury", description: "Opulent dark tones" },
    { name: "Gold Rush", colors: ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#f5c518"], mood: "luxury", description: "Rich gold and deep blue" },
  ],
  natural: [
    { name: "Forest Walk", colors: ["#2d6a4f", "#40916c", "#52b788", "#95d5b2", "#d8f3dc"], mood: "natural", description: "Lush forest greens" },
    { name: "Earth Tones", colors: ["#5d4037", "#6d4c41", "#795548", "#8d6e63", "#a1887f"], mood: "natural", description: "Earthy brown palette" },
  ],
  playful: [
    { name: "Candy Shop", colors: ["#ff9ff3", "#f368e0", "#ff6b6b", "#ff9f43", "#feca57"], mood: "playful", description: "Sweet candy colors" },
    { name: "Rainbow Burst", colors: ["#ff0000", "#ff7700", "#ffff00", "#00ff00", "#0000ff"], mood: "playful", description: "Full rainbow spectrum" },
  ],
  professional: [
    { name: "Corporate Blue", colors: ["#1a237e", "#283593", "#3949ab", "#5c6bc0", "#9fa8da"], mood: "professional", description: "Trustworthy blue tones" },
    { name: "Slate & Steel", colors: ["#263238", "#37474f", "#455a64", "#546e7a", "#607d8b"], mood: "professional", description: "Modern neutral palette" },
  ],
  dark: [
    { name: "Dark Matter", colors: ["#0a0a0f", "#12121a", "#1a1a2e", "#2d2d44", "#3d3d5c"], mood: "dark", description: "Deep dark theme" },
    { name: "Cyber Noir", colors: ["#0d0221", "#150734", "#240b36", "#2f0e4b", "#3c1068"], mood: "dark", description: "Dark cyberpunk hues" },
  ],
  pastel: [
    { name: "Pastel Dream", colors: ["#f8edeb", "#fcd5ce", "#f9dcc4", "#fec89a", "#e8e8e4"], mood: "pastel", description: "Soft pastel dreamscape" },
    { name: "Cotton Candy", colors: ["#ffd1dc", "#ffb3c6", "#ff8fab", "#fb6f92", "#ffc2d1"], mood: "pastel", description: "Sweet cotton candy hues" },
  ],
  vibrant: [
    { name: "Tropical Punch", colors: ["#ff006e", "#fb5607", "#ffbe0b", "#3a86ff", "#00f5d4"], mood: "vibrant", description: "Bold tropical colors" },
    { name: "Electric Dreams", colors: ["#00f5d4", "#00bbf9", "#fee440", "#f15bb5", "#9b5de5"], mood: "vibrant", description: "Electric vibrant palette" },
  ],
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = colorSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { prompt, mood = "calm", count, base_color } = parsed.data;

    const available = PALETTE_LIBRARY[mood] || PALETTE_LIBRARY.calm;
    const palettes = available.slice(0, count);

    let result = palettes;

    if (base_color) {
      result = palettes.map((p) => ({
        ...p,
        colors: [base_color, ...p.colors.slice(1)],
        description: `${p.description} (accented with ${base_color})`,
      }));
    }

    const { error: genError } = await supabase.from("ai_generations").insert({
      user_id: user.id,
      type: "color",
      prompt,
      result: { palettes: result, mood },
      model: "gpt-4o",
      tokens_used: 50,
    });

    if (genError) {
      return NextResponse.json({ error: genError.message }, { status: 500 });
    }

    return NextResponse.json({ palettes: result, mood });
  } catch (error) {
    console.error("AI color error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
