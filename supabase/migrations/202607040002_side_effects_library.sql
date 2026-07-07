-- ============================================================================
-- Side-effect library metadata on the existing symptoms reference table
-- ============================================================================

alter table public.symptoms
  add column if not exists category text not null default 'physical'
    check (category in ('physical', 'psychological')),
  add column if not exists review_status text not null default 'draft'
    check (review_status in ('draft', 'reviewed')),
  add column if not exists display_order integer not null default 0;

create index if not exists symptoms_category_idx on public.symptoms (category);

-- ============================================================================
-- Treatment profile additions: prescribed dose text + chosen primary symptom
-- ============================================================================

alter table public.treatment_profiles
  add column if not exists medication_dose_text text,
  add column if not exists primary_symptom_code text;

-- ============================================================================
-- Side effect requests ("Informativo" feedback mechanism)
-- ============================================================================

create table if not exists public.side_effect_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category_guess text check (category_guess in ('physical', 'psychological', 'unsure')),
  query_text text not null,
  notes text,
  status text not null default 'submitted'
    check (status in ('submitted', 'reviewed', 'added', 'dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists side_effect_requests_user_id_idx on public.side_effect_requests (user_id);
create index if not exists side_effect_requests_status_idx on public.side_effect_requests (status);

drop trigger if exists side_effect_requests_set_updated_at on public.side_effect_requests;
create trigger side_effect_requests_set_updated_at
before update on public.side_effect_requests
for each row
execute function public.set_updated_at();

alter table public.side_effect_requests enable row level security;

drop policy if exists "Side effect requests are readable by owner" on public.side_effect_requests;
create policy "Side effect requests are readable by owner"
on public.side_effect_requests
for select
using (auth.uid() = user_id);

drop policy if exists "Side effect requests are insertable by owner" on public.side_effect_requests;
create policy "Side effect requests are insertable by owner"
on public.side_effect_requests
for insert
with check (auth.uid() = user_id);

-- ============================================================================
-- Seed phase-1 side-effect codes (content lives in i18n, not here)
-- ============================================================================

insert into public.symptoms (code, display_name, category, review_status, display_order)
values
  ('nausea', 'Nausea', 'physical', 'draft', 1),
  ('vomiting', 'Vomiting', 'physical', 'draft', 2),
  ('constipation', 'Constipation', 'physical', 'draft', 3),
  ('diarrhea', 'Diarrhea', 'physical', 'draft', 4),
  ('fatigue', 'Fatigue', 'physical', 'draft', 5),
  ('hairLoss', 'Hair loss', 'physical', 'draft', 6),
  ('dehydration', 'Dehydration', 'physical', 'draft', 7),
  ('reflux', 'Reflux / heartburn', 'physical', 'draft', 8),
  ('muscleLoss', 'Muscle loss / loose skin', 'physical', 'draft', 9),
  ('headache', 'Headache', 'physical', 'draft', 10),
  ('moodSwings', 'Mood swings', 'psychological', 'draft', 1),
  ('anxiety', 'Anxiety', 'psychological', 'draft', 2),
  ('lowMotivation', 'Low motivation / apathy', 'psychological', 'draft', 3),
  ('insomnia', 'Insomnia', 'psychological', 'draft', 4),
  ('foodRelationship', 'Altered relationship with food', 'psychological', 'draft', 5)
on conflict (code) do update set
  category = excluded.category,
  display_order = excluded.display_order;
