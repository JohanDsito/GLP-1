import { CalendarDays, CheckCircle2, LineChart, Moon, Plus, RotateCcw, Scale } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../entities/auth/auth-store';
import type { SideEffect } from '../../entities/side-effects/types';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import { fetchTodayCheckin, upsertTodayCheckin, type DailyCheckin } from '../../lib/supabase/checkins';
import { fetchRecentDoses, hasLoggedForPeriod, logDose, type DoseEntry } from '../../lib/supabase/doses';
import { fetchActiveSideEffects, fetchTodaySymptomRecords, saveDailySymptoms } from '../../lib/supabase/symptoms';
import { fetchWeightLogs, kgToLb, lbToKg, upsertTodayWeight } from '../../lib/supabase/weight';
import { Section } from '../../shared/ui/section';

type WeightUnit = 'kg' | 'lb';
const UNIT_KEY = 'glp1-weight-unit';

const scale = [1, 2, 3, 4, 5];
const severityChoices = [
  { value: 0, key: 'none' },
  { value: 2, key: 'mild' },
  { value: 3, key: 'moderate' },
  { value: 4, key: 'high' },
];
const defaultCheckinCodes = ['nausea', 'fatigue', 'constipation', 'headache', 'moodSwings', 'anxiety'];

export function DoseTrackerPage() {
  const { t } = useTranslation();
  const profile = useTreatmentProfileStore((state) => state.profile);
  const userId = useAuthStore((state) => state.user?.id ?? null);

  const [doses, setDoses] = useState<DoseEntry[]>([]);
  const [alreadyLogged, setAlreadyLogged] = useState(false);
  const [savingDose, setSavingDose] = useState(false);

  const [checkin, setCheckin] = useState<DailyCheckin>({ mood: null, energy: null, sleepHours: null, sleepQuality: null });
  const [savingCheckin, setSavingCheckin] = useState(false);
  const [checkinLocked, setCheckinLocked] = useState(false);
  const [editingCheckin, setEditingCheckin] = useState(false);

  // Daily symptom check-in
  const [checkinEffects, setCheckinEffects] = useState<SideEffect[]>([]);
  const [symptomSeverities, setSymptomSeverities] = useState<Record<string, number>>({});
  const [symptomsLocked, setSymptomsLocked] = useState(false);
  const [editingSymptoms, setEditingSymptoms] = useState(false);
  const [savingSymptoms, setSavingSymptoms] = useState(false);

  const [weightUnit, setWeightUnit] = useState<WeightUnit>(
    () => ((typeof localStorage !== 'undefined' && localStorage.getItem(UNIT_KEY)) as WeightUnit) || 'kg',
  );
  const [weightInput, setWeightInput] = useState('');
  const [savingWeight, setSavingWeight] = useState(false);
  const [weightSaved, setWeightSaved] = useState(false);

  const frequency = profile?.doseFrequency ?? 'weekly';
  const doseLabel = profile?.medicationDoseText || profile?.medication || t('doses.unknownMedication');

  useEffect(() => {
    if (!userId) {
      return;
    }

    let mounted = true;

    async function load() {
      try {
        const [recent, logged, todayCheckin, effects, todayRecords, weights] = await Promise.all([
          fetchRecentDoses(userId as string),
          hasLoggedForPeriod(userId as string, frequency),
          fetchTodayCheckin(userId as string),
          fetchActiveSideEffects(),
          fetchTodaySymptomRecords(userId as string),
          fetchWeightLogs(userId as string),
        ]);

        if (!mounted) {
          return;
        }

        setDoses(recent);
        setAlreadyLogged(logged);
        if (todayCheckin) {
          setCheckin(todayCheckin);
          setCheckinLocked(true);
        }

        const latestWeight = weights[weights.length - 1];
        if (latestWeight) {
          const shown = weightUnit === 'lb' ? kgToLb(latestWeight.weightKg) : latestWeight.weightKg;
          setWeightInput(shown.toFixed(1));
        }

        // Build the daily symptom list: declared symptoms first, then common ones.
        const declared = (profile?.symptomCodes ?? []).filter((code) => code && code !== 'none');
        const codes = Array.from(new Set([...declared, ...defaultCheckinCodes]));
        const byCode = new Map(effects.map((e) => [e.code, e]));
        const list = codes.map((code) => byCode.get(code)).filter((e): e is SideEffect => Boolean(e));
        setCheckinEffects(list);

        // Prefill severities from today's records; lock if any exist.
        const severities: Record<string, number> = {};
        for (const effect of list) {
          severities[effect.id] = todayRecords[effect.id] ?? 0;
        }
        setSymptomSeverities(severities);
        setSymptomsLocked(Object.keys(todayRecords).length > 0);
      } catch {
        // Keep the page usable if Supabase isn't reachable.
      }
    }

    void load();

    return () => {
      mounted = false;
    };
  }, [userId, frequency, profile?.symptomCodes, weightUnit]);

  async function handleLogDose() {
    if (!userId || alreadyLogged) {
      return;
    }
    setSavingDose(true);
    try {
      await logDose(userId, doseLabel);
      setDoses(await fetchRecentDoses(userId));
      setAlreadyLogged(true);
    } catch {
      // Non-fatal.
    } finally {
      setSavingDose(false);
    }
  }

  async function handleSaveCheckin() {
    if (!userId) return;
    setSavingCheckin(true);
    try {
      await upsertTodayCheckin(userId, checkin);
      setCheckinLocked(true);
      setEditingCheckin(false);
    } catch {
      // Non-fatal.
    } finally {
      setSavingCheckin(false);
    }
  }

  async function handleSaveSymptoms() {
    if (!userId) return;
    setSavingSymptoms(true);
    try {
      await saveDailySymptoms(userId, symptomSeverities);
      setSymptomsLocked(true);
      setEditingSymptoms(false);
    } catch {
      // Non-fatal.
    } finally {
      setSavingSymptoms(false);
    }
  }

  function handleToggleWeightUnit() {
    const next = weightUnit === 'kg' ? 'lb' : 'kg';
    const current = Number(weightInput);
    if (weightInput && !Number.isNaN(current)) {
      const converted = weightUnit === 'kg' ? kgToLb(current) : lbToKg(current);
      setWeightInput(converted.toFixed(1));
    }
    setWeightUnit(next);
    try {
      localStorage.setItem(UNIT_KEY, next);
    } catch {
      // ignore
    }
  }

  async function handleSaveWeight() {
    const value = Number(weightInput);
    if (!userId || !weightInput || Number.isNaN(value) || value <= 0) {
      return;
    }
    setSavingWeight(true);
    setWeightSaved(false);
    try {
      const weightKg = weightUnit === 'lb' ? lbToKg(value) : value;
      await upsertTodayWeight(userId, weightKg);
      setWeightSaved(true);
    } catch {
      // Non-fatal.
    } finally {
      setSavingWeight(false);
    }
  }

  function ScaleRow({
    label,
    value,
    onSelect,
  }: {
    label: string;
    value: number | null;
    onSelect: (next: number) => void;
  }) {
    return (
      <div className="stack" style={{ gap: 8 }}>
        <span className="onboarding-step">{label}</span>
        <div className="choice-chip-row">
          {scale.map((level) => (
            <button
              key={level}
              type="button"
              className={value === level ? 'choice-chip selected' : 'choice-chip'}
              onClick={() => onSelect(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const activeSymptomsToday = checkinEffects.filter((e) => (symptomSeverities[e.id] ?? 0) > 0);

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('tracking.kicker')}</div>
        <h1 className="page-title">{t('tracking.title')}</h1>
        <p className="page-subtitle">{t('tracking.subtitle')}</p>
        <Link className="subtle-link" to="/progress">
          <LineChart className="icon" style={{ display: 'inline-block' }} /> {t('tracking.viewProgress')}
        </Link>
      </div>

      <Section eyebrow={t('doses.currentWeek')} title={t('doses.doseRhythm')}>
        <div className="grid cards">
          <article className="panel pad">
            <div className="panel-header">
              <div>
                <div className="pill primary">{t(`tracking.frequency.${frequency}`)}</div>
                <p className="panel-copy">{t('doses.todayMapped')}</p>
              </div>
              <CalendarDays className="icon" />
            </div>
            <div className="metric">
              <div className="metric-value">{doseLabel}</div>
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
            {alreadyLogged ? (
              <div className="pill primary" style={{ width: 'fit-content' }}>
                <CheckCircle2 className="icon" />
                {frequency === 'daily' ? t('tracking.loggedToday') : t('tracking.loggedThisWeek')}
              </div>
            ) : (
              <button className="cta" type="button" onClick={() => void handleLogDose()} disabled={savingDose}>
                {savingDose ? t('auth.working') : t('doses.logToday')}
              </button>
            )}
          </article>
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <Section eyebrow={t('tracking.checkinKicker')} title={t('tracking.checkinTitle')}>
        <div className="panel pad">
          {checkinLocked && !editingCheckin ? (
            <div className="stack" style={{ gap: 12 }}>
              <div className="pill primary" style={{ width: 'fit-content' }}>
                <CheckCircle2 className="icon" />
                {t('tracking.symptomsDone')}
              </div>
              <div className="dashboard-mini-grid">
                <div className="dashboard-mini-card">
                  <span className="dashboard-mini-label">{t('tracking.mood')}</span>
                  <strong>{checkin.mood ?? '—'}</strong>
                </div>
                <div className="dashboard-mini-card">
                  <span className="dashboard-mini-label">{t('tracking.energy')}</span>
                  <strong>{checkin.energy ?? '—'}</strong>
                </div>
                <div className="dashboard-mini-card">
                  <span className="dashboard-mini-label">{t('tracking.sleepHours')}</span>
                  <strong>{checkin.sleepHours != null ? `${checkin.sleepHours}h` : '—'}</strong>
                </div>
                <div className="dashboard-mini-card">
                  <span className="dashboard-mini-label">{t('tracking.sleepQuality')}</span>
                  <strong>{checkin.sleepQuality ?? '—'}</strong>
                </div>
              </div>
              <button className="cta secondary" type="button" onClick={() => setEditingCheckin(true)}>
                <RotateCcw className="icon" />
                {t('tracking.logAgain')}
              </button>
            </div>
          ) : (
            <div className="stack" style={{ gap: 16 }}>
              <ScaleRow label={t('tracking.mood')} value={checkin.mood} onSelect={(n) => setCheckin((c) => ({ ...c, mood: n }))} />
              <ScaleRow label={t('tracking.energy')} value={checkin.energy} onSelect={(n) => setCheckin((c) => ({ ...c, energy: n }))} />
              <label className="stack" style={{ gap: 8 }}>
                <span className="onboarding-step">
                  <Moon className="icon" style={{ display: 'inline-block', marginRight: 4 }} />
                  {t('tracking.sleepHours')}
                </span>
                <input
                  className="auth-input"
                  type="number"
                  min={0}
                  max={16}
                  step={0.5}
                  value={checkin.sleepHours ?? ''}
                  onChange={(event) =>
                    setCheckin((c) => ({ ...c, sleepHours: event.target.value === '' ? null : Number(event.target.value) }))
                  }
                />
              </label>
              <ScaleRow label={t('tracking.sleepQuality')} value={checkin.sleepQuality} onSelect={(n) => setCheckin((c) => ({ ...c, sleepQuality: n }))} />
              <button className="cta" type="button" onClick={() => void handleSaveCheckin()} disabled={savingCheckin}>
                {savingCheckin ? t('auth.working') : t('tracking.saveCheckin')}
              </button>
            </div>
          )}
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <Section eyebrow={t('tracking.symptomsKicker')} title={t('tracking.symptomsTitle')}>
        <div className="panel pad">
          {symptomsLocked && !editingSymptoms ? (
            <div className="stack" style={{ gap: 12 }}>
              <div className="pill primary" style={{ width: 'fit-content' }}>
                <CheckCircle2 className="icon" />
                {t('tracking.symptomsDone')}
              </div>
              <p className="panel-copy">
                {activeSymptomsToday.length > 0
                  ? activeSymptomsToday.map((e) => t(`sideEffects.content.${e.code}.title`, e.code)).join(', ')
                  : t('tracking.noSymptomsToday')}
              </p>
              <button className="cta secondary" type="button" onClick={() => setEditingSymptoms(true)}>
                <RotateCcw className="icon" />
                {t('tracking.logAgain')}
              </button>
            </div>
          ) : (
            <div className="stack" style={{ gap: 16 }}>
              <p className="panel-copy">{t('tracking.symptomsPrompt')}</p>
              {checkinEffects.map((effect) => (
                <div className="stack" key={effect.id} style={{ gap: 8 }}>
                  <span className="onboarding-step">{t(`sideEffects.content.${effect.code}.title`, effect.code)}</span>
                  <div className="choice-chip-row">
                    {severityChoices.map((choice) => (
                      <button
                        key={choice.key}
                        type="button"
                        className={(symptomSeverities[effect.id] ?? 0) === choice.value ? 'choice-chip selected' : 'choice-chip'}
                        onClick={() => setSymptomSeverities((s) => ({ ...s, [effect.id]: choice.value }))}
                      >
                        {t(`sideEffects.severityOptions.${choice.key}`)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="cta" type="button" onClick={() => void handleSaveSymptoms()} disabled={savingSymptoms}>
                {savingSymptoms ? t('auth.working') : t('tracking.saveSymptoms')}
              </button>
              <Link className="subtle-link" to="/symptom-monitor">
                {t('tracking.learnSymptoms')}
              </Link>
            </div>
          )}
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <Section
        eyebrow={t('tracking.weightKicker')}
        title={t('tracking.weightTitle')}
        action={
          <button className="subtle-link" type="button" onClick={handleToggleWeightUnit}>
            {weightUnit === 'kg' ? t('progress.showLb') : t('progress.showKg')}
          </button>
        }
      >
        <div className="panel pad">
          <div className="panel-header">
            <div>
              <p className="panel-copy">{t('tracking.weightHelp')}</p>
            </div>
            <Scale className="icon" />
          </div>
          <div className="stack" style={{ gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                className="auth-input"
                type="number"
                min={0}
                step={0.1}
                placeholder={weightUnit === 'kg' ? '75.0' : '165.0'}
                value={weightInput}
                onChange={(event) => setWeightInput(event.target.value)}
                style={{ flex: 1 }}
              />
              <span className="pill soft">{weightUnit}</span>
            </div>
            <button className="cta" type="button" onClick={() => void handleSaveWeight()} disabled={savingWeight}>
              {savingWeight ? t('auth.working') : t('tracking.saveWeight')}
            </button>
            {weightSaved ? (
              <p className="panel-copy" style={{ fontSize: 13 }}>
                <CheckCircle2 className="icon" style={{ display: 'inline-block', marginRight: 4 }} />
                {t('tracking.checkinSaved')}
              </p>
            ) : null}
          </div>
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <Section eyebrow={t('doses.history')} title={t('doses.recentDoses')}>
        {doses.length > 0 ? (
          <div className="list">
            {doses.map((dose) => (
              <div className="list-item" key={dose.id}>
                <div>
                  <div className="list-item-title">{dose.scheduledFor}</div>
                  <div className="list-item-copy">{dose.dosage}</div>
                </div>
                <span className="pill primary">
                  <CheckCircle2 className="icon" />
                  {t('doses.onTime')}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="panel-copy">{t('tracking.noDosesYet')}</p>
        )}
      </Section>
    </main>
  );
}
