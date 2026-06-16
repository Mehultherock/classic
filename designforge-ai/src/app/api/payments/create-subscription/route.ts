import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { z } from "zod";

const subscriptionSchema = z.object({
  plan: z.enum(["pro", "business"]),
  payment_method: z.enum(["stripe", "razorpay", "paypal"]),
  payment_method_id: z.string().optional(),
  success_url: z.string().url().optional(),
  cancel_url: z.string().url().optional(),
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
    const parsed = subscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { plan, payment_method } = parsed.data;

    const subscriptionId = crypto.randomUUID();
    const periodStart = new Date().toISOString();
    const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error: subError } = await supabase.from("subscriptions").insert({
      id: subscriptionId,
      user_id: user.id,
      plan,
      status: "active",
      stripe_subscription_id: `sub_mock_${subscriptionId.slice(0, 8)}`,
      current_period_start: periodStart,
      current_period_end: periodEnd,
      cancel_at_period_end: false,
    });

    if (subError) {
      return NextResponse.json({ error: subError.message }, { status: 500 });
    }

    await supabase.from("users").update({
      plan,
      updated_at: new Date().toISOString(),
    }).eq("id", user.id);

    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: user.id,
      amount: plan === "pro" ? 1900 : 4900,
      currency: "USD",
      status: "succeeded",
      payment_method,
      payment_intent_id: `pi_mock_${subscriptionId.slice(0, 12)}`,
      description: `${plan} plan subscription`,
    });

    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 500 });
    }

    return NextResponse.json({
      subscription: {
        id: subscriptionId,
        plan,
        status: "active",
        current_period_start: periodStart,
        current_period_end: periodEnd,
      },
      redirect_url: parsed.data.success_url || null,
    }, { status: 201 });
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
