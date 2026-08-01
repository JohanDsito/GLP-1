import { CheckCircle2, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from '../../lib/supabase/auth';
import { BrandMark } from '../../shared/ui/brand-mark';

const MIN_PASSWORD = 8;

export function ResetPasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'short'>('idle');

  async function handleSave() {
    if (password.trim().length < MIN_PASSWORD) {
      setStatus('short');
      return;
    }
    setSaving(true);
    setStatus('idle');
    try {
      const { error } = await updatePassword(password);
      if (error) {
        setStatus('error');
      } else {
        setStatus('success');
        setTimeout(() => navigate('/', { replace: true }), 1400);
      }
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <BrandMark size="lg" />
        </div>
        <div className="page-kicker">{t('auth.secureAccess')}</div>
        <h1 className="page-title">{t('auth.resetNewTitle')}</h1>
        <p className="page-subtitle">{t('auth.resetNewCopy')}</p>
      </section>

      <section className="onboarding-card panel pad">
        <div className="panel-header">
          <div>
            <div className="page-kicker">{t('auth.access')}</div>
            <h2 className="panel-title">{t('auth.resetNewTitle')}</h2>
          </div>
          <KeyRound className="icon" />
        </div>

        <div className="stack">
          <label className="stack" style={{ gap: 8 }}>
            <span className="onboarding-step">{t('auth.newPasswordLabel')}</span>
            <div className="password-field">
              <input
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={t('settings.newPasswordPlaceholder')}
                minLength={MIN_PASSWORD}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
              </button>
            </div>
          </label>

          {status === 'success' ? (
            <div className="auth-success">
              <CheckCircle2 className="icon" />
              <span>{t('auth.resetNewSaved')}</span>
            </div>
          ) : null}
          {status === 'error' ? <div className="auth-alert">{t('auth.resetNewError')}</div> : null}
          {status === 'short' ? <div className="auth-alert">{t('auth.errors.passwordShort', { count: MIN_PASSWORD })}</div> : null}

          <button className="cta" type="button" disabled={saving || !password.trim()} onClick={() => void handleSave()}>
            {saving ? t('auth.working') : t('auth.resetNewButton')}
          </button>
        </div>
      </section>
    </main>
  );
}
