import { create } from 'zustand';

export type SubscriptionStatus = 'loading' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive';

interface SubscriptionState {
  status: SubscriptionStatus;
  hasMuscle: boolean;
  setStatus: (status: SubscriptionStatus) => void;
  setHasMuscle: (hasMuscle: boolean) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  status: 'loading',
  hasMuscle: false,
  setStatus: (status) => set({ status }),
  setHasMuscle: (hasMuscle) => set({ hasMuscle }),
}));
