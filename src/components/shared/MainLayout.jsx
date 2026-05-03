import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { LogOut, Bell } from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen bg-bg-main overflow-hidden transition-colors duration-300" dir="rtl">
      {/* 1. السايد بار (مع تمرير حالة الطي) */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* 2. المحتوى الرئيسي */}
      <div className="flex-grow flex flex-col relative overflow-hidden">
        
        {/* الهيدر العلوي */}
        <header className="h-20 px-10 flex justify-between items-center z-10">
          <div className="flex-grow"></div>

          <div className="flex items-center gap-6 bg-bg-header backdrop-blur-md px-6 py-2 rounded-2xl border border-border-main">
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="h-8 w-[1px] bg-gray-300/50 dark:bg-gray-700/50" />
              <span className="font-bold text-text-main">احمد سعيد</span>
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-700 overflow-hidden shadow-sm">
                <img src="https://ui-avatars.com/api/?name=Ahmed+Saeed&background=367AFF&color=fff" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="h-8 w-[1px] bg-gray-300/50 dark:bg-gray-700/50" />

            <div className="flex items-center gap-2 text-primary font-bold relative">
              <Bell size={22} className="text-primary/80" />
              <span className="bg-primary text-white text-[10px] absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full">3</span>
            </div>

            <div className="h-8 w-[1px] bg-gray-300/50 dark:bg-gray-700/50" />

            <button 
              onClick={handleLogout}
              className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
              title="تسجيل الخروج"
            >
              <LogOut size={22} />
            </button>
          </div>
        </header>

        {/* الحاوية البيضاء للمحتوى */}
        <div className="flex-grow mx-10 mb-10 bg-bg-card rounded-[40px] shadow-2xl shadow-primary/5 flex flex-col overflow-hidden relative border-8 border-bg-card transition-colors duration-300">
          <main className="flex-grow overflow-y-auto custom-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

