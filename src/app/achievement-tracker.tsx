import { useEffect, useRef, useState } from 'react';
import { evaluateEarnedAchievements } from '../entities/achievements/catalog';
import { useEngagementStore } from '../entities/achievements/engagement-store';
import { useAuthStore } from '../entities/auth/auth-store';
import { useTreatmentProfileStore } from '../entities/treatment-profile/treatment-profile-store';
import { fetchEarnedAchievements, insertAchievements } from '../lib/supabase/achievements';
import { fetchEngagement } from '../lib/supabase/engagement';
import { getFirstName } from '../lib/supabase/profile';
import { CelebrationModal } from '../shared/ui/celebration-modal';

/**
 * Runs once per app entry: recomputes streaks + achievements from the user's
 * tracking data, records any newly earned milestones, and celebrates them.
 */
export function AchievementTracker() {
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const firstName = getFirstName(user);
  const daysOnTreatment = useTreatmentProfileStore((state) => state.profile?.daysOnTreatment ?? null);
  const setEngagement = useEngagementStore((state) => state.setEngagement);
  const [celebrating, setCelebrating] = useState<string[]>([]);
  const ranForUser = useRef<string | null>(null);

  useEffect(() => {
    if (!userId || ranForUser.current === userId) {
      return;
    }
    ranForUser.current = userId;

    let cancelled = false;

    (async () => {
      try {
        const [{ stats }, earned] = await Promise.all([
          fetchEngagement(userId, daysOnTreatment),
          fetchEarnedAchievements(userId),
        ]);

        if (cancelled) {
          return;
        }

        const earnedSet = new Set(earned);
        const nowEarned = evaluateEarnedAchievements(stats);
        const newly = nowEarned.filter((code) => !earnedSet.has(code));

        if (newly.length > 0) {
          await insertAchievements(userId, newly);
        }

        const allEarned = Array.from(new Set([...earned, ...nowEarned]));
        setEngagement({
          currentStreak: stats.currentStreak,
          longestStreak: stats.longestStreak,
          earned: allEarned,
        });

        if (!cancelled && newly.length > 0) {
          setCelebrating(newly);
        }
      } catch {
        // Non-fatal: achievements are a bonus layer.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, daysOnTreatment, setEngagement]);

  if (celebrating.length === 0) {
    return null;
  }

  return <CelebrationModal codes={celebrating} firstName={firstName} onClose={() => setCelebrating([])} />;
}
