import { ChevronRight, HeartPulse, Languages, Sparkles, Stethoscope } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../entities/auth/auth-store';
import { deriveTreatmentProfile } from '../../entities/treatment-profile/derive-treatment-profile';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import type {
    AppLanguage,
    MedicationName,
    OnboardingAnswers,
    SymptomProfile,
    TreatmentGoal,
    TreatmentProfile,
    TreatmentStage,
} from '../../entities/treatment-profile/types';
import { i18n } from '../../i18n';
import { saveTreatmentProfile } from '../../lib/supabase/treatment-profile';

type QuestionKey = 'stage' | 'symptomProfile' | 'medication' | 'goal' | 'language';

type Option<T extends string> = {
  value: T;
  title: string;
  copy: string;
};

type OnboardingAnswerValue = OnboardingAnswers[QuestionKey];

type QuestionConfig = {
  key: QuestionKey;
  eyebrow: string;
  title: string;
  copy: string;
  icon: typeof Stethoscope;
  options: Array<Option<OnboardingAnswerValue>>;
};

const defaultAnswers: OnboardingAnswers = {
  stage: 'just_started',
  symptomProfile: 'mild',
  medication: 'semaglutide',
  goal: 'avoid_side_effects',
  language: 'en',
};

function getQuestions(t: (key: string, options?: Record<string, unknown>) => string): Array<QuestionConfig> {
  return [
    {
      key: 'stage',
      eyebrow: t('onboarding.firstStep'),
      title: t('onboarding.questions.stage.title'),
      copy: t('onboarding.questions.stage.copy'),
      icon: Stethoscope,
      options: [
        { value: 'researching', title: t('onboarding.questions.stage.options.researching.title'), copy: t('onboarding.questions.stage.options.researching.copy') },
        { value: 'just_started', title: t('onboarding.questions.stage.options.just_started.title'), copy: t('onboarding.questions.stage.options.just_started.copy') },
        { value: 'ongoing', title: t('onboarding.questions.stage.options.ongoing.title'), copy: t('onboarding.questions.stage.options.ongoing.copy') },
        { value: 'paused', title: t('onboarding.questions.stage.options.paused.title'), copy: t('onboarding.questions.stage.options.paused.copy') },
        { value: 'stopped', title: t('onboarding.questions.stage.options.stopped.title'), copy: t('onboarding.questions.stage.options.stopped.copy') },
      ],
    },
    {
      key: 'symptomProfile',
      eyebrow: t('onboarding.symptoms'),
      title: t('onboarding.questions.symptomProfile.title'),
      copy: t('onboarding.questions.symptomProfile.copy'),
      icon: HeartPulse,
      options: [
        { value: 'none', title: t('onboarding.questions.symptomProfile.options.none.title'), copy: t('onboarding.questions.symptomProfile.options.none.copy') },
        { value: 'mild', title: t('onboarding.questions.symptomProfile.options.mild.title'), copy: t('onboarding.questions.symptomProfile.options.mild.copy') },
        { value: 'moderate', title: t('onboarding.questions.symptomProfile.options.moderate.title'), copy: t('onboarding.questions.symptomProfile.options.moderate.copy') },
        { value: 'high', title: t('onboarding.questions.symptomProfile.options.high.title'), copy: t('onboarding.questions.symptomProfile.options.high.copy') },
      ],
    },
    {
      key: 'medication',
      eyebrow: t('onboarding.medication'),
      title: t('onboarding.questions.medication.title'),
      copy: t('onboarding.questions.medication.copy'),
      icon: Sparkles,
      options: [
        { value: 'semaglutide', title: t('onboarding.questions.medication.options.semaglutide.title'), copy: t('onboarding.questions.medication.options.semaglutide.copy') },
        { value: 'tirzepatide', title: t('onboarding.questions.medication.options.tirzepatide.title'), copy: t('onboarding.questions.medication.options.tirzepatide.copy') },
        { value: 'liraglutide', title: t('onboarding.questions.medication.options.liraglutide.title'), copy: t('onboarding.questions.medication.options.liraglutide.copy') },
        { value: 'unknown', title: t('onboarding.questions.medication.options.unknown.title'), copy: t('onboarding.questions.medication.options.unknown.copy') },
      ],
    },
    {
      key: 'goal',
      eyebrow: t('onboarding.goal'),
      title: t('onboarding.questions.goal.title'),
      copy: t('onboarding.questions.goal.copy'),
      icon: Sparkles,
      options: [
        { value: 'avoid_side_effects', title: t('onboarding.questions.goal.options.avoid_side_effects.title'), copy: t('onboarding.questions.goal.options.avoid_side_effects.copy') },
        { value: 'manage_symptoms', title: t('onboarding.questions.goal.options.manage_symptoms.title'), copy: t('onboarding.questions.goal.options.manage_symptoms.copy') },
        { value: 'stay_consistent', title: t('onboarding.questions.goal.options.stay_consistent.title'), copy: t('onboarding.questions.goal.options.stay_consistent.copy') },
        { value: 'doctor_report', title: t('onboarding.questions.goal.options.doctor_report.title'), copy: t('onboarding.questions.goal.options.doctor_report.copy') },
      ],
    },
    {
      key: 'language',
      eyebrow: t('onboarding.language'),
      title: t('onboarding.questions.language.title'),
      copy: t('onboarding.questions.language.copy'),
      icon: Languages,
      options: [
        { value: 'en', title: t('languageNames.en'), copy: t('onboarding.questions.language.options.en.copy') },
        { value: 'es', title: t('languageNames.es'), copy: t('onboarding.questions.language.options.es.copy') },
        { value: 'pt', title: t('languageNames.pt'), copy: t('onboarding.questions.language.options.pt.copy') },
      ],
    },
  ];
}

export function OnboardingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const setProfile = useTreatmentProfileStore((state) => state.setProfile);
  const setLanguage = useTreatmentProfileStore((state) => state.setLanguage);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const questions = useMemo(() => getQuestions(t), [t]);
  const currentQuestion = questions[step];
  const selectedValue = answers[currentQuestion.key];
  const isLastStep = step === questions.length - 1;
  const progress = ((step + 1) / questions.length) * 100;
  const Icon = currentQuestion.icon;

  function handleOptionSelect(value: OnboardingAnswerValue) {
    setAnswers((current) => ({ ...current, [currentQuestion.key]: value } as OnboardingAnswers));

    if (currentQuestion.key === 'language' && (value === 'en' || value === 'es' || value === 'pt')) {
      void i18n.changeLanguage(value);
      setLanguage(value);
    }
  }

  async function handleNext() {
    if (!isLastStep) {
      setStep((current) => current + 1);
      return;
    }

    if (!userId) {
      return;
    }

    const profile: TreatmentProfile = deriveTreatmentProfile({
      stage: answers.stage as TreatmentStage,
      symptomProfile: answers.symptomProfile as SymptomProfile,
      medication: answers.medication as MedicationName,
      goal: answers.goal as TreatmentGoal,
      language: answers.language as AppLanguage,
    });

    setSaving(true);
    setSubmitError(null);

    try {
      setProfile(profile, userId);
      await saveTreatmentProfile(userId, profile);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save treatment profile.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="onboarding-shell">
      <section className="onboarding-hero">
        <div className="brand-mark" style={{ marginBottom: 18 }}>
          <Sparkles className="icon" />
          <span>{t('appName')}</span>
        </div>
        <div className="page-kicker">{t('onboarding.welcomeFlow')}</div>
        <h1 className="page-title">{t('onboarding.heroTitle')}</h1>
        <p className="page-subtitle">{t('onboarding.heroCopy')}</p>
        <div className="onboarding-progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
      </section>

      <section className="onboarding-card panel pad">
        <div className="panel-header">
          <div>
            <div className="page-kicker">{currentQuestion.eyebrow}</div>
            <h2 className="panel-title">{currentQuestion.title}</h2>
            <p className="panel-copy">{currentQuestion.copy}</p>
          </div>
          <Icon className="icon" />
        </div>

        <div className="onboarding-options">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedValue === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={isSelected ? 'onboarding-option selected' : 'onboarding-option'}
                onClick={() => handleOptionSelect(option.value)}
              >
                <div className="onboarding-option-title">{option.title}</div>
                <div className="onboarding-option-copy">{option.copy}</div>
              </button>
            );
          })}
        </div>

        <div className="onboarding-actions">
          <div className="onboarding-step">
            {t('onboarding.stepOf', { current: step + 1, total: questions.length })}
          </div>
          {submitError ? <div className="auth-alert">{submitError}</div> : null}
          <button className="cta" type="button" onClick={handleNext} disabled={saving}>
            {saving ? t('auth.working') : isLastStep ? t('onboarding.finishSetup') : t('onboarding.continue')}
            <ChevronRight className="icon" />
          </button>
        </div>
      </section>
    </main>
  );
}

