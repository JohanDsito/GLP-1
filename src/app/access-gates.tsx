import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAdminStore } from '../entities/admin/admin-store';
import { useAuthStore } from '../entities/auth/auth-store';
import { useSubscriptionStore } from '../entities/subscription/subscription-store';
import { useTreatmentProfileStore } from '../entities/treatment-profile/treatment-profile-store';
import { GateScreen } from '../shared/ui/gate-screen';

function LoadingGate() {
  const { t } = useTranslation();

  return (
    <GateScreen title={t('gate.checkingAccess')} copy={t('gate.confirmingSession')} />
  );
}

export function RequirePaidAccess({ children }: PropsWithChildren) {
  const authStatus = useAuthStore((state) => state.status);
  const subscriptionStatus = useSubscriptionStore((state) => state.status);
  const hasHydrated = useTreatmentProfileStore((state) => state.hasHydrated);

  if (authStatus === 'loading' || subscriptionStatus === 'loading' || !hasHydrated) {
    return <LoadingGate />;
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/auth" replace />;
  }

  if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
}

export function RequireAuthPageAccess({ children }: PropsWithChildren) {
  const authStatus = useAuthStore((state) => state.status);
  const subscriptionStatus = useSubscriptionStore((state) => state.status);

  if (authStatus === 'loading' || subscriptionStatus === 'loading') {
    return <LoadingGate />;
  }

  if (authStatus === 'authenticated' && (subscriptionStatus === 'active' || subscriptionStatus === 'trialing')) {
    return <Navigate to="/" replace />;
  }

  if (authStatus === 'authenticated' && subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
}

export function RequireSubscriptionPageAccess({ children }: PropsWithChildren) {
  const authStatus = useAuthStore((state) => state.status);
  const subscriptionStatus = useSubscriptionStore((state) => state.status);

  if (authStatus === 'loading' || subscriptionStatus === 'loading') {
    return <LoadingGate />;
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/auth" replace />;
  }

  if (subscriptionStatus === 'active' || subscriptionStatus === 'trialing') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function RequireLanguageSelection({ children }: PropsWithChildren) {
  const selectedLanguage = useTreatmentProfileStore((state) => state.selectedLanguage);
  const hasHydrated = useTreatmentProfileStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <LoadingGate />;
  }

  if (!selectedLanguage) {
    return <Navigate to="/select-language" replace />;
  }

  return children;
}

export function RequireMusclePlanAccess({ children }: PropsWithChildren) {
  const hasMuscle = useSubscriptionStore((state) => state.hasMuscle);
  const subscriptionStatus = useSubscriptionStore((state) => state.status);

  if (subscriptionStatus === 'loading') {
    return <LoadingGate />;
  }

  // The exercise section is a locked add-on: unlocked by a coupon or a separate
  // purchase. Users without it are sent to the upgrade/unlock screen.
  if (!hasMuscle) {
    return <Navigate to="/muscle-plan/upgrade" replace />;
  }

  return children;
}

export function RequireAdmin({ children }: PropsWithChildren) {
  const adminStatus = useAdminStore((state) => state.status);

  if (adminStatus === 'loading') {
    return <LoadingGate />;
  }

  if (adminStatus !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function RequireAppAccess({ children }: PropsWithChildren) {
  const onboardingComplete = useTreatmentProfileStore((state) => state.onboardingComplete);
  const profileUserId = useTreatmentProfileStore((state) => state.profileUserId);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const hasHydrated = useTreatmentProfileStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return <LoadingGate />;
  }

  if (!onboardingComplete || profileUserId !== userId) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}
