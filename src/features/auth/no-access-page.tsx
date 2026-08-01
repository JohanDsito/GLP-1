import { ExternalLink, LockKeyhole, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../entities/auth/auth-store';
import { useSubscriptionStore } from '../../entities/subscription/subscription-store';
import { fetchHasAppAccess } from '../../lib/supabase/access';
import { signOut } from '../../lib/supabase/auth';
import { BrandMark } from '../../shared/ui/brand-mark';

const hotmartUrl = import.meta.env.VITE_HOTMART_CHECKOUT_URL as string | undefined;

export function NoAccessPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const email = useAuthStore((state) => state.user?.email ?? null);
  const setAccessStatus = useSubscriptionStore((state) => state.setAccessStatus);

  const [checking, setChecking] = useState(false);
  const [notFound, setNotFound] = useState(false);

  async function handleRecheck() {
    setChecking(true);
    setNotFound(false);
    const granted = await fetchHasAppAccess();
    setChecking(false);
    if (granted) {
      setAccessStatus('granted');
      navigate('/', { replace: true });
    } else {
      setNotFound(true);
    }
  }

  async function handleSignOut() {
    await signOut();
    navigate('/auth', { replace: true });
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <BrandMark size="lg" />
        </div>
        <div className="muscle-lock" aria-hidden="true">
          <LockKeyhole className="icon" />
        </div>
        <div className="page-kicker">{t('noAccess.kicker')}</div>
        <h1 className="page-title">{t('noAccess.title')}</h1>
        <p className="page-subtitle">{t('noAccess.subtitle')}</p>
      </section>

      <section className="onboarding-card panel pad">
        <div className="stack" style={{ gap: 14 }}>
          <div className="panel soft pad">
            <div className="dashboard-mini-label">{t('noAccess.yourEmail')}</div>
            <strong style={{ wordBreak: 'break-all' }}>{email ?? '—'}</strong>
            <p className="panel-copy" style={{ marginTop: 8, fontSize: 13 }}>{t('noAccess.emailHint')}</p>
          </div>

          {hotmartUrl ? (
            <a className="cta" href={hotmartUrl} target="_blank" rel="noreferrer">
              {t('noAccess.buy')}
              <ExternalLink className="icon" />
            </a>
          ) : null}

          <button className="cta secondary" type="button" onClick={() => void handleRecheck()} disabled={checking}>
            <RefreshCw className="icon" />
            {checking ? t('noAccess.checking') : t('noAccess.alreadyBought')}
          </button>

          {notFound ? <div className="auth-alert">{t('noAccess.notFound')}</div> : null}

          <button className="subtle-link" type="button" style={{ alignSelf: 'center' }} onClick={() => void handleSignOut()}>
            {t('noAccess.otherEmail')}
          </button>
        </div>
      </section>
    </main>
  );
}
