import { CalendarCheck2, Download, FileText, MessageSquareShare } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import { Section } from '../../shared/ui/section';

export function MedicalReportPage() {
  const { t } = useTranslation();
  const profile = useTreatmentProfileStore((state) => state.profile);

  const reportText = useMemo(() => {
    const treatmentText = profile
      ? `${profile.medication} ${profile.doseFrequency ?? 'weekly'}`
      : t('reports.treatmentValue');
    const symptomText = profile?.symptomProfile ?? t('reports.symptomValue');
    const adherenceText = t('reports.adherenceValue');

    return [
      t('appName'),
      `${t('reports.treatment')}: ${treatmentText}`,
      `${t('reports.symptomLog')}: ${symptomText}`,
      `${t('reports.adherence')}: ${adherenceText}`,
      t('reports.shareSummary'),
    ].join('\n');
  }, [profile, t]);

  function handleDownload() {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'glp1-report.txt';
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    const payload = {
      title: 'GLP-1 Guide report',
      text: reportText,
    };

    if (navigator.share) {
      await navigator.share(payload);
      return;
    }

    await navigator.clipboard.writeText(reportText);
  }

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('reports.title')}</div>
        <h1 className="page-title">{t('reports.subtitle')}</h1>
        <p className="page-subtitle">{t('reports.shareSummary')}</p>
      </div>

      <Section eyebrow={t('reports.nextAppointment')} title={t('reports.doctorReady')}>
        <div className="panel soft pad">
          <div className="panel-header">
            <div>
              <div className="pill primary">{t('reports.daysAway')}</div>
              <p className="panel-copy">{t('reports.shareSummary')}</p>
            </div>
            <CalendarCheck2 className="icon" />
          </div>
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <div className="grid cards">
        <Section eyebrow={t('reports.snapshot')} title={t('reports.reportData')}>
          <div className="list">
            <div className="list-item">
              <div>
                <div className="list-item-title">{t('reports.treatment')}</div>
                <div className="list-item-copy">
                  {profile ? `${profile.medication} - ${profile.doseFrequency ?? 'weekly'}` : t('reports.treatmentValue')}
                </div>
              </div>
              <FileText className="icon" />
            </div>
            <div className="list-item">
              <div>
                <div className="list-item-title">{t('reports.symptomLog')}</div>
                <div className="list-item-copy">{profile ? profile.symptomProfile : t('reports.symptomValue')}</div>
              </div>
              <FileText className="icon" />
            </div>
            <div className="list-item">
              <div>
                <div className="list-item-title">{t('reports.adherence')}</div>
                <div className="list-item-copy">{t('reports.adherenceValue')}</div>
              </div>
              <FileText className="icon" />
            </div>
          </div>
        </Section>
        <Section eyebrow={t('reports.shareSummary')} title={t('reports.exportOptions')}>
          <div className="stack">
            <button className="cta" type="button" onClick={handleDownload}>
              <Download className="icon" />
              {t('reports.downloadReport')}
            </button>
            <button className="cta secondary" type="button" onClick={handleShare}>
              <MessageSquareShare className="icon" />
              {t('reports.shareVia')}
            </button>
          </div>
        </Section>
      </div>
    </main>
  );
}

