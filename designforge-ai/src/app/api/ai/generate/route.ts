import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const generateSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(2000),
  type: z.enum(["design", "text", "image", "color", "font"]),
  style: z.string().optional(),
  project_id: z.string().uuid().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
});

const DAILY_LIMITS: Record<string, number> = {
  free: 5,
  pro: -1,
  business: -1,
};

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function mockDesignResult(prompt: string, style?: string) {
  return {
    layout: "grid",
    sections: [
      { type: "header", content: prompt.split(" ").slice(0, 3).join(" "), style: "bold" },
      { type: "body", content: `Professional design generated from: "${prompt}"` },
      { type: "footer", content: "DesignForge AI", style: "small" },
    ],
    colorScheme: ["#1a1a2e", "#16213e", "#0f3460", "#e94560"],
    suggestedFonts: ["Inter", "Playfair Display", "Roboto"],
    composition: "centered",
  };
}

function mockTextResult(prompt: string) {
  return {
    headline: `${prompt.split(" ").slice(0, 5).join(" ")} – Elevate Your Vision`,
    subheadline: `Discover the perfect ${prompt.toLowerCase().includes("design") ? "design" : "solution"} for your needs`,
    body: `Experience the future of ${prompt.toLowerCase().split(" ").slice(0, 3).join(" ")} with our AI-powered platform. Create stunning, professional-quality results in seconds.`,
    callToAction: "Get Started Now",
    variations: [
      `Transform Your ${prompt.split(" ").slice(0, 2).join(" ")} Journey`,
      `Revolutionize Your ${prompt.split(" ").slice(0, 2).join(" ")} Experience`,
      `Unlock Premium ${prompt.split(" ").slice(0, 2).join(" ")} Solutions`,
    ],
  };
}

function mockImageResult(prompt: string) {
  const seed = prompt.length;
  return {
    images: [
      {
        url: `https://placehold.co/1024x1024/1a1a2e/e94560?text=${encodeURIComponent(prompt.slice(0, 20))}`,
        alt: prompt,
        width: 1024,
        height: 1024,
      },
    ],
    revisedPrompt: `Professional ${prompt}, high quality, 4k, detailed, modern design style`,
  };
}

function mockColorResult(prompt: string) {
  const palettes = [
    { name: "Ocean Breeze", colors: ["#0077b6", "#00b4d8", "#90e0ef", "#caf0f8", "#023e8a"], mood: "calm" },
    { name: "Sunset Glow", colors: ["#ff6b35", "#f7c59f", "#efefd0", "#004e89", "#1a659e"], mood: "warm" },
    { name: "Forest Walk", colors: ["#2d6a4f", "#40916c", "#52b788", "#95d5b2", "#d8f3dc"], mood: "natural" },
    { name: "Midnight Luxe", colors: ["#0b090a", "#161a1d", "#660708", "#a4161a", "#ba1826"], mood: "luxury" },
    { name: "Pastel Dream", colors: ["#f8edeb", "#fcd5ce", "#f9dcc4", "#fec89a", "#e8e8e4"], mood: "soft" },
    { name: "Bold & Bright", colors: ["#ff006e", "#fb5607", "#ffbe0b", "#3a86ff", "#8338ec"], mood: "energetic" },
  ];
  const idx = prompt.length % palettes.length;
  return palettes[idx];
}

function mockFontResult(prompt: string) {
  const pairings = [
    { heading: "Playfair Display", body: "Source Sans Pro", style: "elegant" },
    { heading: "Montserrat", body: "Merriweather", style: "modern" },
    { heading: "Poppins", body: "Lora", style: "clean" },
    { heading: "Raleway", body: "Open Sans", style: "minimal" },
    { heading: "Oswald", body: "Libre Baskerville", style: "bold" },
    { heading: "DM Serif Display", body: "Inter", style: "classic" },
  ];
  const idx = prompt.length % pairings.length;
  return pairings[idx];
}

function getMockResult(type: string, prompt: string, style?: string) {
  switch (type) {
    case "design": return mockDesignResult(prompt, style);
    case "text": return mockTextResult(prompt);
    case "image": return mockImageResult(prompt);
    case "color": return mockColorResult(prompt);
    case "font": return mockFontResult(prompt);
    default: return { message: "Generated successfully" };
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = generateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { prompt, type, style } = parsed.data;

    const { data: profile } = await supabase
      .from("users")
      .select("plan, ai_generations_today, last_generation_date")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const limit = DAILY_LIMITS[profile.plan] ?? 5;

    if (limit !== -1) {
      const today = new Date().toISOString().split("T")[0];
      const lastGen = profile.last_generation_date?.split("T")[0];
      const count = lastGen === today ? profile.ai_generations_today : 0;

      if (count >= limit) {
        return NextResponse.json(
          { error: `Daily generation limit reached (${limit}/day). Upgrade your plan for unlimited generations.` },
          { status: 429 }
        );
      }
    }

    const result = getMockResult(type, prompt, style);
    const tokensUsed = Math.floor(Math.random() * 500) + 100;
    const modelMap: Record<string, string> = {
      design: "gpt-4o",
      text: "gpt-4o",
      image: "dall-e-3",
      color: "gpt-4o",
      font: "gpt-4o",
    };

    const { error: genError } = await supabase.from("ai_generations").insert({
      user_id: user.id,
      type,
      prompt,
      result,
      model: modelMap[type] || "gpt-4o",
      tokens_used: tokensUsed,
    });

    if (genError) {
      return NextResponse.json({ error: genError.message }, { status: 500 });
    }

    const today = new Date().toISOString().split("T")[0];
    const lastGen = profile.last_generation_date?.split("T")[0];
    const newCount = lastGen === today ? profile.ai_generations_today + 1 : 1;

    await supabase.from("users").update({
      ai_generations_today: newCount,
      last_generation_date: today,
    }).eq("id", user.id);

    return NextResponse.json({
      result,
      tokensUsed,
      generationsRemaining: limit === -1 ? -1 : limit - newCount,
    });
  } catch (error) {
    console.error("AI generate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
