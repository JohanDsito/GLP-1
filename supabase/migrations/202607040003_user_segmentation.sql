-- ============================================================================
-- Admin users
-- ============================================================================
-- A dedicated table (not a profiles.is_admin column) so there is no RLS path
-- for a user to grant themselves admin: users may only READ their own row,
-- and only the service role / Supabase dashboard can write.

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

drop policy if exists "Admin users can read their own row" on public.admin_users;
create policy "Admin users can read their own row"
on public.admin_users
for select
using (auth.uid() = user_id);

-- No insert/update/delete policies for regular users on purpose.

-- ============================================================================
-- Aggregated segmentation (admins only, aggregates only — never individual PII)
-- ============================================================================

create or replace function public.get_user_segmentation()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not exists (select 1 from public.admin_users where user_id = auth.uid()) then
    raise exception 'Not authorized';
  end if;

  select jsonb_build_object(
    'totalProfiles', (select count(*) from public.treatment_profiles),
    'byIntent', (
      select coalesce(jsonb_object_agg(intent, cnt), '{}'::jsonb)
      from (select intent, count(*) as cnt from public.treatment_profiles group by intent) s
    ),
    'bySymptomProfile', (
      select coalesce(jsonb_object_agg(symptom_profile, cnt), '{}'::jsonb)
      from (select symptom_profile, count(*) as cnt from public.treatment_profiles group by symptom_profile) s
    ),
    'byTimeBucket', (
      select coalesce(jsonb_object_agg(bucket, cnt), '{}'::jsonb)
      from (
        select
          case
            when days_on_treatment is null then 'unknown'
            when days_on_treatment = 0 then 'researching'
            when days_on_treatment <= 7 then 'lt_1_week'
            when days_on_treatment <= 28 then 'wk_1_4'
            when days_on_treatment <= 90 then 'mo_1_3'
            when days_on_treatment <= 180 then 'mo_3_6'
            else 'mo_6_plus'
          end as bucket,
          count(*) as cnt
        from public.treatment_profiles
        group by 1
      ) s
    ),
    'topSymptoms', (
      select coalesce(jsonb_object_agg(code, cnt), '{}'::jsonb)
      from (
        select code, count(*) as cnt
        from public.treatment_profiles tp
        cross join lateral jsonb_array_elements_text(coalesce(tp.metadata->'symptomCodes', '[]'::jsonb)) as code
        where code <> 'none'
        group by code
        order by cnt desc
        limit 15
      ) s
    ),
    'pendingRequests', (
      select count(*) from public.side_effect_requests where status = 'submitted'
    )
  )
  into result;

  return result;
end;
$$;

grant execute on function public.get_user_segmentation() to authenticated;
