import { Download, FileText, Printer } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../entities/auth/auth-store';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import { fetchCheckinHistory } from '../../lib/supabase/checkins';
import { fetchRecentDoses } from '../../lib/supabase/doses';
import { fetchActiveSideEffects, fetchRecentSymptomRecords } from '../../lib/supabase/symptoms';
import { fetchWeightLogs, kgToLb } from '../../lib/supabase/weight';
import { Section } from '../../shared/ui/section';

interface ReportData {
  weeksOnTreatment: number | null;
  medication: string;
  dose: string;
  startWeightKg: number | null;
  latestWeightKg: number | null;
  weightChangeKg: number | null;
  adherencePct: number | null;
  doseCount: number;
  symptoms: Array<{ code: string; severity: number }>;
  avgSleepHours: number | null;
  avgMood: number | null;
}

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function MedicalReportPage() {
  const { t } = useTranslation();
  const profile = useTreatmentProfileStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const patientName = ((user?.user_metadata?.full_name as string) ?? '').trim();
  const [data, setData] = useState<ReportData | null>(null);
  const [unit] = useState<'kg' | 'lb'>(
    () => ((typeof localStorage !== 'undefined' && localStorage.getItem('glp1-weight-unit')) as 'kg' | 'lb') || 'kg',
  );

  useEffect(() => {
    if (!userId) return;
    let mounted = true;

    async function load() {
      try {
        const [weights, doses, effects, records, checkins] = await Promise.all([
          fetchWeightLogs(userId as string),
          fetchRecentDoses(userId as string),
          fetchActiveSideEffects(),
          fetchRecentSymptomRecords(userId as string),
          fetchCheckinHistory(userId as string),
        ]);

        if (!mounted) return;

        const cutoff = Date.now() - 28 * 24 * 60 * 60 * 1000;
        const doseCount = doses.filter((d) => new Date(d.scheduledFor).getTime() >= cutoff).length;
        const expected = profile?.doseFrequency === 'daily' ? 28 : 4;

        // Latest severity per symptom code
        const codeById = new Map(effects.map((e) => [e.id, e.code]));
        const latestByCode = new Map<string, number>();
        for (const rec of records) {
          const code = codeById.get(rec.symptomId);
          if (code && !latestByCode.has(code)) {
            latestByCode.set(code, rec.severity);
          }
        }

        const startWeight = weights[0]?.weightKg ?? null;
        const latestWeight = weights[weights.length - 1]?.weightKg ?? null;

        setData({
          weeksOnTreatment: profile?.daysOnTreatment != null ? Math.floor(profile.daysOnTreatment / 7) : null,
          medication: profile?.medication ?? '—',
          dose: profile?.medicationDoseText ?? '—',
          startWeightKg: startWeight,
          latestWeightKg: latestWeight,
          weightChangeKg: startWeight != null && latestWeight != null ? latestWeight - startWeight : null,
          adherencePct: doseCount > 0 ? Math.min(100, Math.round((doseCount / expected) * 100)) : null,
          doseCount,
          symptoms: Array.from(latestByCode.entries())
            .filter(([, sev]) => sev > 0)
            .map(([code, severity]) => ({ code, severity })),
          avgSleepHours: avg(checkins.map((c) => c.sleepHours).filter((v): v is number => v != null)),
          avgMood: avg(checkins.map((c) => c.mood).filter((v): v is number => v != null)),
        });
      } catch {
        // Keep the page usable.
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [userId, profile]);

  function fmtWeight(kg: number | null): string {
    if (kg == null) return '—';
    const v = unit === 'lb' ? kgToLb(kg) : kg;
    return `${v.toFixed(1)} ${unit}`;
  }

  const severityLabel = (s: number) =>
    s >= 4 ? t('sideEffects.severityOptions.high') : s === 3 ? t('sideEffects.severityOptions.moderate') : t('sideEffects.severityOptions.mild');

  const reportText = useMemo(() => {
    if (!data) return '';
    const lines = [
      t('appName') + ' — ' + t('reports.title'),
      '',
      ...(patientName ? [`${t('reports.patient')}: ${patientName}`] : []),
      `${t('reports.treatment')}: ${data.medication} (${data.dose})`,
      `${t('progress.weeksOnTreatment')}: ${data.weeksOnTreatment ?? '—'}`,
      `${t('reports.weightStart')}: ${fmtWeight(data.startWeightKg)}`,
      `${t('reports.weightLatest')}: ${fmtWeight(data.latestWeightKg)}`,
      `${t('reports.weightChange')}: ${data.weightChangeKg != null ? fmtWeight(data.weightChangeKg) : '—'}`,
      `${t('reports.adherence')}: ${data.adherencePct != null ? data.adherencePct + '%' : '—'} (${data.doseCount} ${t('reports.dosesLogged')})`,
      `${t('reports.avgSleep')}: ${data.avgSleepHours != null ? data.avgSleepHours.toFixed(1) + 'h' : '—'}`,
      `${t('reports.symptomLog')}: ${
        data.symptoms.length > 0
          ? data.symptoms.map((s) => `${t(`sideEffects.content.${s.code}.title`, s.code)} (${severityLabel(s.severity)})`).join(', ')
          : '—'
      }`,
    ];
    return lines.join('\n');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, unit, t]);

  function handleDownload() {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = t('reports.reportFile');
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function Row({ label, value }: { label: string; value: string }) {
    return (
      <div className="list-item">
        <div className="list-item-title">{label}</div>
        <div className="list-item-copy" style={{ marginTop: 0, fontWeight: 700, color: 'var(--text)' }}>
          {value}
        </div>
      </div>
    );
  }

  return (
    <main className="page report-print-area">
      <div className="page-head">
        <div className="page-kicker">{t('reports.title')}</div>
        <h1 className="page-title">{t('reports.doctorReady')}</h1>
        <p className="page-subtitle">{t('reports.shareSummary')}</p>
      </div>

      {data ? (
        <>
          <Section eyebrow={t('reports.snapshot')} title={t('reports.reportData')}>
            <div className="list">
              {patientName ? <Row label={t('reports.patient')} value={patientName} /> : null}
              <Row label={t('reports.treatment')} value={`${data.medication} (${data.dose})`} />
              <Row label={t('progress.weeksOnTreatment')} value={String(data.weeksOnTreatment ?? '—')} />
              <Row label={t('reports.weightStart')} value={fmtWeight(data.startWeightKg)} />
              <Row label={t('reports.weightLatest')} value={fmtWeight(data.latestWeightKg)} />
              <Row
                label={t('reports.weightChange')}
                value={data.weightChangeKg != null ? fmtWeight(data.weightChangeKg) : '—'}
              />
              <Row
                label={t('reports.adherence')}
                value={data.adherencePct != null ? `${data.adherencePct}% (${data.doseCount})` : '—'}
              />
              <Row label={t('reports.avgSleep')} value={data.avgSleepHours != null ? `${data.avgSleepHours.toFixed(1)}h` : '—'} />
            </div>
          </Section>

          <div style={{ height: 16 }} />

          <Section eyebrow={t('reports.symptomLog')} title={t('reports.symptomLog')}>
            {data.symptoms.length > 0 ? (
              <div className="list">
                {data.symptoms.map((s) => (
                  <div className="list-item" key={s.code}>
                    <div className="list-item-title">{t(`sideEffects.content.${s.code}.title`, s.code)}</div>
                    <span className="pill accent">{severityLabel(s.severity)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="panel-copy">{t('reports.noSymptoms')}</p>
            )}
          </Section>

          <div style={{ height: 16 }} />

          <div className="stack no-print">
            <button className="cta" type="button" onClick={() => window.print()}>
              <Printer className="icon" />
              {t('reports.print')}
            </button>
            <button className="cta secondary" type="button" onClick={handleDownload}>
              <Download className="icon" />
              {t('reports.downloadReport')}
            </button>
          </div>
        </>
      ) : (
        <div className="panel soft pad">
          <div className="panel-header">
            <p className="panel-copy">{t('loading')}</p>
            <FileText className="icon" />
          </div>
        </div>
      )}
    </main>
  );
}
