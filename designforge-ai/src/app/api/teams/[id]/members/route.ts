import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const addMemberSchema = z.object({
  email: z.string().email("Valid email is required"),
  role: z.enum(["admin", "editor", "viewer"]).optional().default("editor"),
});

async function getUser(supabase: Awaited<ReturnType<typeof createServerSupabase>>) {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function verifyTeamOwnership(supabase: Awaited<ReturnType<typeof createServerSupabase>>, teamId: string, userId: string) {
  const { data: team, error } = await supabase
    .from("teams")
    .select("owner_id")
    .eq("id", teamId)
    .single();

  if (error || !team) return null;
  return team;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: members, error } = await supabase
      .from("team_members")
      .select("*, users!inner(id, email, name, avatar_url)")
      .eq("team_id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: team } = await supabase
      .from("teams")
      .select("name, owner_id")
      .eq("id", id)
      .single();

    return NextResponse.json({ members, team });
  } catch (error) {
    console.error("Team members GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await verifyTeamOwnership(supabase, id, user.id);
    if (!team) {
      return NextResponse.json({ error: "Team not found or access denied" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = addMemberSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { data: invitedUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", parsed.data.email)
      .single();

    if (!invitedUser) {
      return NextResponse.json(
        { error: "No user found with this email" },
        { status: 404 }
      );
    }

    const { data: existingMember } = await supabase
      .from("team_members")
      .select("id")
      .eq("team_id", id)
      .eq("user_id", invitedUser.id)
      .single();

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a team member" },
        { status: 409 }
      );
    }

    const { data: member, error } = await supabase
      .from("team_members")
      .insert({
        team_id: id,
        user_id: invitedUser.id,
        role: parsed.data.role,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ member }, { status: 201 });
  } catch (error) {
    console.error("Team members POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabase();
    const user = await getUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = await verifyTeamOwnership(supabase, id, user.id);
    if (!team) {
      return NextResponse.json({ error: "Team not found or access denied" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const memberId = body.member_id || body.user_id;

    if (!memberId) {
      return NextResponse.json({ error: "member_id is required" }, { status: 400 });
    }

    if (memberId === user.id) {
      return NextResponse.json(
        { error: "Cannot remove yourself as owner. Transfer ownership first." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("team_id", id)
      .eq("user_id", memberId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Member removed" });
  } catch (error) {
    console.error("Team members DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
