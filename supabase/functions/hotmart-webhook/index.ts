import { createClient } from 'npm:@supabase/supabase-js@2.57.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const hotmartHottok = Deno.env.get('HOTMART_HOTTOK') ?? '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') ?? '';
const resendFrom = Deno.env.get('RESEND_FROM') ?? 'Lumea <onboarding@resend.dev>';
const appUrl = Deno.env.get('APP_URL') ?? '';
// Optional: a separate Hotmart product for the exercise (Muscle Plan) add-on.
// When a purchase matches this product id, only the exercise section is unlocked.
const musclePlanProductId = Deno.env.get('HOTMART_MUSCLE_PRODUCT_ID') ?? '';

// Hotmart events that grant / revoke lifetime access.
const GRANT_EVENTS = new Set(['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']);
const REVOKE_EVENTS = new Set(['PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_PROTEST', 'PURCHASE_EXPIRED']);

function generatePassword(): string {
  // 12 chars, no ambiguous characters, always readable in an email.
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

async function sendCredentialsEmail(email: string, password: string, name: string | null): Promise<void> {
  if (!resendApiKey) {
    console.warn('[hotmart] RESEND_API_KEY not set — skipping credentials email');
    return;
  }

  const greeting = name ? `Hola ${name},` : 'Hola,';
  const loginUrl = appUrl || 'https://tu-app.com';

  const html = `
    <div style="font-family: -apple-system, Segoe UI, sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #00685f;">Tu acceso a Lumea está listo</h2>
      <p>${greeting}</p>
      <p>¡Gracias por tu compra! Ya puedes entrar a la aplicación con estas credenciales:</p>
      <div style="background: #f2f6f5; border-radius: 12px; padding: 16px; margin: 16px 0;">
        <p style="margin: 0 0 8px;"><strong>Correo:</strong> ${email}</p>
        <p style="margin: 0;"><strong>Contraseña:</strong> ${password}</p>
      </div>
      <p><a href="${loginUrl}" style="display: inline-block; background: #00685f; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 999px; font-weight: 700;">Entrar a Lumea</a></p>
      <p style="color: #666; font-size: 13px;">Por seguridad, te recomendamos cambiar tu contraseña desde Configuración una vez dentro.</p>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: resendFrom,
      to: [email],
      subject: 'Tu acceso a Lumea — credenciales de entrada',
      html,
    }),
  });

  if (!response.ok) {
    console.error('[hotmart] Resend email failed', await response.text());
  }
}

Deno.serve(async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  if (!supabaseUrl || !serviceRoleKey || !hotmartHottok) {
    return new Response('Missing environment variables', { status: 500 });
  }

  const rawBody = await request.text();

  // Validate that the call really comes from Hotmart: the hottok can arrive as a
  // header (webhook 2.0) or inside the JSON body / query string (older setups).
  let payload: Record<string, unknown> = {};
  try {
    payload = rawBody ? JSON.parse(rawBody) : {};
  } catch {
    payload = {};
  }

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
  const product = (data.product ?? {}) as { id?: string | number };
  const email = (buyer.email ?? '').trim().toLowerCase();

  // Does this purchase correspond to the standalone exercise (Muscle Plan) product?
  const isMuscleProduct =
    Boolean(musclePlanProductId) && String(product.id ?? '') === String(musclePlanProductId);

  if (!email) {
    // Nothing to do (e.g. a test ping) — acknowledge so Hotmart stops retrying.
    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });

  async function findUserId(): Promise<string | null> {
    const { data: rpcData, error } = await supabase.rpc('get_user_id_by_email', { p_email: email });
    if (error) {
      console.error('[hotmart] get_user_id_by_email failed', error.message);
      return null;
    }
    return (rpcData as string | null) ?? null;
  }

  // ── Revoke access on refund / chargeback ──────────────────────────────────
  if (REVOKE_EVENTS.has(event)) {
    const userId = await findUserId();
    if (userId) {
      await supabase.from('subscriptions').update({ status: 'inactive', synced_at: new Date().toISOString() }).eq('user_id', userId);
    }
    return new Response(JSON.stringify({ received: true, action: 'revoked' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── Grant lifetime access on approved purchase ────────────────────────────
  if (GRANT_EVENTS.has(event)) {
    let userId = await findUserId();
    let newAccount = false;

    if (!userId) {
      const password = generatePassword();
      const { data: created, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { first_name: buyer.name ?? '' },
      });

      if (createError || !created.user) {
        console.error('[hotmart] createUser failed', createError?.message);
        return new Response('Could not create user', { status: 500 });
      }

      userId = created.user.id;
      newAccount = true;
      await sendCredentialsEmail(email, password, buyer.name ?? null);
    }

    // Main product → lifetime app access. Standalone exercise product → only
    // unlock the Muscle Plan add-on (the exercise section is a separate purchase).
    const row = isMuscleProduct
      ? { user_id: userId, has_muscle_plan: true }
      : { user_id: userId, status: 'active' };

    const { error: upsertError } = await supabase.from('subscriptions').upsert(
      {
        ...row,
        provider: 'hotmart',
        metadata: { provider: 'hotmart', transaction: purchase.transaction ?? null, product: String(product.id ?? '') },
        synced_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );

    if (upsertError) {
      console.error('[hotmart] subscriptions upsert failed', upsertError.message);
      return new Response(upsertError.message, { status: 500 });
    }

    return new Response(JSON.stringify({ received: true, action: 'granted', newAccount }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Any other event: acknowledge without acting.
  return new Response(JSON.stringify({ received: true, ignored: event }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
