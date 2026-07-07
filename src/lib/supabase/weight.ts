import { supabase } from './client';

export interface WeightLog {
  loggedOn: string;
  weightKg: number;
}

type WeightRow = {
  logged_on: string;
  weight_kg: number;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export const KG_PER_LB = 0.45359237;

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export async function fetchWeightLogs(userId: string): Promise<WeightLog[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('weight_logs')
    .select('logged_on, weight_kg')
    .eq('user_id', userId)
    .order('logged_on', { ascending: true })
    .limit(365);

  if (error) {
    throw error;
  }

  return (data as WeightRow[]).map((row) => ({ loggedOn: row.logged_on, weightKg: Number(row.weight_kg) }));
}

export async function upsertTodayWeight(userId: string, weightKg: number): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('weight_logs').upsert(
    {
      user_id: userId,
      logged_on: todayIso(),
      weight_kg: Number(weightKg.toFixed(2)),
    },
    { onConflict: 'user_id,logged_on' },
  );

  if (error) {
    throw error;
  }
}
