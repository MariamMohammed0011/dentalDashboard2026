import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar, { navItems, NavItem } from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { LogOut, Bell, Menu, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from "../../assets/logo.png";
import Header from './Header/Header';
import MainComponent from './MainComponent';
import { useLogout } from '../../features/auth/hooks/useLogout';
export default function MainLayout() {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
const { handleLogout, isLoggingOut } = useLogout();
  return (
    <div className="flex min-h-screen bg-bg-main transition-colors duration-300" dir="rtl">
      
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      
      <div className="flex-grow flex flex-col relative overflow-x-hidden overflow-y-auto">
        
        
        <Header handleLogout={handleLogout} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
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

                <nav className="flex-grow overflow-y-auto no-scrollbar pb-6">
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
        <MainComponent>
          <main className="h-full flex-grow flex flex-col">
            <Outlet /> 
          </main>
        </MainComponent>

       
       
      </div>
    </div>
  );
}

