import Stripe from 'npm:stripe@17.7.0';
import { createClient } from 'npm:@supabase/supabase-js@2.57.2';

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') ?? '';
const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const appUrl = Deno.env.get('APP_URL') ?? '';

Deno.serve(async (request) => {
  if (!stripeSecretKey || !supabaseUrl || !supabaseAnonKey || !appUrl) {
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

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userData.user.id)
    .maybeSingle();

  if (!subscription?.stripe_customer_id) {
    return new Response('No Stripe customer found for this user', { status: 404 });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${appUrl}/settings`,
    });

    return new Response(JSON.stringify({ url: portalSession.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(error instanceof Error ? error.message : 'Unable to create portal session', {
      status: 500,
    });
  }
});
