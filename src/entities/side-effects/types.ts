import type { ReviewStatus, SideEffectCategory, SideEffectSeverity } from '../treatment-profile/types';

/** Display order of the library categories. */
export const sideEffectCategories: SideEffectCategory[] = [
  'gastrointestinal',
  'systemic',
  'genitourinary',
  'serious',
  'psychological',
];

export interface SideEffect {
  id: string;
  code: string;
  category: SideEffectCategory;
  severity: SideEffectSeverity;
  reviewStatus: ReviewStatus;
  severityScaleMin: number;
  severityScaleMax: number;
  displayOrder: number;
}

export function groupByCategory(sideEffects: SideEffect[]): Record<SideEffectCategory, SideEffect[]> {
  const grouped: Record<SideEffectCategory, SideEffect[]> = {
    gastrointestinal: [],
    systemic: [],
    genitourinary: [],
    serious: [],
    psychological: [],
  };

  for (const sideEffect of sideEffects) {
    (grouped[sideEffect.category] ?? grouped.gastrointestinal).push(sideEffect);
  }

  for (const category of sideEffectCategories) {
    grouped[category].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  return grouped;
}
