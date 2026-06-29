import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggleFAB from "./components/shared/ThemeToggleFAB";
import LoginForm from "./features/auth/components/LoginForm";
import MainLayout from "./components/shared/MainLayout";
import DashboardHome from "./features/dashboard/DashboardHome";
import OrdersPage from "./features/orders/pages/OrdersPage";
import MembershipRequestsPage from "./features/membership/pages/MembershipRequestsPage";
import DoctorsPage from "./features/doctors/pages/DoctorsPage";
import LabsPage from "./features/labs/pages/LabsPage";
import DeliveryCompaniesPage from "./features/dashboard/pages/DeliveryCompaniesPage";
import AdsPage from "./features/ads/pages/AdsPage";
import UsersManagementPage from "./features/ads/pages/UsersManagementPage";
import ReportsPage from "./features/reports/pages/ReportsPage";
import InterventionPage from "./features/interventions/pages/InterventionPage";
import SettingsPage from "./features/dashboard/pages/SettingsPage";
import BlogsPage from "./features/blogs/pages/BlogsPage";
import NotificationsListPage from "./features/notifications/pages/NotificationsListPage";
import SendNotificationPage from "./features/notifications/pages/SendNotificationPage";

const queryClient = new QueryClient();
import Cookies from "js-cookie";
const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("auth_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
};
const LoginRoute = () => {
  const token = Cookies.get("auth_token");
  if (token) return <Navigate to="/dashboard" replace />;
  return <LoginForm />;
};

function App() {

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="bottom-left" richColors dir="rtl" />
        <Router>
  
          <Routes>
             <Route 
              path="/login" 
              element={<LoginRoute />} 
            />
  
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
              <Route path="blogs" element={<BlogsPage />} />
              <Route path="delivery-companies" element={<DeliveryCompaniesPage />} />
              <Route path="ads" element={<AdsPage />} />
              <Route path="ads/users" element={<UsersManagementPage />} />
              <Route path="notifications" element={<NotificationsListPage />} />
              <Route path="notifications/send" element={<SendNotificationPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="intervention-log" element={<InterventionPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
  
            {/* إعادة توجيه أي مسار غير معروف للوج ان أو الداشبورد */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeToggleFAB />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;