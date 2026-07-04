import type { ReactNode } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { CalendarClock, HeartPulse, LayoutDashboard, ScrollText, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navItems = [
  { to: '/dashboard', labelKey: 'nav.home', icon: LayoutDashboard },
  { to: '/dose-tracker', labelKey: 'nav.doses', icon: CalendarClock },
  { to: '/symptom-monitor', labelKey: 'nav.symptoms', icon: HeartPulse },
  { to: '/reports', labelKey: 'nav.reports', icon: ScrollText },
];

function Topbar() {
  const { t } = useTranslation();

  return (
    <header className="app-topbar">
      <Link className="brand-mark" to="/dashboard">
        <HeartPulse className="icon" />
        <span>{t('appName')}</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="topbar-pill">
          <span>{t('activePlan')}</span>
        </div>
        <Link className="topbar-action" to="/settings" aria-label="Open settings">
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
      <Topbar />
      {children ?? <Outlet />}
      <BottomNav />
    </div>
  );
}
