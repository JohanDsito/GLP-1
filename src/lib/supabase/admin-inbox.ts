import { supabase } from './client';

export interface AdminQuestion {
  id: string;
  createdAt: string;
  email: string;
  question: string;
  status: string;
}

export interface AdminSideEffectRequest {
  id: string;
  createdAt: string;
  email: string;
  categoryGuess: string | null;
  queryText: string;
  notes: string | null;
  status: string;
}

export async function fetchAdminQuestions(): Promise<AdminQuestion[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase.rpc('admin_list_user_questions');
  if (error) {
    throw error;
  }
  return ((data ?? []) as Array<Record<string, string>>).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    email: row.email,
    question: row.question,
    status: row.status,
  }));
}

export async function fetchAdminSideEffectRequests(): Promise<AdminSideEffectRequest[]> {
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase.rpc('admin_list_side_effect_requests');
  if (error) {
    throw error;
  }
  return ((data ?? []) as Array<Record<string, string | null>>).map((row) => ({
    id: row.id as string,
    createdAt: row.created_at as string,
    email: row.email as string,
    categoryGuess: row.category_guess,
    queryText: row.query_text as string,
    notes: row.notes,
    status: row.status as string,
  }));
}

export async function setQuestionStatus(id: string, status: 'submitted' | 'answered'): Promise<void> {
  if (!supabase) {
    return;
  }
  const { error } = await supabase.from('user_questions').update({ status }).eq('id', id);
  if (error) {
    throw error;
  }
}

export async function setSideEffectRequestStatus(id: string, status: 'submitted' | 'reviewed'): Promise<void> {
  if (!supabase) {
    return;
  }
  const { error } = await supabase.from('side_effect_requests').update({ status }).eq('id', id);
  if (error) {
    throw error;
  }
}
