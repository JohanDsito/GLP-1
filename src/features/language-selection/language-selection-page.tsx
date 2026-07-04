import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import type { AppLanguage } from '../../entities/treatment-profile/types';
import { i18n, supportedLanguages } from '../../i18n';

export function LanguageSelectionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const selectedLanguage = useTreatmentProfileStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useTreatmentProfileStore((state) => state.setSelectedLanguage);
  const [language, setLanguage] = useState<AppLanguage>(selectedLanguage ?? supportedLanguages[0]);

  useEffect(() => {
    if (selectedLanguage) {
      setLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  function handleContinue() {
    setSelectedLanguage(language);
    navigate('/', { replace: true });
  }

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('languageSelection.title')}</div>
        <h1 className="page-title">{t('languageSelection.subtitle')}</h1>
        <p className="page-subtitle">{t('languageSelection.help')}</p>
      </div>

      <section className="panel pad">
        <div className="stack">
          {supportedLanguages.map((option) => (
            <button
              key={option}
              type="button"
              className={option === language ? 'onboarding-option selected' : 'onboarding-option'}
              onClick={() => setLanguage(option)}
            >
              <div className="onboarding-option-title">{t(`languageNames.${option}`)}</div>
              <div className="onboarding-option-copy">
                {option === language ? t('languageSelection.selected') : t('languageSelection.choose')}
              </div>
            </button>
          ))}
        </div>

        <button className="cta" type="button" onClick={handleContinue}>
          {t('languageSelection.continue')}
        </button>
      </section>
    </main>
  );
}
