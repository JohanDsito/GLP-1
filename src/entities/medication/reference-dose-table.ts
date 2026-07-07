import type { MedicationName } from '../treatment-profile/types';

export interface ReferenceDoseStep {
  step: number;
  dose: string;
}

const referenceDoseTable: Partial<Record<MedicationName, ReferenceDoseStep[]>> = {
  semaglutide: [
    { step: 1, dose: '0.25 mg' },
    { step: 2, dose: '0.5 mg' },
    { step: 3, dose: '1 mg' },
    { step: 4, dose: '1.7 mg' },
    { step: 5, dose: '2.4 mg' },
  ],
  tirzepatide: [
    { step: 1, dose: '2.5 mg' },
    { step: 2, dose: '5 mg' },
    { step: 3, dose: '7.5 mg' },
    { step: 4, dose: '10 mg' },
    { step: 5, dose: '12.5 mg' },
    { step: 6, dose: '15 mg' },
  ],
  liraglutide: [
    { step: 1, dose: '0.6 mg' },
    { step: 2, dose: '1.2 mg' },
    { step: 3, dose: '1.8 mg' },
    { step: 4, dose: '2.4 mg' },
    { step: 5, dose: '3 mg' },
  ],
};

export function getReferenceDoseSteps(medication: MedicationName): ReferenceDoseStep[] | null {
  return referenceDoseTable[medication] ?? null;
}
