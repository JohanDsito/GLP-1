import { supabase } from './client';

export type SideEffectRequestCategoryGuess = 'physical' | 'psychological' | 'unsure';

export async function submitSideEffectRequest(
  userId: string,
  input: { categoryGuess: SideEffectRequestCategoryGuess; queryText: string; notes?: string },
): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  const { error } = await supabase.from('side_effect_requests').insert({
    user_id: userId,
    category_guess: input.categoryGuess,
    query_text: input.queryText,
    notes: input.notes ?? null,
  });

  if (error) {
    throw error;
  }
}
