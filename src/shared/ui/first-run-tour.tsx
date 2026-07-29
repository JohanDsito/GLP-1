import { Apple, Bell, HeartPulse, HelpCircle, LineChart, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../entities/auth/auth-store';
import { getFirstName } from '../../lib/supabase/profile';

const TOUR_KEY = 'glp1-tour-done';

const steps = [
  { icon: Sparkles, titleKey: 'tour.welcome.title', bodyKey: 'tour.welcome.body' },
  { icon: LineChart, titleKey: 'tour.tracking.title', bodyKey: 'tour.tracking.body' },
  { icon: Apple, titleKey: 'tour.nutrition.title', bodyKey: 'tour.nutrition.body' },
  { icon: HeartPulse, titleKey: 'tour.symptoms.title', bodyKey: 'tour.symptoms.body' },
  { icon: HelpCircle, titleKey: 'tour.faq.title', bodyKey: 'tour.faq.body' },
  { icon: Bell, titleKey: 'tour.reminders.title', bodyKey: 'tour.reminders.body' },
] as const;

function tourAlreadySeen(): boolean {
  try {
    return localStorage.getItem(TOUR_KEY) === '1';
  } catch {
    return true;
  }
}

export function FirstRunTour() {
  const { t } = useTranslation();
  const firstName = getFirstName(useAuthStore((state) => state.user));
  const [open, setOpen] = useState(() => !tourAlreadySeen());
  const [step, setStep] = useState(0);

  if (!open) {
    return null;
  }

  function finish() {
    try {
      localStorage.setItem(TOUR_KEY, '1');
    } catch {
      // ignore
    }
    setOpen(false);
  }

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const Icon = current.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(9, 20, 18, 0.55)',
        display: 'grid',
        placeItems: 'center',
        padding: 20,
      }}
    >
      <div
        className="panel pad"
        style={{ width: 'min(100%, 420px)', background: 'var(--surface)', textAlign: 'center' }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'var(--primary-soft)',
            display: 'grid',
            placeItems: 'center',
            margin: '4px auto 14px',
          }}
        >
          <Icon className="icon" style={{ color: 'var(--primary-strong)' }} />
        </div>

        <h2 className="panel-title" style={{ marginBottom: 8 }}>
          {step === 0 && firstName ? t('tour.welcome.titleNamed', { name: firstName }) : t(current.titleKey)}
        </h2>
        <p className="panel-copy" style={{ marginBottom: 18 }}>
          {t(current.bodyKey)}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 18 }}>
          {steps.map((s, index) => (
            <span
              key={s.titleKey}
              style={{
                width: index === step ? 20 : 8,
                height: 8,
                borderRadius: 999,
                background: index === step ? 'var(--primary-strong)' : 'var(--surface-muted)',
                transition: 'width 160ms ease',
              }}
            />
          ))}
        </div>

        <div className="stack" style={{ gap: 8 }}>
          <button
            className="cta"
            type="button"
            onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
          >
            {isLast ? t('tour.finish') : t('tour.next')}
          </button>
          {!isLast ? (
            <button className="subtle-link" type="button" onClick={finish}>
              {t('tour.skip')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
