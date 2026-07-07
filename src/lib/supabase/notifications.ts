import { supabase } from './client';

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  readAt: string | null;
  createdAt: string;
}

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  read_at: string | null;
  created_at: string;
};

function rowToNotification(row: NotificationRow): AppNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export async function fetchNotifications(userId: string): Promise<AppNotification[]> {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, body, read_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    throw error;
  }

  return (data as NotificationRow[]).map(rowToNotification);
}

export async function markNotificationRead(id: string): Promise<void> {
  if (!supabase) {
    return;
  }

  await supabase.from('notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  if (!supabase) {
    return;
  }

  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userId)
    .is('read_at', null);
}
