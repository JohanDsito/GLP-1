import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { deriveTreatmentProfile } from './derive-treatment-profile';
import type { AppLanguage, OnboardingAnswers, TreatmentProfile } from './types';

interface TreatmentProfileState {
  profile: TreatmentProfile | null;
  profileUserId: string | null;
  selectedLanguage: AppLanguage | null;
  onboardingComplete: boolean;
  hasHydrated: boolean;
  setProfile: (profile: TreatmentProfile, userId: string) => void;
  setProfileFromAnswers: (answers: OnboardingAnswers, userId: string) => void;
  setLanguage: (language: AppLanguage) => void;
  setSelectedLanguage: (language: AppLanguage) => void;
  resetProfile: () => void;
}

export const useTreatmentProfileStore = create<TreatmentProfileState>()(
  persist(
    (set) => ({
      profile: null,
      profileUserId: null,
      selectedLanguage: null,
      onboardingComplete: false,
      hasHydrated: false,
      setProfile: (profile, userId) =>
        set({
          profile,
          profileUserId: userId,
          selectedLanguage: profile.language,
          onboardingComplete: true,
        }),
      setProfileFromAnswers: (answers, userId) => {
        const profile = deriveTreatmentProfile(answers);
        return set({
          profile,
          profileUserId: userId,
          selectedLanguage: profile.language,
          onboardingComplete: true,
        });
      },
      setLanguage: (language) =>
        set((state) => ({
          selectedLanguage: language,
          profile: state.profile ? { ...state.profile, language } : state.profile,
        })),
      setSelectedLanguage: (language) =>
        set({
          selectedLanguage: language,
        }),
      resetProfile: () =>
        set({
          profile: null,
          profileUserId: null,
          onboardingComplete: false,
        }),
    }),
    {
      name: 'glp1-treatment-profile',
      onRehydrateStorage: () => () => {
        queueMicrotask(() => {
          useTreatmentProfileStore.setState({ hasHydrated: true });
        });
      },
    },
  ),
);
