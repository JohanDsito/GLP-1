import type { TreatmentProfile } from '../treatment-profile/types';

export type RecommendationPriority = 'high' | 'medium' | 'low';

export interface DashboardRecommendation {
  id: string;
  title: string;
  copy: string;
  priority: RecommendationPriority;
  tone: 'primary' | 'accent' | 'soft';
  href: string;
}

export function buildDashboardRecommendations(
  profile: TreatmentProfile | null,
): Array<DashboardRecommendation> {
  const recommendations: Array<DashboardRecommendation> = [];

  if (!profile) {
    return [
      {
        id: 'onboarding',
        title: 'Complete setup',
        copy: 'Build the treatment profile to personalize the product.',
        priority: 'high',
        tone: 'accent',
        href: '/onboarding',
      },
    ];
  }

  if (profile.symptomProfile !== 'none') {
    recommendations.push({
      id: 'symptoms',
      title: 'Symptom guidance',
      copy: 'Prioritize the module that matches the active symptom profile.',
      priority: profile.symptomProfile === 'high' ? 'high' : 'medium',
      tone: 'accent',
      href: '/symptom-monitor',
    });
  }

  if (profile.stage === 'paused' || profile.stage === 'stopped') {
    recommendations.push({
      id: 'anti-rebound',
      title: 'Anti-rebound plan',
      copy: 'Rebuild routine and reduce the chance of rebound effects.',
      priority: 'high',
      tone: 'primary',
      href: '/dashboard',
    });
  }

  if (profile.goal === 'doctor_report') {
    recommendations.push({
      id: 'report',
      title: 'Doctor-ready report',
      copy: 'Open a structured summary for the next appointment.',
      priority: 'high',
      tone: 'primary',
      href: '/reports',
    });
  }

  if (profile.intent === 'preventive') {
    recommendations.push({
      id: 'prevention',
      title: 'Prevention mode',
      copy: 'Keep the routine steady and surface early guidance.',
      priority: 'medium',
      tone: 'soft',
      href: '/dose-tracker',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      id: 'tracking',
      title: 'Keep tracking',
      copy: 'Capture doses and symptoms to refine personalization.',
      priority: 'medium',
      tone: 'soft',
      href: '/dose-tracker',
    });
  }

  return recommendations.slice(0, 4);
}

export function buildDashboardHeadline(profile: TreatmentProfile | null): string {
  if (!profile) {
    return 'Complete the treatment profile to unlock personalization.';
  }

  if (profile.symptomProfile === 'high') {
    return 'Today should focus on symptom relief and calm tracking.';
  }

  if (profile.stage === 'stopped' || profile.stage === 'paused') {
    return 'Today should focus on recovery, structure, and rebound prevention.';
  }

  if (profile.intent === 'preventive') {
    return 'Today should focus on prevention, stability, and routine.';
  }

  return 'Today should focus on consistent tracking and timely support.';
}

