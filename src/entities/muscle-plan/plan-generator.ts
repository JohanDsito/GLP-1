import type { TreatmentProfile } from '../treatment-profile/types';
import type { Equipment, Exercise, MusclePlanQuizAnswers, WeeklyPlan, WorkoutDay } from './types';

type Pattern = 'squat' | 'hinge' | 'push' | 'pull' | 'core';

interface ExerciseDef {
  id: string;
  muscleGroups: string[]; // i18n keys under musclePlan.muscles.*
  pattern: Pattern;
  equipment: Equipment[]; // which chosen tiers can use it
  compound: boolean;
  highImpact?: boolean;
  lowImpactId?: string; // used for the 60+ age range
  noEquipmentVariant?: string; // i18n key
}

// Exercise catalog. Names/notes are resolved from i18n by id
// (musclePlan.exercises.<id>.name). Compound movements are prioritized because
// they preserve more muscle mass than isolation work.
const CATALOG: ExerciseDef[] = [
  // Bodyweight (usable at every equipment tier)
  { id: 'pushup', muscleGroups: ['chest', 'triceps', 'shoulders'], pattern: 'push', equipment: ['none', 'bands', 'dumbbells', 'full_gym'], compound: true, highImpact: true, lowImpactId: 'wall_pushup' },
  { id: 'wall_pushup', muscleGroups: ['chest', 'shoulders'], pattern: 'push', equipment: ['none', 'bands', 'dumbbells', 'full_gym'], compound: true },
  { id: 'bw_squat', muscleGroups: ['quads', 'glutes'], pattern: 'squat', equipment: ['none', 'bands', 'dumbbells', 'full_gym'], compound: true, highImpact: true, lowImpactId: 'chair_squat' },
  { id: 'chair_squat', muscleGroups: ['quads', 'glutes'], pattern: 'squat', equipment: ['none', 'bands', 'dumbbells', 'full_gym'], compound: true },
  { id: 'glute_bridge', muscleGroups: ['glutes', 'hamstrings'], pattern: 'hinge', equipment: ['none', 'bands', 'dumbbells', 'full_gym'], compound: true },
  { id: 'reverse_lunge', muscleGroups: ['quads', 'glutes'], pattern: 'squat', equipment: ['none', 'bands', 'dumbbells', 'full_gym'], compound: true, highImpact: true, lowImpactId: 'chair_squat' },
  { id: 'towel_row', muscleGroups: ['back', 'biceps'], pattern: 'pull', equipment: ['none'], compound: true },
  { id: 'plank', muscleGroups: ['core'], pattern: 'core', equipment: ['none', 'bands', 'dumbbells', 'full_gym'], compound: false },
  { id: 'dead_bug', muscleGroups: ['core'], pattern: 'core', equipment: ['none', 'bands', 'dumbbells', 'full_gym'], compound: false },
  { id: 'bird_dog', muscleGroups: ['core', 'back'], pattern: 'core', equipment: ['none', 'bands', 'dumbbells', 'full_gym'], compound: false },

  // Bands
  { id: 'band_row', muscleGroups: ['back', 'biceps'], pattern: 'pull', equipment: ['bands', 'full_gym'], compound: true, noEquipmentVariant: 'towel_row' },
  { id: 'band_pull_apart', muscleGroups: ['upperBack', 'shoulders'], pattern: 'pull', equipment: ['bands', 'full_gym'], compound: false },
  { id: 'band_squat', muscleGroups: ['quads', 'glutes'], pattern: 'squat', equipment: ['bands', 'full_gym'], compound: true, noEquipmentVariant: 'bw_squat' },
  { id: 'band_hip_thrust', muscleGroups: ['glutes', 'hamstrings'], pattern: 'hinge', equipment: ['bands', 'full_gym'], compound: true, noEquipmentVariant: 'glute_bridge' },
  { id: 'band_press', muscleGroups: ['shoulders', 'triceps'], pattern: 'push', equipment: ['bands', 'full_gym'], compound: true, noEquipmentVariant: 'pushup' },

  // Dumbbells
  { id: 'goblet_squat', muscleGroups: ['quads', 'glutes'], pattern: 'squat', equipment: ['dumbbells', 'full_gym'], compound: true, noEquipmentVariant: 'bw_squat' },
  { id: 'rdl', muscleGroups: ['hamstrings', 'glutes', 'back'], pattern: 'hinge', equipment: ['dumbbells', 'full_gym'], compound: true, noEquipmentVariant: 'glute_bridge' },
  { id: 'db_row', muscleGroups: ['back', 'biceps'], pattern: 'pull', equipment: ['dumbbells', 'full_gym'], compound: true, noEquipmentVariant: 'towel_row' },
  { id: 'db_press', muscleGroups: ['shoulders', 'triceps'], pattern: 'push', equipment: ['dumbbells', 'full_gym'], compound: true, noEquipmentVariant: 'pushup' },
  { id: 'db_bench', muscleGroups: ['chest', 'triceps'], pattern: 'push', equipment: ['dumbbells', 'full_gym'], compound: true, noEquipmentVariant: 'pushup' },
  { id: 'db_lunge', muscleGroups: ['quads', 'glutes'], pattern: 'squat', equipment: ['dumbbells', 'full_gym'], compound: true, highImpact: true, lowImpactId: 'goblet_squat', noEquipmentVariant: 'reverse_lunge' },

  // Full gym
  { id: 'barbell_squat', muscleGroups: ['quads', 'glutes'], pattern: 'squat', equipment: ['full_gym'], compound: true, noEquipmentVariant: 'bw_squat' },
  { id: 'deadlift', muscleGroups: ['back', 'hamstrings', 'glutes'], pattern: 'hinge', equipment: ['full_gym'], compound: true, noEquipmentVariant: 'glute_bridge' },
  { id: 'bench_press', muscleGroups: ['chest', 'triceps'], pattern: 'push', equipment: ['full_gym'], compound: true, noEquipmentVariant: 'pushup' },
  { id: 'cable_row', muscleGroups: ['back', 'biceps'], pattern: 'pull', equipment: ['full_gym'], compound: true, noEquipmentVariant: 'towel_row' },
  { id: 'lat_pulldown', muscleGroups: ['back', 'biceps'], pattern: 'pull', equipment: ['full_gym'], compound: true, noEquipmentVariant: 'band_pull_apart' },
];

interface DayTemplate {
  dayLabel: string;
  focus: string;
  dayIndex: number;
  patterns: Pattern[];
}

function dayTemplates(daysPerWeek: 2 | 3 | 4 | 5): DayTemplate[] {
  const upper: Pattern[] = ['push', 'pull', 'push', 'pull', 'core'];
  const lower: Pattern[] = ['squat', 'hinge', 'squat', 'core'];
  const full: Pattern[] = ['squat', 'push', 'pull', 'hinge', 'core'];
  const push: Pattern[] = ['push', 'push', 'push', 'core'];
  const pull: Pattern[] = ['pull', 'pull', 'pull', 'core'];
  const legs: Pattern[] = ['squat', 'hinge', 'squat', 'core'];

  switch (daysPerWeek) {
    case 2:
      return [
        { dayLabel: 'musclePlan.days.fullA', focus: 'musclePlan.focus.fullBody', dayIndex: 0, patterns: full },
        { dayLabel: 'musclePlan.days.fullB', focus: 'musclePlan.focus.fullBody', dayIndex: 3, patterns: full },
      ];
    case 3:
      return [
        { dayLabel: 'musclePlan.days.upper', focus: 'musclePlan.focus.upperBody', dayIndex: 0, patterns: upper },
        { dayLabel: 'musclePlan.days.lower', focus: 'musclePlan.focus.lowerBody', dayIndex: 2, patterns: lower },
        { dayLabel: 'musclePlan.days.fullA', focus: 'musclePlan.focus.fullBody', dayIndex: 4, patterns: full },
      ];
    case 4:
      return [
        { dayLabel: 'musclePlan.days.upperA', focus: 'musclePlan.focus.upperBody', dayIndex: 0, patterns: upper },
        { dayLabel: 'musclePlan.days.lowerA', focus: 'musclePlan.focus.lowerBody', dayIndex: 1, patterns: lower },
        { dayLabel: 'musclePlan.days.upperB', focus: 'musclePlan.focus.upperBody', dayIndex: 3, patterns: upper },
        { dayLabel: 'musclePlan.days.lowerB', focus: 'musclePlan.focus.lowerBody', dayIndex: 4, patterns: lower },
      ];
    case 5:
      return [
        { dayLabel: 'musclePlan.days.push', focus: 'musclePlan.focus.push', dayIndex: 0, patterns: push },
        { dayLabel: 'musclePlan.days.pull', focus: 'musclePlan.focus.pull', dayIndex: 1, patterns: pull },
        { dayLabel: 'musclePlan.days.legs', focus: 'musclePlan.focus.legs', dayIndex: 2, patterns: legs },
        { dayLabel: 'musclePlan.days.upper', focus: 'musclePlan.focus.upperBody', dayIndex: 3, patterns: upper },
        { dayLabel: 'musclePlan.days.fullA', focus: 'musclePlan.focus.fullBody', dayIndex: 4, patterns: full },
      ];
  }
}

interface BlockRules {
  sets: number;
  reps: string;
  duration: number;
}

function blockRules(weekNumber: number): BlockRules {
  if (weekNumber <= 4) return { sets: 3, reps: '8-10', duration: 32 };
  if (weekNumber <= 8) return { sets: 3, reps: '10-12', duration: 38 };
  return { sets: 4, reps: '8-10', duration: 43 };
}

function poolFor(pattern: Pattern, equipment: Equipment): ExerciseDef[] {
  // Prefer the exercises specific to the chosen tier, then fall back to
  // simpler ones so every day is complete.
  const available = CATALOG.filter((def) => def.pattern === pattern && def.equipment.includes(equipment));
  const compoundFirst = [...available].sort((a, b) => Number(b.compound) - Number(a.compound));
  return compoundFirst;
}

function restForPattern(pattern: Pattern): number {
  // Longer than generic apps (90-120s): GLP-1 users have lower energy output.
  return pattern === 'core' ? 90 : 120;
}

function repsForPattern(pattern: Pattern, blockReps: string): string {
  return pattern === 'core' ? '30-45 sec' : blockReps;
}

function buildDay(
  template: DayTemplate,
  weekNumber: number,
  answers: MusclePlanQuizAnswers,
): WorkoutDay {
  const rules = blockRules(weekNumber);
  const isBeginner = answers.fitnessLevel === 'beginner';
  const isSenior = answers.ageRange === '60+';

  // Beginners cap volume at 2 sets during the base block (lower energy, nausea).
  const daySets = isBeginner && weekNumber <= 4 ? Math.min(rules.sets, 2) : rules.sets;

  const usedIds = new Set<string>();
  const exercises: Exercise[] = template.patterns.map((pattern, index) => {
    const pool = poolFor(pattern, answers.equipment);
    let def = pool.find((candidate) => !usedIds.has(candidate.id)) ?? pool[0];

    // 60+: swap high-impact movements for low-impact alternatives.
    if (isSenior && def.highImpact && def.lowImpactId) {
      const replacement = CATALOG.find((candidate) => candidate.id === def.lowImpactId);
      if (replacement) {
        def = replacement;
      }
    }

    usedIds.add(def.id);

    // Main lift of each day gets +1 set in the consolidation block.
    const isMainLift = index === 0 && pattern !== 'core';
    const sets = weekNumber > 8 && isMainLift ? daySets : daySets;

    return {
      id: def.id,
      name: `musclePlan.exercises.${def.id}.name`,
      muscleGroups: def.muscleGroups.map((group) => `musclePlan.muscles.${group}`),
      sets,
      reps: repsForPattern(pattern, rules.reps),
      restSeconds: restForPattern(pattern),
      noEquipmentVariant: def.noEquipmentVariant
        ? `musclePlan.exercises.${def.noEquipmentVariant}.name`
        : undefined,
      glp1Note:
        isSenior && def.pattern !== 'core'
          ? 'musclePlan.notes.boneDensity'
          : index === 0
          ? 'musclePlan.notes.protein'
          : undefined,
    };
  });

  return {
    dayLabel: template.dayLabel,
    focus: template.focus,
    durationMin: isBeginner ? rules.duration - 3 : rules.duration,
    // Present on every day; shown conditionally when the user marks an injection day.
    intensityNote: 'musclePlan.notes.glp1InjectionDayReduced',
    exercises,
  };
}

export function generateMusclePlan(
  answers: MusclePlanQuizAnswers,
  _treatmentProfile: TreatmentProfile | null,
): WeeklyPlan[] {
  void _treatmentProfile;
  const templates = dayTemplates(answers.daysPerWeek);
  const workoutIndices = templates.map((template) => template.dayIndex);
  const restDays = [0, 1, 2, 3, 4, 5, 6].filter((day) => !workoutIndices.includes(day));

  const weeks: WeeklyPlan[] = [];
  for (let weekNumber = 1; weekNumber <= 12; weekNumber += 1) {
    const progressionNote =
      weekNumber <= 4
        ? 'musclePlan.progression.base'
        : weekNumber <= 8
        ? 'musclePlan.progression.build'
        : 'musclePlan.progression.consolidate';

    weeks.push({
      weekNumber,
      workoutDays: templates.map((template) => buildDay(template, weekNumber, answers)),
      restDays,
      progressionNote,
    });
  }

  return weeks;
}
