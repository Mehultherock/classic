import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const qrSchema = z.object({
  data: z.string().min(1, "Data/content is required").max(2000),
  size: z.number().min(100).max(2000).optional().default(500),
  foreground_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default("#000000"),
  background_color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default("#ffffff"),
  include_logo: z.boolean().optional().default(false),
  format: z.enum(["png", "svg"]).optional().default("png"),
});

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = qrSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { data, size, foreground_color, background_color, format } = parsed.data;

    const encoded = encodeURIComponent(data);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&format=${format}&bgcolor=${background_color.slice(1)}&color=${foreground_color.slice(1)}`;

    return NextResponse.json({
      qr_code_url: qrUrl,
      data,
      size,
      format,
      foreground_color,
      background_color,
    });
  } catch (error) {
    console.error("QR code error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
