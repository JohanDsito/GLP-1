import { CalendarClock, ChevronRight, HeartPulse, Languages, Sparkles, Stethoscope } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../entities/auth/auth-store';
import { getReferenceDoseSteps } from '../../entities/medication/reference-dose-table';
import { deriveTreatmentProfile } from '../../entities/treatment-profile/derive-treatment-profile';
import { useTreatmentProfileStore } from '../../entities/treatment-profile/treatment-profile-store';
import type { OnboardingAnswers } from '../../entities/treatment-profile/types';
import { i18n } from '../../i18n';
import { saveTreatmentProfile } from '../../lib/supabase/treatment-profile';
import { ReminderSettings } from '../settings/reminder-settings';

type ScalarQuestionKey = 'stage' | 'symptomProfile' | 'timeOnTreatment' | 'medication' | 'goal' | 'language';
type QuestionKey = ScalarQuestionKey | 'symptomCodes';
type FreeTextKey = 'primarySymptomOtherText' | 'medicationOtherText';
type ExtraTextKey = 'medicationDoseText';

type Option = {
  value: string;
  title: string;
  copy: string;
};

type QuestionConfig = {
  key: QuestionKey;
  eyebrow: string;
  title: string;
  copy: string;
  icon: typeof Stethoscope;
  options: Array<Option>;
  multiSelect?: boolean;
  freeTextOnValue?: string;
  freeTextAnswerKey?: FreeTextKey;
  extraTextField?: { key: ExtraTextKey; labelKey: string; placeholderKey: string; helpKey: string };
};

const defaultAnswers: OnboardingAnswers = {
  stage: 'just_started',
  symptomProfile: 'mild',
  medication: 'semaglutide',
  goal: 'avoid_side_effects',
  language: 'en',
  timeOnTreatment: 'lt_1_week',
  symptomCodes: ['none'],
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
      key: 'timeOnTreatment',
      eyebrow: t('onboarding.timeStep'),
      title: t('onboarding.questions.timeOnTreatment.title'),
      copy: t('onboarding.questions.timeOnTreatment.copy'),
      icon: CalendarClock,
      options: [
        { value: 'researching', title: t('onboarding.questions.timeOnTreatment.options.researching.title'), copy: t('onboarding.questions.timeOnTreatment.options.researching.copy') },
        { value: 'lt_1_week', title: t('onboarding.questions.timeOnTreatment.options.lt_1_week.title'), copy: t('onboarding.questions.timeOnTreatment.options.lt_1_week.copy') },
        { value: 'wk_1_4', title: t('onboarding.questions.timeOnTreatment.options.wk_1_4.title'), copy: t('onboarding.questions.timeOnTreatment.options.wk_1_4.copy') },
        { value: 'mo_1_3', title: t('onboarding.questions.timeOnTreatment.options.mo_1_3.title'), copy: t('onboarding.questions.timeOnTreatment.options.mo_1_3.copy') },
        { value: 'mo_3_6', title: t('onboarding.questions.timeOnTreatment.options.mo_3_6.title'), copy: t('onboarding.questions.timeOnTreatment.options.mo_3_6.copy') },
        { value: 'mo_6_plus', title: t('onboarding.questions.timeOnTreatment.options.mo_6_plus.title'), copy: t('onboarding.questions.timeOnTreatment.options.mo_6_plus.copy') },
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
      key: 'symptomCodes',
      eyebrow: t('onboarding.primarySymptomStep'),
      title: t('onboarding.questions.primarySymptom.title'),
      copy: t('onboarding.questions.primarySymptom.copy'),
      icon: HeartPulse,
      multiSelect: true,
      freeTextOnValue: 'other',
      freeTextAnswerKey: 'primarySymptomOtherText',
      options: [
        { value: 'none', title: t('onboarding.questions.primarySymptom.options.none.title'), copy: t('onboarding.questions.primarySymptom.options.none.copy') },
        { value: 'nausea', title: t('onboarding.questions.primarySymptom.options.nausea.title'), copy: t('onboarding.questions.primarySymptom.options.nausea.copy') },
        { value: 'fatigue', title: t('onboarding.questions.primarySymptom.options.fatigue.title'), copy: t('onboarding.questions.primarySymptom.options.fatigue.copy') },
        { value: 'hairLoss', title: t('onboarding.questions.primarySymptom.options.hairLoss.title'), copy: t('onboarding.questions.primarySymptom.options.hairLoss.copy') },
        { value: 'constipation', title: t('onboarding.questions.primarySymptom.options.constipation.title'), copy: t('onboarding.questions.primarySymptom.options.constipation.copy') },
        { value: 'moodSwings', title: t('onboarding.questions.primarySymptom.options.moodSwings.title'), copy: t('onboarding.questions.primarySymptom.options.moodSwings.copy') },
        { value: 'other', title: t('onboarding.otherOptionTitle'), copy: t('onboarding.otherOptionCopy') },
      ],
    },
    {
      key: 'medication',
      eyebrow: t('onboarding.medication'),
      title: t('onboarding.questions.medication.title'),
      copy: t('onboarding.questions.medication.copy'),
      icon: Sparkles,
      freeTextOnValue: 'other',
      freeTextAnswerKey: 'medicationOtherText',
      extraTextField: {
        key: 'medicationDoseText',
        labelKey: 'onboarding.doseLabel',
        placeholderKey: 'onboarding.dosePlaceholder',
        helpKey: 'onboarding.doseHelp',
      },
      options: [
        { value: 'semaglutide', title: t('onboarding.questions.medication.options.semaglutide.title'), copy: t('onboarding.questions.medication.options.semaglutide.copy') },
        { value: 'tirzepatide', title: t('onboarding.questions.medication.options.tirzepatide.title'), copy: t('onboarding.questions.medication.options.tirzepatide.copy') },
        { value: 'liraglutide', title: t('onboarding.questions.medication.options.liraglutide.title'), copy: t('onboarding.questions.medication.options.liraglutide.copy') },
        { value: 'other', title: t('onboarding.otherOptionTitle'), copy: t('onboarding.otherOptionCopy') },
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
  const [showReminders, setShowReminders] = useState(false);

  const questions = useMemo(() => getQuestions(t), [t]);
  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;
  const progress = ((step + 1) / questions.length) * 100;
  const Icon = currentQuestion.icon;
  const referenceDoseSteps =
    currentQuestion.key === 'medication' ? getReferenceDoseSteps(answers.medication) : null;

  function isOptionSelected(value: string): boolean {
    if (currentQuestion.multiSelect) {
      return answers.symptomCodes.includes(value);
    }

    return answers[currentQuestion.key as ScalarQuestionKey] === value;
  }

  const freeTextVisible = currentQuestion.multiSelect
    ? Boolean(currentQuestion.freeTextOnValue && answers.symptomCodes.includes(currentQuestion.freeTextOnValue))
    : answers[currentQuestion.key as ScalarQuestionKey] === currentQuestion.freeTextOnValue;

  function handleScalarSelect(value: string) {
    const key = currentQuestion.key as ScalarQuestionKey;
    setAnswers((current) => ({ ...current, [key]: value }));

    if (key === 'language' && (value === 'en' || value === 'es' || value === 'pt')) {
      void i18n.changeLanguage(value);
      setLanguage(value);
    }
  }

  function handleMultiToggle(value: string) {
    setAnswers((current) => {
      // "none" is exclusive: picking it clears everything else, and picking
      // anything else clears "none".
      if (value === 'none') {
        return { ...current, symptomCodes: ['none'] };
      }

      const withoutNone = current.symptomCodes.filter((code) => code !== 'none');
      const next = withoutNone.includes(value)
        ? withoutNone.filter((code) => code !== value)
        : [...withoutNone, value];

      return { ...current, symptomCodes: next.length > 0 ? next : ['none'] };
    });
  }

  function handleFreeTextChange(key: FreeTextKey | ExtraTextKey, value: string) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  async function handleNext() {
    if (!isLastStep) {
      setStep((current) => current + 1);
      return;
    }

    if (!userId) {
      return;
    }

    const profile = deriveTreatmentProfile(answers);

    setSaving(true);
    setSubmitError(null);

    try {
      setProfile(profile, userId);
      await saveTreatmentProfile(userId, profile);
      setShowReminders(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to save treatment profile.');
    } finally {
      setSaving(false);
    }
  }

  if (showReminders) {
    return (
      <main className="onboarding-shell">
        <section className="onboarding-hero">
          <div className="brand-mark" style={{ marginBottom: 18 }}>
            <Sparkles className="icon" />
            <span>{t('appName')}</span>
          </div>
          <div className="page-kicker">{t('reminders.setupKicker')}</div>
          <h1 className="page-title">{t('reminders.setupTitle')}</h1>
          <p className="page-subtitle">{t('reminders.setupSubtitle')}</p>
        </section>

        <section className="onboarding-card">
          <ReminderSettings />
          <button
            className="cta"
            type="button"
            style={{ marginTop: 16, width: '100%' }}
            onClick={() => navigate('/dashboard', { replace: true })}
          >
            {t('reminders.enterApp')}
          </button>
        </section>
      </main>
    );
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
            {currentQuestion.multiSelect ? (
              <p className="panel-copy" style={{ fontSize: 13 }}>{t('onboarding.multiSelectHint')}</p>
            ) : null}
          </div>
          <Icon className="icon" />
        </div>

        <div className="onboarding-options">
          {currentQuestion.options.map((option) => {
            const isSelected = isOptionSelected(option.value);

            return (
              <button
                key={option.value}
                type="button"
                className={isSelected ? 'onboarding-option selected' : 'onboarding-option'}
                onClick={() =>
                  currentQuestion.multiSelect ? handleMultiToggle(option.value) : handleScalarSelect(option.value)
                }
              >
                <div className="onboarding-option-title">{option.title}</div>
                <div className="onboarding-option-copy">{option.copy}</div>
              </button>
            );
          })}
        </div>

        {currentQuestion.freeTextAnswerKey && freeTextVisible ? (
          <label className="stack" style={{ gap: 8, marginTop: 16 }}>
            <span className="onboarding-step">{t('onboarding.otherLabel')}</span>
            <input
              className="auth-input"
              type="text"
              placeholder={t('onboarding.otherPlaceholder')}
              value={answers[currentQuestion.freeTextAnswerKey] ?? ''}
              onChange={(event) => handleFreeTextChange(currentQuestion.freeTextAnswerKey!, event.target.value)}
            />
          </label>
        ) : null}

        {currentQuestion.extraTextField ? (
          <div className="stack" style={{ marginTop: 16 }}>
            <label className="stack" style={{ gap: 8 }}>
              <span className="onboarding-step">{t(currentQuestion.extraTextField.labelKey)}</span>
              <input
                className="auth-input"
                type="text"
                placeholder={t(currentQuestion.extraTextField.placeholderKey)}
                value={answers[currentQuestion.extraTextField.key] ?? ''}
                onChange={(event) =>
                  handleFreeTextChange(currentQuestion.extraTextField!.key, event.target.value)
                }
              />
            </label>
            <p className="panel-copy" style={{ fontSize: 13 }}>
              {t(currentQuestion.extraTextField.helpKey)}
            </p>
            {referenceDoseSteps ? (
              <p className="panel-copy" style={{ fontSize: 13 }}>
                {t('onboarding.referenceDoseLabel')}: {referenceDoseSteps.map((entry) => entry.dose).join(' -> ')}
              </p>
            ) : null}
          </div>
        ) : null}

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
