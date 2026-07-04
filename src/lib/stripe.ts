import { supabase } from './supabase/client';

export const isStripeConfigured = Boolean(supabase);

type CheckoutResult = { ok: true } | { ok: false; error: string };

export async function openCheckout(): Promise<CheckoutResult> {
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabase.functions.invoke<{ url: string }>('create-checkout-session', {
    method: 'POST',
  });

  if (error || !data?.url) {
    return { ok: false, error: error?.message ?? 'Unable to start checkout.' };
  }

  window.location.assign(data.url);
  return { ok: true };
}

export async function openCustomerPortal(): Promise<CheckoutResult> {
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const { data, error } = await supabase.functions.invoke<{ url: string }>('create-portal-session', {
    method: 'POST',
  });

  if (error || !data?.url) {
    return { ok: false, error: error?.message ?? 'Unable to open the customer portal.' };
  }

  window.location.assign(data.url);
  return { ok: true };
}
