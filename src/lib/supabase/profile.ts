import type { User } from '@supabase/supabase-js';
import { supabase } from './client';

type ProfileMetadata = {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  date_of_birth?: string | null;
  sex?: string | null;
  terms_accepted_at?: string | null;
};

// Copy the name/registration details captured in auth user_metadata into the
// profiles table (once), so the server (reminders, reports) can read them.
export async function syncProfileFromUser(user: User): Promise<void> {
  if (!supabase) {
    return;
  }

  const meta = (user.user_metadata ?? {}) as ProfileMetadata;
  if (!meta.first_name && !meta.full_name) {
    return;
  }

  const { data: existing } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing?.first_name) {
    return;
  }

  await supabase.from('profiles').upsert(
    {
      user_id: user.id,
      first_name: meta.first_name ?? null,
      last_name: meta.last_name ?? null,
      full_name: meta.full_name ?? null,
      date_of_birth: meta.date_of_birth ?? null,
      sex: meta.sex ?? null,
      terms_accepted_at: meta.terms_accepted_at ?? null,
    },
    { onConflict: 'user_id' },
  );
}

export function getFirstName(user: User | null): string {
  const meta = (user?.user_metadata ?? {}) as ProfileMetadata;
  return meta.first_name?.trim() || '';
}

export async function fetchIsAdmin(userId: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean(data);
}
