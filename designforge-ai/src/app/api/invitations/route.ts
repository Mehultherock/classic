import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const createInvitationSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  event_type: z.string().min(1, "Event type is required"),
  event_name: z.string().min(1, "Event name is required"),
  event_date: z.string().min(1, "Event date is required"),
  event_time: z.string().optional().nullable(),
  venue: z.string().optional().nullable(),
  theme: z.string().optional().nullable(),
  color_palette: z.array(z.string()).optional().default([]),
  style_preference: z.string().optional().nullable(),
  custom_instructions: z.string().optional().nullable(),
  rsvp_enabled: z.boolean().optional().default(true),
  qr_enabled: z.boolean().optional().default(true),
  project_id: z.string().uuid().optional().nullable(),
});

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12")));
    const eventType = searchParams.get("event_type") || "";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("invitations")
      .select("*", { count: "exact" })
      .eq("user_id", user.id);

    if (eventType) {
      query = query.eq("event_type", eventType);
    }

    const { data: invitations, error, count } = await query
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      invitations,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Invitations GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    const parsed = createInvitationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const shareId = crypto.randomUUID().slice(0, 12);
    const shareLink = `${request.nextUrl.origin}/rsvp/${shareId}`;

    const { data: invitation, error } = await supabase
      .from("invitations")
      .insert({
        user_id: user.id,
        ...parsed.data,
        color_palette: parsed.data.color_palette,
        share_link: shareLink,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error("Invitations POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
