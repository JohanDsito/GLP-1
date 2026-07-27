-- ============================================================================
-- GLP-1 Muscle Plan: access flag + plan storage + workout sessions
-- ============================================================================

alter table public.subscriptions
  add column if not exists has_muscle_plan boolean not null default false;

-- One generated plan per user (12 weeks stored as jsonb).
create table if not exists public.muscle_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  quiz_answers jsonb not null default '{}'::jsonb,
  generated_plan jsonb not null default '[]'::jsonb,
  current_week integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists muscle_plans_user_id_idx on public.muscle_plans (user_id);

drop trigger if exists muscle_plans_set_updated_at on public.muscle_plans;
create trigger muscle_plans_set_updated_at
before update on public.muscle_plans
for each row
execute function public.set_updated_at();

alter table public.muscle_plans enable row level security;

drop policy if exists "Muscle plans are readable by owner" on public.muscle_plans;
create policy "Muscle plans are readable by owner"
on public.muscle_plans for select using (auth.uid() = user_id);

drop policy if exists "Muscle plans are insertable by owner" on public.muscle_plans;
create policy "Muscle plans are insertable by owner"
on public.muscle_plans for insert with check (auth.uid() = user_id);

drop policy if exists "Muscle plans are updatable by owner" on public.muscle_plans;
create policy "Muscle plans are updatable by owner"
on public.muscle_plans for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- Workout sessions
-- ============================================================================

create table if not exists public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.muscle_plans(id) on delete set null,
  session_date date not null default (now() at time zone 'utc')::date,
  week_number integer not null default 1,
  day_label text not null,
  exercises jsonb not null default '[]'::jsonb,
  completed boolean not null default false,
  duration_min integer,
  glp1_injection_day boolean not null default false,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists workout_sessions_user_id_idx on public.workout_sessions (user_id);
create index if not exists workout_sessions_date_idx on public.workout_sessions (session_date desc);

alter table public.workout_sessions enable row level security;

drop policy if exists "Workout sessions are readable by owner" on public.workout_sessions;
create policy "Workout sessions are readable by owner"
on public.workout_sessions for select using (auth.uid() = user_id);

drop policy if exists "Workout sessions are insertable by owner" on public.workout_sessions;
create policy "Workout sessions are insertable by owner"
on public.workout_sessions for insert with check (auth.uid() = user_id);

drop policy if exists "Workout sessions are updatable by owner" on public.workout_sessions;
create policy "Workout sessions are updatable by owner"
on public.workout_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
