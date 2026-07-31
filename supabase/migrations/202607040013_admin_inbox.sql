-- ============================================================================
-- Admin inbox: let admins read all user questions and side-effect requests
-- (with the submitter's email) and mark them as handled. Reads go through
-- SECURITY DEFINER functions so we can join auth.users for the email.
-- ============================================================================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

grant execute on function public.is_admin() to authenticated;

-- ── Listing functions (admin-only; empty for everyone else) ─────────────────
create or replace function public.admin_list_user_questions()
returns table (id uuid, created_at timestamptz, email text, question text, status text)
language sql
security definer
set search_path = public
as $$
  select q.id, q.created_at, u.email::text, q.question, q.status
  from public.user_questions q
  join auth.users u on u.id = q.user_id
  where public.is_admin()
  order by q.created_at desc;
$$;

grant execute on function public.admin_list_user_questions() to authenticated;

create or replace function public.admin_list_side_effect_requests()
returns table (id uuid, created_at timestamptz, email text, category_guess text, query_text text, notes text, status text)
language sql
security definer
set search_path = public
as $$
  select r.id, r.created_at, u.email::text, r.category_guess, r.query_text, r.notes, r.status
  from public.side_effect_requests r
  join auth.users u on u.id = r.user_id
  where public.is_admin()
  order by r.created_at desc;
$$;

grant execute on function public.admin_list_side_effect_requests() to authenticated;

-- ── Admin policies to read/update status directly ───────────────────────────
drop policy if exists "Admins read user questions" on public.user_questions;
create policy "Admins read user questions" on public.user_questions
  for select using (public.is_admin());

drop policy if exists "Admins update user questions" on public.user_questions;
create policy "Admins update user questions" on public.user_questions
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read side effect requests" on public.side_effect_requests;
create policy "Admins read side effect requests" on public.side_effect_requests
  for select using (public.is_admin());

drop policy if exists "Admins update side effect requests" on public.side_effect_requests;
create policy "Admins update side effect requests" on public.side_effect_requests
  for update using (public.is_admin()) with check (public.is_admin());
