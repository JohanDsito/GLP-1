import { supabase } from './client';

/** Returns true if the signed-in user's email is allowed into the app. */
export async function fetchHasAppAccess(): Promise<boolean> {
  if (!supabase) {
    return false;
  }
  const { data, error } = await supabase.rpc('has_app_access');
  if (error) {
    return false;
  }
  return Boolean(data);
}
