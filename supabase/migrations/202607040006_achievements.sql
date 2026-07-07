-- ============================================================================
-- Achievements — milestones a user has unlocked (streaks, weight, consistency)
-- ============================================================================
-- Earned achievements are stored so celebration happens exactly once and
-- badges persist across devices. What counts as "earned" is evaluated client
-- side from the user's own tracking data; this table is just the record.

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  code text not null,
  achieved_at timestamptz not null default now(),
  unique (user_id, code)
);

create index if not exists achievements_user_id_idx on public.achievements (user_id);

alter table public.achievements enable row level security;

drop policy if exists "Achievements are readable by owner" on public.achievements;
create policy "Achievements are readable by owner"
on public.achievements for select using (auth.uid() = user_id);

drop policy if exists "Achievements are insertable by owner" on public.achievements;
create policy "Achievements are insertable by owner"
on public.achievements for insert with check (auth.uid() = user_id);
