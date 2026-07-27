import { AlertTriangle, ArrowLeft, CheckCircle2, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../entities/auth/auth-store';
import { isInjectionDayToday, setInjectionDayToday } from '../../../entities/muscle-plan/injection-day';
import { useMusclePlanStore } from '../../../entities/muscle-plan/muscle-plan-store';
import type { Exercise } from '../../../entities/muscle-plan/types';
import { fetchWeightLogs } from '../../../lib/supabase/weight';
import { Section } from '../../../shared/ui/section';

export function MusclePlanSessionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dayIndex = '0' } = useParams<{ dayIndex: string }>();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const plan = useMusclePlanStore((state) => state.plan);
  const logSession = useMusclePlanStore((state) => state.logSession);

  const [injectionDay, setInjectionDay] = useState(isInjectionDayToday());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [weightKg, setWeightKg] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchWeightLogs(userId)
        .then((logs) => setWeightKg(logs.length > 0 ? logs[logs.length - 1].weightKg : null))
        .catch(() => undefined);
    }
  }, [userId]);

  if (!plan) {
    return <Navigate to="/muscle-plan/dashboard" replace />;
  }

  const week = plan.weeks.find((w) => w.weekNumber === plan.currentWeek) ?? plan.weeks[0];
  const day = week.workoutDays[Number(dayIndex)];
  if (!day) {
    return <Navigate to="/muscle-plan/dashboard" replace />;
  }

  function effectiveSets(exercise: Exercise): number {
    return injectionDay ? Math.max(exercise.sets - 1, 1) : exercise.sets;
  }

  function toggleInjection() {
    const next = !injectionDay;
    setInjectionDay(next);
    setInjectionDayToday(next);
  }

  const proteinGrams = weightKg ? Math.round(weightKg * 1.6) : null;

  async function handleComplete() {
    if (!userId || !plan) return;
    setSaving(true);
    setError(null);
    try {
      await logSession({
        userId,
        planId: plan.id,
        sessionDate: new Date().toISOString().slice(0, 10),
        weekNumber: plan.currentWeek,
        dayLabel: day.dayLabel,
        exercises: day.exercises.map((e) => ({ ...e, sets: effectiveSets(e) })),
        completed: true,
        durationMin: day.durationMin,
        glp1InjectionDay: injectionDay,
        notes: null,
      });
      setDone(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('musclePlan.session.saveError'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page muscle-theme">
      <Link className="subtle-link" to="/muscle-plan/dashboard">
        <ArrowLeft className="icon" style={{ display: 'inline-block' }} /> {t('musclePlan.session.back')}
      </Link>

      <div className="page-head">
        <h1 className="page-title">{t(day.focus)}</h1>
        <div className="dashboard-pills">
          <span className="pill soft">{t('musclePlan.dashboard.minutes', { count: day.durationMin })}</span>
        </div>
        <label className="list-item" style={{ cursor: 'pointer', maxWidth: 420 }}>
          <div className="list-item-title">{t('musclePlan.dashboard.glp1Card.toggle')}</div>
          <input type="checkbox" checked={injectionDay} onChange={toggleInjection} />
        </label>
      </div>

      {injectionDay ? (
        <div className="panel pad muscle-injection-banner" style={{ marginBottom: 16 }}>
          <div className="panel-header">
            <div>
              <div className="list-item-title">{t('musclePlan.session.injectionDayTitle')}</div>
              <p className="panel-copy">{t('musclePlan.session.injectionDayBody')}</p>
            </div>
            <AlertTriangle className="icon" />
          </div>
        </div>
      ) : null}

      <Section eyebrow={t('musclePlan.session.exercisesKicker')} title={t(day.dayLabel)}>
        <div className="list">
          {day.exercises.map((exercise, index) => {
            const key = `${exercise.id}-${index}`;
            const isOpen = expanded === key;
            return (
              <div className="panel pad" key={key}>
                <div className="panel-header">
                  <div>
                    <div className="list-item-title">{t(exercise.name)}</div>
                    <div className="choice-chip-row" style={{ marginTop: 6 }}>
                      {exercise.muscleGroups.map((group) => (
                        <span className="pill soft" key={group}>
                          {t(group)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="muscle-set-row">
                  <span className={injectionDay ? 'pill accent' : 'pill primary'}>
                    {t('musclePlan.session.setsReps', { sets: effectiveSets(exercise), reps: exercise.reps })}
                  </span>
                  <span className="pill soft">{t('musclePlan.session.rest', { seconds: exercise.restSeconds })}</span>
                </div>

                <button
                  type="button"
                  className="subtle-link"
                  onClick={() => setExpanded(isOpen ? null : key)}
                  style={{ marginTop: 10 }}
                >
                  {t('musclePlan.session.formNotes')}{' '}
                  <ChevronDown className="icon" style={{ display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : undefined }} />
                </button>

                {isOpen ? (
                  <div className="stack" style={{ gap: 8, marginTop: 8 }}>
                    <p className="panel-copy">{t(`musclePlan.exercises.${exercise.id}.howTo`, '')}</p>
                    {exercise.glp1Note ? (
                      <p className="panel-copy" style={{ fontStyle: 'italic' }}>{t(exercise.glp1Note)}</p>
                    ) : null}
                    {exercise.noEquipmentVariant ? (
                      <p className="panel-copy">
                        {t('musclePlan.session.noEquipment')}: {t(exercise.noEquipmentVariant)}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <div className="panel pad muscle-protein-card">
        <p className="panel-copy">
          {proteinGrams
            ? t('musclePlan.session.proteinReminder', { grams: proteinGrams })
            : t('musclePlan.session.proteinReminderNoWeight')}
        </p>
      </div>

      <div style={{ height: 16 }} />

      {error ? <div className="auth-alert">{error}</div> : null}

      {done ? (
        <div className="panel soft pad">
          <div className="panel-header">
            <p className="panel-copy">{t('musclePlan.session.completedFeedback')}</p>
            <CheckCircle2 className="icon" />
          </div>
          <button className="cta" type="button" onClick={() => navigate('/muscle-plan/dashboard')}>
            {t('musclePlan.session.backToDashboard')}
          </button>
        </div>
      ) : (
        <button className="cta" type="button" onClick={() => void handleComplete()} disabled={saving}>
          {saving ? t('auth.working') : t('musclePlan.session.complete')}
        </button>
      )}
    </main>
  );
}
