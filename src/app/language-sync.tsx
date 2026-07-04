import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTreatmentProfileStore } from '../entities/treatment-profile/treatment-profile-store';
import { i18n, supportedLanguages } from '../i18n';

export function LanguageSync() {
  const { i18n: translation } = useTranslation();
  const selectedLanguage = useTreatmentProfileStore((state) => state.selectedLanguage);
  const profileLanguage = useTreatmentProfileStore((state) => state.profile?.language);
  const fallbackLanguage = supportedLanguages[0];

  useEffect(() => {
    const nextLanguage =
      selectedLanguage && supportedLanguages.includes(selectedLanguage)
        ? selectedLanguage
        : profileLanguage && supportedLanguages.includes(profileLanguage)
        ? profileLanguage
        : fallbackLanguage;

    if (translation.language !== nextLanguage) {
      void i18n.changeLanguage(nextLanguage);
    }
  }, [fallbackLanguage, profileLanguage, selectedLanguage, translation.language]);

  return null;
}

