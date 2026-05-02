import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import LoginForm from "./features/auth/components/LoginForm";
import MainLayout from "./components/shared/MainLayout";
import DashboardHome from "./features/dashboard/DashboardHome";

const queryClient = new QueryClient();

// مكون لحماية المسارات: إذا لم يوجد توكن، يوجه المستخدم للوج ان
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auth_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

function App() {

  return (
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
            {/* يمكنك إضافة باقي الصفحات هنا مثل الحسابات والطلبات */}
          </Route>

          {/* إعادة توجيه أي مسار غير معروف للوج ان أو الداشبورد */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;