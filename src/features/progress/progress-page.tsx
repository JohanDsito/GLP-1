import { Activity, FileText, Flame, Scale, TrendingDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { achievementCatalog } from '../../entities/achievements/catalog';
import { useEngagementStore } from '../../entities/achievements/engagement-store';
import { useAuthStore } from '../../entities/auth/auth-store';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import { fetchCheckinHistory, type CheckinHistoryEntry } from '../../lib/supabase/checkins';
import { fetchRecentDoses } from '../../lib/supabase/doses';
import { fetchActiveSideEffects, fetchRecentSymptomRecords } from '../../lib/supabase/symptoms';
import { fetchWeightLogs, kgToLb, type WeightLog } from '../../lib/supabase/weight';
import { Section } from '../../shared/ui/section';
import { TrendChart, type TrendPoint } from '../../shared/ui/trend-chart';

type WeightUnit = 'kg' | 'lb';
const UNIT_KEY = 'glp1-weight-unit';

function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function ProgressPage() {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const profile = useTreatmentProfileStore((state) => state.profile);

  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [checkins, setCheckins] = useState<CheckinHistoryEntry[]>([]);
  const [doseCount, setDoseCount] = useState(0);
  const [symptomSeries, setSymptomSeries] = useState<Array<{ code: string; points: TrendPoint[] }>>([]);
  const [unit, setUnit] = useState<WeightUnit>(
    () => ((typeof localStorage !== 'undefined' && localStorage.getItem(UNIT_KEY)) as WeightUnit) || 'kg',
  );

  useEffect(() => {
    if (!userId) {
      return;
    }
    let mounted = true;

    async function load() {
      try {
        const [weights, checkinHistory, doses, effects, records] = await Promise.all([
          fetchWeightLogs(userId as string),
          fetchCheckinHistory(userId as string),
          fetchRecentDoses(userId as string),
          fetchActiveSideEffects(),
          fetchRecentSymptomRecords(userId as string),
        ]);

        if (!mounted) {
          return;
        }

        setWeightLogs(weights);
        setCheckins(checkinHistory);

        const cutoff = Date.now() - 28 * 24 * 60 * 60 * 1000;
        setDoseCount(doses.filter((d) => new Date(d.scheduledFor).getTime() >= cutoff).length);

        // Group symptom severity by code over time (only codes with 2+ points).
        const codeById = new Map(effects.map((e) => [e.id, e.code]));
        const byCode = new Map<string, TrendPoint[]>();
        for (const record of [...records].reverse()) {
          const code = codeById.get(record.symptomId);
          if (!code) continue;
          const list = byCode.get(code) ?? [];
          list.push({ label: shortDate(record.recordedAt.slice(0, 10)), value: record.severity });
          byCode.set(code, list);
        }
        setSymptomSeries(
          Array.from(byCode.entries())
            .filter(([, points]) => points.length >= 2)
            .slice(0, 4)
            .map(([code, points]) => ({ code, points })),
        );
      } catch {
        // Keep the page usable if Supabase isn't reachable.
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [userId]);

  function toggleUnit() {
    const next = unit === 'kg' ? 'lb' : 'kg';
    setUnit(next);
    try {
      localStorage.setItem(UNIT_KEY, next);
    } catch {
      // ignore
    }
  }

  const weightPoints: TrendPoint[] = useMemo(
    () =>
      weightLogs.map((log) => ({
        label: shortDate(log.loggedOn),
        value: unit === 'lb' ? kgToLb(log.weightKg) : log.weightKg,
      })),
    [weightLogs, unit],
  );

  const weightChange = useMemo(() => {
    if (weightLogs.length < 2) return null;
    const first = weightLogs[0].weightKg;
    const last = weightLogs[weightLogs.length - 1].weightKg;
    const deltaKg = last - first;
    const delta = unit === 'lb' ? kgToLb(deltaKg) : deltaKg;
    return delta;
  }, [weightLogs, unit]);

  const weeksOnTreatment =
    profile?.daysOnTreatment != null ? Math.max(0, Math.floor(profile.daysOnTreatment / 7)) : null;

  const expectedDoses = profile?.doseFrequency === 'daily' ? 28 : 4;
  const adherencePct = Math.min(100, Math.round((doseCount / expectedDoses) * 100));

  const checkinSeries = (key: keyof CheckinHistoryEntry): TrendPoint[] =>
    checkins
      .filter((c) => c[key] != null)
      .map((c) => ({ label: shortDate(c.date), value: Number(c[key]) }));

  const moodPoints = checkinSeries('mood');
  const energyPoints = checkinSeries('energy');
  const sleepQualityPoints = checkinSeries('sleepQuality');
  const sleepHoursPoints = checkinSeries('sleepHours');

  const currentStreak = useEngagementStore((state) => state.currentStreak);
  const longestStreak = useEngagementStore((state) => state.longestStreak);
  const earned = useEngagementStore((state) => state.earned);
  const earnedSet = new Set(earned);

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('progress.kicker')}</div>
        <h1 className="page-title">{t('progress.title')}</h1>
        <p className="page-subtitle">{t('progress.subtitle')}</p>
        <Link className="subtle-link" to="/reports">
          <FileText className="icon" style={{ display: 'inline-block' }} /> {t('progress.generateReport')}
        </Link>
      </div>

      <Section eyebrow={t('achievements.kicker')} title={t('achievements.streakTitle')}>
        <div className="grid cards">
          <article className="panel soft pad">
            <div className="panel-header">
              <div>
                <div className="dashboard-mini-label">{t('achievements.currentStreak')}</div>
                <div className="metric-value" style={{ fontSize: 34 }}>
                  🔥 {currentStreak}
                </div>
              </div>
              <Flame className="icon" />
            </div>
          </article>
          <article className="panel soft pad">
            <div className="panel-header">
              <div>
                <div className="dashboard-mini-label">{t('achievements.longestStreak')}</div>
                <div className="metric-value" style={{ fontSize: 34 }}>
                  {longestStreak}
                </div>
              </div>
              <Activity className="icon" />
            </div>
          </article>
        </div>

        <div style={{ height: 14 }} />

        <div className="dashboard-mini-label" style={{ marginBottom: 10 }}>{t('achievements.badges')}</div>
        <div className="achievement-grid">
          {achievementCatalog.map((def) => {
            const isEarned = earnedSet.has(def.code);
            return (
              <div className={isEarned ? 'achievement-badge' : 'achievement-badge locked'} key={def.code}>
                <span className="emoji">{def.emoji}</span>
                <span className="label">{t(`achievements.items.${def.code}.title`, def.code)}</span>
              </div>
            );
          })}
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <div className="grid cards">
        <article className="panel soft pad">
          <div className="panel-header">
            <div>
              <div className="dashboard-mini-label">{t('progress.weeksOnTreatment')}</div>
              <div className="metric-value" style={{ fontSize: 34 }}>
                {weeksOnTreatment ?? '—'}
              </div>
            </div>
            <Activity className="icon" />
          </div>
        </article>
        <article className="panel soft pad">
          <div className="panel-header">
            <div>
              <div className="dashboard-mini-label">{t('progress.weightChange')}</div>
              <div className="metric-value" style={{ fontSize: 34 }}>
                {weightChange != null ? `${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} ${unit}` : '—'}
              </div>
            </div>
            <TrendingDown className="icon" />
          </div>
        </article>
        <article className="panel soft pad">
          <div className="panel-header">
            <div>
              <div className="dashboard-mini-label">{t('progress.adherence')}</div>
              <div className="metric-value" style={{ fontSize: 34 }}>
                {doseCount > 0 ? `${adherencePct}%` : '—'}
              </div>
              <div className="dashboard-mini-label">{t('progress.adherenceHint')}</div>
            </div>
            <Scale className="icon" />
          </div>
        </article>
      </div>

      <div style={{ height: 16 }} />

      <Section
        eyebrow={t('progress.weightKicker')}
        title={t('progress.weightTitle')}
        action={
          <button className="subtle-link" type="button" onClick={toggleUnit}>
            {unit === 'kg' ? t('progress.showLb') : t('progress.showKg')}
          </button>
        }
      >
        {weightPoints.length > 0 ? (
          <TrendChart data={weightPoints} formatValue={(v) => `${v.toFixed(1)} ${unit}`} />
        ) : (
          <p className="panel-copy">{t('progress.noWeight')} <Link className="subtle-link" to="/dose-tracker">{t('progress.logNow')}</Link></p>
        )}
      </Section>

      <div style={{ height: 16 }} />

      <Section eyebrow={t('progress.wellbeingKicker')} title={t('progress.wellbeingTitle')}>
        {moodPoints.length > 0 || energyPoints.length > 0 || sleepHoursPoints.length > 0 ? (
          <div className="grid cards">
            {moodPoints.length > 0 ? (
              <div className="panel pad">
                <div className="list-item-title">{t('tracking.mood')}</div>
                <TrendChart data={moodPoints} yMin={1} yMax={5} color="var(--primary-strong)" />
              </div>
            ) : null}
            {energyPoints.length > 0 ? (
              <div className="panel pad">
                <div className="list-item-title">{t('tracking.energy')}</div>
                <TrendChart data={energyPoints} yMin={1} yMax={5} color="var(--accent)" />
              </div>
            ) : null}
            {sleepQualityPoints.length > 0 ? (
              <div className="panel pad">
                <div className="list-item-title">{t('tracking.sleepQuality')}</div>
                <TrendChart data={sleepQualityPoints} yMin={1} yMax={5} color="var(--primary)" />
              </div>
            ) : null}
            {sleepHoursPoints.length > 0 ? (
              <div className="panel pad">
                <div className="list-item-title">{t('tracking.sleepHours')}</div>
                <TrendChart data={sleepHoursPoints} formatValue={(v) => `${v.toFixed(1)}h`} color="var(--primary)" />
              </div>
            ) : null}
          </div>
        ) : (
          <p className="panel-copy">{t('progress.noWellbeing')} <Link className="subtle-link" to="/dose-tracker">{t('progress.logNow')}</Link></p>
        )}
      </Section>

      <div style={{ height: 16 }} />

      <Section eyebrow={t('progress.symptomsKicker')} title={t('progress.symptomsTitle')}>
        {symptomSeries.length > 0 ? (
          <div className="grid cards">
            {symptomSeries.map((series) => (
              <div className="panel pad" key={series.code}>
                <div className="list-item-title">{t(`sideEffects.content.${series.code}.title`, series.code)}</div>
                <TrendChart data={series.points} yMin={0} yMax={4} color="var(--accent)" />
              </div>
            ))}
          </div>
        ) : (
          <p className="panel-copy">{t('progress.noSymptoms')} <Link className="subtle-link" to="/symptom-monitor">{t('progress.logNow')}</Link></p>
        )}
      </Section>
    </main>
  );
}
