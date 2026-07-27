import { ArrowRight, CalendarDays, Dumbbell, HeartPulse, LineChart, MessageSquareText, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useEngagementStore } from '../../entities/achievements/engagement-store';
import { useAuthStore } from '../../entities/auth/auth-store';
import {
    buildDashboardRecommendations
} from '../../entities/recommendation/recommendation-engine';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import { getFirstName } from '../../lib/supabase/profile';
import { fetchActiveSideEffects, fetchRecentSymptomRecords } from '../../lib/supabase/symptoms';

function formatStage(stage: string) {
  return stage.replaceAll('_', ' ');
}

function formatMedication(medication: string) {
  switch (medication) {
    case 'semaglutide':
      return 'Semaglutide';
    case 'tirzepatide':
      return 'Tirzepatide';
    case 'liraglutide':
      return 'Liraglutide';
    case 'unknown':
      return 'Medication pending';
    default:
      return medication;
  }
}

function getPriorityTone(tone: 'primary' | 'accent' | 'soft') {
  if (tone === 'accent') {
    return 'pill accent';
  }

  if (tone === 'soft') {
    return 'pill soft';
  }

  return 'pill primary';
}

export function DashboardPage() {
  const { t } = useTranslation();
  const profile = useTreatmentProfileStore((state) => state.profile);
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const firstName = getFirstName(user);
  const [activeSymptomCodes, setActiveSymptomCodes] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let mounted = true;

    Promise.all([fetchActiveSideEffects(), fetchRecentSymptomRecords(userId)])
      .then(([effects, records]) => {
        if (!mounted) {
          return;
        }

        const codeById = new Map(effects.map((effect) => [effect.id, effect.code]));
        const codes = records
          .filter((record) => record.severity > 0)
          .map((record) => codeById.get(record.symptomId))
          .filter((code): code is string => Boolean(code));

        setActiveSymptomCodes(Array.from(new Set(codes)));
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [userId]);

  const currentStreak = useEngagementStore((state) => state.currentStreak);
  const recommendations = buildDashboardRecommendations(profile, activeSymptomCodes);
  const topRecommendation = recommendations[0];

  return (
    <main className="page dashboard-page">
      <section className="dashboard-hero panel">
        <div className="dashboard-hero__content">
          <div className="page-kicker">
            {firstName ? t('dashboard.greeting', { name: firstName }) : t('dashboard.personalizedToday')}
          </div>
          <h1 className="dashboard-title">
            {profile ? t('dashboard.titleKnown') : t('dashboard.titleUnknown')}
          </h1>
          <p className="dashboard-copy">{t('dashboard.headline.' + (profile ? (profile.symptomProfile === 'high' ? 'reactiveHigh' : profile.stage === 'stopped' || profile.stage === 'paused' ? 'paused' : profile.intent === 'preventive' ? 'preventive' : 'generic') : 'setup'))}</p>

          {currentStreak > 0 ? (
            <Link to="/progress" className="streak-chip" style={{ width: 'fit-content', marginBottom: 4 }}>
              🔥 {t('achievements.streakDays', { count: currentStreak })}
            </Link>
          ) : null}

          <div className="dashboard-pills">
            <span className={profile?.intent === 'preventive' ? 'pill soft' : 'pill primary'}>
              {profile?.intent === 'preventive' ? t('dashboard.preventiveMode') : t('dashboard.activeGuidance')}
            </span>
            <span className="pill accent">
              {profile ? formatMedication(profile.medication) : t('dashboard.noProfileYet')}
            </span>
            <span className="pill primary">{profile ? formatStage(profile.stage) : t('dashboard.onboardingRequired')}</span>
          </div>
        </div>

        <div className="dashboard-hero__panel">
          <div className="dashboard-signal">
            <div className="dashboard-signal__label">{t('dashboard.todayFocus')}</div>
            <div className="dashboard-signal__value">
              {topRecommendation?.title ?? t('dashboard.completeOnboarding')}
            </div>
            <div className="dashboard-signal__copy">
              {topRecommendation?.copy ?? t('dashboard.recommendations.onboarding.copy')}
            </div>
          </div>

          <div className="dashboard-mini-grid">
            <div className="dashboard-mini-card">
              <span className="dashboard-mini-label">{t('dashboard.medication')}</span>
              <strong>{profile ? formatMedication(profile.medication) : t('dashboard.pending')}</strong>
            </div>
            <div className="dashboard-mini-card">
              <span className="dashboard-mini-label">{t('dashboard.language')}</span>
              <strong>{profile?.language.toUpperCase() ?? 'EN'}</strong>
            </div>
            <div className="dashboard-mini-card">
              <span className="dashboard-mini-label">{t('dashboard.symptoms')}</span>
              <strong>{profile?.symptomProfile ?? t('dashboard.notSet')}</strong>
            </div>
            <div className="dashboard-mini-card">
              <span className="dashboard-mini-label">{t('dashboard.status')}</span>
              <strong>{profile ? t('dashboard.active') : t('dashboard.setup')}</strong>
            </div>
          </div>
        </div>
      </section>

      <Link className="muscle-entry-card" to="/muscle-plan/dashboard">
        <div>
          <div className="list-item-title">{t('musclePlan.title')}</div>
          <div className="list-item-copy">{t('dashboard.musclePlanEntry')}</div>
        </div>
        <Dumbbell className="icon" />
      </Link>

      <section className="dashboard-layout">
        <div className="dashboard-main">
          <article className="panel pad dashboard-priority">
            <div className="panel-header">
              <div>
                <div className="page-kicker">{t('dashboard.priorityStack')}</div>
                <h2 className="panel-title">{t('dashboard.priorityTitle')}</h2>
              </div>
              <Link className="subtle-link" to="/symptom-monitor">
                {t('dashboard.openSymptoms')} <ArrowRight className="icon" style={{ display: 'inline-block' }} />
              </Link>
            </div>

            <div className="dashboard-priority__lead">
              <div className="dashboard-priority__icon">
                <Sparkles className="icon" />
              </div>
              <div>
                <div className="dashboard-priority__title">
                  {t(`dashboard.recommendations.${topRecommendation?.id}.title`, topRecommendation?.title)}
                </div>
                <p className="panel-copy">
                  {t(`dashboard.recommendations.${topRecommendation?.id}.copy`, topRecommendation?.copy)}
                </p>
              </div>
            </div>

            <div className="dashboard-list">
              {recommendations.map((item) => (
                <Link className="dashboard-recommendation" key={item.id} to={item.href}>
                  <div>
                    <div className="list-item-title">{t(`dashboard.recommendations.${item.id}.title`, item.title)}</div>
                    <div className="list-item-copy">{t(`dashboard.recommendations.${item.id}.copy`, item.copy)}</div>
                  </div>
                  <span className={getPriorityTone(item.tone)}>{item.priority}</span>
                </Link>
              ))}
            </div>
          </article>

          <div className="dashboard-actions-grid">
            <Link className="dashboard-action-card" to="/dose-tracker">
              <CalendarDays className="icon" />
              <div>
                <div className="list-item-title">{t('dashboard.logDose')}</div>
                <div className="list-item-copy">{t('dashboard.quickActions.logDose')}</div>
              </div>
            </Link>
            <Link className="dashboard-action-card" to="/reports">
              <MessageSquareText className="icon" />
              <div>
                <div className="list-item-title">{t('dashboard.doctorReport')}</div>
                <div className="list-item-copy">{t('dashboard.quickActions.report')}</div>
              </div>
            </Link>
            <Link className="dashboard-action-card" to="/progress">
              <LineChart className="icon" />
              <div>
                <div className="list-item-title">{t('dashboard.progress')}</div>
                <div className="list-item-copy">{t('dashboard.quickActions.progress')}</div>
              </div>
            </Link>
          </div>
        </div>

        <aside className="dashboard-rail">
          <article className="panel pad dashboard-rail-card">
            <div className="panel-header">
              <div>
                <div className="page-kicker">{t('reports.snapshot')}</div>
                <h2 className="panel-title">{t('dashboard.treatmentProfile')}</h2>
              </div>
              <HeartPulse className="icon" />
            </div>

            <div className="dashboard-rail-stack">
              <div className="dashboard-rail-row">
                <span className="dashboard-mini-label">{t('dashboard.stage')}</span>
                <strong>{profile ? formatStage(profile.stage) : t('dashboard.wait')}</strong>
              </div>
              <div className="dashboard-rail-row">
                <span className="dashboard-mini-label">{t('dashboard.goal')}</span>
                <strong>{profile?.goal ?? t('dashboard.notSet')}</strong>
              </div>
              <div className="dashboard-rail-row">
                <span className="dashboard-mini-label">{t('dashboard.intent')}</span>
                <strong>{profile?.intent ?? t('dashboard.notSet')}</strong>
              </div>
            </div>
          </article>

          <article className="panel pad dashboard-rail-card dashboard-rail-card--soft">
            <div className="panel-header">
              <div>
                <div className="page-kicker">{t('dashboard.nextStep')}</div>
                <h2 className="panel-title">{t('dashboard.keepMomentum')}</h2>
              </div>
              <ArrowRight className="icon" />
            </div>
            <p className="panel-copy">
              {profile ? t('dashboard.progressCopyKnown') : t('dashboard.progressCopyUnknown')}
            </p>
            <div className="stack">
              <Link className="cta" to={profile?.symptomProfile === 'none' ? '/dose-tracker' : '/symptom-monitor'}>
                {t('dashboard.continue')}
              </Link>
              <Link className="cta secondary" to="/settings">
                {t('dashboard.reviewAccount')}
              </Link>
            </div>
          </article>
        </aside>
      </section>
    </main>
  );
}

