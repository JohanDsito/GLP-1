import { AlertTriangle, CircleAlert, Pill, Plus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import { Section } from '../../shared/ui/section';

const symptoms = ['Nausea', 'Hair loss', 'Constipation', 'Fatigue', 'Skin sagging'];

export function SymptomMonitorPage() {
  const { t } = useTranslation();
  const profile = useTreatmentProfileStore((state) => state.profile);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Nausea', 'Fatigue']);

  function toggleSymptom(symptom: string) {
    setSelectedSymptoms((current) =>
      current.includes(symptom) ? current.filter((value) => value !== symptom) : [...current, symptom],
    );
  }

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('symptoms.title')}</div>
        <h1 className="page-title">{t('symptoms.title')}</h1>
        <p className="page-subtitle">{t('symptoms.subtitle')}</p>
      </div>

      <Section eyebrow={t('symptoms.status')} title={t('symptoms.signalForToday')}>
        <div className="panel soft pad">
          <div className="panel-header">
            <div>
              <div className="pill accent">{profile?.symptomProfile ? `${t('symptoms.activeWeek')} · ${profile.symptomProfile}` : t('symptoms.activeWeek')}</div>
              <p className="panel-copy">{profile ? t('symptoms.profileSummary', { stage: profile.stage, goal: profile.goal }) : t('symptoms.prioritize')}</p>
            </div>
            <AlertTriangle className="icon" />
          </div>
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <Section eyebrow={t('symptoms.selection')} title={t('symptoms.whatIsActive')}>
        <div className="grid cards">
          {symptoms.map((item, index) => (
            <button
              type="button"
              className={selectedSymptoms.includes(item) ? 'panel pad symptom-card selected' : 'panel pad symptom-card'}
              key={item}
              onClick={() => toggleSymptom(item)}
            >
              <div className="panel-header">
                <div className={selectedSymptoms.includes(item) ? 'pill accent' : 'pill primary'}>
                  {selectedSymptoms.includes(item) ? t('symptoms.selected') : t('symptoms.available')}
                </div>
                {index === 0 ? <Pill className="icon" /> : index === 4 ? <Plus className="icon" /> : <CircleAlert className="icon" />}
              </div>
              <div className="metric">
                <div className="metric-value" style={{ fontSize: 24 }}>
                  {item}
                </div>
                <div className="metric-label">{t('symptoms.contextualCopy')}</div>
              </div>
            </button>
          ))}
        </div>
      </Section>
    </main>
  );
}
