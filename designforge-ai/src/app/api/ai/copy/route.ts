import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const copySchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(1000),
  type: z.enum(["headline", "body", "cta", "tagline", "social", "seo", "email"]),
  tone: z.enum(["professional", "casual", "luxury", "playful", "urgent", "emotional"]).optional(),
  count: z.number().min(1).max(10).optional().default(3),
  keywords: z.array(z.string()).optional(),
  brand_name: z.string().optional(),
});

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function generateVariations(prompt: string, type: string, tone: string, count: number, keywords?: string[], brandName?: string) {
  const tones: Record<string, string[]> = {
    professional: ["Streamlined", "Optimized", "Enterprise-grade", "Results-driven"],
    casual: ["Hey there", "Check this out", "You gotta see", "Super easy"],
    luxury: ["Exquisite", "Premium", "Curated", "Artisanal"],
    playful: ["Woo-hoo", "Guess what", "Get ready to", "Time to"],
    urgent: ["Limited time", "Act now", "Don't miss", "Last chance"],
    emotional: ["Imagine", "Feel the", "Experience", "Cherish"],
  };

  const typeSuffixes: Record<string, string> = {
    headline: " – Transform Your Vision",
    body: " Our platform makes it simple to create stunning results.",
    cta: " Get Started Today",
    tagline: " Where Creativity Meets AI",
    social: " #DesignForge #AICreativity",
    seo: " | AI-Powered Design Platform",
    email: " Unlock your creative potential with DesignForge AI.",
  };

  const toned = tones[tone] || tones.professional;
  const suffix = typeSuffixes[type] || "";

  const variations = [];
  for (let i = 0; i < count; i++) {
    const opener = toned[i % toned.length];
    const kw = keywords && keywords.length > 0 ? keywords[i % keywords.length] : "";
    const brand = brandName ? brandName : "DesignForge AI";
    variations.push(
      `${opener} ${prompt}${kw ? ` with ${kw}` : ""}${suffix.replace("DesignForge AI", brand)}`
    );
  }

  return variations;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = copySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { prompt, type, tone = "professional", count, keywords, brand_name } = parsed.data;

    const variations = generateVariations(prompt, type, tone, count, keywords, brand_name);

    const { error: genError } = await supabase.from("ai_generations").insert({
      user_id: user.id,
      type: "text",
      prompt: `[copy] ${prompt}`,
      result: { variations, type, tone },
      model: "gpt-4o",
      tokens_used: variations.length * 50,
    });

    if (genError) {
      return NextResponse.json({ error: genError.message }, { status: 500 });
    }

    return NextResponse.json({ variations });
  } catch (error) {
    console.error("AI copy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
