export type TreatmentStage =
  | 'researching'
  | 'just_started'
  | 'ongoing'
  | 'paused'
  | 'stopped';

export type SymptomProfile = 'none' | 'mild' | 'moderate' | 'high';

export type TreatmentIntent = 'preventive' | 'reactive';

export type MedicationName = 'semaglutide' | 'tirzepatide' | 'liraglutide' | 'other' | 'unknown';

export type TreatmentGoal = 'avoid_side_effects' | 'manage_symptoms' | 'stay_consistent' | 'doctor_report';

export type AppLanguage = 'en' | 'es' | 'pt';

export type SideEffectCategory =
  | 'gastrointestinal'
  | 'systemic'
  | 'genitourinary'
  | 'serious'
  | 'psychological';

export type SideEffectSeverity = 'routine' | 'emergency';

export type ReviewStatus = 'draft' | 'reviewed';

export type TimeOnTreatment =
  | 'researching'
  | 'lt_1_week'
  | 'wk_1_4'
  | 'mo_1_3'
  | 'mo_3_6'
  | 'mo_6_plus';

export interface TreatmentProfile {
  stage: TreatmentStage;
  symptomProfile: SymptomProfile;
  intent: TreatmentIntent;
  medication: MedicationName;
  goal: TreatmentGoal;
  language: AppLanguage;
  daysOnTreatment?: number;
  doseFrequency?: 'weekly' | 'daily' | 'other';
  primarySymptomCode?: string;
  primarySymptomOtherText?: string;
  medicationOtherText?: string;
  medicationDoseText?: string;
  symptomCodes?: string[];
}

export interface OnboardingAnswers {
  stage: TreatmentStage;
  symptomProfile: SymptomProfile;
  medication: MedicationName;
  goal: TreatmentGoal;
  language: AppLanguage;
  timeOnTreatment: TimeOnTreatment;
  symptomCodes: string[];
  primarySymptomOtherText?: string;
  medicationOtherText?: string;
  medicationDoseText?: string;
}
