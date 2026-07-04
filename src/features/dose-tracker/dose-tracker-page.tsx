import { CalendarDays, CheckCircle2, Clock3, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import { Section } from '../../shared/ui/section';

const history = [
  { date: 'June 12', status: 'On time', tone: 'primary' },
  { date: 'June 6', status: '1 day late', tone: 'accent' },
  { date: 'May 29', status: 'On time', tone: 'primary' },
] as const;

export function DoseTrackerPage() {
  const { t } = useTranslation();
  const profile = useTreatmentProfileStore((state) => state.profile);
  const [lastLoggedDose, setLastLoggedDose] = useState<string | null>(null);

  function handleLogDose() {
    setLastLoggedDose(new Date().toLocaleString());
  }

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('doses.title')}</div>
        <h1 className="page-title">{t('doses.title')}</h1>
        <p className="page-subtitle">{t('doses.subtitle')}</p>
      </div>

      <Section eyebrow={t('doses.currentWeek')} title={t('doses.doseRhythm')}>
        <div className="grid cards">
          <article className="panel pad">
            <div className="panel-header">
              <div>
                <div className="pill primary">{t('doses.phaseAware')}</div>
                <p className="panel-copy">{t('doses.todayMapped')}</p>
              </div>
              <CalendarDays className="icon" />
            </div>
            <div className="metric">
              <div className="metric-value">{profile?.medication ?? t('doses.unknownMedication')}</div>
              <div className="metric-label">{t('doses.currentDose')}</div>
            </div>
          </article>
          <article className="panel pad">
            <div className="panel-header">
              <div>
                <div className="pill accent">{t('doses.actionNeeded')}</div>
                <p className="panel-copy">{t('doses.captureFast')}</p>
              </div>
              <Plus className="icon" />
            </div>
            <button className="cta" type="button" onClick={handleLogDose}>
              {t('doses.logToday')}
            </button>
            {lastLoggedDose ? <p className="panel-copy">{t('doses.loggedLocally', { date: lastLoggedDose })}</p> : null}
            {profile ? <p className="panel-copy">{t('doses.profileHint', { medication: profile.medication, frequency: profile.doseFrequency ?? 'weekly' })}</p> : null}
          </article>
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <Section eyebrow={t('doses.history')} title={t('doses.recentDoses')}>
        <div className="list">
          {history.map((entry) => (
            <div className="list-item" key={entry.date}>
              <div>
                <div className="list-item-title">{entry.date}</div>
                <div className="list-item-copy">Semaglutide - 1.0mg</div>
              </div>
              {entry.tone === 'primary' ? (
                <span className="pill primary">
                  <CheckCircle2 className="icon" />
                  {t('doses.onTime')}
                </span>
              ) : (
                <span className="pill accent">
                  <Clock3 className="icon" />
                  {t('doses.late')}
                </span>
              )}
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}

