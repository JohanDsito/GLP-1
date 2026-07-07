import { AlertTriangle, CircleAlert, MessageCircleQuestion, Pill } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { groupByCategory, type SideEffect } from '../../entities/side-effects/types';
import type { SideEffectCategory } from '../../entities/treatment-profile/types';
import { fetchActiveSideEffects } from '../../lib/supabase/symptoms';
import { Section } from '../../shared/ui/section';

export function SymptomMonitorPage() {
  const { t } = useTranslation();
  const [sideEffects, setSideEffects] = useState<SideEffect[]>([]);
  const [activeTab, setActiveTab] = useState<SideEffectCategory>('physical');

  useEffect(() => {
    let mounted = true;

    fetchActiveSideEffects()
      .then((effects) => {
        if (mounted) {
          setSideEffects(effects);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, []);

  const grouped = groupByCategory(sideEffects);
  const visibleEffects = grouped[activeTab];

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('sideEffects.title')}</div>
        <h1 className="page-title">{t('sideEffects.title')}</h1>
        <p className="page-subtitle">{t('sideEffects.browseSubtitle')}</p>
      </div>

      <div className="dashboard-pills" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={activeTab === 'physical' ? 'choice-chip selected' : 'choice-chip'}
          onClick={() => setActiveTab('physical')}
        >
          {t('sideEffects.physicalTab')}
        </button>
        <button
          type="button"
          className={activeTab === 'psychological' ? 'choice-chip selected' : 'choice-chip'}
          onClick={() => setActiveTab('psychological')}
        >
          {t('sideEffects.psychologicalTab')}
        </button>
      </div>

      <Section eyebrow={t('sideEffects.title')} title={t(`sideEffects.${activeTab}Tab`)}>
        <div className="list">
          {visibleEffects.map((effect) => {
            const contentTitle = t(`sideEffects.content.${effect.code}.title`, effect.code);
            const hasContent = i18nHasContent(t, effect.code);

            const inner = (
              <>
                <div>
                  {effect.reviewStatus !== 'reviewed' ? (
                    <div className="pill soft" style={{ marginBottom: 8 }}>
                      {t('sideEffects.draftBadge')}
                    </div>
                  ) : null}
                  <div className="list-item-title">{contentTitle}</div>
                  {!hasContent ? <div className="list-item-copy">{t('sideEffects.contentMissing')}</div> : null}
                </div>
                {activeTab === 'physical' ? <Pill className="icon" /> : <CircleAlert className="icon" />}
              </>
            );

            return hasContent ? (
              <Link className="list-item" key={effect.id} to={`/symptom-monitor/${effect.code}`}>
                {inner}
              </Link>
            ) : (
              <div className="list-item" key={effect.id}>
                {inner}
              </div>
            );
          })}
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <div className="panel soft pad">
        <div className="panel-header">
          <div>
            <div className="list-item-title">{t('sideEffects.didntFindIt')}</div>
          </div>
          <AlertTriangle className="icon" />
        </div>
        <Link className="cta secondary" to="/symptom-monitor/request">
          <MessageCircleQuestion className="icon" />
          {t('sideEffects.tellUs')}
        </Link>
      </div>
    </main>
  );
}

function i18nHasContent(t: (key: string) => string, code: string): boolean {
  const key = `sideEffects.content.${code}.title`;
  return t(key) !== key;
}
