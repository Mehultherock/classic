import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const rsvpSchema = z.object({
  invitation_id: z.string().uuid("Invalid invitation ID"),
  guest_name: z.string().min(1, "Guest name is required").max(200),
  guest_email: z.string().email().optional().nullable(),
  status: z.enum(["attending", "declined", "maybe"]),
  guests_count: z.number().min(0).max(100).optional().default(1),
  message: z.string().max(1000).optional().nullable(),
});

async function getInvitationByShareLink(supabase: Awaited<ReturnType<typeof createServerSupabase>>, shareLink: string) {
  const { data } = await supabase
    .from("invitations")
    .select("id, rsvp_enabled")
    .eq("share_link", shareLink)
    .single();
  return data;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    let invitationId = body.invitation_id as string | undefined;

    if (!invitationId && body.share_link) {
      const invitation = await getInvitationByShareLink(supabase, body.share_link as string);
      if (!invitation) {
        return NextResponse.json({ error: "Invalid invitation link" }, { status: 404 });
      }
      if (!invitation.rsvp_enabled) {
        return NextResponse.json({ error: "RSVP is disabled for this invitation" }, { status: 400 });
      }
      invitationId = invitation.id;
    }

    const parsed = rsvpSchema.safeParse({ ...body, invitation_id: invitationId });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { data: invitation } = await supabase
      .from("invitations")
      .select("rsvp_enabled")
      .eq("id", parsed.data.invitation_id)
      .single();

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (!invitation.rsvp_enabled) {
      return NextResponse.json({ error: "RSVP is disabled for this invitation" }, { status: 400 });
    }

    const { data: response, error } = await supabase
      .from("rsvp_responses")
      .insert({
        invitation_id: parsed.data.invitation_id,
        guest_name: parsed.data.guest_name,
        guest_email: parsed.data.guest_email || null,
        status: parsed.data.status,
        guests_count: parsed.data.guests_count,
        message: parsed.data.message || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    console.error("RSVP POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabase();
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("invitation_id");
    const shareLink = searchParams.get("share_link");

    if (!invitationId && !shareLink) {
      return NextResponse.json(
        { error: "invitation_id or share_link query parameter is required" },
        { status: 400 }
      );
    }

    let id = invitationId;
    if (shareLink && !id) {
      const invitation = await getInvitationByShareLink(supabase, shareLink);
      if (invitation) {
        id = invitation.id;
      }
    }

    if (!id) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const { data: responses, error } = await supabase
      .from("rsvp_responses")
      .select("*")
      .eq("invitation_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const attending = responses.filter((r) => r.status === "attending");
    const declined = responses.filter((r) => r.status === "declined");
    const maybe = responses.filter((r) => r.status === "maybe");
    const totalGuests = attending.reduce((sum, r) => sum + r.guests_count, 0);

    return NextResponse.json({
      responses,
      summary: {
        total: responses.length,
        attending: attending.length,
        declined: declined.length,
        maybe: maybe.length,
        totalGuests,
      },
    });
  } catch (error) {
    console.error("RSVP GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
