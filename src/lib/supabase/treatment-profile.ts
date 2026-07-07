import type { TreatmentProfile } from '../../entities/treatment-profile/types';
import { supabase } from './client';

type TreatmentProfileRow = {
  user_id: string;
  stage: string | null;
  symptom_profile: string | null;
  intent: string | null;
  medication: string | null;
  goal: string | null;
  language: string | null;
  days_on_treatment: number | null;
  dose_frequency: string | null;
  medication_dose_text: string | null;
  primary_symptom_code: string | null;
  metadata: { medicationOtherText?: string; primarySymptomOtherText?: string; symptomCodes?: string[] } | null;
};

function rowToTreatmentProfile(row: TreatmentProfileRow): TreatmentProfile {
  return {
    stage: row.stage as TreatmentProfile['stage'],
    symptomProfile: row.symptom_profile as TreatmentProfile['symptomProfile'],
    intent: row.intent as TreatmentProfile['intent'],
    medication: row.medication as TreatmentProfile['medication'],
    goal: row.goal as TreatmentProfile['goal'],
    language: (row.language as TreatmentProfile['language']) ?? 'en',
    daysOnTreatment: row.days_on_treatment ?? undefined,
    doseFrequency: (row.dose_frequency as TreatmentProfile['doseFrequency']) ?? undefined,
    medicationDoseText: row.medication_dose_text ?? undefined,
    primarySymptomCode: row.primary_symptom_code ?? undefined,
    medicationOtherText: row.metadata?.medicationOtherText,
    primarySymptomOtherText: row.metadata?.primarySymptomOtherText,
    symptomCodes: row.metadata?.symptomCodes ?? undefined,
  };
}

function profileToRow(profile: TreatmentProfile) {
  return {
    stage: profile.stage,
    symptom_profile: profile.symptomProfile,
    intent: profile.intent,
    medication: profile.medication,
    goal: profile.goal,
    language: profile.language,
    days_on_treatment: profile.daysOnTreatment ?? null,
    dose_frequency: profile.doseFrequency ?? null,
    medication_dose_text: profile.medicationDoseText ?? null,
    primary_symptom_code: profile.primarySymptomCode ?? null,
    metadata: {
      medicationOtherText: profile.medicationOtherText,
      primarySymptomOtherText: profile.primarySymptomOtherText,
      symptomCodes: profile.symptomCodes ?? [],
    },
  };
}

export async function fetchTreatmentProfile(userId: string): Promise<TreatmentProfile | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('treatment_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle<TreatmentProfileRow>();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return rowToTreatmentProfile(data);
}

export async function saveTreatmentProfile(userId: string, profile: TreatmentProfile): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const record = {
    user_id: userId,
    ...profileToRow(profile),
  };

  const { error } = await supabase.from('treatment_profiles').upsert(record, { onConflict: 'user_id' });

  if (error) {
    throw error;
  }
}
