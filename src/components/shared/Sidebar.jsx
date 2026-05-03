import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoImg from "../../assets/logo.png";
import { 
  LayoutDashboard, 
  ClipboardList, 
  UserPlus, 
  UserCog, 
  FlaskConical, 
  Truck, 
  Megaphone, 
  FileText, 
  History, 
  Settings,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const NavItem = ({ to, label, icon: Icon, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));

  return (
    <div className="relative w-full">
      

      <Link 
        to={to} 
        className={`relative z-10 flex items-center py-2 transition-all duration-300 mx-4 my-0.5 rounded-xl ${
          isActive 
            ? "bg-white text-primary font-black shadow-md scale-[1.02]" 
            : "text-gray-500 font-bold hover:text-primary hover:bg-white/30"
        } ${isCollapsed ? "justify-center px-0" : "justify-start px-4 gap-3"}`}
      >
        <Icon size={isCollapsed ? 22 : 20} className={`transition-transform duration-300 ${isActive ? "text-primary scale-110" : "text-gray-400"}`} />
        {!isCollapsed && (
          <span className={`whitespace-nowrap transition-transform duration-300 origin-right text-sm ${isActive ? "scale-110 translate-x-1" : ""}`}>
            {label}
          </span>
        )}
      </Link>
    </div>
  );
};

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const navItems = [
    { to: "/dashboard", label: "الداشبورد", icon: LayoutDashboard },
    { to: "/dashboard/orders", label: "الطلبات", icon: ClipboardList },
    { to: "/dashboard/membership-requests", label: "طلبات الانتساب", icon: UserPlus },
    { to: "/dashboard/doctors", label: "الاطباء", icon: UserCog },
    { to: "/dashboard/labs", label: "المخابر", icon: FlaskConical },
    { to: "/dashboard/delivery-companies", label: "شركات التوصيل", icon: Truck },
    { to: "/dashboard/ads", label: "الإعلانات", icon: Megaphone },
    { to: "/dashboard/reports", label: "التقارير", icon: FileText },
    { to: "/dashboard/intervention-log", label: "سجل التدخلات", icon: History },
  ];

  return (
    <aside 
      className={`h-screen flex flex-col py-4 bg-[#E8F1FF] z-20 transition-all duration-300 relative border-l border-white/20 ${
        isCollapsed ? "w-[80px]" : "w-[260px]"
      }`} 
      dir="rtl"
    > 
      {/* زر الطي (Toggle Button) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-24 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center text-primary z-30 border border-gray-100 hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* اللوجو */}
      <div className={`px-4 mb-6 flex justify-center transition-all ${isCollapsed ? "scale-75" : ""}`}>
        <img src={logoImg} alt="Dental Dash" className={`${isCollapsed ? "w-10" : "w-20"} object-contain`} />
      </div>

      {/* القائمة */}
      <nav className="flex flex-col justify-between flex-grow pb-4 overflow-hidden">
        <div className="flex flex-col">
          {navItems.map((item) => (
            <NavItem key={item.to} {...item} isCollapsed={isCollapsed} />
          ))}
        </div>
        
        <NavItem to="/dashboard/settings" label="الاعدادات" icon={Settings} isCollapsed={isCollapsed} />
      </nav>
    </aside>
  );
}

