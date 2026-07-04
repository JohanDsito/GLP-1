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

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer.id;
    const metadataUserId = subscription.metadata.user_id ?? null;

    if (!metadataUserId) {
      return new Response('Missing user_id metadata', { status: 200 });
    }

    const { error } = await supabase.from('subscriptions').upsert(
      {
        user_id: metadataUserId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: subscription.id,
        price_id: subscription.items.data[0]?.price?.id ?? null,
        status: mapStripeStatus(subscription.status),
        cancel_at_period_end: subscription.cancel_at_period_end,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
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

