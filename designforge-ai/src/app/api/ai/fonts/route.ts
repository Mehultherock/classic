import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const fontSchema = z.object({
  prompt: z.string().min(1, "Description is required").max(500),
  style: z.enum(["elegant", "modern", "classic", "playful", "minimal", "bold", "handwritten", "vintage"]).optional(),
  count: z.number().min(1).max(5).optional().default(3),
  include_system_fonts: z.boolean().optional().default(true),
});

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

const FONT_PAIRINGS: Record<string, { heading: string; body: string; accent: string; style: string; description: string }[]> = {
  elegant: [
    { heading: "Playfair Display", body: "Source Sans Pro", accent: "Cormorant Garamond", style: "elegant", description: "Timeless serif with clean sans-serif complement" },
    { heading: "Didot", body: "Avenir", accent: "Bodoni Moda", style: "elegant", description: "High-fashion editorial pairing" },
    { heading: "Cormorant", body: "Proxima Nova", accent: "EB Garamond", style: "elegant", description: "Refined and sophisticated" },
  ],
  modern: [
    { heading: "Montserrat", body: "Merriweather", accent: "Raleway", style: "modern", description: "Clean geometric with readable serif" },
    { heading: "Poppins", body: "Lora", accent: "Roboto Slab", style: "modern", description: "Contemporary geometric with warm serif" },
    { heading: "DM Sans", body: "DM Serif Display", accent: "Space Grotesk", style: "modern", description: "Modern duo with personality" },
  ],
  classic: [
    { heading: "DM Serif Display", body: "Inter", accent: "Abril Fatface", style: "classic", description: "Timeless serif with neutral sans" },
    { heading: "Libre Baskerville", body: "Open Sans", accent: "Merriweather", style: "classic", description: "Traditional print-inspired pairing" },
    { heading: "Lora", body: "Work Sans", accent: "Cardo", style: "classic", description: "Elegant readability" },
  ],
  playful: [
    { heading: "Fredoka One", body: "Nunito", accent: "Bubblegum Sans", style: "playful", description: "Fun rounded fonts" },
    { heading: "Baloo 2", body: "Quicksand", accent: "Pacifico", style: "playful", description: "Bouncy and energetic" },
    { heading: "Comfortaa", body: "Jost", accent: "Amatic SC", style: "playful", description: "Whimsical and light" },
  ],
  minimal: [
    { heading: "Inter", body: "Inter", accent: "Helvetica Neue", style: "minimal", description: "Clean single-typeface approach" },
    { heading: "Raleway", body: "Open Sans", accent: "Josefin Sans", style: "minimal", description: "Simple and airy" },
    { heading: "Work Sans", body: "Source Sans Pro", accent: "Hind", style: "minimal", description: "Functional and clean" },
  ],
  bold: [
    { heading: "Oswald", body: "Libre Baskerville", accent: "Bebas Neue", style: "bold", description: "Strong impact pairing" },
    { heading: "Anton", body: "Roboto", accent: "Barlow Condensed", style: "bold", description: "Powerful condensed headlines" },
    { heading: "Fjalla One", body: "Karla", accent: "Pathway Gothic One", style: "bold", description: "Assertive and confident" },
  ],
  handwritten: [
    { heading: "Dancing Script", body: "Lato", accent: "Pacifico", style: "handwritten", description: "Script elegance with clean body" },
    { heading: "Caveat", body: "Quicksand", accent: "Kalam", style: "handwritten", description: "Casual handwriting pairing" },
    { heading: "Shadows Into Light", body: "Nunito", accent: "Indie Flower", style: "handwritten", description: "Playful hand-drawn feel" },
  ],
  vintage: [
    { heading: "Abril Fatface", body: "Josefin Sans", accent: "Playfair Display", style: "vintage", description: "Retro-inspired bold serif" },
    { heading: "Prata", body: "Cabin", accent: "Cinzel", style: "vintage", description: "Old-world charm" },
    { heading: "Cinzel", body: "Fauna One", accent: "Julius Sans One", style: "vintage", description: "Roman-inspired elegance" },
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
    const parsed = fontSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { style = "modern", count } = parsed.data;

    const available = FONT_PAIRINGS[style] || FONT_PAIRINGS.modern;
    const pairings = available.slice(0, count);

    const { error: genError } = await supabase.from("ai_generations").insert({
      user_id: user.id,
      type: "font",
      prompt: `[fonts] style: ${style}`,
      result: { pairings, style },
      model: "gpt-4o",
      tokens_used: 50,
    });

    if (genError) {
      return NextResponse.json({ error: genError.message }, { status: 500 });
    }

    return NextResponse.json({ pairings, style });
  } catch (error) {
    console.error("AI fonts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
