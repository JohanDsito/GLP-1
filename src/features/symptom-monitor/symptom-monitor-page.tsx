import { AlertTriangle, ChevronRight, MessageCircleQuestion } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { groupByCategory, sideEffectCategories, type SideEffect } from '../../entities/side-effects/types';
import type { SideEffectCategory } from '../../entities/treatment-profile/types';
import { fetchActiveSideEffects } from '../../lib/supabase/symptoms';
import { Section } from '../../shared/ui/section';
import { FaqView } from '../faq/faq-page';

export function SymptomMonitorPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'faq' ? 'faq' : 'library';

  const [sideEffects, setSideEffects] = useState<SideEffect[]>([]);
  const [activeCat, setActiveCat] = useState<SideEffectCategory>('gastrointestinal');

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
  const visibleEffects = grouped[activeCat];

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('nav.symptoms')}</div>
        <h1 className="page-title">{view === 'faq' ? t('faq.title') : t('sideEffects.title')}</h1>
        <p className="page-subtitle">{view === 'faq' ? t('faq.subtitle') : t('sideEffects.browseSubtitle')}</p>
      </div>

      {/* Section tabs: side-effect library / questions */}
      <div className="section-tabs" style={{ marginBottom: 16 }}>
        <button type="button" className={view === 'library' ? 'active' : undefined} onClick={() => setParams({})}>
          {t('sideEffects.tabLibrary')}
        </button>
        <button type="button" className={view === 'faq' ? 'active' : undefined} onClick={() => setParams({ view: 'faq' })}>
          {t('sideEffects.tabFaq')}
        </button>
      </div>

      {view === 'faq' ? (
        <FaqView />
      ) : (
        <>
          <div className="choice-chip-row" style={{ flexWrap: 'wrap', marginBottom: 16 }}>
            {sideEffectCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={activeCat === cat ? 'choice-chip selected' : 'choice-chip'}
                onClick={() => setActiveCat(cat)}
              >
                {t(`sideEffects.categories.${cat}`)}
              </button>
            ))}
          </div>

          <Section eyebrow={t('sideEffects.title')} title={t(`sideEffects.categories.${activeCat}`)}>
            <div className="list">
              {visibleEffects.map((effect) => {
                const contentTitle = t(`sideEffects.content.${effect.code}.title`, effect.code);
                const hasContent = i18nHasContent(t, effect.code);
                const isEmergency = effect.severity === 'emergency';

                const inner = (
                  <>
                    <div>
                      {isEmergency ? (
                        <div className="pill danger" style={{ marginBottom: 8 }}>
                          <AlertTriangle className="icon" />
                          {t('sideEffects.emergencyBadge')}
                        </div>
                      ) : null}
                      <div className="list-item-title">{contentTitle}</div>
                      {!hasContent ? <div className="list-item-copy">{t('sideEffects.contentMissing')}</div> : null}
                    </div>
                    <ChevronRight className="icon" />
                  </>
                );

                const className = `list-item${isEmergency ? ' list-item--emergency' : ''}`;

                return hasContent ? (
                  <Link className={className} key={effect.id} to={`/symptom-monitor/${effect.code}`}>
                    {inner}
                  </Link>
                ) : (
                  <div className={className} key={effect.id}>
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
        </>
      )}
    </main>
  );
}

function i18nHasContent(t: (key: string) => string, code: string): boolean {
  const key = `sideEffects.content.${code}.title`;
  return t(key) !== key;
}
