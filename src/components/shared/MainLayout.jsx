import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { LogOut, Bell } from 'lucide-react';

export default function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  return (
    <div className="flex min-h-screen bg-[#E8F1FF] gap-2 md:gap-10" dir="rtl">
      {/* القائمة الجانبية على اليمين */}
      <Sidebar />

      {/* المحتوى الرئيسي في حاوية بيضاء مستديرة */}
      <div className="flex-grow py-6 pl-6 pr-6 md:pr-0 flex flex-col h-screen overflow-hidden">
        <div className="flex-grow bg-white rounded-[40px] shadow-sm flex flex-col overflow-hidden border-8 border-white/50">
          {/* الهيدر المخصص داخل الحاوية البيضاء */}
          <header className="px-8 py-4 flex justify-between items-center border-b border-gray-50">
            <div className="flex items-center gap-3">
              <span className="font-bold text-gray-700 text-lg">احمد سعيد</span>
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Ahmed+Saeed&background=random" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Bell size={24} />
                <span className="text-lg">3</span>
              </div>
              <div className="h-8 w-[1px] bg-gray-200" />
              <button 
                onClick={handleLogout}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <LogOut size={24} />
              </button>
            </div>
          </header>

          {/* منطقة عرض الصفحات */}
          <main className="flex-grow overflow-y-auto p-4 custom-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

