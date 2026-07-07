import { useEffect } from 'react';
import { useAdminStore } from '../entities/admin/admin-store';
import { useAuthStore } from '../entities/auth/auth-store';
import { useSubscriptionStore } from '../entities/subscription/subscription-store';
import { useTreatmentProfileStore } from '../entities/treatment-profile/treatment-profile-store';
import { supabase } from '../lib/supabase/client';
import { fetchIsAdmin } from '../lib/supabase/profile';
import { fetchSubscriptionStatus } from '../lib/supabase/subscription';
import { fetchTreatmentProfile } from '../lib/supabase/treatment-profile';

function shouldResetProfile(currentProfileUserId: string | null, sessionUserId: string | undefined) {
  // Only clear a previously loaded profile when we know it belonged to a
  // *different* signed-in user (switching accounts) or the user signed out.
  // A null profileUserId just means onboarding hasn't happened yet for the
  // current user — that is not a reason to wipe language/profile state.
  if (!currentProfileUserId) {
    return false;
  }

  return currentProfileUserId !== sessionUserId;
}

export function SupabaseBootstrap() {
  const setSession = useAuthStore((state) => state.setSession);
  const setSubscriptionStatus = useSubscriptionStore((state) => state.setStatus);
  const setAdminStatus = useAdminStore((state) => state.setStatus);
  const hasHydrated = useTreatmentProfileStore((state) => state.hasHydrated);
  const resetProfile = useTreatmentProfileStore((state) => state.resetProfile);
  const setProfile = useTreatmentProfileStore((state) => state.setProfile);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      setSubscriptionStatus('inactive');
      setAdminStatus('not_admin');
      return;
    }

    let mounted = true;
    let requestId = 0;

    async function loadSubscription(userId: string | undefined) {
      const nextRequestId = requestId + 1;
      requestId = nextRequestId;

      if (!userId) {
        setSubscriptionStatus('inactive');
        setAdminStatus('not_admin');
        return;
      }

      setSubscriptionStatus('loading');
      setAdminStatus('loading');

      try {
        const [status, profile, isAdmin] = await Promise.all([
          fetchSubscriptionStatus(userId),
          fetchTreatmentProfile(userId),
          fetchIsAdmin(userId),
        ]);

        if (mounted && requestId === nextRequestId) {
          setSubscriptionStatus(status);
          setAdminStatus(isAdmin ? 'admin' : 'not_admin');
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
          setAdminStatus('not_admin');
        }
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        const currentProfileUserId = useTreatmentProfileStore.getState().profileUserId;
        if (hasHydrated && shouldResetProfile(currentProfileUserId, data.session?.user.id)) {
          resetProfile();
        }

        setSession(data.session ?? null);
        void loadSubscription(data.session?.user.id);
      }
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentProfileUserId = useTreatmentProfileStore.getState().profileUserId;
      if (hasHydrated && shouldResetProfile(currentProfileUserId, session?.user.id)) {
        resetProfile();
      }

      setSession(session);
      void loadSubscription(session?.user.id);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, [hasHydrated, resetProfile, setAdminStatus, setProfile, setSession, setSubscriptionStatus]);

  return null;
}

