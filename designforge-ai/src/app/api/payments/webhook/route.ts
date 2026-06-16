import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("stripe-signature");
    const body = await request.text();

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 });
    }

    let event: Record<string, unknown>;
    try {
      event = JSON.parse(body);
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const supabase = await createServerSupabase();
    const eventType = event.type as string;
    const data = event.data as Record<string, unknown>;
    const obj = data?.object as Record<string, unknown> | undefined;

    switch (eventType) {
      case "checkout.session.completed": {
        const customerEmail = obj?.customer_email as string;
        const subscriptionId = obj?.subscription as string;
        if (customerEmail) {
          await supabase.from("users").update({ plan: "pro" }).eq("email", customerEmail);
          if (subscriptionId) {
            await supabase.from("subscriptions").update({
              stripe_subscription_id: subscriptionId,
              status: "active",
            }).eq("user_id", (await supabase.from("users").select("id").eq("email", customerEmail).single()).data?.id || "");
          }
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const subId = obj?.id as string;
        const subStatus = obj?.status as string;
        const items = obj?.items as Record<string, unknown>;
        const planData = (items?.data as Record<string, unknown>[])?.[0]?.plan as Record<string, unknown>;
        const productName = (planData?.product as string)?.toLowerCase() || "pro";

        if (subId) {
          await supabase.from("subscriptions").update({
            status: subStatus === "active" ? "active" : subStatus === "past_due" ? "past_due" : subStatus === "canceled" ? "canceled" : "past_due",
          }).eq("stripe_subscription_id", subId);

          if (subStatus === "active") {
            const { data: sub } = await supabase.from("subscriptions").select("user_id").eq("stripe_subscription_id", subId).single();
            if (sub) {
              await supabase.from("users").update({ plan: productName.includes("business") ? "business" : "pro" }).eq("id", sub.user_id);
            }
          }
        }
        break;
      }
      case "customer.subscription.deleted": {
        const deletedSubId = obj?.id as string;
        if (deletedSubId) {
          const { data: sub } = await supabase.from("subscriptions").select("user_id").eq("stripe_subscription_id", deletedSubId).single();
          await supabase.from("subscriptions").update({
            status: "canceled",
            cancel_at_period_end: false,
          }).eq("stripe_subscription_id", deletedSubId);

          if (sub) {
            await supabase.from("users").update({ plan: "free" }).eq("id", sub.user_id);
          }
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoiceSubId = obj?.subscription as string;
        const amountPaid = obj?.amount_paid as number;
        const currency = obj?.currency as string;
        if (invoiceSubId) {
          const { data: sub } = await supabase.from("subscriptions").select("user_id").eq("stripe_subscription_id", invoiceSubId).single();
          if (sub) {
            await supabase.from("payments").insert({
              user_id: sub.user_id,
              amount: amountPaid / 100,
              currency: currency?.toUpperCase() || "USD",
              status: "succeeded",
              payment_method: "stripe",
              payment_intent_id: obj?.payment_intent as string || `pi_${Date.now()}`,
              description: "Subscription payment",
            });
          }
        }
        break;
      }
      case "invoice.payment_failed": {
        const failedSubId = obj?.subscription as string;
        if (failedSubId) {
          await supabase.from("subscriptions").update({ status: "past_due" }).eq("stripe_subscription_id", failedSubId);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
