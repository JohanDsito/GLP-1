import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AnalyticsPage } from '../features/admin/analytics-page';
import { AuthPage } from '../features/auth/auth-page';
import { DashboardPage } from '../features/dashboard/dashboard-page';
import { DoseTrackerPage } from '../features/dose-tracker/dose-tracker-page';
import { LanguageSelectionPage } from '../features/language-selection/language-selection-page';
import { LegalPage } from '../features/legal/legal-page';
import { NotificationsPage } from '../features/notifications/notifications-page';
import { NutritionPage } from '../features/nutrition/nutrition-page';
import { ProgressPage } from '../features/progress/progress-page';
import { OnboardingPage } from '../features/onboarding/onboarding-page';
import { MedicalReportPage } from '../features/reports/medical-report-page';
import { SettingsPage } from '../features/settings/settings-page';
import { SideEffectDetailPage } from '../features/symptom-monitor/side-effect-detail-page';
import { SideEffectRequestPage } from '../features/symptom-monitor/side-effect-request-page';
import { SubscriptionPage } from '../features/subscription/subscription-page';
import { SymptomMonitorPage } from '../features/symptom-monitor/symptom-monitor-page';
import { AppShell } from '../shared/layout/app-shell';
import {
    RequireAdmin,
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
    path: '/terms',
    element: <LegalPage doc="terms" />,
  },
  {
    path: '/privacy',
    element: <LegalPage doc="privacy" />,
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
      { path: 'progress', element: <ProgressPage /> },
      { path: 'nutrition', element: <NutritionPage /> },
      { path: 'dose-tracker', element: <DoseTrackerPage /> },
      { path: 'symptom-monitor', element: <SymptomMonitorPage /> },
      { path: 'symptom-monitor/request', element: <SideEffectRequestPage /> },
      { path: 'symptom-monitor/:code', element: <SideEffectDetailPage /> },
      { path: 'reports', element: <MedicalReportPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'settings', element: <SettingsPage /> },
      {
        path: 'insights',
        element: (
          <RequireAdmin>
            <AnalyticsPage />
          </RequireAdmin>
        ),
      },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
