export type Gender = 'male' | 'female' | 'other';
export type AgeRange = '18-30' | '31-45' | '46-60' | '60+';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type Equipment = 'none' | 'bands' | 'dumbbells' | 'full_gym';

export interface MusclePlanQuizAnswers {
  gender: Gender;
  ageRange: AgeRange;
  fitnessLevel: FitnessLevel;
  daysPerWeek: 2 | 3 | 4 | 5;
  equipment: Equipment;
  glp1Medication: string;
}

export interface Exercise {
  id: string;
  name: string; // i18n key — NOT raw string
  muscleGroups: string[]; // i18n keys
  sets: number;
  reps: string; // e.g. "8-12" or "30 sec"
  restSeconds: number;
  noEquipmentVariant?: string; // i18n key for the alternative
  glp1Note?: string; // i18n key — specific note for GLP-1 users
}

export interface WorkoutDay {
  dayLabel: string; // i18n key: e.g. "musclePlan.days.upper"
  focus: string; // i18n key: e.g. "musclePlan.focus.upperBody"
  durationMin: number;
  intensityNote?: string; // i18n key — reduced intensity note for injection day
  exercises: Exercise[];
}

export interface WeeklyPlan {
  weekNumber: number;
  workoutDays: WorkoutDay[];
  restDays: number[]; // 0=Mon...6=Sun
  progressionNote: string; // i18n key
}

export interface MusclePlan {
  id: string;
  userId: string;
  quizAnswers: MusclePlanQuizAnswers;
  weeks: WeeklyPlan[]; // 12 weeks total
  currentWeek: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  planId: string | null;
  sessionDate: string;
  weekNumber: number;
  dayLabel: string;
  exercises: Exercise[];
  completed: boolean;
  durationMin: number | null;
  glp1InjectionDay: boolean;
  notes: string | null;
  createdAt: string;
}
