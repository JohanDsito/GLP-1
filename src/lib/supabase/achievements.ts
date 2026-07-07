import { supabase } from './client';

export async function fetchEarnedAchievements(userId: string): Promise<string[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase.from('achievements').select('code').eq('user_id', userId);

  if (error) {
    throw error;
  }

  return (data as Array<{ code: string }>).map((row) => row.code);
}

export async function insertAchievements(userId: string, codes: string[]): Promise<void> {
  if (!supabase || codes.length === 0) {
    return;
  }

  const rows = codes.map((code) => ({ user_id: userId, code }));
  // Ignore conflicts in case of a race; the unique constraint protects us.
  await supabase.from('achievements').upsert(rows, { onConflict: 'user_id,code', ignoreDuplicates: true });
}
