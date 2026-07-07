import { supabase } from './client';

export interface ReminderPreferences {
  doseReminderEnabled: boolean;
  doseReminderTime: string;
  checkinReminderEnabled: boolean;
  checkinReminderTime: string;
  timezone: string;
}

type ReminderRow = {
  dose_reminder_enabled: boolean;
  dose_reminder_time: string;
  checkin_reminder_enabled: boolean;
  checkin_reminder_time: string;
  timezone: string;
};

export const defaultReminderPreferences: ReminderPreferences = {
  doseReminderEnabled: false,
  doseReminderTime: '09:00',
  checkinReminderEnabled: false,
  checkinReminderTime: '20:00',
  timezone: 'UTC',
};

function browserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export async function fetchReminderPreferences(userId: string): Promise<ReminderPreferences> {
  if (!supabase) {
    return { ...defaultReminderPreferences, timezone: browserTimezone() };
  }

  const { data, error } = await supabase
    .from('reminder_preferences')
    .select('dose_reminder_enabled, dose_reminder_time, checkin_reminder_enabled, checkin_reminder_time, timezone')
    .eq('user_id', userId)
    .maybeSingle<ReminderRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return { ...defaultReminderPreferences, timezone: browserTimezone() };
  }

  return {
    doseReminderEnabled: data.dose_reminder_enabled,
    doseReminderTime: data.dose_reminder_time.slice(0, 5),
    checkinReminderEnabled: data.checkin_reminder_enabled,
    checkinReminderTime: data.checkin_reminder_time.slice(0, 5),
    timezone: data.timezone,
  };
}

export async function saveReminderPreferences(userId: string, prefs: ReminderPreferences): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('reminder_preferences').upsert(
    {
      user_id: userId,
      dose_reminder_enabled: prefs.doseReminderEnabled,
      dose_reminder_time: prefs.doseReminderTime,
      checkin_reminder_enabled: prefs.checkinReminderEnabled,
      checkin_reminder_time: prefs.checkinReminderTime,
      timezone: prefs.timezone || browserTimezone(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    throw error;
  }
}
