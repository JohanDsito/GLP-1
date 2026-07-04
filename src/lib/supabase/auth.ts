import { supabase } from './client';

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase.auth.signUp({ email, password });
}

export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase.auth.signOut();
}

