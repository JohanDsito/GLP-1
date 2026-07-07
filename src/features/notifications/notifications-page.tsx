import { BellOff, CheckCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../entities/auth/auth-store';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from '../../lib/supabase/notifications';
import { Section } from '../../shared/ui/section';

export function NotificationsPage() {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let mounted = true;

    fetchNotifications(userId)
      .then((items) => {
        if (mounted) {
          setNotifications(items);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [userId]);

  async function handleMarkAll() {
    if (!userId) {
      return;
    }

    await markAllNotificationsRead(userId);
    setNotifications((current) => current.map((item) => ({ ...item, readAt: item.readAt ?? new Date().toISOString() })));
  }

  async function handleRead(id: string) {
    await markNotificationRead(id);
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, readAt: item.readAt ?? new Date().toISOString() } : item)),
    );
  }

  const hasUnread = notifications.some((item) => !item.readAt);

  return (
    <main className="page">
      <div className="page-head">
        <div className="page-kicker">{t('notifications.kicker')}</div>
        <h1 className="page-title">{t('notifications.title')}</h1>
        <p className="page-subtitle">{t('notifications.subtitle')}</p>
      </div>

      <Section
        eyebrow={t('notifications.kicker')}
        title={t('notifications.title')}
        action={
          hasUnread ? (
            <button className="subtle-link" type="button" onClick={() => void handleMarkAll()}>
              <CheckCheck className="icon" style={{ display: 'inline-block' }} /> {t('notifications.markAllRead')}
            </button>
          ) : undefined
        }
      >
        {notifications.length > 0 ? (
          <div className="list">
            {notifications.map((item) => (
              <button
                type="button"
                className="list-item"
                key={item.id}
                onClick={() => void handleRead(item.id)}
                style={{ textAlign: 'left', width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <div>
                  <div className="list-item-title">{item.title}</div>
                  {item.body ? <div className="list-item-copy">{item.body}</div> : null}
                </div>
                {!item.readAt ? <span className="pill accent">{t('notifications.new')}</span> : null}
              </button>
            ))}
          </div>
        ) : (
          <div className="panel soft pad">
            <div className="panel-header">
              <p className="panel-copy">{t('notifications.empty')}</p>
              <BellOff className="icon" />
            </div>
          </div>
        )}
      </Section>
    </main>
  );
}
