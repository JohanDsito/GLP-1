-- ============================================================================
-- Registration profile fields (name, date of birth, sex, terms acceptance)
-- ============================================================================
-- Collected at sign-up (stored in auth user_metadata) and synced into
-- public.profiles on first authenticated load so the server (reminders,
-- reports) can read them.

alter table public.profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists date_of_birth date,
  add column if not exists sex text check (sex in ('female', 'male', 'other', 'prefer_not')),
  add column if not exists terms_accepted_at timestamptz;
