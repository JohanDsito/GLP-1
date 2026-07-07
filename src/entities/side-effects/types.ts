import type { ReviewStatus, SideEffectCategory } from '../treatment-profile/types';

export interface SideEffect {
  id: string;
  code: string;
  category: SideEffectCategory;
  reviewStatus: ReviewStatus;
  severityScaleMin: number;
  severityScaleMax: number;
  displayOrder: number;
}

export function groupByCategory(sideEffects: SideEffect[]): Record<SideEffectCategory, SideEffect[]> {
  const grouped: Record<SideEffectCategory, SideEffect[]> = { physical: [], psychological: [] };

  for (const sideEffect of sideEffects) {
    grouped[sideEffect.category].push(sideEffect);
  }

  grouped.physical.sort((a, b) => a.displayOrder - b.displayOrder);
  grouped.psychological.sort((a, b) => a.displayOrder - b.displayOrder);

  return grouped;
}
