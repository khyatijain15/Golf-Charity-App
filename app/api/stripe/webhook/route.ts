import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe/server";

export async function POST(req: Request) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Webhook error: ${String(err)}` }, { status: 400 });
  }

  const eventObject = event.data.object as unknown as Record<string, unknown>;
  
  // Auditing
  await admin.from('subscription_events').insert({
    stripe_event_id: event.id,
    event_type: event.type,
    amount: (eventObject.amount_total && typeof eventObject.amount_total === 'number') ? eventObject.amount_total / 100 : null,
    currency: (eventObject.currency && typeof eventObject.currency === 'string') ? eventObject.currency : 'gbp',
    status: (eventObject.status && typeof eventObject.status === 'string') ? eventObject.status : event.type,
    user_id: (eventObject.metadata && typeof eventObject.metadata === 'object' && eventObject.metadata !== null && 'userId' in eventObject.metadata) ? (eventObject.metadata as Record<string, string>).userId : null
  });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.mode === 'subscription') {
        const userId = session.metadata?.userId;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;
        
        let plan = 'monthly';
        if (session.amount_total && session.amount_total > 5000) {
            plan = 'yearly';
        }

        if (userId) {
             const { error } = await admin
            .from("profiles")
            .update({ 
                subscription_status: "active", 
                stripe_subscription_id: subscriptionId,
                stripe_customer_id: customerId,
                subscription_plan: plan,
                role: 'subscriber'
            })
            .eq("id", userId);

            if (error) console.error('Error updating profile on checkout:', error);
        }
    }
  }

  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object as Stripe.Subscription;
    // Redundant if checkout.session.completed handles it, but good fallback
    await admin
      .from("profiles")
      .update({ subscription_status: "active", stripe_subscription_id: subscription.id, role: 'subscriber' })
      .eq("stripe_customer_id", String(subscription.customer));
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await admin
      .from("profiles")
      .update({ subscription_status: "inactive", role: 'public' })
      .eq("stripe_customer_id", String(subscription.customer));
  }

  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    await admin
      .from("profiles")
      .update({ subscription_status: "lapsed" })
      .eq("stripe_customer_id", String(invoice.customer));
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object as Stripe.Invoice;
    await admin
      .from("profiles")
      .update({ subscription_status: "active", role: 'subscriber' })
      .eq("stripe_customer_id", String(invoice.customer));
  }
  
  return NextResponse.json({ received: true });
}
