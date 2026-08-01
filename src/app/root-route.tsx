import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../entities/auth/auth-store';
import { useTreatmentProfileStore } from '../entities/treatment-profile/treatment-profile-store';
import { GateScreen } from '../shared/ui/gate-screen';

export function RootRoute() {
  const { t } = useTranslation();
  const authStatus = useAuthStore((state) => state.status);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const selectedLanguage = useTreatmentProfileStore((state) => state.selectedLanguage);
  const onboardingComplete = useTreatmentProfileStore((state) => state.onboardingComplete);
  const profileUserId = useTreatmentProfileStore((state) => state.profileUserId);
  const hasHydrated = useTreatmentProfileStore((state) => state.hasHydrated);

  if (authStatus === 'loading' || !hasHydrated) {
    return <GateScreen title={t('gate.checkingAccess')} copy={t('gate.confirmingSession')} />;
  }

  if (!selectedLanguage) {
    return <Navigate to="/select-language" replace />;
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/auth" replace />;
  }

  // Access is controlled upstream (Hotmart / MemberApp); a signed-in user goes
  // straight to onboarding or the app — no in-app payment step.
  if (!onboardingComplete || profileUserId !== userId) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
