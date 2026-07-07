import { supabase } from './client';

export interface DoseEntry {
  id: string;
  dosage: string;
  scheduledFor: string;
  takenAt: string | null;
  status: string;
}

type DoseRow = {
  id: string;
  dosage: string;
  scheduled_for: string;
  taken_at: string | null;
  status: string;
};

function rowToDose(row: DoseRow): DoseEntry {
  return {
    id: row.id,
    dosage: row.dosage,
    scheduledFor: row.scheduled_for,
    takenAt: row.taken_at,
    status: row.status,
  };
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

// Monday-based start of the current week, as an ISO date string.
function startOfWeekIso(): string {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // 0 = Monday
  now.setDate(now.getDate() - day);
  return now.toISOString().slice(0, 10);
}

export async function fetchRecentDoses(userId: string): Promise<DoseEntry[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('doses')
    .select('id, dosage, scheduled_for, taken_at, status')
    .eq('user_id', userId)
    .order('scheduled_for', { ascending: false })
    .limit(20);

  if (error) {
    throw error;
  }

  return (data as DoseRow[]).map(rowToDose);
}

export async function hasLoggedForPeriod(userId: string, frequency: 'weekly' | 'daily' | 'other'): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const since = frequency === 'daily' ? todayIso() : startOfWeekIso();

  const { count, error } = await supabase
    .from('doses')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'taken')
    .gte('scheduled_for', since);

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}

export async function logDose(userId: string, dosage: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('doses').insert({
    user_id: userId,
    dosage,
    scheduled_for: todayIso(),
    taken_at: new Date().toISOString(),
    status: 'taken',
  });

  if (error) {
    throw error;
  }
}
