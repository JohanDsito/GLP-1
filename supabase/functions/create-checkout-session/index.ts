import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.57.2';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const priceId = Deno.env.get('STRIPE_PRICE_ID') ?? '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const appUrl = Deno.env.get('APP_URL') ?? '';

Deno.serve(async (request) => {
  if (!stripeSecretKey || !priceId || !supabaseUrl || !supabaseAnonKey || !appUrl) {
    return new Response('Missing Stripe or Supabase environment variables', { status: 500 });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Missing Authorization header', { status: 401 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return new Response('Invalid session', { status: 401 });
  }

  const user = userData.user;

  const { data: existingSubscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .maybeSingle();

  const stripe = new Stripe(stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      customer: existingSubscription?.stripe_customer_id ?? undefined,
      customer_email: existingSubscription?.stripe_customer_id ? undefined : (user.email ?? undefined),
      subscription_data: {
        metadata: { user_id: user.id },
      },
      success_url: `${appUrl}/?checkout=success`,
      cancel_url: `${appUrl}/subscribe?checkout=cancelled`,
    });

    if (!session.url) {
      return new Response('Stripe did not return a checkout URL', { status: 500 });
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Unable to create checkout session', {
      status: 500,
    });
  }
});
