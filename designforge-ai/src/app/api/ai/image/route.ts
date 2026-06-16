import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const imageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(2000),
  style: z.enum(["realistic", "artistic", "3d", "sketch", "watercolor", "minimal", "vintage", "cyberpunk"]).optional(),
  size: z.enum(["1024x1024", "1024x1792", "1792x1024"]).optional().default("1024x1024"),
  count: z.number().min(1).max(4).optional().default(1),
  negative_prompt: z.string().optional(),
});

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

function generateImageUrls(prompt: string, style: string, count: number) {
  const images = [];
  for (let i = 0; i < count; i++) {
    const seed = (prompt.length + i * 100) % 1000;
    images.push({
      url: `https://placehold.co/1024x1024/1a1a2e/e94560?text=${encodeURIComponent(prompt.slice(0, 15))}+${i + 1}`,
      alt: `${prompt} - Variation ${i + 1}`,
      width: 1024,
      height: 1024,
      seed,
      style,
    });
  }
  return images;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = imageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { prompt, style = "realistic", count } = parsed.data;

    const images = generateImageUrls(prompt, style, count);

    const { error: genError } = await supabase.from("ai_generations").insert({
      user_id: user.id,
      type: "image",
      prompt,
      result: { images, style },
      model: "dall-e-3",
      tokens_used: count * 100,
    });

    if (genError) {
      return NextResponse.json({ error: genError.message }, { status: 500 });
    }

    return NextResponse.json({ images, revisedPrompt: `Professional ${style} style: ${prompt}, high quality, detailed` });
  } catch (error) {
    console.error("AI image error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
