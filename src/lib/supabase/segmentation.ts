import { supabase } from './client';

export interface UserSegmentation {
  totalProfiles: number;
  byIntent: Record<string, number>;
  bySymptomProfile: Record<string, number>;
  byTimeBucket: Record<string, number>;
  topSymptoms: Record<string, number>;
  pendingRequests: number;
}

export async function fetchUserSegmentation(): Promise<UserSegmentation | null> {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.rpc('get_user_segmentation');

  if (error || !data) {
    throw error ?? new Error('No segmentation data returned.');
  }

  return data as UserSegmentation;
}
