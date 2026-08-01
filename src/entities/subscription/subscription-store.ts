import { create } from 'zustand';

export type SubscriptionStatus = 'loading' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive';

/** Whether the signed-in user's email is allowed into the app (Hotmart buyer or admin). */
export type AccessStatus = 'loading' | 'granted' | 'denied';

interface SubscriptionState {
  status: SubscriptionStatus;
  hasMuscle: boolean;
  accessStatus: AccessStatus;
  setStatus: (status: SubscriptionStatus) => void;
  setHasMuscle: (hasMuscle: boolean) => void;
  setAccessStatus: (accessStatus: AccessStatus) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  status: 'loading',
  hasMuscle: false,
  accessStatus: 'loading',
  setStatus: (status) => set({ status }),
  setHasMuscle: (hasMuscle) => set({ hasMuscle }),
  setAccessStatus: (accessStatus) => set({ accessStatus }),
}));
