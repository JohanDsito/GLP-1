import { Bell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../entities/auth/auth-store';
import { enablePush, isPushSupported } from '../../lib/push';
import {
  defaultReminderPreferences,
  fetchReminderPreferences,
  saveReminderPreferences,
  type ReminderPreferences,
} from '../../lib/supabase/reminders';

export function ReminderSettings() {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [prefs, setPrefs] = useState<ReminderPreferences>(defaultReminderPreferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pushStatus, setPushStatus] = useState<'idle' | 'enabling' | 'enabled' | 'denied' | 'error'>('idle');
  const [pushErrorDetail, setPushErrorDetail] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let mounted = true;
    fetchReminderPreferences(userId)
      .then((result) => {
        if (mounted) {
          setPrefs(result);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [userId]);

  async function handleSave(next: ReminderPreferences) {
    setPrefs(next);
    if (!userId) {
      return;
    }

    setSaving(true);
    setSaved(false);
    try {
      await saveReminderPreferences(userId, next);
      setSaved(true);
    } catch {
      // Non-fatal.
    } finally {
      setSaving(false);
    }
  }

  async function handleEnablePush() {
    setPushStatus('enabling');
    setPushErrorDetail(null);
    const result = await enablePush();
    if (result.ok) {
      setPushStatus('enabled');
    } else if (result.reason === 'denied') {
      setPushStatus('denied');
    } else {
      setPushStatus('error');
      setPushErrorDetail('message' in result ? (result.message ?? null) : null);
    }
  }

  return (
    <article className="panel pad">
      <div className="panel-header">
        <div>
          <div className="pill accent">{t('reminders.title')}</div>
          <p className="panel-copy">{t('reminders.subtitle')}</p>
        </div>
        <Bell className="icon" />
      </div>

      <div className="stack" style={{ gap: 14 }}>
        <label className="list-item" style={{ cursor: 'pointer' }}>
          <div>
            <div className="list-item-title">{t('reminders.doseReminder')}</div>
            <div className="list-item-copy">{t('reminders.doseReminderHelp')}</div>
          </div>
          <input
            type="checkbox"
            checked={prefs.doseReminderEnabled}
            onChange={(event) => void handleSave({ ...prefs, doseReminderEnabled: event.target.checked })}
          />
        </label>
        {prefs.doseReminderEnabled ? (
          <input
            className="auth-input"
            type="time"
            value={prefs.doseReminderTime}
            onChange={(event) => void handleSave({ ...prefs, doseReminderTime: event.target.value })}
          />
        ) : null}

        <label className="list-item" style={{ cursor: 'pointer' }}>
          <div>
            <div className="list-item-title">{t('reminders.checkinReminder')}</div>
            <div className="list-item-copy">{t('reminders.checkinReminderHelp')}</div>
          </div>
          <input
            type="checkbox"
            checked={prefs.checkinReminderEnabled}
            onChange={(event) => void handleSave({ ...prefs, checkinReminderEnabled: event.target.checked })}
          />
        </label>
        {prefs.checkinReminderEnabled ? (
          <input
            className="auth-input"
            type="time"
            value={prefs.checkinReminderTime}
            onChange={(event) => void handleSave({ ...prefs, checkinReminderTime: event.target.value })}
          />
        ) : null}

        {saving ? <p className="panel-copy" style={{ fontSize: 13 }}>{t('auth.working')}</p> : null}
        {saved && !saving ? <p className="panel-copy" style={{ fontSize: 13 }}>{t('reminders.saved')}</p> : null}

        <div className="stack" style={{ gap: 8 }}>
          <span className="onboarding-step">{t('reminders.pushTitle')}</span>
          <p className="panel-copy" style={{ fontSize: 13 }}>{t('reminders.pushHelp')}</p>
          {isPushSupported ? (
            <button
              className="cta secondary"
              type="button"
              onClick={() => void handleEnablePush()}
              disabled={pushStatus === 'enabling' || pushStatus === 'enabled'}
            >
              {pushStatus === 'enabled' ? t('reminders.pushEnabled') : t('reminders.enablePush')}
            </button>
          ) : (
            <p className="panel-copy" style={{ fontSize: 13 }}>{t('reminders.pushUnsupported')}</p>
          )}
          {pushStatus === 'denied' ? <div className="auth-alert">{t('reminders.pushDenied')}</div> : null}
          {pushStatus === 'error' ? (
            <div className="auth-alert">
              {t('reminders.pushError')}
              {pushErrorDetail ? <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>{pushErrorDetail}</div> : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
