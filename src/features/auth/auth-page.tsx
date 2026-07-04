import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, LogIn, Mail, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { signInWithEmail, signUpWithEmail } from '../../lib/supabase/auth';
import { isSupabaseConfigured } from '../../lib/supabase/client';

export function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result =
        mode === 'sign-in' ? await signInWithEmail(email, password) : await signUpWithEmail(email, password);

      if (result.error) {
        throw result.error;
      }

      if (mode === 'sign-up' && !result.data.session) {
        setError(t('auth.confirmEmail'));
        return;
      }

      navigate('/', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('auth.unableToAuthenticate'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <Sparkles className="icon" />
          <span>{t('appName')}</span>
        </div>
        <div className="page-kicker">{t('auth.secureAccess')}</div>
        <h1 className="page-title">{t('auth.title')}</h1>
        <p className="page-subtitle">{t('auth.subtitle')}</p>
        <div className="stack" style={{ maxWidth: 460 }}>
          <div className="list-item">
            <div>
              <div className="list-item-title">{t('auth.authGate')}</div>
              <div className="list-item-copy">{t('auth.authGateCopy')}</div>
            </div>
            <ShieldCheck className="icon" />
          </div>
          <div className="list-item">
            <div>
              <div className="list-item-title">{t('auth.config')}</div>
              <div className="list-item-copy">
                {isSupabaseConfigured ? t('auth.configDetected') : t('auth.configMissing')}
              </div>
            </div>
            <Mail className="icon" />
          </div>
        </div>
      </section>

      <section className="onboarding-card panel pad">
        <div className="panel-header">
          <div>
            <div className="page-kicker">{t('auth.access')}</div>
            <h2 className="panel-title">{mode === 'sign-in' ? t('auth.signIn') : t('auth.createAccount')}</h2>
            <p className="panel-copy">{t('auth.useBackend')}</p>
          </div>
          <LogIn className="icon" />
        </div>

        <form className="stack" onSubmit={handleSubmit}>
          <label className="stack" style={{ gap: 8 }}>
            <span className="onboarding-step">{t('auth.email')}</span>
            <input
              className="auth-input"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              required
            />
          </label>
          <label className="stack" style={{ gap: 8 }}>
            <span className="onboarding-step">{t('auth.password')}</span>
            <input
              className="auth-input"
              type="password"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              required
              minLength={6}
            />
          </label>

          {error ? <div className="auth-alert">{error}</div> : null}

          <button className="cta" type="submit" disabled={loading}>
            {loading ? t('auth.working') : mode === 'sign-in' ? t('auth.signInAction') : t('auth.createAccountAction')}
          </button>
        </form>

        <button className="cta secondary" type="button" onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}>
          {mode === 'sign-in' ? t('auth.needAccount') : t('auth.haveAccount')}
        </button>
      </section>
    </main>
  );
}
