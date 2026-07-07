import type { EngagementStats } from '../../entities/achievements/catalog';
import { fetchCheckinHistory } from './checkins';
import { fetchRecentDoses } from './doses';
import { fetchRecentSymptomRecords } from './symptoms';
import { fetchWeightLogs } from './weight';

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return toIsoDate(date);
}

export function computeStreaks(activityDates: string[]): { current: number; longest: number } {
  const set = new Set(activityDates);
  const sorted = [...set].sort();

  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of sorted) {
    if (prev && addDays(prev, 1) === day) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    prev = day;
  }

  // Current streak counts back from today; if today isn't logged yet, the
  // streak is still "alive" as long as yesterday was logged.
  const today = toIsoDate(new Date());
  let cursor = set.has(today) ? today : addDays(today, -1);
  let current = 0;
  while (set.has(cursor)) {
    current += 1;
    cursor = addDays(cursor, -1);
  }

  return { current, longest };
}

export async function fetchEngagement(
  userId: string,
  daysOnTreatment: number | null,
): Promise<{ stats: EngagementStats; activityDates: string[] }> {
  const [checkins, doses, symptomRecords, weights] = await Promise.all([
    fetchCheckinHistory(userId),
    fetchRecentDoses(userId),
    fetchRecentSymptomRecords(userId),
    fetchWeightLogs(userId),
  ]);

  const activityDates = new Set<string>();
  for (const c of checkins) activityDates.add(c.date);
  for (const d of doses) activityDates.add(d.scheduledFor.slice(0, 10));
  for (const r of symptomRecords) activityDates.add(r.recordedAt.slice(0, 10));
  for (const w of weights) activityDates.add(w.loggedOn.slice(0, 10));

  const dates = [...activityDates];
  const { current, longest } = computeStreaks(dates);

  let weightLossPct: number | null = null;
  if (weights.length >= 2) {
    const start = weights[0].weightKg;
    const latest = weights[weights.length - 1].weightKg;
    if (start > 0) {
      weightLossPct = ((start - latest) / start) * 100;
    }
  }

  return {
    stats: {
      currentStreak: current,
      longestStreak: longest,
      weightLossPct,
      totalCheckins: checkins.length,
      daysOnTreatment,
    },
    activityDates: dates,
  };
}
