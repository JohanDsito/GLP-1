import { createClient } from 'npm:@supabase/supabase-js@2.57.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const hotmartHottok = Deno.env.get('HOTMART_HOTTOK') ?? '';

// Hotmart events that grant / revoke access to the app.
const GRANT_EVENTS = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']);
const REVOKE_EVENTS = new Set(['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_PROTEST', 'PURCHASE_EXPIRED']);

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!supabaseUrl || !serviceRoleKey || !hotmartHottok) {
    return new Response('Missing environment variables', { status: 500 });
  }

  const rawBody = await request.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    payload = {};
  }

  // Validate the call really comes from Hotmart (hottok as header, body or query).
  const url = new URL(request.url);
  const receivedHottok =
    request.headers.get('x-hotmart-hottok') ??
    (payload as { hottok?: string }).hottok ??
    url.searchParams.get('hottok') ??
    '';

  if (receivedHottok !== hotmartHottok) {
    return new Response('Invalid hottok', { status: 401 });
  }

  const event = String((payload as { event?: string }).event ?? '').toUpperCase();
  const data = ((payload as { data?: Record<string, unknown> }).data ?? {}) as Record<string, unknown>;
  const buyer = (data.buyer ?? {}) as { email?: string; name?: string };
  const purchase = (data.purchase ?? {}) as { transaction?: string };
  const email = (buyer.email ?? '').trim().toLowerCase();

  if (!email) {
    // Test ping or missing buyer — acknowledge so Hotmart stops retrying.
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  if (GRANT_EVENTS.has(event)) {
    const { error } = await supabase.from('app_access').upsert(
      {
        email,
        active: true,
        source: 'hotmart',
        metadata: { name: buyer.name ?? null, transaction: purchase.transaction ?? null },
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' },
    );
    if (error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response(JSON.stringify({ received: true, action: 'granted' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (REVOKE_EVENTS.has(event)) {
    const { error } = await supabase
      .from('app_access')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('email', email);
    if (error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response(JSON.stringify({ received: true, action: 'revoked' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ received: true, ignored: event }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
