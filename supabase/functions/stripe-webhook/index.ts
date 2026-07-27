import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.57.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

function mapStripeStatus(status: string | null | undefined) {
  if (status === 'active' || status === 'trialing' || status === 'past_due' || status === 'canceled') {
    return status;
  }

  return 'inactive';
}

Deno.serve(async (request) => {
  const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';

  if (!stripeSecretKey || !supabaseUrl || !supabaseServiceRoleKey || !webhookSecret) {
    return new Response('Missing Stripe or Supabase environment variables', { status: 500 });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const stripe = new Stripe(stripeSecretKey);
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing Stripe signature', { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Invalid signature', { status: 400 });
  }

  // One-time purchases (e.g. the GLP-1 Muscle Plan add-on).
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadataUserId = session.metadata?.user_id ?? session.client_reference_id ?? null;
    const product = session.metadata?.product ?? null;

    if (metadataUserId && product === 'muscle_plan' && session.payment_status === 'paid') {
      const stripeCustomerId =
        typeof session.customer === 'string' ? session.customer : (session.customer?.id ?? null);

      const { error } = await supabase.from('subscriptions').upsert(
        {
          user_id: metadataUserId,
          has_muscle_plan: true,
          ...(stripeCustomerId ? { stripe_customer_id: stripeCustomerId } : {}),
        },
        { onConflict: 'user_id' },
      );

      if (error) {
        return new Response(error.message, { status: 500 });
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const eventSubscription = event.data.object as Stripe.Subscription;

    // Never trust the status frozen inside the event payload: Stripe delivers
    // `created` (status: incomplete) and `updated` (status: active) almost at
    // once, and if `created` is processed last it would overwrite active with
    // inactive. Re-fetch the live subscription so we always persist the current
    // truth, regardless of event ordering.
    let subscription = eventSubscription;
    try {
      subscription = await stripe.subscriptions.retrieve(eventSubscription.id);
    } catch {
      // Fall back to the event payload if the live fetch fails (e.g. the
      // subscription was already deleted).
    }

    const stripeCustomerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
    const metadataUserId = subscription.metadata.user_id ?? eventSubscription.metadata.user_id ?? null;

    if (!metadataUserId) {
      return new Response('Missing user_id metadata', { status: 200 });
    }

    // As of API version 2026-06-24.dahlia, Stripe moved the billing period
    // fields from the subscription itself to each subscription item.
    const primaryItem = subscription.items.data[0];
    const currentPeriodEnd = primaryItem?.current_period_end;

    const { error } = await supabase.from('subscriptions').upsert(
      {
        user_id: metadataUserId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: subscription.id,
        price_id: primaryItem?.price?.id ?? null,
        status: mapStripeStatus(subscription.status),
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
        metadata: subscription.metadata,
        synced_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (error) {
      return new Response(error.message, { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});

