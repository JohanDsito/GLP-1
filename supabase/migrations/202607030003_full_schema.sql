create extension if not exists pgcrypto;

-- ============================================================================
-- Helpers
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.touch_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- Profiles
-- ============================================================================

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  locale text not null default 'en',
  timezone text,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Profiles are readable by owner" on public.profiles;
create policy "Profiles are readable by owner"
on public.profiles
for select
using (auth.uid() = user_id);

drop policy if exists "Profiles are insertable by owner" on public.profiles;
create policy "Profiles are insertable by owner"
on public.profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "Profiles are updatable by owner" on public.profiles;
create policy "Profiles are updatable by owner"
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Profiles are deletable by owner" on public.profiles;
create policy "Profiles are deletable by owner"
on public.profiles
for delete
using (auth.uid() = user_id);

-- ============================================================================
-- Treatment profile
-- ============================================================================

create table if not exists public.treatment_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stage text not null,
  symptom_profile text not null default 'none',
  intent text not null,
  medication text not null default 'unknown',
  goal text not null,
  language text not null default 'en',
  days_on_treatment integer,
  dose_frequency text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists treatment_profiles_user_id_idx on public.treatment_profiles (user_id);
create index if not exists treatment_profiles_stage_idx on public.treatment_profiles (stage);
create index if not exists treatment_profiles_goal_idx on public.treatment_profiles (goal);

drop trigger if exists treatment_profiles_set_updated_at on public.treatment_profiles;
create trigger treatment_profiles_set_updated_at
before update on public.treatment_profiles
for each row
execute function public.set_updated_at();

alter table public.treatment_profiles enable row level security;

drop policy if exists "Treatment profiles are readable by owner" on public.treatment_profiles;
create policy "Treatment profiles are readable by owner"
on public.treatment_profiles
for select
using (auth.uid() = user_id);

drop policy if exists "Treatment profiles are insertable by owner" on public.treatment_profiles;
create policy "Treatment profiles are insertable by owner"
on public.treatment_profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "Treatment profiles are updatable by owner" on public.treatment_profiles;
create policy "Treatment profiles are updatable by owner"
on public.treatment_profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Treatment profiles are deletable by owner" on public.treatment_profiles;
create policy "Treatment profiles are deletable by owner"
on public.treatment_profiles
for delete
using (auth.uid() = user_id);

-- ============================================================================
-- Reference data
-- ============================================================================

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text not null,
  route text,
  dosing_pattern text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists medications_set_updated_at on public.medications;
create trigger medications_set_updated_at
before update on public.medications
for each row
execute function public.set_updated_at();

alter table public.medications enable row level security;

drop policy if exists "Medications are readable by authenticated users" on public.medications;
create policy "Medications are readable by authenticated users"
on public.medications
for select
to authenticated
using (true);

create table if not exists public.conditions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists conditions_set_updated_at on public.conditions;
create trigger conditions_set_updated_at
before update on public.conditions
for each row
execute function public.set_updated_at();

alter table public.conditions enable row level security;

drop policy if exists "Conditions are readable by authenticated users" on public.conditions;
create policy "Conditions are readable by authenticated users"
on public.conditions
for select
to authenticated
using (true);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists goals_set_updated_at on public.goals;
create trigger goals_set_updated_at
before update on public.goals
for each row
execute function public.set_updated_at();

alter table public.goals enable row level security;

drop policy if exists "Goals are readable by authenticated users" on public.goals;
create policy "Goals are readable by authenticated users"
on public.goals
for select
to authenticated
using (true);

create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists languages_set_updated_at on public.languages;
create trigger languages_set_updated_at
before update on public.languages
for each row
execute function public.set_updated_at();

alter table public.languages enable row level security;

drop policy if exists "Languages are readable by authenticated users" on public.languages;
create policy "Languages are readable by authenticated users"
on public.languages
for select
to authenticated
using (true);

-- ============================================================================
-- Core tracking
-- ============================================================================

create table if not exists public.doses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  medication_id uuid references public.medications(id) on delete set null,
  dosage text not null,
  scheduled_for date not null,
  taken_at timestamptz,
  notes text,
  status text not null default 'scheduled',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists doses_user_id_idx on public.doses (user_id);
create index if not exists doses_scheduled_for_idx on public.doses (scheduled_for);
create index if not exists doses_status_idx on public.doses (status);

drop trigger if exists doses_set_updated_at on public.doses;
create trigger doses_set_updated_at
before update on public.doses
for each row
execute function public.set_updated_at();

alter table public.doses enable row level security;

drop policy if exists "Doses are readable by owner" on public.doses;
create policy "Doses are readable by owner"
on public.doses
for select
using (auth.uid() = user_id);

drop policy if exists "Doses are insertable by owner" on public.doses;
create policy "Doses are insertable by owner"
on public.doses
for insert
with check (auth.uid() = user_id);

drop policy if exists "Doses are updatable by owner" on public.doses;
create policy "Doses are updatable by owner"
on public.doses
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Doses are deletable by owner" on public.doses;
create policy "Doses are deletable by owner"
on public.doses
for delete
using (auth.uid() = user_id);

create table if not exists public.symptoms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  display_name text not null,
  severity_scale_min integer not null default 0,
  severity_scale_max integer not null default 4,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists symptoms_set_updated_at on public.symptoms;
create trigger symptoms_set_updated_at
before update on public.symptoms
for each row
execute function public.set_updated_at();

alter table public.symptoms enable row level security;

drop policy if exists "Symptoms are readable by authenticated users" on public.symptoms;
create policy "Symptoms are readable by authenticated users"
on public.symptoms
for select
to authenticated
using (true);

create table if not exists public.symptom_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symptom_id uuid not null references public.symptoms(id) on delete restrict,
  severity integer not null check (severity between 0 and 4),
  recorded_at timestamptz not null default now(),
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists symptom_records_user_id_idx on public.symptom_records (user_id);
create index if not exists symptom_records_symptom_id_idx on public.symptom_records (symptom_id);
create index if not exists symptom_records_recorded_at_idx on public.symptom_records (recorded_at desc);

drop trigger if exists symptom_records_set_updated_at on public.symptom_records;
create trigger symptom_records_set_updated_at
before update on public.symptom_records
for each row
execute function public.set_updated_at();

alter table public.symptom_records enable row level security;

drop policy if exists "Symptom records are readable by owner" on public.symptom_records;
create policy "Symptom records are readable by owner"
on public.symptom_records
for select
using (auth.uid() = user_id);

drop policy if exists "Symptom records are insertable by owner" on public.symptom_records;
create policy "Symptom records are insertable by owner"
on public.symptom_records
for insert
with check (auth.uid() = user_id);

drop policy if exists "Symptom records are updatable by owner" on public.symptom_records;
create policy "Symptom records are updatable by owner"
on public.symptom_records
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Symptom records are deletable by owner" on public.symptom_records;
create policy "Symptom records are deletable by owner"
on public.symptom_records
for delete
using (auth.uid() = user_id);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid references public.treatment_profiles(id) on delete set null,
  title text not null,
  body text not null,
  priority text not null default 'medium',
  surface text not null default 'dashboard',
  reason text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recommendations_user_id_idx on public.recommendations (user_id);
create index if not exists recommendations_priority_idx on public.recommendations (priority);

drop trigger if exists recommendations_set_updated_at on public.recommendations;
create trigger recommendations_set_updated_at
before update on public.recommendations
for each row
execute function public.set_updated_at();

alter table public.recommendations enable row level security;

drop policy if exists "Recommendations are readable by owner" on public.recommendations;
create policy "Recommendations are readable by owner"
on public.recommendations
for select
using (auth.uid() = user_id);

drop policy if exists "Recommendations are insertable by owner" on public.recommendations;
create policy "Recommendations are insertable by owner"
on public.recommendations
for insert
with check (auth.uid() = user_id);

drop policy if exists "Recommendations are updatable by owner" on public.recommendations;
create policy "Recommendations are updatable by owner"
on public.recommendations
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Recommendations are deletable by owner" on public.recommendations;
create policy "Recommendations are deletable by owner"
on public.recommendations
for delete
using (auth.uid() = user_id);

create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  severity text not null default 'info',
  title text not null,
  body text not null,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists alerts_user_id_idx on public.alerts (user_id);
create index if not exists alerts_read_at_idx on public.alerts (read_at);

drop trigger if exists alerts_set_updated_at on public.alerts;
create trigger alerts_set_updated_at
before update on public.alerts
for each row
execute function public.set_updated_at();

alter table public.alerts enable row level security;

drop policy if exists "Alerts are readable by owner" on public.alerts;
create policy "Alerts are readable by owner"
on public.alerts
for select
using (auth.uid() = user_id);

drop policy if exists "Alerts are insertable by owner" on public.alerts;
create policy "Alerts are insertable by owner"
on public.alerts
for insert
with check (auth.uid() = user_id);

drop policy if exists "Alerts are updatable by owner" on public.alerts;
create policy "Alerts are updatable by owner"
on public.alerts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Alerts are deletable by owner" on public.alerts;
create policy "Alerts are deletable by owner"
on public.alerts
for delete
using (auth.uid() = user_id);

create table if not exists public.medical_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid references public.treatment_profiles(id) on delete set null,
  report_period_start date not null,
  report_period_end date not null,
  storage_path text,
  summary text,
  generated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists medical_reports_user_id_idx on public.medical_reports (user_id);
create index if not exists medical_reports_period_idx on public.medical_reports (report_period_start, report_period_end);

drop trigger if exists medical_reports_set_updated_at on public.medical_reports;
create trigger medical_reports_set_updated_at
before update on public.medical_reports
for each row
execute function public.set_updated_at();

alter table public.medical_reports enable row level security;

drop policy if exists "Medical reports are readable by owner" on public.medical_reports;
create policy "Medical reports are readable by owner"
on public.medical_reports
for select
using (auth.uid() = user_id);

drop policy if exists "Medical reports are insertable by owner" on public.medical_reports;
create policy "Medical reports are insertable by owner"
on public.medical_reports
for insert
with check (auth.uid() = user_id);

drop policy if exists "Medical reports are updatable by owner" on public.medical_reports;
create policy "Medical reports are updatable by owner"
on public.medical_reports
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Medical reports are deletable by owner" on public.medical_reports;
create policy "Medical reports are deletable by owner"
on public.medical_reports
for delete
using (auth.uid() = user_id);

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  due_at timestamptz not null,
  done_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reminders_user_id_idx on public.reminders (user_id);
create index if not exists reminders_due_at_idx on public.reminders (due_at);

drop trigger if exists reminders_set_updated_at on public.reminders;
create trigger reminders_set_updated_at
before update on public.reminders
for each row
execute function public.set_updated_at();

alter table public.reminders enable row level security;

drop policy if exists "Reminders are readable by owner" on public.reminders;
create policy "Reminders are readable by owner"
on public.reminders
for select
using (auth.uid() = user_id);

drop policy if exists "Reminders are insertable by owner" on public.reminders;
create policy "Reminders are insertable by owner"
on public.reminders
for insert
with check (auth.uid() = user_id);

drop policy if exists "Reminders are updatable by owner" on public.reminders;
create policy "Reminders are updatable by owner"
on public.reminders
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Reminders are deletable by owner" on public.reminders;
create policy "Reminders are deletable by owner"
on public.reminders
for delete
using (auth.uid() = user_id);

-- ============================================================================
-- Quizzes
-- ============================================================================

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null,
  title text not null,
  completed_at timestamptz,
  answers jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quizzes_user_id_idx on public.quizzes (user_id);
create index if not exists quizzes_slug_idx on public.quizzes (slug);

drop trigger if exists quizzes_set_updated_at on public.quizzes;
create trigger quizzes_set_updated_at
before update on public.quizzes
for each row
execute function public.set_updated_at();

alter table public.quizzes enable row level security;

drop policy if exists "Quizzes are readable by owner" on public.quizzes;
create policy "Quizzes are readable by owner"
on public.quizzes
for select
using (auth.uid() = user_id);

drop policy if exists "Quizzes are insertable by owner" on public.quizzes;
create policy "Quizzes are insertable by owner"
on public.quizzes
for insert
with check (auth.uid() = user_id);

drop policy if exists "Quizzes are updatable by owner" on public.quizzes;
create policy "Quizzes are updatable by owner"
on public.quizzes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Quizzes are deletable by owner" on public.quizzes;
create policy "Quizzes are deletable by owner"
on public.quizzes
for delete
using (auth.uid() = user_id);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  code text not null,
  prompt text not null,
  answer_type text not null,
  order_index integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists questions_quiz_id_idx on public.questions (quiz_id);
create index if not exists questions_order_index_idx on public.questions (order_index);

drop trigger if exists questions_set_updated_at on public.questions;
create trigger questions_set_updated_at
before update on public.questions
for each row
execute function public.set_updated_at();

alter table public.questions enable row level security;

drop policy if exists "Questions are readable through their quiz owner" on public.questions;
create policy "Questions are readable through their quiz owner"
on public.questions
for select
using (
  exists (
    select 1
    from public.quizzes q
    where q.id = quiz_id
      and q.user_id = auth.uid()
  )
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  value text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists answers_user_id_idx on public.answers (user_id);
create index if not exists answers_question_id_idx on public.answers (question_id);

drop trigger if exists answers_set_updated_at on public.answers;
create trigger answers_set_updated_at
before update on public.answers
for each row
execute function public.set_updated_at();

alter table public.answers enable row level security;

drop policy if exists "Answers are readable by owner" on public.answers;
create policy "Answers are readable by owner"
on public.answers
for select
using (auth.uid() = user_id);

drop policy if exists "Answers are insertable by owner" on public.answers;
create policy "Answers are insertable by owner"
on public.answers
for insert
with check (auth.uid() = user_id);

drop policy if exists "Answers are updatable by owner" on public.answers;
create policy "Answers are updatable by owner"
on public.answers
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Answers are deletable by owner" on public.answers;
create policy "Answers are deletable by owner"
on public.answers
for delete
using (auth.uid() = user_id);

-- ============================================================================
-- Subscription
-- ============================================================================

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  price_id text,
  status text not null default 'inactive',
  cancel_at_period_end boolean not null default false,
  current_period_end timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_status_idx on public.subscriptions (status);
create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions (stripe_customer_id);
create index if not exists subscriptions_stripe_subscription_id_idx on public.subscriptions (stripe_subscription_id);

drop trigger if exists subscriptions_set_updated_at on public.subscriptions;
create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row
execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

drop policy if exists "Subscriptions are readable by owner" on public.subscriptions;
create policy "Subscriptions are readable by owner"
on public.subscriptions
for select
using (auth.uid() = user_id);

drop policy if exists "Subscriptions are insertable by service role or owner" on public.subscriptions;
create policy "Subscriptions are insertable by service role or owner"
on public.subscriptions
for insert
with check (auth.uid() = user_id or auth.role() = 'service_role');

drop policy if exists "Subscriptions are updatable by service role or owner" on public.subscriptions;
create policy "Subscriptions are updatable by service role or owner"
on public.subscriptions
for update
using (auth.uid() = user_id or auth.role() = 'service_role')
with check (auth.uid() = user_id or auth.role() = 'service_role');

drop policy if exists "Subscriptions are deletable by service role or owner" on public.subscriptions;
create policy "Subscriptions are deletable by service role or owner"
on public.subscriptions
for delete
using (auth.uid() = user_id or auth.role() = 'service_role');

-- ============================================================================
-- Notifications
-- ============================================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  channel text not null default 'in_app',
  sent_at timestamptz,
  read_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx on public.notifications (user_id);
create index if not exists notifications_read_at_idx on public.notifications (read_at);

drop trigger if exists notifications_set_updated_at on public.notifications;
create trigger notifications_set_updated_at
before update on public.notifications
for each row
execute function public.set_updated_at();

alter table public.notifications enable row level security;

drop policy if exists "Notifications are readable by owner" on public.notifications;
create policy "Notifications are readable by owner"
on public.notifications
for select
using (auth.uid() = user_id);

drop policy if exists "Notifications are insertable by owner" on public.notifications;
create policy "Notifications are insertable by owner"
on public.notifications
for insert
with check (auth.uid() = user_id);

drop policy if exists "Notifications are updatable by owner" on public.notifications;
create policy "Notifications are updatable by owner"
on public.notifications
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Notifications are deletable by owner" on public.notifications;
create policy "Notifications are deletable by owner"
on public.notifications
for delete
using (auth.uid() = user_id);

-- ============================================================================
-- Views
-- ============================================================================

create or replace view public.v_subscription_status as
select
  s.user_id,
  s.status,
  s.current_period_end,
  s.cancel_at_period_end,
  s.synced_at
from public.subscriptions s;

create or replace view public.v_treatment_profile_summary as
select
  tp.user_id,
  tp.stage,
  tp.symptom_profile,
  tp.intent,
  tp.medication,
  tp.goal,
  tp.language,
  tp.days_on_treatment,
  tp.dose_frequency,
  tp.updated_at
from public.treatment_profiles tp;

-- ============================================================================
-- Seed data
-- ============================================================================

insert into public.medications (code, display_name, route, dosing_pattern)
values
  ('semaglutide', 'Semaglutide', 'subcutaneous', 'weekly'),
  ('tirzepatide', 'Tirzepatide', 'subcutaneous', 'weekly'),
  ('liraglutide', 'Liraglutide', 'subcutaneous', 'daily')
on conflict (code) do nothing;

insert into public.languages (code, display_name)
values
  ('en', 'English'),
  ('es', 'Spanish'),
  ('pt', 'Portuguese')
on conflict (code) do nothing;

