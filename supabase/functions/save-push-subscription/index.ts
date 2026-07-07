import { createClient } from 'npm:@supabase/supabase-js@2.57.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response('Missing Supabase environment variables', { status: 500, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Missing Authorization header', { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return new Response('Invalid session', { status: 401, headers: corsHeaders });
  }

  let body: { endpoint?: string; p256dh?: string; auth?: string; userAgent?: string };
  try {
    body = await request.json();
  } catch {
    return new Response('Invalid JSON', { status: 400, headers: corsHeaders });
  }

  if (!body.endpoint || !body.p256dh || !body.auth) {
    return new Response('Missing subscription fields', { status: 400, headers: corsHeaders });
  }

  // The user is validated above with the anon client. Write with the service
  // role so the upsert (which may take the ON CONFLICT update path) isn't
  // blocked by row-level security, which has no client update policy.
  const admin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const { error } = await admin.from('push_subscriptions').upsert(
    {
      user_id: userData.user.id,
      endpoint: body.endpoint,
      p256dh: body.p256dh,
      auth: body.auth,
      user_agent: body.userAgent ?? null,
    },
    { onConflict: 'endpoint' },
  );

  if (error) {
    console.error('[save-push-subscription] upsert failed', error);
    return new Response(error.message, { status: 500, headers: corsHeaders });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
