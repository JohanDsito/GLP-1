import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Apple, Bell, CalendarClock, HeartPulse, LayoutDashboard, LineChart, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../entities/auth/auth-store';
import { fetchNotifications } from '../../lib/supabase/notifications';
import { AchievementTracker } from '../../app/achievement-tracker';
import { FirstRunTour } from '../ui/first-run-tour';
import { BrandMark } from '../ui/brand-mark';

const navItems = [
  { to: '/dashboard', labelKey: 'nav.home', icon: LayoutDashboard },
  { to: '/dose-tracker', labelKey: 'nav.doses', icon: CalendarClock },
  { to: '/progress', labelKey: 'nav.progress', icon: LineChart },
  { to: '/nutrition', labelKey: 'nav.nutrition', icon: Apple },
  { to: '/symptom-monitor', labelKey: 'nav.symptoms', icon: HeartPulse },
];

function Topbar() {
  const { t } = useTranslation();
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let mounted = true;

    fetchNotifications(userId)
      .then((items) => {
        if (mounted) {
          setUnreadCount(items.filter((item) => !item.readAt).length);
        }
      })
      .catch(() => undefined);

    return () => {
      mounted = false;
    };
  }, [userId]);

  return (
    <header className="app-topbar">
      <Link className="brand-mark" to="/dashboard" aria-label={t('appName')}>
        <BrandMark size="sm" />
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="topbar-pill">
          <span>{t('activePlan')}</span>
        </div>
        <Link className="topbar-action" to="/notifications" aria-label={t('notifications.title')} style={{ position: 'relative' }}>
          <Bell className="icon" />
          {unreadCount > 0 ? (
            <span
              style={{
                position: 'absolute',
                top: -4,
                right: -4,
                minWidth: 16,
                height: 16,
                borderRadius: 999,
                background: 'var(--danger, #ba1a1a)',
                color: '#fff',
                fontSize: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
              }}
            >
              {unreadCount}
            </span>
          ) : null}
        </Link>
        <Link className="topbar-action" to="/settings" aria-label={t('settings.title')}>
          <Settings className="icon" />
        </Link>
      </div>
    </header>
  );
}

function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="nav" aria-label="Primary">
      {navItems.map(({ to, labelKey, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/dashboard'}
          className={({ isActive }) => (isActive ? 'active' : undefined)}
        >
          <Icon className="icon" />
          <span className="nav-label">{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function AppShell({ children }: { children?: ReactNode }) {
  return (
    <div className="app-shell">
      <FirstRunTour />
      <AchievementTracker />
      <Topbar />
      {children ?? <Outlet />}
      <BottomNav />
    </div>
  );
}
