import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { TrackingLogView } from '../dose-tracker/dose-tracker-page';
import { ProgressView } from '../progress/progress-page';

/**
 * Merged "Seguimiento" section. Two tabs — "Registrar" (log today) and
 * "Progreso" (charts + achievements) — sharing a single route. The active tab
 * lives in the URL (`?view=progress`) so existing links can deep-link into it.
 */
export function SeguimientoPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const view = params.get('view') === 'progress' ? 'progress' : 'log';

  function setView(next: 'log' | 'progress') {
    setParams(next === 'progress' ? { view: 'progress' } : {});
  }

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('tracking.kicker')}</div>
        <h1 className="page-title">{t('nav.tracking')}</h1>
        <p className="page-subtitle">{view === 'log' ? t('tracking.subtitle') : t('progress.subtitle')}</p>
      </div>

      <div className="choice-chip-row" role="tablist" style={{ marginBottom: 16 }}>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'log'}
          className={view === 'log' ? 'choice-chip selected' : 'choice-chip'}
          onClick={() => setView('log')}
        >
          {t('tracking.tabLog')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'progress'}
          className={view === 'progress' ? 'choice-chip selected' : 'choice-chip'}
          onClick={() => setView('progress')}
        >
          {t('tracking.tabProgress')}
        </button>
      </div>

      {view === 'log' ? <TrackingLogView /> : <ProgressView />}
    </main>
  );
}
