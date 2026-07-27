import type { MusclePlan, WorkoutSession } from '../../entities/muscle-plan/types';
import { supabase } from './client';

type MusclePlanRow = {
  id: string;
  user_id: string;
  quiz_answers: MusclePlan['quizAnswers'];
  generated_plan: MusclePlan['weeks'];
  current_week: number;
  created_at: string;
  updated_at: string;
};

type WorkoutSessionRow = {
  id: string;
  user_id: string;
  plan_id: string | null;
  session_date: string;
  week_number: number;
  day_label: string;
  exercises: WorkoutSession['exercises'];
  completed: boolean;
  duration_min: number | null;
  glp1_injection_day: boolean;
  notes: string | null;
  created_at: string;
};

function rowToPlan(row: MusclePlanRow): MusclePlan {
  return {
    id: row.id,
    userId: row.user_id,
    quizAnswers: row.quiz_answers,
    weeks: row.generated_plan,
    currentWeek: row.current_week,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToSession(row: WorkoutSessionRow): WorkoutSession {
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    sessionDate: row.session_date,
    weekNumber: row.week_number,
    dayLabel: row.day_label,
    exercises: row.exercises,
    completed: row.completed,
    durationMin: row.duration_min,
    glp1InjectionDay: row.glp1_injection_day,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export async function fetchMusclePlan(userId: string): Promise<MusclePlan | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('muscle_plans')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle<MusclePlanRow>();

  if (error) {
    throw error;
  }

  return data ? rowToPlan(data) : null;
}

export async function upsertMusclePlan(
  userId: string,
  quizAnswers: MusclePlan['quizAnswers'],
  weeks: MusclePlan['weeks'],
  currentWeek: number,
): Promise<MusclePlan | null> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('muscle_plans')
    .upsert(
      {
        user_id: userId,
        quiz_answers: quizAnswers,
        generated_plan: weeks,
        current_week: currentWeek,
      },
      { onConflict: 'user_id' },
    )
    .select('*')
    .maybeSingle<MusclePlanRow>();

  if (error) {
    throw error;
  }

  return data ? rowToPlan(data) : null;
}

export async function updateCurrentWeek(userId: string, week: number): Promise<void> {
  if (!supabase) {
    return;
  }
  await supabase.from('muscle_plans').update({ current_week: week }).eq('user_id', userId);
}

export async function fetchWorkoutSessions(userId: string): Promise<WorkoutSession[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('session_date', { ascending: false })
    .limit(30);

  if (error) {
    throw error;
  }

  return (data as WorkoutSessionRow[]).map(rowToSession);
}

export async function insertWorkoutSession(
  session: Omit<WorkoutSession, 'id' | 'createdAt'>,
): Promise<WorkoutSession | null> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({
      user_id: session.userId,
      plan_id: session.planId,
      session_date: session.sessionDate,
      week_number: session.weekNumber,
      day_label: session.dayLabel,
      exercises: session.exercises,
      completed: session.completed,
      duration_min: session.durationMin,
      glp1_injection_day: session.glp1InjectionDay,
      notes: session.notes,
    })
    .select('*')
    .maybeSingle<WorkoutSessionRow>();

  if (error) {
    throw error;
  }

  return data ? rowToSession(data) : null;
}

export async function updateSessionInjectionDay(sessionId: string, isInjectionDay: boolean): Promise<void> {
  if (!supabase) {
    return;
  }
  await supabase.from('workout_sessions').update({ glp1_injection_day: isInjectionDay }).eq('id', sessionId);
}
