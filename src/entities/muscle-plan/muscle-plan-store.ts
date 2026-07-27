import { create } from 'zustand';
import {
  fetchMusclePlan,
  fetchWorkoutSessions,
  insertWorkoutSession,
  updateCurrentWeek,
  updateSessionInjectionDay,
  upsertMusclePlan,
} from '../../lib/supabase/muscle-plan';
import type { MusclePlan, WorkoutSession } from './types';

interface MusclePlanState {
  plan: MusclePlan | null;
  sessions: WorkoutSession[];
  isLoading: boolean;
  hasHydrated: boolean;
  loadPlan: (userId: string) => Promise<void>;
  savePlan: (
    userId: string,
    quizAnswers: MusclePlan['quizAnswers'],
    weeks: MusclePlan['weeks'],
    currentWeek: number,
  ) => Promise<void>;
  loadSessions: (userId: string) => Promise<void>;
  logSession: (session: Omit<WorkoutSession, 'id' | 'createdAt'>) => Promise<void>;
  markInjectionDay: (sessionId: string, isInjectionDay: boolean) => Promise<void>;
  setCurrentWeek: (userId: string, week: number) => Promise<void>;
}

export const useMusclePlanStore = create<MusclePlanState>((set, get) => ({
  plan: null,
  sessions: [],
  isLoading: false,
  hasHydrated: false,

  loadPlan: async (userId) => {
    set({ isLoading: true });
    try {
      const plan = await fetchMusclePlan(userId);
      set({ plan, hasHydrated: true, isLoading: false });
    } catch {
      set({ isLoading: false, hasHydrated: true });
    }
  },

  savePlan: async (userId, quizAnswers, weeks, currentWeek) => {
    set({ isLoading: true });
    try {
      const plan = await upsertMusclePlan(userId, quizAnswers, weeks, currentWeek);
      set({ plan, isLoading: false, hasHydrated: true });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  loadSessions: async (userId) => {
    try {
      const sessions = await fetchWorkoutSessions(userId);
      set({ sessions });
    } catch {
      // Non-fatal.
    }
  },

  logSession: async (session) => {
    const created = await insertWorkoutSession(session);
    if (created) {
      set({ sessions: [created, ...get().sessions] });
    }
  },

  markInjectionDay: async (sessionId, isInjectionDay) => {
    await updateSessionInjectionDay(sessionId, isInjectionDay);
    set({
      sessions: get().sessions.map((s) => (s.id === sessionId ? { ...s, glp1InjectionDay: isInjectionDay } : s)),
    });
  },

  setCurrentWeek: async (userId, week) => {
    await updateCurrentWeek(userId, week);
    const plan = get().plan;
    if (plan) {
      set({ plan: { ...plan, currentWeek: week } });
    }
  },
}));
