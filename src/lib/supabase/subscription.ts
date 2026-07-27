import type { SubscriptionStatus } from '../../entities/subscription/subscription-store';
import { supabase } from './client';

type SubscriptionRow = {
  status: string | null;
};

const allowedStatuses = new Set<SubscriptionStatus>([
  'active',
  'trialing',
  'past_due',
  'canceled',
  'inactive',
]);

function normalizeSubscriptionStatus(status: string | null | undefined): SubscriptionStatus {
  if (!status) {
    return 'inactive';
  }

  if (allowedStatuses.has(status as SubscriptionStatus)) {
    return status as SubscriptionStatus;
  }

  return 'inactive';
}

export async function fetchSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  if (!supabase) {
    return 'inactive';
  }

  const { data, error } = await supabase.from('subscriptions').select('status').eq('user_id', userId).maybeSingle();

  if (error) {
    throw error;
  }

  return normalizeSubscriptionStatus((data as SubscriptionRow | null)?.status ?? null);
}

export async function fetchHasMusclePlan(userId: string): Promise<boolean> {
  if (!supabase) {
    return false;
  }

  const { data, error } = await supabase
    .from('subscriptions')
    .select('has_muscle_plan')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    return false;
  }

  return Boolean((data as { has_muscle_plan?: boolean } | null)?.has_muscle_plan);
}
