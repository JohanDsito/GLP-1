import type { SideEffect } from '../../entities/side-effects/types';
import { supabase } from './client';

type SymptomRow = {
  id: string;
  code: string;
  category: string;
  review_status: string;
  severity_scale_min: number;
  severity_scale_max: number;
  display_order: number;
};

type SymptomRecordRow = {
  symptom_id: string;
  severity: number;
  recorded_at: string;
};

function rowToSideEffect(row: SymptomRow): SideEffect {
  return {
    id: row.id,
    code: row.code,
    category: row.category as SideEffect['category'],
    reviewStatus: row.review_status as SideEffect['reviewStatus'],
    severityScaleMin: row.severity_scale_min,
    severityScaleMax: row.severity_scale_max,
    displayOrder: row.display_order,
  };
}

export async function fetchActiveSideEffects(): Promise<SideEffect[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('symptoms')
    .select('id, code, category, review_status, severity_scale_min, severity_scale_max, display_order')
    .eq('active', true)
    .order('display_order', { ascending: true });

  if (error) {
    throw error;
  }

  return (data as SymptomRow[]).map(rowToSideEffect);
}

export async function fetchRecentSymptomRecords(
  userId: string,
): Promise<Array<{ symptomId: string; severity: number; recordedAt: string }>> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('symptom_records')
    .select('symptom_id, severity, recorded_at')
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return (data as SymptomRecordRow[]).map((row) => ({
    symptomId: row.symptom_id,
    severity: row.severity,
    recordedAt: row.recorded_at,
  }));
}

export async function logSymptomRecord(userId: string, symptomId: string, severity: number, notes?: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('symptom_records').insert({
    user_id: userId,
    symptom_id: symptomId,
    severity,
    notes: notes ?? null,
  });

  if (error) {
    throw error;
  }
}

function todayBounds() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

// Today's records keyed by symptom_id (latest severity chosen today).
export async function fetchTodaySymptomRecords(userId: string): Promise<Record<string, number>> {
  if (!supabase) {
    return {};
  }

  const { start, end } = todayBounds();
  const { data, error } = await supabase
    .from('symptom_records')
    .select('symptom_id, severity')
    .eq('user_id', userId)
    .gte('recorded_at', start)
    .lt('recorded_at', end);

  if (error) {
    throw error;
  }

  const result: Record<string, number> = {};
  for (const row of (data as Array<{ symptom_id: string; severity: number }>) ?? []) {
    result[row.symptom_id] = row.severity;
  }
  return result;
}

// One-per-day semantics: replace today's records with the current selection.
export async function saveDailySymptoms(
  userId: string,
  severitiesById: Record<string, number>,
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { start, end } = todayBounds();
  const { error: deleteError } = await supabase
    .from('symptom_records')
    .delete()
    .eq('user_id', userId)
    .gte('recorded_at', start)
    .lt('recorded_at', end);

  if (deleteError) {
    throw deleteError;
  }

  const rows = Object.entries(severitiesById)
    .filter(([, severity]) => severity > 0)
    .map(([symptomId, severity]) => ({ user_id: userId, symptom_id: symptomId, severity }));

  if (rows.length === 0) {
    return;
  }

  const { error: insertError } = await supabase.from('symptom_records').insert(rows);
  if (insertError) {
    throw insertError;
  }
}
