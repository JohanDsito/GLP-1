-- ============================================================================
-- Hotmart access flow: helper to resolve an auth user id from an email so the
-- webhook can grant/revoke lifetime access. SECURITY DEFINER because auth.users
-- is not exposed through the API; only the service role calls this via RPC.
-- ============================================================================

create or replace function public.get_user_id_by_email(p_email text)
returns uuid
language sql
security definer
set search_path = public
as $$
  select id
  from auth.users
  where lower(email) = lower(p_email)
  limit 1;
$$;

revoke all on function public.get_user_id_by_email(text) from anon, authenticated;

-- Record which provider granted access (Stripe legacy / Hotmart).
alter table public.subscriptions
  add column if not exists provider text;
