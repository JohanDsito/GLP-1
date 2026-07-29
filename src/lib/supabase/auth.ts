import { supabase } from './client';

export interface SignUpDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  acceptedTerms: boolean;
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, details: SignUpDetails) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: details.firstName,
        last_name: details.lastName,
        full_name: `${details.firstName} ${details.lastName}`.trim(),
        date_of_birth: details.dateOfBirth || null,
        sex: details.sex || null,
        terms_accepted_at: details.acceptedTerms ? new Date().toISOString() : null,
      },
    },
  });
}

export async function signOut() {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase.auth.signOut();
}

export async function updatePassword(newPassword: string) {
  if (!supabase) {
    throw new Error('Supabase is not configured.');
  }

  return supabase.auth.updateUser({ password: newPassword });
}
