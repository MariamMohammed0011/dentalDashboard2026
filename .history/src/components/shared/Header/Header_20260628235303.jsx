import React from 'react';
import { LogOut, Menu, User } from 'lucide-react';
import { useProfile } from '../../../features/auth/hooks/useProfile';
import NotificationMenu from '../Notifications/NotificationMenu';

export default function Header({ handleLogout, setIsMobileMenuOpen }) {
  const { data: user, isLoading } = useProfile();

  return (
    <header className="absolute lg:top-2 top-4 left-0 h-10 px-4 flex items-center justify-between w-full z-20 pointer-events-none">
      <div className="flex items-center gap-6 pointer-events-auto w-full justify-between">
        
       
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm text-text-main"
        >
          <Menu size={24} />
        </button>

        <div className="flex items-center gap-3 mr-auto">
         
          <div className="flex items-center gap-2">
            {/* <div className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden shadow-sm bg-primary/10 flex items-center justify-center">
              {user?.name ? (
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=367AFF&color=fff`} 
                  alt="User" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User size={20} className="text-primary" />
              )}
            </div> */}
            <span className="font-bold text-text-main block text-sm">
              {isLoading ? 'جاري التحميل...' : (user?.name || 'مسؤول النظام')}
            </span>
          </div>

          {/* التنبيهات */}
          <NotificationMenu />


          <button 
            onClick={handleLogout}
            className="text-danger hover:bg-danger-bg p-2 rounded-xl transition-all"
            title="تسجيل الخروج"
          >
            <LogOut size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
