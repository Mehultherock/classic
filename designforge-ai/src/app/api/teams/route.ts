import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const createTeamSchema = z.object({
  name: z.string().min(1, "Team name is required").max(100),
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

    const { data: memberTeams, error: memberError } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id);

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    const teamIds = memberTeams.map((t) => t.team_id);

    const { data: ownedTeams, error: ownedError } = await supabase
      .from("teams")
      .select("*")
      .eq("owner_id", user.id);

    if (ownedError) {
      return NextResponse.json({ error: ownedError.message }, { status: 500 });
    }

    let memberTeamData: any[] = [];
    if (teamIds.length > 0) {
      const { data, error } = await supabase
        .from("teams")
        .select("*")
        .in("id", teamIds);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      memberTeamData = data || [];
    }

    const allTeams = [...ownedTeams, ...memberTeamData.filter(
      (t) => !ownedTeams.find((o) => o.id === t.id)
    )];

    const teamsWithMembers = await Promise.all(
      allTeams.map(async (team) => {
        const { data: members } = await supabase
          .from("team_members")
          .select("*, users!inner(name, email, avatar_url)")
          .eq("team_id", team.id);
        return { ...team, members: members || [] };
      })
    );

    return NextResponse.json({ teams: teamsWithMembers });
  } catch (error) {
    console.error("Teams GET error:", error);
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
    const parsed = createTeamSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { data: team, error: teamError } = await supabase
      .from("teams")
      .insert({ name: parsed.data.name, owner_id: user.id })
      .select()
      .single();

    if (teamError) {
      return NextResponse.json({ error: teamError.message }, { status: 500 });
    }

    const { error: memberError } = await supabase.from("team_members").insert({
      team_id: team.id,
      user_id: user.id,
      role: "owner",
    });

    if (memberError) {
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Teams POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
