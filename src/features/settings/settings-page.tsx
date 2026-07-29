import { BarChart3, KeyRound, Languages, LogOut, RotateCcw, ShieldCheck, UserCog } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminStore } from '../../entities/admin/admin-store';
import { useAuthStore } from '../../entities/auth/auth-store';
import { useSubscriptionStore } from '../../entities/subscription/subscription-store';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import { i18n, supportedLanguages } from '../../i18n';
import { getFirstName } from '../../lib/supabase/profile';
import { signOut, updatePassword } from '../../lib/supabase/auth';
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
  const [newPassword, setNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<'idle' | 'success' | 'error' | 'short'>('idle');

  async function handleSignOut() {
    await signOut();
    navigate('/auth', { replace: true });
  }

  async function handleChangePassword() {
    if (newPassword.trim().length < 8) {
      setPasswordStatus('short');
      return;
    }
    setSavingPassword(true);
    setPasswordStatus('idle');
    try {
      const { error } = await updatePassword(newPassword);
      setPasswordStatus(error ? 'error' : 'success');
      if (!error) {
        setNewPassword('');
      }
    } catch {
      setPasswordStatus('error');
    } finally {
      setSavingPassword(false);
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
              {getFirstName(user) ? <div className="list-item-title">{getFirstName(user)}</div> : null}
              <p className="panel-copy">{user?.email ?? t('settings.noEmailLoaded')}</p>
            </div>
            <UserCog className="icon" />
          </div>
          <div className="stack">
            <div className="list-item">
              <div>
                <div className="list-item-title">{t('settings.subscription')}</div>
                <div className="list-item-copy">
                  {subscriptionStatus === 'active' || subscriptionStatus === 'trialing'
                    ? t('settings.lifetimeActive')
                    : t('settings.accessInactive')}
                </div>
              </div>
              <ShieldCheck className="icon" />
            </div>
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
              <div className="pill primary">{t('settings.security')}</div>
              <p className="panel-copy">{t('settings.changePasswordHelp')}</p>
            </div>
            <KeyRound className="icon" />
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <label className="stack" style={{ gap: 8 }}>
              <span className="onboarding-step">{t('settings.newPassword')}</span>
              <input
                className="auth-input"
                type="password"
                autoComplete="new-password"
                placeholder={t('settings.newPasswordPlaceholder')}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
            </label>
            {passwordStatus === 'success' ? <div className="auth-alert">{t('settings.passwordUpdated')}</div> : null}
            {passwordStatus === 'error' ? <div className="auth-alert">{t('settings.passwordError')}</div> : null}
            {passwordStatus === 'short' ? <div className="auth-alert">{t('settings.passwordTooShort')}</div> : null}
            <button
              className="cta secondary"
              type="button"
              disabled={savingPassword || !newPassword.trim()}
              onClick={() => void handleChangePassword()}
            >
              {savingPassword ? t('auth.working') : t('settings.changePassword')}
            </button>
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
