import type { OnboardingAnswers, TimeOnTreatment, TreatmentProfile } from './types';

// Representative day counts per time-on-treatment bucket. The DB segmentation
// function re-buckets from days_on_treatment, so these just need to fall inside
// each range (see supabase/migrations/202607040003_user_segmentation.sql).
const daysByTimeBucket: Record<TimeOnTreatment, number> = {
  researching: 0,
  lt_1_week: 3,
  wk_1_4: 14,
  mo_1_3: 60,
  mo_3_6: 135,
  mo_6_plus: 200,
};

export function deriveTreatmentProfile(answers: OnboardingAnswers): TreatmentProfile {
  const meaningfulSymptomCodes = answers.symptomCodes.filter((code) => code && code !== 'none');
  const primarySymptomCode = meaningfulSymptomCodes[0] ?? 'none';

  const intent: TreatmentProfile['intent'] = (() => {
    if (answers.goal === 'doctor_report') {
      return 'reactive';
    }

    if (answers.stage === 'paused' || answers.stage === 'stopped') {
      return 'reactive';
    }

    if (primarySymptomCode !== 'none') {
      return 'reactive';
    }

    if (answers.symptomProfile === 'high' || answers.goal === 'manage_symptoms') {
      return 'reactive';
    }

    if (answers.symptomProfile === 'none' && answers.goal === 'avoid_side_effects') {
      return 'preventive';
    }

    if (answers.stage === 'researching' || answers.medication === 'unknown') {
      return 'preventive';
    }

    return 'reactive';
  })();

  return {
    stage: answers.stage,
    symptomProfile: answers.symptomProfile,
    medication: answers.medication,
    goal: answers.goal,
    language: answers.language,
    intent,
    daysOnTreatment: daysByTimeBucket[answers.timeOnTreatment],
    doseFrequency:
      answers.medication === 'liraglutide' ? 'daily' : answers.medication === 'other' ? 'other' : 'weekly',
    primarySymptomCode,
    symptomCodes: meaningfulSymptomCodes,
    primarySymptomOtherText: answers.primarySymptomOtherText,
    medicationOtherText: answers.medicationOtherText,
    medicationDoseText: answers.medicationDoseText,
  };
}
