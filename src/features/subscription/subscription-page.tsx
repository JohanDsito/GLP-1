import { CheckCircle2, CreditCard, ExternalLink, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isStripeConfigured, openCheckout } from '../../lib/stripe';

export function SubscriptionPage() {
  const { t } = useTranslation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setError(null);
    setIsRedirecting(true);
    const result = await openCheckout();
    if (!result.ok) {
      setError(result.error);
      setIsRedirecting(false);
    }
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <CreditCard className="icon" />
          <span>{t('appName')}</span>
        </div>
        <div className="page-kicker">{t('subscribe.plan')}</div>
        <h1 className="page-title">{t('subscribe.title')}</h1>
        <p className="page-subtitle">{t('subscribe.subtitle')}</p>
        <div className="list" style={{ maxWidth: 520 }}>
          <div className="list-item">
            <div>
              <div className="list-item-title">{t('subscribe.billingSource')}</div>
              <div className="list-item-copy">{t('subscribe.billingSourceCopy')}</div>
            </div>
            <CheckCircle2 className="icon" />
          </div>
          <div className="list-item">
            <div>
              <div className="list-item-title">{t('subscribe.security')}</div>
              <div className="list-item-copy">{t('subscribe.securityCopy')}</div>
            </div>
            <ShieldCheck className="icon" />
          </div>
        </div>
      </section>

      <section className="onboarding-card panel pad">
        <div className="panel-header">
          <div>
            <div className="page-kicker">{t('subscribe.plan')}</div>
            <h2 className="panel-title">{t('subscribe.premiumAccess')}</h2>
            <p className="panel-copy">{t('subscribe.requirement')}</p>
          </div>
          <CreditCard className="icon" />
        </div>

        <div className="stack">
          <div className="panel soft pad">
            <div className="metric">
              <div className="metric-value" style={{ fontSize: 32 }}>
                {t('subscribe.starterMembership')}
              </div>
              <div className="metric-label">
                {isStripeConfigured
                  ? t('subscribe.stripeReady')
                  : t('subscribe.stripeMissing')}
              </div>
            </div>
          </div>

          <button
            className="cta"
            type="button"
            onClick={() => void handleCheckout()}
            disabled={!isStripeConfigured || isRedirecting}
          >
            {isRedirecting ? t('subscribe.redirecting') : t('subscribe.openCheckout')}
            <ExternalLink className="icon" />
          </button>
          {error ? <div className="auth-alert">{error}</div> : null}
        </div>
      </section>
    </main>
  );
}

