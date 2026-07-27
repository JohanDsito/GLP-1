import { CheckCircle2, Dumbbell, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createMusclePlanCheckout } from '../../../lib/stripe';
import { Section } from '../../../shared/ui/section';

const FEATURE_KEYS = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'];

export function MusclePlanUpgradePage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);
    const result = await createMusclePlanCheckout();
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <main className="onboarding-shell muscle-theme">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <Dumbbell className="icon" />
          <span>{t('musclePlan.title')}</span>
        </div>
        <div className="page-kicker">{t('musclePlan.upgrade.kicker')}</div>
        <h1 className="page-title">{t('musclePlan.upgrade.title')}</h1>

        <div className="panel pad muscle-glp1-card" style={{ maxWidth: 520 }}>
          <div className="panel-header">
            <div>
              <div className="pill accent">{t('musclePlan.upgrade.scienceBadge')}</div>
              <p className="panel-copy" style={{ marginTop: 8 }}>{t('musclePlan.upgrade.scienceCard')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="onboarding-card panel pad">
        <Section eyebrow={t('musclePlan.upgrade.includesKicker')} title={t('musclePlan.upgrade.includesTitle')}>
          <div className="list">
            {FEATURE_KEYS.map((key) => (
              <div className="list-item" key={key}>
                <div className="list-item-title">{t(`musclePlan.upgrade.${key}`)}</div>
                <CheckCircle2 className="icon" />
              </div>
            ))}
          </div>
        </Section>

        <div className="stack" style={{ marginTop: 16 }}>
          <div className="panel soft pad">
            <div className="metric">
              <div className="metric-value" style={{ fontSize: 34 }}>
                {t('musclePlan.upgrade.price')}
              </div>
              <div className="metric-label">{t('musclePlan.upgrade.priceNote')}</div>
            </div>
          </div>

          {error ? <div className="auth-alert">{error}</div> : null}

          <button className="cta" type="button" onClick={() => void handleUpgrade()} disabled={loading}>
            {loading ? t('auth.working') : t('musclePlan.upgrade.cta')}
            <ExternalLink className="icon" />
          </button>
          <p className="panel-copy" style={{ fontSize: 13 }}>{t('musclePlan.upgrade.smallPrint')}</p>
        </div>
      </section>
    </main>
  );
}
