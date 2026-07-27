import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, ShieldCheck } from 'lucide-react';
import { BrandMark } from '../../shared/ui/brand-mark';
import { useTranslation } from 'react-i18next';
import { signInWithEmail, signUpWithEmail } from '../../lib/supabase/auth';
import { isSupabaseConfigured } from '../../lib/supabase/client';

const MIN_PASSWORD = 8;

export function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sex, setSex] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateSignUp(): string | null {
    if (!firstName.trim() || !lastName.trim()) {
      return t('auth.errors.nameRequired');
    }
    if (password.length < MIN_PASSWORD) {
      return t('auth.errors.passwordShort', { count: MIN_PASSWORD });
    }
    if (password !== confirmPassword) {
      return t('auth.errors.passwordMismatch');
    }
    if (!dateOfBirth) {
      return t('auth.errors.dobRequired');
    }
    if (!sex) {
      return t('auth.errors.sexRequired');
    }
    if (!acceptedTerms) {
      return t('auth.errors.termsRequired');
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (mode === 'sign-up') {
      const validationError = validateSignUp();
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);

    try {
      const result =
        mode === 'sign-in'
          ? await signInWithEmail(email, password)
          : await signUpWithEmail(email, password, {
              firstName: firstName.trim(),
              lastName: lastName.trim(),
              dateOfBirth,
              sex,
              acceptedTerms,
            });

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

  const isSignUp = mode === 'sign-up';

  return (
    <main className="onboarding-shell">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <BrandMark size="lg" />
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
            <h2 className="panel-title">{isSignUp ? t('auth.createAccount') : t('auth.signIn')}</h2>
            <p className="panel-copy">{t('auth.useBackend')}</p>
          </div>
          <LogIn className="icon" />
        </div>

        <form className="stack" onSubmit={handleSubmit}>
          {isSignUp ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <label className="stack" style={{ gap: 8, flex: 1 }}>
                <span className="onboarding-step">{t('auth.firstName')}</span>
                <input
                  className="auth-input"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                />
              </label>
              <label className="stack" style={{ gap: 8, flex: 1 }}>
                <span className="onboarding-step">{t('auth.lastName')}</span>
                <input
                  className="auth-input"
                  type="text"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                />
              </label>
            </div>
          ) : null}

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
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              required
              minLength={isSignUp ? MIN_PASSWORD : 6}
            />
          </label>

          {isSignUp ? (
            <>
              <label className="stack" style={{ gap: 8 }}>
                <span className="onboarding-step">{t('auth.confirmPassword')}</span>
                <input
                  className="auth-input"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </label>

              <div style={{ display: 'flex', gap: 10 }}>
                <label className="stack" style={{ gap: 8, flex: 1 }}>
                  <span className="onboarding-step">{t('auth.dateOfBirth')}</span>
                  <input
                    className="auth-input"
                    type="date"
                    value={dateOfBirth}
                    max={new Date().toISOString().slice(0, 10)}
                    onChange={(event) => setDateOfBirth(event.target.value)}
                    required
                  />
                </label>
                <label className="stack" style={{ gap: 8, flex: 1 }}>
                  <span className="onboarding-step">{t('auth.sex')}</span>
                  <select className="auth-input" value={sex} onChange={(event) => setSex(event.target.value)} required>
                    <option value="" disabled>
                      {t('auth.sexSelect')}
                    </option>
                    <option value="female">{t('auth.sexOptions.female')}</option>
                    <option value="male">{t('auth.sexOptions.male')}</option>
                    <option value="other">{t('auth.sexOptions.other')}</option>
                    <option value="prefer_not">{t('auth.sexOptions.prefer_not')}</option>
                  </select>
                </label>
              </div>

              <label className="list-item" style={{ cursor: 'pointer', gap: 10 }}>
                <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
                <span className="list-item-copy" style={{ marginTop: 0 }}>
                  {t('auth.termsIntro')}{' '}
                  <Link className="subtle-link" to="/terms" target="_blank">
                    {t('auth.termsLink')}
                  </Link>{' '}
                  {t('auth.termsAnd')}{' '}
                  <Link className="subtle-link" to="/privacy" target="_blank">
                    {t('auth.privacyLink')}
                  </Link>
                </span>
              </label>
            </>
          ) : null}

          {error ? <div className="auth-alert">{error}</div> : null}

          <button className="cta" type="submit" disabled={loading}>
            {loading ? t('auth.working') : isSignUp ? t('auth.createAccountAction') : t('auth.signInAction')}
          </button>
        </form>

        <button className="cta secondary" type="button" onClick={() => setMode(isSignUp ? 'sign-in' : 'sign-up')}>
          {isSignUp ? t('auth.haveAccount') : t('auth.needAccount')}
        </button>
      </section>
    </main>
  );
}
