import type { OnboardingAnswers, TreatmentProfile } from './types';

export function deriveTreatmentProfile(answers: OnboardingAnswers): TreatmentProfile {
  const intent: TreatmentProfile['intent'] = (() => {
    if (answers.goal === 'doctor_report') {
      return 'reactive';
    }

    if (answers.stage === 'paused' || answers.stage === 'stopped') {
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
    ...answers,
    intent,
    doseFrequency: answers.medication === 'liraglutide' ? 'daily' : 'weekly',
  };
}

