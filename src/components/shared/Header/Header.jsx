import React from 'react';
import { LogOut, Bell, Menu } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';

export default function Header({ handleLogout, setIsMobileMenuOpen }) {
  return (
    <header className="absolute top-2 left-0 h-10 px-4 lg:px-10 flex items-center justify-between w-full z-20 pointer-events-none">
      <div className="flex items-center gap-6 pointer-events-auto w-full justify-between">
        
        {/* زر القائمة للموبايل - يظهر فقط في الشاشات الصغيرة */}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm text-text-main"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-4 mr-auto">
          {/* اسم المستخدم والصورة */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden shadow-sm">
              <img src="https://ui-avatars.com/api/?name=Ahmed+Saeed&background=367AFF&color=fff" alt="User" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-text-main hidden sm:block text-sm">احمد سعيد</span>
          </div>

          {/* التنبيهات */}
          <div className="flex items-center gap-2 text-primary font-bold relative">
            <Bell size={22} className="text-primary/80" />
            <span className="bg-primary text-white text-[10px] absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full">3</span>
          </div>
{/* 
          <div className="h-8 w-[1px] bg-gray-300/40 dark:bg-gray-700/40 hidden sm:block" />

        
          <ThemeToggle /> */}

          {/* زر تسجيل الخروج */}
          <button 
            onClick={handleLogout}
            className="text-red-500 hover:bg-red-50/50 p-2 rounded-xl transition-all"
            title="تسجيل الخروج"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
