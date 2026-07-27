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
  activeSymptomCodes: string[] = [],
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

  const primarySymptomCode =
    profile.primarySymptomCode && profile.primarySymptomCode !== 'none'
      ? profile.primarySymptomCode
      : (activeSymptomCodes[0] ?? null);

  if (primarySymptomCode) {
    recommendations.push({
      id: 'side-effect',
      title: 'Side-effect guidance',
      copy: 'A specific plan for the symptom that matters most right now.',
      priority: 'high',
      tone: 'accent',
      href: `/symptom-monitor/${primarySymptomCode}`,
    });
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
      id: 'antiRebound',
      title: 'Anti-rebound plan',
      copy: 'Rebuild routine and reduce the chance of rebound effects.',
      priority: 'high',
      tone: 'primary',
      href: '/dashboard',
    });
  }

  if (profile.goal === 'doctor_report') {
    recommendations.push({
      id: 'doctorReport',
      title: 'Doctor-ready report',
      copy: 'Open a structured summary for the next appointment.',
      priority: 'high',
      tone: 'primary',
      href: '/reports',
    });
  }

  recommendations.push({
    id: 'nutrition',
    title: 'Nutrition',
    copy: 'The pillar that prevents most physical side effects, whether you have symptoms yet or not.',
    priority: primarySymptomCode ? 'medium' : 'high',
    tone: 'primary',
    href: '/nutrition',
  });

  recommendations.push({
    id: 'exercise',
    title: 'Training',
    copy: 'Keep muscle and tone while losing weight — a dedicated training plan is on its way.',
    priority: 'low',
    tone: 'soft',
    href: '/nutrition',
  });

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

  return recommendations.slice(0, 5);
}

export function buildDashboardHeadline(profile: TreatmentProfile | null): string {
  if (!profile) {
    return 'Complete the treatment profile to unlock personalization.';
  }

  const hasSpecificSymptom = Boolean(profile.primarySymptomCode && profile.primarySymptomCode !== 'none');

  if (hasSpecificSymptom || profile.symptomProfile === 'high') {
    return 'Today should focus on symptom relief and calm tracking.';
  }

  if (profile.stage === 'stopped' || profile.stage === 'paused') {
    return 'Today should focus on recovery, structure, and rebound prevention.';
  }

  if (profile.intent === 'preventive') {
    return 'Today should focus on prevention: nutrition, movement, and steady tracking.';
  }

  return 'Today should focus on consistent tracking and timely support.';
}
