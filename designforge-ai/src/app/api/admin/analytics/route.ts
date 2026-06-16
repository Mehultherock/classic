import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function requireAdmin(supabase: Awaited<ReturnType<typeof createServerSupabase>>, userId: string) {
  const { data: profile } = await supabase
    .from("users")
    .select("plan")
    .eq("id", userId)
    .single();

  return (profile as { plan: string } | null)?.plan === "business";
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = await requireAdmin(supabase, user.id);
    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const days = Math.min(365, Math.max(1, parseInt(searchParams.get("days") || "30")));
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const { data: analyticsData } = await supabase
      .from("analytics")
      .select("*")
      .gte("date", startDate)
      .order("date", { ascending: true });

    const { count: totalUsers } = await supabase
      .from("users")
      .select("*", { count: "exact", head: true });

    const { count: totalProjects } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true });

    const { count: totalGenerations } = await supabase
      .from("ai_generations")
      .select("*", { count: "exact", head: true });

    const { count: templatesCount } = await supabase
      .from("templates")
      .select("*", { count: "exact", head: true });

    const monthlyDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { count: activeUsers } = await supabase
      .from("ai_generations")
      .select("user_id", { count: "exact", head: true })
      .gte("created_at", monthlyDate);

    const { data: rawPlanDistribution } = await supabase
      .from("users")
      .select("plan");

    const planCounts = { free: 0, pro: 0, business: 0 };
    const planDistribution = rawPlanDistribution as Array<{ plan: string }> | null;
    planDistribution?.forEach((u) => {
      if (u.plan in planCounts) {
        planCounts[u.plan as keyof typeof planCounts]++;
      }
    });

    const { data: rawGenerations } = await supabase
      .from("ai_generations")
      .select("type")
      .gte("created_at", monthlyDate);

    const genTypeCounts: Record<string, number> = {};
    (rawGenerations as Array<{ type: string }> | null)?.forEach((g) => {
      genTypeCounts[g.type] = (genTypeCounts[g.type] || 0) + 1;
    });

    const { data: rawProjects } = await supabase
      .from("projects")
      .select("type")
      .gte("created_at", monthlyDate);

    const projectTypeCounts: Record<string, number> = {};
    (rawProjects as Array<{ type: string }> | null)?.forEach((p) => {
      projectTypeCounts[p.type] = (projectTypeCounts[p.type] || 0) + 1;
    });

    return NextResponse.json({
      overview: {
        totalUsers: totalUsers || 0,
        totalProjects: totalProjects || 0,
        totalGenerations: totalGenerations || 0,
        totalTemplates: templatesCount || 0,
        activeUsersLast30Days: activeUsers || 0,
      },
      planDistribution: planCounts,
      generationTypes: genTypeCounts,
      projectTypes: projectTypeCounts,
      timeline: (analyticsData as Array<Record<string, unknown>>) || [],
    });
  } catch (error) {
    console.error("Admin analytics error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
