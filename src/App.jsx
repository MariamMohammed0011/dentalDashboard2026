import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ThemeProvider } from "./context/ThemeContext";
import LoginForm from "./features/auth/components/LoginForm";
import MainLayout from "./components/shared/MainLayout";
import DashboardHome from "./features/dashboard/DashboardHome";
import OrdersPage from "./features/dashboard/pages/OrdersPage";
import MembershipRequestsPage from "./features/dashboard/pages/MembershipRequestsPage";
import DoctorsPage from "./features/dashboard/pages/DoctorsPage";
import LabsPage from "./features/dashboard/pages/LabsPage";
import DeliveryCompaniesPage from "./features/dashboard/pages/DeliveryCompaniesPage";
import AdsPage from "./features/dashboard/pages/AdsPage";
import ReportsPage from "./features/dashboard/pages/ReportsPage";
import InterventionLogPage from "./features/dashboard/pages/InterventionLogPage";
import SettingsPage from "./features/dashboard/pages/SettingsPage";

const queryClient = new QueryClient();

// مكون لحماية المسارات: إذا لم يوجد توكن، يوجه المستخدم للوج ان
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-left" richColors dir="rtl" />
        <Router>
  
          <Routes>
            {/* مسار تسجيل الدخول */}
            <Route 
              path="/login" 
              element={localStorage.getItem('auth_token') ? <Navigate to="/dashboard" replace /> : <LoginForm />} 
            />
  
            {/* مسارات لوحة التحكم المحمية */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="membership-requests" element={<MembershipRequestsPage />} />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="labs" element={<LabsPage />} />
              <Route path="delivery-companies" element={<DeliveryCompaniesPage />} />
              <Route path="ads" element={<AdsPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="intervention-log" element={<InterventionLogPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
  
            {/* إعادة توجيه أي مسار غير معروف للوج ان أو الداشبورد */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;