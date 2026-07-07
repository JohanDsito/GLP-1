-- ============================================================================
-- Daily check-ins (mood, energy, sleep) — the "seguimiento" pillar
-- ============================================================================

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  checkin_date date not null default (now() at time zone 'utc')::date,
  mood integer check (mood between 1 and 5),
  energy integer check (energy between 1 and 5),
  sleep_hours numeric(4, 1),
  sleep_quality integer check (sleep_quality between 1 and 5),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, checkin_date)
);

create index if not exists daily_checkins_user_id_idx on public.daily_checkins (user_id);
create index if not exists daily_checkins_date_idx on public.daily_checkins (checkin_date desc);

drop trigger if exists daily_checkins_set_updated_at on public.daily_checkins;
create trigger daily_checkins_set_updated_at
before update on public.daily_checkins
for each row
execute function public.set_updated_at();

alter table public.daily_checkins enable row level security;

drop policy if exists "Daily checkins are readable by owner" on public.daily_checkins;
create policy "Daily checkins are readable by owner"
on public.daily_checkins for select using (auth.uid() = user_id);

drop policy if exists "Daily checkins are insertable by owner" on public.daily_checkins;
create policy "Daily checkins are insertable by owner"
on public.daily_checkins for insert with check (auth.uid() = user_id);

drop policy if exists "Daily checkins are updatable by owner" on public.daily_checkins;
create policy "Daily checkins are updatable by owner"
on public.daily_checkins for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Daily checkins are deletable by owner" on public.daily_checkins;
create policy "Daily checkins are deletable by owner"
on public.daily_checkins for delete using (auth.uid() = user_id);

-- ============================================================================
-- Push subscriptions (Web Push)
-- ============================================================================

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;

drop policy if exists "Push subscriptions are readable by owner" on public.push_subscriptions;
create policy "Push subscriptions are readable by owner"
on public.push_subscriptions for select using (auth.uid() = user_id);

drop policy if exists "Push subscriptions are insertable by owner" on public.push_subscriptions;
create policy "Push subscriptions are insertable by owner"
on public.push_subscriptions for insert with check (auth.uid() = user_id);

drop policy if exists "Push subscriptions are deletable by owner" on public.push_subscriptions;
create policy "Push subscriptions are deletable by owner"
on public.push_subscriptions for delete using (auth.uid() = user_id);

-- ============================================================================
-- Reminder preferences
-- ============================================================================

create table if not exists public.reminder_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  dose_reminder_enabled boolean not null default false,
  dose_reminder_time time not null default '09:00',
  checkin_reminder_enabled boolean not null default false,
  checkin_reminder_time time not null default '20:00',
  timezone text not null default 'UTC',
  last_dose_reminded_on date,
  last_checkin_reminded_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists reminder_preferences_set_updated_at on public.reminder_preferences;
create trigger reminder_preferences_set_updated_at
before update on public.reminder_preferences
for each row
execute function public.set_updated_at();

alter table public.reminder_preferences enable row level security;

drop policy if exists "Reminder preferences are readable by owner" on public.reminder_preferences;
create policy "Reminder preferences are readable by owner"
on public.reminder_preferences for select using (auth.uid() = user_id);

drop policy if exists "Reminder preferences are insertable by owner" on public.reminder_preferences;
create policy "Reminder preferences are insertable by owner"
on public.reminder_preferences for insert with check (auth.uid() = user_id);

drop policy if exists "Reminder preferences are updatable by owner" on public.reminder_preferences;
create policy "Reminder preferences are updatable by owner"
on public.reminder_preferences for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
