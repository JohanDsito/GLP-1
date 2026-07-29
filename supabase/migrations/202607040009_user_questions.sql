-- ============================================================================
-- User-submitted questions for the Q&A ("Preguntas") section
-- ============================================================================

create table if not exists public.user_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  status text not null default 'submitted'
    check (status in ('submitted', 'reviewed', 'answered', 'dismissed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_questions_user_id_idx on public.user_questions (user_id);
create index if not exists user_questions_status_idx on public.user_questions (status);

drop trigger if exists user_questions_set_updated_at on public.user_questions;
create trigger user_questions_set_updated_at
before update on public.user_questions
for each row
execute function public.set_updated_at();

alter table public.user_questions enable row level security;

drop policy if exists "User questions are readable by owner" on public.user_questions;
create policy "User questions are readable by owner"
on public.user_questions
for select
using (auth.uid() = user_id);

drop policy if exists "User questions are insertable by owner" on public.user_questions;
create policy "User questions are insertable by owner"
on public.user_questions
for insert
with check (auth.uid() = user_id);
