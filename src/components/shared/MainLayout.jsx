import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-primary-dark" dir="rtl">
      {/* القائمة الجانبية */}
      <Sidebar onLogout={handleLogout} />

      {/* المحتوى الرئيسي */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* الهيدر العلوي */}
        <Header />

        {/* منطقة عرض الصفحات */}
        <main className="flex-grow overflow-y-auto p-8 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}