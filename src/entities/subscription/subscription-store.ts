import { create } from 'zustand';

export type SubscriptionStatus = 'loading' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'inactive';

interface SubscriptionState {
  status: SubscriptionStatus;
  setStatus: (status: SubscriptionStatus) => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  status: 'loading',
  setStatus: (status) => set({ status }),
}));

