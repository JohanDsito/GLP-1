import { BarChart3, Languages, LogOut, RotateCcw, ShieldCheck, UserCog } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../entities/admin/admin-store';
import { useAuthStore } from '../../entities/auth/auth-store';
import { useSubscriptionStore } from '../../entities/subscription/subscription-store';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import { i18n, supportedLanguages } from '../../i18n';
import { openCustomerPortal } from '../../lib/stripe';
import { signOut } from '../../lib/supabase/auth';
import { saveTreatmentProfile } from '../../lib/supabase/treatment-profile';
import { ReminderSettings } from './reminder-settings';

export function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const subscriptionStatus = useSubscriptionStore((state) => state.status);
  const isAdmin = useAdminStore((state) => state.status === 'admin');
  const profile = useTreatmentProfileStore((state) => state.profile);
  const selectedLanguage = useTreatmentProfileStore((state) => state.selectedLanguage);
  const setLanguage = useTreatmentProfileStore((state) => state.setLanguage);
  const resetProfile = useTreatmentProfileStore((state) => state.resetProfile);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  async function handleSignOut() {
    await signOut();
    navigate('/auth', { replace: true });
  }

  async function handleManageBilling() {
    setPortalError(null);
    setIsOpeningPortal(true);
    const result = await openCustomerPortal();
    if (!result.ok) {
      setPortalError(result.error);
      setIsOpeningPortal(false);
    }
  }

  function handleResetOnboarding() {
    resetProfile();
    navigate('/onboarding', { replace: true });
  }

  async function handleLanguageChange(language: (typeof supportedLanguages)[number]) {
    setLanguage(language);

    if (userId && profile) {
      try {
        await saveTreatmentProfile(userId, { ...profile, language });
      } catch {
        // Keep the UI responsive even if saving language fails.
      }
    }

    await i18n.changeLanguage(language);
  }

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('settings.session')}</div>
        <h1 className="page-title">{t('settings.title')}</h1>
        <p className="page-subtitle">{t('settings.subtitle')}</p>
      </div>

      <div className="grid cards">
        <article className="panel pad">
          <div className="panel-header">
            <div>
              <div className="pill primary">{t('settings.account')}</div>
              <p className="panel-copy">{user?.email ?? t('settings.noEmailLoaded')}</p>
            </div>
            <UserCog className="icon" />
          </div>
          <div className="stack">
            <div className="list-item">
              <div>
                <div className="list-item-title">{t('settings.subscription')}</div>
                <div className="list-item-copy">{subscriptionStatus}</div>
              </div>
              <ShieldCheck className="icon" />
            </div>
            {subscriptionStatus === 'active' || subscriptionStatus === 'trialing' || subscriptionStatus === 'past_due' ? (
              <div className="stack" style={{ gap: 8 }}>
                <button
                  className="cta secondary"
                  type="button"
                  onClick={() => void handleManageBilling()}
                  disabled={isOpeningPortal}
                >
                  {isOpeningPortal ? t('settings.openingBilling') : t('settings.manageBilling')}
                </button>
                {portalError ? <div className="auth-alert">{portalError}</div> : null}
              </div>
            ) : null}
            <div className="list-item">
              <div>
                <div className="list-item-title">{t('settings.currentLanguage')}</div>
                <div className="list-item-copy">{(selectedLanguage ?? profile?.language ?? i18n.language).toUpperCase()}</div>
              </div>
              <Languages className="icon" />
            </div>
            {isAdmin ? (
              <Link className="cta secondary" to="/insights">
                <BarChart3 className="icon" />
                {t('settings.viewInsights')}
              </Link>
            ) : null}
          </div>
        </article>

        <article className="panel pad">
          <div className="panel-header">
            <div>
              <div className="pill accent">{t('settings.experience')}</div>
              <p className="panel-copy">{t('settings.languageHelp')}</p>
            </div>
            <RotateCcw className="icon" />
          </div>
          <div className="stack">
            <label className="stack" style={{ gap: 8 }}>
              <span className="onboarding-step">{t('settings.language')}</span>
              <select
                className="auth-input"
                value={selectedLanguage ?? profile?.language ?? i18n.language}
                onChange={(event) => void handleLanguageChange(event.target.value as (typeof supportedLanguages)[number])}
              >
                {supportedLanguages.map((language) => (
                  <option key={language} value={language}>
                    {t(`languageNames.${language}`)}
                  </option>
                ))}
              </select>
            </label>
            <button className="cta secondary" type="button" onClick={handleResetOnboarding}>
              {t('settings.resetOnboarding')}
            </button>
            <button className="cta" type="button" onClick={handleSignOut}>
              <LogOut className="icon" />
              {t('settings.signOut')}
            </button>
          </div>
        </article>

        <ReminderSettings />
      </div>
    </main>
  );
}
