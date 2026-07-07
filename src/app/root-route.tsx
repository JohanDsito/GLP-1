import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../entities/auth/auth-store';
import { useSubscriptionStore } from '../entities/subscription/subscription-store';
import { useTreatmentProfileStore } from '../entities/treatment-profile/treatment-profile-store';
import { fetchSubscriptionStatus } from '../lib/supabase/subscription';
import { GateScreen } from '../shared/ui/gate-screen';

const CHECKOUT_POLL_ATTEMPTS = 15;
const CHECKOUT_POLL_INTERVAL_MS = 2000;

function isActiveStatus(status: string) {
  return status === 'active' || status === 'trialing';
}

export function RootRoute() {
  const { t } = useTranslation();
  const authStatus = useAuthStore((state) => state.status);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const subscriptionStatus = useSubscriptionStore((state) => state.status);
  const setSubscriptionStatus = useSubscriptionStore((state) => state.setStatus);
  const selectedLanguage = useTreatmentProfileStore((state) => state.selectedLanguage);
  const onboardingComplete = useTreatmentProfileStore((state) => state.onboardingComplete);
  const profileUserId = useTreatmentProfileStore((state) => state.profileUserId);
  const hasHydrated = useTreatmentProfileStore((state) => state.hasHydrated);

  const [isReturningFromCheckout] = useState(
    () => new URLSearchParams(window.location.search).get('checkout') === 'success',
  );
  const [isConfirmingCheckout, setIsConfirmingCheckout] = useState(isReturningFromCheckout);
  const hasPolledRef = useRef(false);

  useEffect(() => {
    if (isReturningFromCheckout && authStatus === 'unauthenticated') {
      setIsConfirmingCheckout(false);
    }
  }, [authStatus, isReturningFromCheckout]);

  useEffect(() => {
    if (!isReturningFromCheckout || hasPolledRef.current || !userId) {
      return;
    }

    hasPolledRef.current = true;
    window.history.replaceState(null, '', window.location.pathname);

    let cancelled = false;

    async function pollForActiveSubscription() {
      for (let attempt = 0; attempt < CHECKOUT_POLL_ATTEMPTS; attempt += 1) {
        try {
          const status = await fetchSubscriptionStatus(userId as string);
          if (cancelled) {
            return;
          }

          if (isActiveStatus(status)) {
            setSubscriptionStatus(status);
            setIsConfirmingCheckout(false);
            return;
          }
        } catch {
          // Keep retrying; a transient read failure shouldn't stop the poll.
        }

        await new Promise((resolve) => setTimeout(resolve, CHECKOUT_POLL_INTERVAL_MS));
      }

      if (!cancelled) {
        setIsConfirmingCheckout(false);
      }
    }

    void pollForActiveSubscription();

    return () => {
      cancelled = true;
    };
  }, [isReturningFromCheckout, setSubscriptionStatus, userId]);

  if (isConfirmingCheckout) {
    return <GateScreen title={t('gate.finalizingSubscription')} copy={t('gate.finalizingSubscriptionCopy')} />;
  }

  if (authStatus === 'loading' || subscriptionStatus === 'loading' || !hasHydrated) {
    return <GateScreen title={t('gate.checkingAccess')} copy={t('gate.confirmingSession')} />;
  }

  if (!selectedLanguage) {
    return <Navigate to="/select-language" replace />;
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to="/auth" replace />;
  }

  if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trialing') {
    return <Navigate to="/subscribe" replace />;
  }

  if (!hasHydrated) {
    return <GateScreen title={t('gate.preparingProfile')} copy={t('gate.loadingContext')} />;
  }

  if (!onboardingComplete || profileUserId !== userId) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}
