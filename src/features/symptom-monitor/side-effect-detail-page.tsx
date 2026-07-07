import { ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useAuthStore } from '../../entities/auth/auth-store';
import type { SideEffect } from '../../entities/side-effects/types';
import { fetchActiveSideEffects, logSymptomRecord } from '../../lib/supabase/symptoms';
import { Section } from '../../shared/ui/section';

const severityLevels: Array<{ value: number; labelKey: string }> = [
  { value: 0, labelKey: 'sideEffects.severityOptions.none' },
  { value: 2, labelKey: 'sideEffects.severityOptions.mild' },
  { value: 3, labelKey: 'sideEffects.severityOptions.moderate' },
  { value: 4, labelKey: 'sideEffects.severityOptions.high' },
];

export function SideEffectDetailPage() {
  const { t } = useTranslation();
  const { code = '' } = useParams<{ code: string }>();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [sideEffect, setSideEffect] = useState<SideEffect | null>(null);
  const [saving, setSaving] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    let mounted = true;

    fetchActiveSideEffects()
      .then((effects) => {
        if (mounted) {
          setSideEffect(effects.find((effect) => effect.code === code) ?? null);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [code]);

  const titleKey = `sideEffects.content.${code}.title`;
  const hasContent = t(titleKey) !== titleKey;
  const supplements = t(`sideEffects.content.${code}.supplements`, { returnObjects: true }) as string[];

  async function handleLogSeverity(severity: number) {
    if (!userId || !sideEffect) {
      return;
    }

    setSaving(true);

    try {
      await logSymptomRecord(userId, sideEffect.id, severity);
      setLogged(true);
    } catch {
      // Non-fatal.
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <Link className="subtle-link" to="/symptom-monitor">
        <ArrowLeft className="icon" style={{ display: 'inline-block' }} /> {t('sideEffects.title')}
      </Link>

      <div className="page-head">
        {sideEffect && sideEffect.reviewStatus !== 'reviewed' ? (
          <div className="pill soft" style={{ marginBottom: 8 }}>
            {t('sideEffects.draftBadge')}
          </div>
        ) : null}
        <h1 className="page-title">{hasContent ? t(titleKey) : code}</h1>
      </div>

      <div className="panel soft pad" style={{ marginBottom: 16 }}>
        <div className="panel-header">
          <p className="panel-copy">{t('sideEffects.specialistDisclaimer')}</p>
          <ShieldAlert className="icon" />
        </div>
      </div>

      {hasContent ? (
        <>
          <Section eyebrow={t('sideEffects.cause')} title={t('sideEffects.cause')}>
            <p className="panel-copy">{t(`sideEffects.content.${code}.cause`)}</p>
          </Section>

          <div style={{ height: 16 }} />

          <Section eyebrow={t('sideEffects.whatToDo')} title={t('sideEffects.whatToDo')}>
            <p className="panel-copy">{t(`sideEffects.content.${code}.whatToDo`)}</p>
          </Section>

          <div style={{ height: 16 }} />

          <Section eyebrow={t('sideEffects.supplements')} title={t('sideEffects.supplements')}>
            {supplements.length > 0 ? (
              <ul className="list">
                {supplements.map((supplement) => (
                  <li className="list-item" key={supplement}>
                    <div className="list-item-title">{supplement}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="panel-copy">{t('sideEffects.noSupplements')}</p>
            )}
          </Section>
        </>
      ) : (
        <Section eyebrow={t('sideEffects.title')} title={t('sideEffects.title')}>
          <p className="panel-copy">{t('sideEffects.contentMissing')}</p>
        </Section>
      )}

      <div style={{ height: 16 }} />

      <Section eyebrow={t('sideEffects.severityLabel')} title={t('sideEffects.severityLabel')}>
        <div className="dashboard-pills">
          {severityLevels.map((level) => (
            <button
              key={level.value}
              type="button"
              className="pill soft"
              disabled={saving}
              onClick={() => void handleLogSeverity(level.value)}
            >
              {t(level.labelKey)}
            </button>
          ))}
        </div>
        {logged ? (
          <p className="panel-copy" style={{ fontSize: 13, marginTop: 8 }}>
            <CheckCircle2 className="icon" style={{ display: 'inline-block', marginRight: 4 }} />
            {t('sideEffects.logged')}
          </p>
        ) : null}
      </Section>
    </main>
  );
}
