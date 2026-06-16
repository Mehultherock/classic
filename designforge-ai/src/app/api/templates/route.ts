import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const createTemplateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().nullable(),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().optional().nullable(),
  type: z.string().min(1, "Type is required"),
  thumbnail_url: z.string().url("Invalid thumbnail URL"),
  preview_url: z.string().url().optional().nullable(),
  width: z.number().positive(),
  height: z.number().positive(),
  elements: z.array(z.any()).optional().default([]),
  tags: z.array(z.string()).optional().default([]),
  premium: z.boolean().optional().default(false),
  popular: z.boolean().optional().default(false),
  downloads: z.number().optional().default(0),
});

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const category = searchParams.get("category") || "";
    const type = searchParams.get("type") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "popular";
    const premium = searchParams.get("premium");

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("templates").select("*", { count: "exact" });

    if (category) {
      query = query.eq("category", category);
    }

    if (type) {
      query = query.eq("type", type);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
    }

    if (premium === "true") {
      query = query.eq("premium", true);
    } else if (premium === "false") {
      query = query.eq("premium", false);
    }

    const orderColumn = sort === "newest" ? "created_at" : sort === "downloads" ? "downloads" : "popular";
    const { data: templates, error, count } = await query
      .order(orderColumn, { ascending: false })
      .range(from, to);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Templates GET error:", error);
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

    const { data: profile } = await supabase
      .from("users")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (!profile || profile.plan !== "business") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = createTemplateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { data: template, error } = await supabase
      .from("templates")
      .insert(parsed.data)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error("Templates POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
