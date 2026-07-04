import { useEffect } from 'react';
import { useAuthStore } from '../entities/auth/auth-store';
import { useSubscriptionStore } from '../entities/subscription/subscription-store';
import { useTreatmentProfileStore } from '../entities/treatment-profile/treatment-profile-store';
import { supabase } from '../lib/supabase/client';
import { fetchSubscriptionStatus } from '../lib/supabase/subscription';
import { fetchTreatmentProfile } from '../lib/supabase/treatment-profile';

export function SupabaseBootstrap() {
  const setSession = useAuthStore((state) => state.setSession);
  const setSubscriptionStatus = useSubscriptionStore((state) => state.setStatus);
  const hasHydrated = useTreatmentProfileStore((state) => state.hasHydrated);
  const resetProfile = useTreatmentProfileStore((state) => state.resetProfile);
  const setProfile = useTreatmentProfileStore((state) => state.setProfile);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      setSubscriptionStatus('inactive');
      return;
    }

    let mounted = true;
    let requestId = 0;

    async function loadSubscription(userId: string | undefined) {
      const nextRequestId = requestId + 1;
      requestId = nextRequestId;

      if (!userId) {
        setSubscriptionStatus('inactive');
        return;
      }

      setSubscriptionStatus('loading');

      try {
        const [status, profile] = await Promise.all([
          fetchSubscriptionStatus(userId),
          fetchTreatmentProfile(userId),
        ]);

        if (mounted && requestId === nextRequestId) {
          setSubscriptionStatus(status);
          if (profile) {
            setProfile(profile, userId);
          } else {
            const currentProfileUserId = useTreatmentProfileStore.getState().profileUserId;
            if (currentProfileUserId !== userId) {
              resetProfile();
            }
          }
        }
      } catch {
        if (mounted && requestId === nextRequestId) {
          setSubscriptionStatus('inactive');
        }
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        const currentProfileUserId = useTreatmentProfileStore.getState().profileUserId;
        if (hasHydrated && (!data.session || currentProfileUserId !== data.session.user.id)) {
          resetProfile();
        }

        setSession(data.session ?? null);
        void loadSubscription(data.session?.user.id);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentProfileUserId = useTreatmentProfileStore.getState().profileUserId;
      if (hasHydrated && (!session || currentProfileUserId !== session.user.id)) {
        resetProfile();
      }

      setSession(session);
      void loadSubscription(session?.user.id);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [hasHydrated, resetProfile, setProfile, setSession, setSubscriptionStatus]);

  return null;
}

