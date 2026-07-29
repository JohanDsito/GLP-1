import { CheckCircle2, Dumbbell, ExternalLink, Lock, Ticket } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '../../../entities/subscription/subscription-store';
import { redeemMusclePlanCoupon, type CouponResult } from '../../../lib/supabase/muscle-plan';
import { Section } from '../../../shared/ui/section';

const FEATURE_KEYS = ['feature1', 'feature2', 'feature3', 'feature4', 'feature5'];
const musclePlanUrl = import.meta.env.VITE_MUSCLE_PLAN_URL as string | undefined;

export function MusclePlanUpgradePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setHasMuscle = useSubscriptionStore((state) => state.setHasMuscle);

  const [coupon, setCoupon] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [result, setResult] = useState<CouponResult | null>(null);

  async function handleRedeem() {
    if (!coupon.trim()) {
      return;
    }
    setRedeeming(true);
    setResult(null);
    const outcome = await redeemMusclePlanCoupon(coupon.trim());
    setResult(outcome);
    setRedeeming(false);

    if (outcome === 'ok' || outcome === 'already') {
      setHasMuscle(true);
      setTimeout(() => navigate('/muscle-plan/dashboard', { replace: true }), 700);
    }
  }

  return (
    <main className="onboarding-shell muscle-theme">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <Dumbbell className="icon" />
          <span>{t('musclePlan.title')}</span>
        </div>
        <div className="muscle-lock">
          <Lock className="icon" />
        </div>
        <div className="page-kicker">{t('musclePlan.upgrade.kicker')}</div>
        <h1 className="page-title">{t('musclePlan.upgrade.lockedTitle')}</h1>

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

        {/* Option 1 — coupon unlock */}
        <div className="stack" style={{ marginTop: 16, gap: 10 }}>
          <div className="panel soft pad">
            <div className="panel-header">
              <div>
                <div className="list-item-title">{t('musclePlan.upgrade.couponTitle')}</div>
                <p className="panel-copy">{t('musclePlan.upgrade.couponCopy')}</p>
              </div>
              <Ticket className="icon" />
            </div>
            <div className="stack" style={{ gap: 8 }}>
              <input
                className="auth-input"
                type="text"
                placeholder={t('musclePlan.upgrade.couponPlaceholder')}
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                autoCapitalize="characters"
              />
              {result && result !== 'ok' && result !== 'already' ? (
                <div className="auth-alert">{t(`musclePlan.upgrade.coupon.${result}`, t('musclePlan.upgrade.coupon.error'))}</div>
              ) : null}
              {result === 'ok' || result === 'already' ? (
                <div className="pill primary" style={{ width: 'fit-content' }}>
                  <CheckCircle2 className="icon" />
                  {t('musclePlan.upgrade.coupon.ok')}
                </div>
              ) : null}
              <button className="cta" type="button" onClick={() => void handleRedeem()} disabled={redeeming || !coupon.trim()}>
                {redeeming ? t('auth.working') : t('musclePlan.upgrade.couponCta')}
              </button>
            </div>
          </div>

          {/* Option 2 — pay separately on Hotmart */}
          <div className="panel soft pad">
            <div className="metric">
              <div className="metric-value" style={{ fontSize: 32 }}>
                {t('musclePlan.upgrade.price')}
              </div>
              <div className="metric-label">{t('musclePlan.upgrade.priceNote')}</div>
            </div>
            {musclePlanUrl ? (
              <a className="cta secondary" href={musclePlanUrl} target="_blank" rel="noreferrer" style={{ marginTop: 12 }}>
                {t('musclePlan.upgrade.buySeparately')}
                <ExternalLink className="icon" />
              </a>
            ) : (
              <p className="panel-copy" style={{ fontSize: 13, marginTop: 12 }}>{t('musclePlan.upgrade.buySoon')}</p>
            )}
          </div>

          <p className="panel-copy" style={{ fontSize: 13 }}>{t('musclePlan.upgrade.smallPrint')}</p>
        </div>
      </section>
    </main>
  );
}
