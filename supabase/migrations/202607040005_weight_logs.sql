-- ============================================================================
-- Weight & body tracking — the primary outcome for GLP-1 users
-- ============================================================================
-- Weight is stored canonically in kilograms; the UI converts to lb for display.

create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  logged_on date not null default (now() at time zone 'utc')::date,
  weight_kg numeric(5, 2) not null check (weight_kg > 0 and weight_kg < 500),
  waist_cm numeric(5, 1),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, logged_on)
);

create index if not exists weight_logs_user_id_idx on public.weight_logs (user_id);
create index if not exists weight_logs_logged_on_idx on public.weight_logs (logged_on desc);

drop trigger if exists weight_logs_set_updated_at on public.weight_logs;
create trigger weight_logs_set_updated_at
before update on public.weight_logs
for each row
execute function public.set_updated_at();

alter table public.weight_logs enable row level security;

drop policy if exists "Weight logs are readable by owner" on public.weight_logs;
create policy "Weight logs are readable by owner"
on public.weight_logs for select using (auth.uid() = user_id);

drop policy if exists "Weight logs are insertable by owner" on public.weight_logs;
create policy "Weight logs are insertable by owner"
on public.weight_logs for insert with check (auth.uid() = user_id);

drop policy if exists "Weight logs are updatable by owner" on public.weight_logs;
create policy "Weight logs are updatable by owner"
on public.weight_logs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Weight logs are deletable by owner" on public.weight_logs;
create policy "Weight logs are deletable by owner"
on public.weight_logs for delete using (auth.uid() = user_id);
