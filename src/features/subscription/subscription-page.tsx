import { CheckCircle2, ExternalLink, Mail, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BrandMark } from '../../shared/ui/brand-mark';

const hotmartUrl = import.meta.env.VITE_HOTMART_CHECKOUT_URL as string | undefined;

export function SubscriptionPage() {
  const { t } = useTranslation();

  return (
    <main className="onboarding-shell">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <BrandMark size="lg" />
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
              <div className="list-item-title">{t('subscribe.credentials')}</div>
              <div className="list-item-copy">{t('subscribe.credentialsCopy')}</div>
            </div>
            <Mail className="icon" />
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
          <ShieldCheck className="icon" />
        </div>

        <div className="stack">
          <div className="panel soft pad">
            <div className="metric">
              <div className="metric-value" style={{ fontSize: 40 }}>
                {t('subscribe.price')}
              </div>
              <div className="metric-label">{t('subscribe.priceNote')}</div>
            </div>
          </div>

          {hotmartUrl ? (
            <a className="cta" href={hotmartUrl} target="_blank" rel="noreferrer">
              {t('subscribe.buyOnHotmart')}
              <ExternalLink className="icon" />
            </a>
          ) : (
            <div className="auth-alert">{t('subscribe.hotmartMissing')}</div>
          )}

          <p className="panel-copy" style={{ fontSize: 13 }}>{t('subscribe.alreadyBought')}</p>
        </div>
      </section>
    </main>
  );
}
