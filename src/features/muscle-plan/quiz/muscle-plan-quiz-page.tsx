import { ChevronRight, Dumbbell, Gauge, PersonStanding, CalendarRange, Cake } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../entities/auth/auth-store';
import { generateMusclePlan } from '../../../entities/muscle-plan/plan-generator';
import { useMusclePlanStore } from '../../../entities/muscle-plan/muscle-plan-store';
import type {
  AgeRange,
  Equipment,
  FitnessLevel,
  Gender,
  MusclePlanQuizAnswers,
} from '../../../entities/muscle-plan/types';
import { useTreatmentProfileStore } from '../../../entities/treatment-profile/treatment-profile-store';

type QuizKey = 'gender' | 'ageRange' | 'fitnessLevel' | 'daysPerWeek' | 'equipment';

interface Option {
  value: string;
  title: string;
  subtext?: string;
}

interface StepConfig {
  key: QuizKey;
  eyebrow: string;
  title: string;
  icon: typeof Dumbbell;
  options: Option[];
  calloutKey?: string; // shown always under the options
  seniorCalloutValue?: string; // callout shown only when this option is selected
}

function metadataSexToGender(sex: unknown): Gender {
  if (sex === 'female' || sex === 'male' || sex === 'other') {
    return sex;
  }
  return 'female';
}

export function MusclePlanQuizPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id ?? null;
  const profile = useTreatmentProfileStore((state) => state.profile);
  const savePlan = useMusclePlanStore((state) => state.savePlan);

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<MusclePlanQuizAnswers>(() => ({
    gender: metadataSexToGender(user?.user_metadata?.sex),
    ageRange: '31-45',
    fitnessLevel: 'beginner',
    daysPerWeek: 3,
    equipment: 'none',
    glp1Medication: profile?.medication ?? 'unknown',
  }));

  const steps = useMemo<StepConfig[]>(
    () => [
      {
        key: 'gender',
        eyebrow: t('musclePlan.quiz.gender.eyebrow'),
        title: t('musclePlan.quiz.gender.title'),
        icon: PersonStanding,
        options: [
          { value: 'male', title: t('musclePlan.quiz.gender.male') },
          { value: 'female', title: t('musclePlan.quiz.gender.female') },
          { value: 'other', title: t('musclePlan.quiz.gender.other') },
        ],
      },
      {
        key: 'ageRange',
        eyebrow: t('musclePlan.quiz.age.eyebrow'),
        title: t('musclePlan.quiz.age.title'),
        icon: Cake,
        seniorCalloutValue: '60+',
        options: [
          { value: '18-30', title: '18-30' },
          { value: '31-45', title: '31-45' },
          { value: '46-60', title: '46-60' },
          { value: '60+', title: '60+' },
        ],
      },
      {
        key: 'fitnessLevel',
        eyebrow: t('musclePlan.quiz.fitness.eyebrow'),
        title: t('musclePlan.quiz.fitness.title'),
        icon: Gauge,
        options: [
          { value: 'beginner', title: t('musclePlan.quiz.fitness.beginner'), subtext: t('musclePlan.quiz.fitness.beginnerSub') },
          { value: 'intermediate', title: t('musclePlan.quiz.fitness.intermediate'), subtext: t('musclePlan.quiz.fitness.intermediateSub') },
          { value: 'advanced', title: t('musclePlan.quiz.fitness.advanced'), subtext: t('musclePlan.quiz.fitness.advancedSub') },
        ],
      },
      {
        key: 'daysPerWeek',
        eyebrow: t('musclePlan.quiz.days.eyebrow'),
        title: t('musclePlan.quiz.days.title'),
        icon: CalendarRange,
        calloutKey: 'musclePlan.quiz.days.glp1Note',
        options: [
          { value: '2', title: t('musclePlan.quiz.days.d2'), subtext: t('musclePlan.quiz.days.d2sub') },
          { value: '3', title: t('musclePlan.quiz.days.d3'), subtext: t('musclePlan.quiz.days.d3sub') },
          { value: '4', title: t('musclePlan.quiz.days.d4'), subtext: t('musclePlan.quiz.days.d4sub') },
          { value: '5', title: t('musclePlan.quiz.days.d5'), subtext: t('musclePlan.quiz.days.d5sub') },
        ],
      },
      {
        key: 'equipment',
        eyebrow: t('musclePlan.quiz.equipment.eyebrow'),
        title: t('musclePlan.quiz.equipment.title'),
        icon: Dumbbell,
        options: [
          { value: 'none', title: t('musclePlan.quiz.equipment.none'), subtext: t('musclePlan.quiz.equipment.noneSub') },
          { value: 'bands', title: t('musclePlan.quiz.equipment.bands'), subtext: t('musclePlan.quiz.equipment.bandsSub') },
          { value: 'dumbbells', title: t('musclePlan.quiz.equipment.dumbbells'), subtext: t('musclePlan.quiz.equipment.dumbbellsSub') },
          { value: 'full_gym', title: t('musclePlan.quiz.equipment.fullGym'), subtext: t('musclePlan.quiz.equipment.fullGymSub') },
        ],
      },
    ],
    [t],
  );

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;
  const Icon = current.icon;
  const selectedValue = String(answers[current.key]);

  function handleSelect(value: string) {
    setAnswers((prev) => {
      if (current.key === 'daysPerWeek') {
        return { ...prev, daysPerWeek: Number(value) as MusclePlanQuizAnswers['daysPerWeek'] };
      }
      if (current.key === 'gender') return { ...prev, gender: value as Gender };
      if (current.key === 'ageRange') return { ...prev, ageRange: value as AgeRange };
      if (current.key === 'fitnessLevel') return { ...prev, fitnessLevel: value as FitnessLevel };
      if (current.key === 'equipment') return { ...prev, equipment: value as Equipment };
      return prev;
    });
  }

  async function handleNext() {
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    if (!userId) {
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const weeks = generateMusclePlan(answers, profile);
      await savePlan(userId, answers, weeks, 1);
      navigate('/muscle-plan/dashboard', { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t('musclePlan.quiz.saveError'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="onboarding-shell muscle-theme">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <Dumbbell className="icon" />
          <span>{t('musclePlan.title')}</span>
        </div>
        <div className="page-kicker">{t('musclePlan.quiz.kicker')}</div>
        <h1 className="page-title">{t('musclePlan.quiz.heroTitle')}</h1>
        <p className="page-subtitle">{t('musclePlan.quiz.heroCopy')}</p>
        <div className="onboarding-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="onboarding-card panel pad">
        <div className="panel-header">
          <div>
            <div className="page-kicker">{current.eyebrow}</div>
            <h2 className="panel-title">{current.title}</h2>
          </div>
          <Icon className="icon" />
        </div>

        <div className="onboarding-options">
          {current.options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <button
                key={option.value}
                type="button"
                className={isSelected ? 'onboarding-option selected' : 'onboarding-option'}
                onClick={() => handleSelect(option.value)}
              >
                <div className="onboarding-option-title">{option.title}</div>
                {option.subtext ? <div className="onboarding-option-copy">{option.subtext}</div> : null}
              </button>
            );
          })}
        </div>

        {current.calloutKey ? (
          <div className="panel soft pad muscle-callout">
            <p className="panel-copy">{t(current.calloutKey)}</p>
          </div>
        ) : null}

        {current.seniorCalloutValue && selectedValue === current.seniorCalloutValue ? (
          <div className="panel soft pad muscle-callout">
            <p className="panel-copy">{t('musclePlan.quiz.age.seniorNote')}</p>
          </div>
        ) : null}

        <div className="onboarding-actions">
          <div className="onboarding-step">{t('onboarding.stepOf', { current: step + 1, total: steps.length })}</div>
          {error ? <div className="auth-alert">{error}</div> : null}
          <button className="cta" type="button" onClick={() => void handleNext()} disabled={saving}>
            {saving ? t('auth.working') : isLast ? t('musclePlan.quiz.finish') : t('onboarding.continue')}
            <ChevronRight className="icon" />
          </button>
        </div>
      </section>
    </main>
  );
}
