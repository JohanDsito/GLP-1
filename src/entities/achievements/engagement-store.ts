import { create } from 'zustand';

interface EngagementState {
  currentStreak: number;
  longestStreak: number;
  earned: string[];
  loaded: boolean;
  setEngagement: (value: { currentStreak: number; longestStreak: number; earned: string[] }) => void;
}

export const useEngagementStore = create<EngagementState>((set) => ({
  currentStreak: 0,
  longestStreak: 0,
  earned: [],
  loaded: false,
  setEngagement: (value) => set({ ...value, loaded: true }),
}));
