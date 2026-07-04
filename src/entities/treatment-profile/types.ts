export type TreatmentStage =
  | 'researching'
  | 'just_started'
  | 'ongoing'
  | 'paused'
  | 'stopped';

export type SymptomProfile = 'none' | 'mild' | 'moderate' | 'high';

export type TreatmentIntent = 'preventive' | 'reactive';

export type MedicationName = 'semaglutide' | 'tirzepatide' | 'liraglutide' | 'unknown';

export type TreatmentGoal = 'avoid_side_effects' | 'manage_symptoms' | 'stay_consistent' | 'doctor_report';

export type AppLanguage = 'en' | 'es' | 'pt';

export interface TreatmentProfile {
  stage: TreatmentStage;
  symptomProfile: SymptomProfile;
  intent: TreatmentIntent;
  medication: MedicationName;
  goal: TreatmentGoal;
  language: AppLanguage;
  daysOnTreatment?: number;
  doseFrequency?: 'weekly' | 'daily' | 'other';
}

export interface OnboardingAnswers {
  stage: TreatmentStage;
  symptomProfile: SymptomProfile;
  medication: MedicationName;
  goal: TreatmentGoal;
  language: AppLanguage;
}

