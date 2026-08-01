-- ============================================================================
-- Access allowlist by email: only people whose email bought on Hotmart (or an
-- admin) can enter the app. The Hotmart webhook writes here; the app checks it
-- through has_app_access(), which reads the caller's email from their JWT.
-- ============================================================================

create table if not exists public.app_access (
  email text primary key,
  active boolean not null default true,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  granted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.app_access enable row level security;
-- No end-user policies: the table stays private. Writes happen with the service
-- role (webhook); reads happen through has_app_access() (security definer).

create or replace function public.has_app_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (select 1 from public.admin_users where user_id = auth.uid())
    or exists (
      select 1 from public.app_access
      where active = true
        and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

grant execute on function public.has_app_access() to authenticated;
