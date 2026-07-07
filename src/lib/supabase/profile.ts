import { supabase } from './client';

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
