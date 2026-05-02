import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LogOut, Settings } from 'lucide-react';
import loginImg from "../../assets/login.png";

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold ${
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-gray-600 hover:bg-primary/10 hover:text-primary"
      }`}
    >

      <Icon size={22} />
      <span>{label}</span>
    </Link>
  );
};

export default function Sidebar({ onLogout }) {
  return (
    <aside className="lg:flex w-72 bg-white border-l border-gray-100 shadow-sm flex-col" dir="rtl"> 
      {/* اللوجو */}
      <div className="p-8 flex justify-center">
        <div className="bg-primary/10 p-4 rounded-2xl inline-block">
          <img src={loginImg} alt="Mada ICR" className="w-16 h-16 object-contain" />
        </div>
      </div>

      {/* القائمة الملاحية */}
      <nav className="flex-grow px-4 space-y-2">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="الداشبورد" />
        <NavItem to="/dashboard/accounts" icon={Users} label="الحسابات" />
        <NavItem to="/dashboard/orders" icon={FileText} label="الطلبات" />
        <NavItem to="/dashboard/settings" icon={Settings} label="الإعدادات" />
      </nav>

      {/* زر تسجيل الخروج */}
      <div className="p-4 border-t border-gray-50">
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 w-full p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-right"
        >
          <LogOut size={22} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
