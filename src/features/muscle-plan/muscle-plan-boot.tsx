import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../entities/auth/auth-store';
import { useMusclePlanStore } from '../../entities/muscle-plan/muscle-plan-store';
import { GateScreen } from '../../shared/ui/gate-screen';

// Loads the user's muscle plan into the store before rendering muscle-plan
// screens. When requirePlan is set, redirects to the quiz if none exists yet.
export function MusclePlanBoot({ requirePlan = false, children }: PropsWithChildren<{ requirePlan?: boolean }>) {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const plan = useMusclePlanStore((state) => state.plan);
  const hasHydrated = useMusclePlanStore((state) => state.hasHydrated);
  const loadPlan = useMusclePlanStore((state) => state.loadPlan);

  useEffect(() => {
    if (userId) {
      void loadPlan(userId);
    }
  }, [userId, loadPlan]);

  if (!hasHydrated) {
    return <GateScreen title={t('musclePlan.loadingTitle')} copy={t('musclePlan.loadingCopy')} />;
  }

  if (requirePlan && !plan) {
    return <Navigate to="/muscle-plan/quiz" replace />;
  }

  return children;
}
