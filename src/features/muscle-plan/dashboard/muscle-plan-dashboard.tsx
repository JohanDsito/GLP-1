import { Activity, CheckCircle2, ChevronRight, Dumbbell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../entities/auth/auth-store';
import { isInjectionDayToday, setInjectionDayToday } from '../../../entities/muscle-plan/injection-day';
import { useMusclePlanStore } from '../../../entities/muscle-plan/muscle-plan-store';
import { useTreatmentProfileStore } from '../../../entities/treatment-profile/treatment-profile-store';
import { Section } from '../../../shared/ui/section';

function isoWeekStart(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}

function addWeeks(iso: string, delta: number): string {
  const d = new Date(`${iso}T00:00:00`);
  d.setDate(d.getDate() + delta * 7);
  return d.toISOString().slice(0, 10);
}

export function MusclePlanDashboardPage() {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const profile = useTreatmentProfileStore((state) => state.profile);
  const plan = useMusclePlanStore((state) => state.plan);
  const sessions = useMusclePlanStore((state) => state.sessions);
  const loadSessions = useMusclePlanStore((state) => state.loadSessions);
  const [injectionToday, setInjectionToday] = useState(isInjectionDayToday());

  useEffect(() => {
    if (userId) {
      void loadSessions(userId);
    }
  }, [userId, loadSessions]);

  if (!plan) {
    return null;
  }

  const week = plan.weeks.find((w) => w.weekNumber === plan.currentWeek) ?? plan.weeks[0];
  const medicationLabel = profile?.medication ?? 'GLP-1';

  const todayStr = new Date().toISOString().slice(0, 10);
  const thisWeekStart = isoWeekStart(todayStr);
  const sessionsThisWeek = sessions.filter((s) => s.completed && isoWeekStart(s.sessionDate) === thisWeekStart).length;
  const target = week.workoutDays.length;

  // Streak: consecutive weeks (up to this one) with at least one completed session.
  const activeWeeks = new Set(sessions.filter((s) => s.completed).map((s) => isoWeekStart(s.sessionDate)));
  let weekStreak = 0;
  let cursor = activeWeeks.has(thisWeekStart) ? thisWeekStart : addWeeks(thisWeekStart, -1);
  while (activeWeeks.has(cursor)) {
    weekStreak += 1;
    cursor = addWeeks(cursor, -1);
  }

  function toggleInjection() {
    const next = !injectionToday;
    setInjectionToday(next);
    setInjectionDayToday(next);
  }

  return (
    <main className="page muscle-theme">
      <div className="muscle-hero">
        <div className="page-kicker">{t('musclePlan.dashboard.kicker')}</div>
        <h1 className="page-title">
          {t('musclePlan.dashboard.title', { week: plan.currentWeek, level: t(`musclePlan.level.${plan.quizAnswers.fitnessLevel}`) })}
        </h1>
        <p className="page-subtitle">{t('musclePlan.dashboard.adaptedFor', { medication: medicationLabel })}</p>
        <div className="dashboard-pills" style={{ marginTop: 12 }}>
          <span className="pill primary">{t(`musclePlan.level.${plan.quizAnswers.fitnessLevel}`)}</span>
          <span className="pill accent">{t(`musclePlan.equipment.${plan.quizAnswers.equipment}`)}</span>
          <span className="pill soft">{t('musclePlan.dashboard.daysPill', { count: plan.quizAnswers.daysPerWeek })}</span>
        </div>
      </div>

      <Section eyebrow={t('musclePlan.dashboard.weekKicker')} title={t('musclePlan.dashboard.weekTitle')}>
        <div className="muscle-day-row">
          {week.workoutDays.map((day, index) => {
            const done = sessions.some(
              (s) => s.completed && s.dayLabel === day.dayLabel && isoWeekStart(s.sessionDate) === thisWeekStart,
            );
            return (
              <Link className="muscle-day-card" key={`${day.dayLabel}-${index}`} to={`/muscle-plan/session/${index}`}>
                <div className="muscle-day-card__focus">{t(day.focus)}</div>
                <div className="list-item-title">{t(day.dayLabel)}</div>
                <div className="list-item-copy">{t('musclePlan.dashboard.minutes', { count: day.durationMin })}</div>
                {done ? (
                  <span className="pill primary" style={{ marginTop: 8 }}>
                    <CheckCircle2 className="icon" />
                    {t('musclePlan.dashboard.done')}
                  </span>
                ) : (
                  <span className="subtle-link" style={{ marginTop: 8 }}>
                    {t('musclePlan.dashboard.start')} <ChevronRight className="icon" style={{ display: 'inline-block' }} />
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </Section>

      <div style={{ height: 16 }} />

      <div className="panel pad muscle-glp1-card">
        <div className="panel-header">
          <div>
            <div className="pill accent">{t('musclePlan.dashboard.glp1Card.badge')}</div>
            <h2 className="panel-title" style={{ marginTop: 8 }}>{t('musclePlan.dashboard.glp1Card.title')}</h2>
            <p className="panel-copy">{t('musclePlan.dashboard.glp1Card.body')}</p>
          </div>
          <Activity className="icon" />
        </div>
        <label className="list-item" style={{ cursor: 'pointer' }}>
          <div className="list-item-title">{t('musclePlan.dashboard.glp1Card.toggle')}</div>
          <input type="checkbox" checked={injectionToday} onChange={toggleInjection} />
        </label>
      </div>

      <div style={{ height: 16 }} />

      <Section eyebrow={t('musclePlan.dashboard.progressKicker')} title={t('musclePlan.dashboard.progressTitle')}>
        <div className="grid cards">
          <article className="panel soft pad">
            <div className="dashboard-mini-label">{t('musclePlan.dashboard.sessionsThisWeek')}</div>
            <div className="metric-value" style={{ fontSize: 32 }}>
              {sessionsThisWeek} / {target}
            </div>
          </article>
          <article className="panel soft pad">
            <div className="dashboard-mini-label">{t('musclePlan.dashboard.weekProgress')}</div>
            <div className="metric-value" style={{ fontSize: 32 }}>
              {plan.currentWeek} / 12
            </div>
            <div className="onboarding-progress" aria-hidden="true" style={{ marginTop: 8 }}>
              <span style={{ width: `${(plan.currentWeek / 12) * 100}%` }} />
            </div>
          </article>
          <article className="panel soft pad">
            <div className="dashboard-mini-label">{t('musclePlan.dashboard.weekStreak')}</div>
            <div className="metric-value" style={{ fontSize: 32 }}>
              <Dumbbell className="icon" style={{ display: 'inline-block' }} /> {weekStreak}
            </div>
          </article>
        </div>
      </Section>
    </main>
  );
}
