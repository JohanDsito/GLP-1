export type AchievementType = 'streak' | 'weight' | 'consistency' | 'tenure';

export interface AchievementDef {
  code: string;
  type: AchievementType;
  emoji: string;
  /** Value required on the relevant metric to unlock. */
  threshold: number;
}

export interface EngagementStats {
  currentStreak: number;
  longestStreak: number;
  weightLossPct: number | null;
  totalCheckins: number;
  daysOnTreatment: number | null;
}

// Ordered so "next milestone" logic can walk the list per type.
export const achievementCatalog: AchievementDef[] = [
  { code: 'streak_3', type: 'streak', emoji: '🔥', threshold: 3 },
  { code: 'streak_7', type: 'streak', emoji: '🔥', threshold: 7 },
  { code: 'streak_14', type: 'streak', emoji: '🔥', threshold: 14 },
  { code: 'streak_30', type: 'streak', emoji: '🔥', threshold: 30 },
  { code: 'streak_60', type: 'streak', emoji: '🔥', threshold: 60 },
  { code: 'streak_100', type: 'streak', emoji: '🔥', threshold: 100 },
  { code: 'weight_first', type: 'weight', emoji: '⚖️', threshold: 0.1 },
  { code: 'weight_3pct', type: 'weight', emoji: '⚖️', threshold: 3 },
  { code: 'weight_5pct', type: 'weight', emoji: '🏅', threshold: 5 },
  { code: 'weight_10pct', type: 'weight', emoji: '🏆', threshold: 10 },
  { code: 'checkins_7', type: 'consistency', emoji: '✅', threshold: 7 },
  { code: 'checkins_30', type: 'consistency', emoji: '✅', threshold: 30 },
  { code: 'tenure_1w', type: 'tenure', emoji: '📅', threshold: 7 },
  { code: 'tenure_1m', type: 'tenure', emoji: '📅', threshold: 30 },
  { code: 'tenure_3m', type: 'tenure', emoji: '📅', threshold: 90 },
];

function metricForType(type: AchievementType, stats: EngagementStats): number | null {
  switch (type) {
    case 'streak':
      return Math.max(stats.currentStreak, stats.longestStreak);
    case 'weight':
      return stats.weightLossPct;
    case 'consistency':
      return stats.totalCheckins;
    case 'tenure':
      return stats.daysOnTreatment;
  }
}

/** Codes the user has earned given their current stats. */
export function evaluateEarnedAchievements(stats: EngagementStats): string[] {
  return achievementCatalog
    .filter((def) => {
      const metric = metricForType(def.type, stats);
      return metric != null && metric >= def.threshold;
    })
    .map((def) => def.code);
}

export function getAchievementDef(code: string): AchievementDef | undefined {
  return achievementCatalog.find((def) => def.code === code);
}
