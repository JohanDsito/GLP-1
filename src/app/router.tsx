import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AnalyticsPage } from '../features/admin/analytics-page';
import { AuthPage } from '../features/auth/auth-page';
import { NoAccessPage } from '../features/auth/no-access-page';
import { ResetPasswordPage } from '../features/auth/reset-password-page';
import { DashboardPage } from '../features/dashboard/dashboard-page';
import { MusclePlanUpgradePage } from '../features/muscle-plan/upgrade/muscle-plan-upgrade-page';
import { SeguimientoPage } from '../features/tracking/seguimiento-page';
import { LanguageSelectionPage } from '../features/language-selection/language-selection-page';
import { LegalPage } from '../features/legal/legal-page';
import { MusclePlanBoot } from '../features/muscle-plan/muscle-plan-boot';
import { MusclePlanDashboardPage } from '../features/muscle-plan/dashboard/muscle-plan-dashboard';
import { MusclePlanQuizPage } from '../features/muscle-plan/quiz/muscle-plan-quiz-page';
import { MusclePlanSessionPage } from '../features/muscle-plan/session/session-page';
import { NotificationsPage } from '../features/notifications/notifications-page';
import { NutritionPage } from '../features/nutrition/nutrition-page';
import { OnboardingPage } from '../features/onboarding/onboarding-page';
import { MedicalReportPage } from '../features/reports/medical-report-page';
import { SettingsPage } from '../features/settings/settings-page';
import { SideEffectDetailPage } from '../features/symptom-monitor/side-effect-detail-page';
import { SideEffectRequestPage } from '../features/symptom-monitor/side-effect-request-page';
import { SymptomMonitorPage } from '../features/symptom-monitor/symptom-monitor-page';
import { AppShell } from '../shared/layout/app-shell';
import {
    RequireAdmin,
    RequireAppAccess,
    RequireAuthPageAccess,
    RequireLanguageSelection,
    RequireMusclePlanAccess,
    RequirePaidAccess,
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
    path: '/reset-password',
    element: <ResetPasswordPage />,
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
    element: <Navigate to="/" replace />,
  },
  {
    path: '/no-access',
    element: (
      <RequireLanguageSelection>
        <NoAccessPage />
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
      { path: 'seguimiento', element: <SeguimientoPage /> },
      { path: 'nutrition', element: <NutritionPage /> },
      { path: 'faq', element: <Navigate to="/symptom-monitor?view=faq" replace /> },
      // Legacy routes kept as redirects into the merged Seguimiento tabs.
      { path: 'progress', element: <Navigate to="/seguimiento?view=progress" replace /> },
      { path: 'dose-tracker', element: <Navigate to="/seguimiento?view=log" replace /> },
      { path: 'symptom-monitor', element: <SymptomMonitorPage /> },
      { path: 'symptom-monitor/request', element: <SideEffectRequestPage /> },
      { path: 'symptom-monitor/:code', element: <SideEffectDetailPage /> },
      { path: 'reports', element: <MedicalReportPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
      { path: 'muscle-plan/upgrade', element: <MusclePlanUpgradePage /> },
      {
        path: 'muscle-plan/quiz',
        element: (
          <RequireMusclePlanAccess>
            <MusclePlanQuizPage />
          </RequireMusclePlanAccess>
        ),
      },
      {
        path: 'muscle-plan/dashboard',
        element: (
          <RequireMusclePlanAccess>
            <MusclePlanBoot requirePlan>
              <MusclePlanDashboardPage />
            </MusclePlanBoot>
          </RequireMusclePlanAccess>
        ),
      },
      {
        path: 'muscle-plan/session/:dayIndex',
        element: (
          <RequireMusclePlanAccess>
            <MusclePlanBoot requirePlan>
              <MusclePlanSessionPage />
            </MusclePlanBoot>
          </RequireMusclePlanAccess>
        ),
      },
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
