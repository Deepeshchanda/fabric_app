import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AuthPage } from '@/components/AuthPage';
import { useAuth } from '@/hooks/AuthContext';
import { BusinessPerformanceDashboardPage } from '@/pages/BusinessPerformanceDashboardPage';
import { GlobalOpexDashboardPage } from '@/pages/GlobalOpexDashboardPage';
import { HomePage } from '@/pages/HomePage';
import { PLDashboardPage } from '@/pages/PLDashboardPage';
import { PortfolioDashboardPage } from '@/pages/PortfolioDashboardPage';
import { ProcurementDashboardPage } from '@/pages/ProcurementDashboardPage';
import { SalesDashboardPage } from '@/pages/SalesDashboardPage';

function AuthGuard({
  children,
  requireAuth,
}: {
  children: React.ReactNode;
  requireAuth: boolean;
}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) return <Navigate to="/auth" replace />;
  if (!requireAuth && isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      {/* ensure all new routes require auth */}
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthGuard requireAuth={false}>
              <AuthPage />
            </AuthGuard>
          }
        />
        <Route
          path="/"
          element={
            <AuthGuard requireAuth={true}>
              <HomePage />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboards/sales"
          element={
            <AuthGuard requireAuth={true}>
              <SalesDashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboards/global-opex"
          element={
            <AuthGuard requireAuth={true}>
              <GlobalOpexDashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboards/pl"
          element={
            <AuthGuard requireAuth={true}>
              <PLDashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboards/procurement"
          element={
            <AuthGuard requireAuth={true}>
              <ProcurementDashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboards/portfolio"
          element={
            <AuthGuard requireAuth={true}>
              <PortfolioDashboardPage />
            </AuthGuard>
          }
        />
        <Route
          path="/dashboards/business-performance"
          element={
            <AuthGuard requireAuth={true}>
              <BusinessPerformanceDashboardPage />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
