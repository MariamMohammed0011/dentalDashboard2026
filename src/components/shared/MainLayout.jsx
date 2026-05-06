import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar, { navItems, NavItem } from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { LogOut, Bell, Menu, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from "../../assets/logo.png";

export default function MainLayout() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-bg-main transition-colors duration-300" dir="rtl">
      {/* 1. السايد بار (مع تمرير حالة الطي) */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* 2. المحتوى الرئيسي */}
      <div className="flex-grow flex flex-col relative overflow-hidden">
        
        {/* الهيدر العلوي */}
        <header className="h-20 px-4 lg:px-10 flex justify-between items-center z-10">
          {/* زر المنيو واللوغو للموبايل */}
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-bg-card border border-border-main text-primary shadow-sm active:scale-95 transition-transform"
            >
              <Menu size={24} />
            </button>
            <img src={logoImg} alt="Logo" className="w-10 h-10 object-contain" />
          </div>

          <div className="flex-grow"></div>

          <div className="flex items-center gap-6 bg-bg-header backdrop-blur-md px-6 py-2 rounded-2xl border border-border-main">
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="h-8 w-[1px] bg-gray-300/50 dark:bg-gray-700/50 hidden sm:block" />
              <span className="font-bold text-text-main hidden sm:block">احمد سعيد</span>
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 border-2 border-white dark:border-gray-700 overflow-hidden shadow-sm">
                <img src="https://ui-avatars.com/api/?name=Ahmed+Saeed&background=367AFF&color=fff" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="h-8 w-[1px] bg-gray-300/50 dark:bg-gray-700/50 hidden sm:block" />

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

        {/* بوب اب المنيو للموبايل */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              />
              
              {/* Drawer Content */}
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-screen w-[280px] bg-bg-main z-50 shadow-2xl lg:hidden flex flex-col py-6"
                dir="rtl"
              >
                <div className="px-6 mb-8 flex justify-between items-center">
                  <img src={logoImg} alt="Logo" className="w-12 h-12 object-contain" />
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X size={24} className="text-text-muted" />
                  </button>
                </div>

                <nav className="flex-grow overflow-y-auto pb-6">
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <NavItem 
                        key={item.to} 
                        {...item} 
                        isCollapsed={false} 
                        onClick={() => setIsMobileMenuOpen(false)} 
                      />
                    ))}
                  </div>
                </nav>

                <div className="px-2 mt-auto border-t border-border-main pt-4">
                   <NavItem 
                    to="/dashboard/settings" 
                    label="الاعدادات" 
                    icon={Settings} 
                    isCollapsed={false} 
                    onClick={() => setIsMobileMenuOpen(false)} 
                   />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* الحاوية البيضاء للمحتوى - تم تصغير الإطار والسماح بالتمدد الرأسي */}
        <div className="flex-grow mx-2 sm:mx-4 lg:mx-8 mb-2 sm:mb-4 lg:mb-8 bg-white dark:bg-bg-card rounded-[2rem] lg:rounded-[2.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex flex-col relative border-[2px] lg:border-[4px] border-[#F1F5F9] dark:border-gray-900 transition-all duration-300 min-h-fit">
          <main className="flex-grow h-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

