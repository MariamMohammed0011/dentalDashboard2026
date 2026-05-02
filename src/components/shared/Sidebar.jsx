import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from "../../assets/logo.png";

const NavItem = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));

  return (
    <div className="relative w-full">
      {/* الجسر الأفقي الرابط بين السايد بار والمحتوى */}
      {isActive && (
        <div className="absolute top-1/2 -translate-y-1/2 -left-[40px] w-[50px] h-12 bg-white z-0 pointer-events-none" />
      )}

      {/* المستطيل الأبيض حول الليبل */}
      <Link 
        to={to} 
        className={`relative z-10 flex items-center justify-center py-3.5 px-6 rounded-2xl transition-all duration-300 text-sm mx-4 my-1.5 ${
          isActive 
            ? "bg-white text-primary font-black scale-105 shadow-xl shadow-primary/5" 
            : "text-[#111827] font-bold hover:text-primary hover:font-black hover:scale-110"
        }`}
      >
        <span>{label}</span>
      </Link>

      {/* المنحنيات الاحترافية (Concave) لربط الجسر بالسايد بار */}
      {isActive && (
        <>
          <div className="absolute top-[-22px] -left-[40px] w-10 h-10 bg-white pointer-events-none z-0">
             <div className="w-full h-full bg-[#E8F1FF] rounded-br-full" />
          </div>
          <div className="absolute bottom-[-22px] -left-[40px] w-10 h-10 bg-white pointer-events-none z-0">
             <div className="w-full h-full bg-[#E8F1FF] rounded-tr-full" />
          </div>
        </>
      )}
    </div>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-64 flex flex-col py-8 bg-[#E8F1FF]" dir="rtl"> 
      {/* اللوجو */}
      <div className="px-8 mb-10 flex justify-center">
        <img src={logoImg} alt="Dental Dash" className="w-32 object-contain" />
      </div>

      {/* القائمة الملاحية */}
      <nav className="flex flex-col">
        <NavItem to="/dashboard" label="الداشبورد" />
        <NavItem to="/dashboard/orders" label="الطلبات" />
        <NavItem to="/dashboard/membership-requests" label="طلبات الانتساب" />
        <NavItem to="/dashboard/doctors" label="الاطباء" />
        <NavItem to="/dashboard/labs" label="المخابر" />
        <NavItem to="/dashboard/delivery-companies" label="شركات التوصيل" />
        <NavItem to="/dashboard/ads" label="الإعلانات" />
        <NavItem to="/dashboard/reports" label="التقارير" />
        <NavItem to="/dashboard/intervention-log" label="سجل التدخلات" />
        <NavItem to="/dashboard/settings" label="الاعدادات" />
      </nav>
    </aside>
  );
}

