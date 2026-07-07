import { supabase } from './client';

export interface DailyCheckin {
  mood: number | null;
  energy: number | null;
  sleepHours: number | null;
  sleepQuality: number | null;
}

type CheckinRow = {
  mood: number | null;
  energy: number | null;
  sleep_hours: number | null;
  sleep_quality: number | null;
};

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function fetchTodayCheckin(userId: string): Promise<DailyCheckin | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('mood, energy, sleep_hours, sleep_quality')
    .eq('user_id', userId)
    .eq('checkin_date', todayIso())
    .maybeSingle<CheckinRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return {
    mood: data.mood,
    energy: data.energy,
    sleepHours: data.sleep_hours,
    sleepQuality: data.sleep_quality,
  };
}

export interface CheckinHistoryEntry {
  date: string;
  mood: number | null;
  energy: number | null;
  sleepHours: number | null;
  sleepQuality: number | null;
}

export async function fetchCheckinHistory(userId: string): Promise<CheckinHistoryEntry[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('checkin_date, mood, energy, sleep_hours, sleep_quality')
    .eq('user_id', userId)
    .order('checkin_date', { ascending: true })
    .limit(180);

  if (error) {
    throw error;
  }

  return (data as Array<CheckinRow & { checkin_date: string }>).map((row) => ({
    date: row.checkin_date,
    mood: row.mood,
    energy: row.energy,
    sleepHours: row.sleep_hours,
    sleepQuality: row.sleep_quality,
  }));
}

export async function upsertTodayCheckin(userId: string, checkin: DailyCheckin): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('daily_checkins').upsert(
    {
      user_id: userId,
      checkin_date: todayIso(),
      mood: checkin.mood,
      energy: checkin.energy,
      sleep_hours: checkin.sleepHours,
      sleep_quality: checkin.sleepQuality,
    },
    { onConflict: 'user_id,checkin_date' },
  );

  if (error) {
    throw error;
  }
}
