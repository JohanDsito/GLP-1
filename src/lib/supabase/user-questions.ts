import { supabase } from './client';

export async function submitUserQuestion(userId: string, question: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('user_questions').insert({
    user_id: userId,
    question,
  });

  if (error) {
    throw error;
  }
}
