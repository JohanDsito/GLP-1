import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthPage } from '../features/auth/auth-page';
import { DashboardPage } from '../features/dashboard/dashboard-page';
import { DoseTrackerPage } from '../features/dose-tracker/dose-tracker-page';
import { LanguageSelectionPage } from '../features/language-selection/language-selection-page';
import { OnboardingPage } from '../features/onboarding/onboarding-page';
import { MedicalReportPage } from '../features/reports/medical-report-page';
import { SettingsPage } from '../features/settings/settings-page';
import { SubscriptionPage } from '../features/subscription/subscription-page';
import { SymptomMonitorPage } from '../features/symptom-monitor/symptom-monitor-page';
import { AppShell } from '../shared/layout/app-shell';
import {
    RequireAppAccess,
    RequireAuthPageAccess,
    RequireLanguageSelection,
    RequirePaidAccess,
    RequireSubscriptionPageAccess,
} from './access-gates';
import { RootRoute } from './root-route';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
  },
  {
    path: '/select-language',
    element: <LanguageSelectionPage />,
  },
  {
    path: '/auth',
    element: (
      <RequireLanguageSelection>
        <RequireAuthPageAccess>
          <AuthPage />
        </RequireAuthPageAccess>
      </RequireLanguageSelection>
    ),
  },
  {
    path: '/subscribe',
    element: (
      <RequireLanguageSelection>
        <RequireSubscriptionPageAccess>
          <SubscriptionPage />
        </RequireSubscriptionPageAccess>
      </RequireLanguageSelection>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <RequireLanguageSelection>
        <RequirePaidAccess>
          <OnboardingPage />
        </RequirePaidAccess>
      </RequireLanguageSelection>
    ),
  },
  {
    element: (
      <RequireLanguageSelection>
        <RequirePaidAccess>
          <RequireAppAccess>
            <AppShell />
          </RequireAppAccess>
        </RequirePaidAccess>
      </RequireLanguageSelection>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'dose-tracker', element: <DoseTrackerPage /> },
      { path: 'symptom-monitor', element: <SymptomMonitorPage /> },
      { path: 'reports', element: <MedicalReportPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
