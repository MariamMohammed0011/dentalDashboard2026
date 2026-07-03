import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from "../../assets/logo.png";
import { 
  LayoutDashboard, 
  ClipboardList, 
  UserPlus, 
  UserCog, 
  FlaskConical, 
  Megaphone, 
  FileText, 
  History, 
  Settings,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Bell,
  CreditCard
} from 'lucide-react';

export const NavItem = ({ to, label, icon: Icon, isCollapsed, onClick, children }) => {
  const location = useLocation();
  
  
  const isAnyChildActive = children
    ? children.some(child => location.pathname === child.to || (child.to !== "/dashboard" && location.pathname.startsWith(child.to)))
    : false;

  const isActive = children 
    ? isAnyChildActive
    : location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));

  const [isOpen, setIsOpen] = useState(isAnyChildActive);

  useEffect(() => {
    if (isAnyChildActive) {
      setIsOpen(true);
    }
  }, [location.pathname, isAnyChildActive]);

  if (children) {
    return (
      <div className="relative w-full flex flex-col">
        <button 
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`relative z-10 flex items-center py-2 transition-all duration-300 mx-4 my-0.5 rounded-xl group cursor-pointer ${
            isActive 
              ? "bg-sidebar-active text-primary font-black shadow-sm" 
              : "text-text-muted font-bold hover:text-primary hover:bg-white/10 dark:hover:bg-white/5"
          } ${isCollapsed ? "justify-center px-0" : "justify-between px-4"}`}
        >
          <div className="flex items-center gap-3">
            <Icon size={isCollapsed ? 22 : 20} className={`transition-all duration-300 ${isActive ? "text-primary scale-110" : "text-text-muted/60"} group-hover:rotate-[15deg] group-hover:scale-110`} />
            {!isCollapsed && (
              <span className="whitespace-nowrap text-sm font-black">
                {label}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <motion.div
              animate={{ rotate: isOpen ? -90 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <ChevronLeft size={16} className={`transition-colors ${isActive ? "text-primary" : "text-text-muted/60 group-hover:text-primary"}`} />
            </motion.div>
          )}
        </button>

        <AnimatePresence initial={false}>
          {isOpen && !isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden flex flex-col gap-1 mr-9 pr-4 border-r border-[#367AFF]/25 mt-0.5 mb-1"
            >
              {children.map((child) => {
                const isChildActive = location.pathname === child.to;
                return (
                  <Link
                    key={child.to}
                    to={child.to}
                    onClick={onClick}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all duration-200 text-right ${
                      isChildActive
                        ? "text-primary font-black bg-primary/10 dark:bg-primary/20"
                        : "text-text-muted hover:text-primary hover:bg-white/10 dark:hover:bg-white/5"
                    }`}
                  >
                    {child.label}
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative w-full bg-red-300 h-full">
      <Link 
        to={to} 
        onClick={onClick}
        className={`relative z-10 flex items-center py-2 transition-all duration-300 mx-4 my-0.5 rounded-xl group ${
          isActive 
            ? "bg-sidebar-active text-primary font-black shadow-md scale-[1.02]" 
            : "text-text-muted font-bold hover:text-primary hover:bg-white/10 dark:hover:bg-white/5"
        } ${isCollapsed ? "justify-center px-0" : "justify-start px-4 gap-3"}`}
      >
        <Icon size={isCollapsed ? 22 : 20} className={`transition-all duration-300 ${isActive ? "text-primary scale-110" : "text-text-muted/60"} group-hover:rotate-[15deg] group-hover:scale-110`} />
        {!isCollapsed && (
          <span className={`whitespace-nowrap transition-transform duration-300 origin-right text-sm ${isActive ? "scale-110 translate-x-1" : ""}`}>
            {label}
          </span>
        )}
      </Link>
    </div>
  );
};

export const navItems = [
  { to: "/dashboard", label: "الرئيسية", icon: LayoutDashboard },
  { to: "/dashboard/orders", label: "الطلبات", icon: ClipboardList },
  { to: "/dashboard/membership-requests", label: "طلبات الانتساب", icon: UserPlus },
  { to: "/dashboard/doctors", label: "الاطباء", icon: UserCog },
  { to: "/dashboard/labs", label: "المخابر", icon: FlaskConical },
  { to: "/dashboard/subscriptions", label: "الاشتراكات", icon: CreditCard },
  { to: "/dashboard/blogs", label: "المدونات", icon: BookOpen },
  {
    label: "الإعلانات",
    icon: Megaphone,
    children: [
      {
        to: "/dashboard/ads",
        label: "إعلانات المنصة",
      },
      {
        to: "/dashboard/ads/users",
        label: "إدارة المستخدمين",
      },
    ],
  },
  {
    label: "الإشعارات",
    icon: Bell,
    children: [
      {
        to: "/dashboard/notifications/send",
        label: "إرسال إشعار",
      },
      {
        to: "/dashboard/notifications",
        label: "أرشيف الإشعارات",
      },
    ],
  },
   { to: "/dashboard/reports", label: "التقارير", icon: FileText },
  { to: "/dashboard/intervention-log", label: "سجل التدخلات", icon: History },
];

export default function Sidebar({ isCollapsed, setIsCollapsed }) {

  return (
    <aside 
      className={`h-screen  moi flex-col py-4 bg-bg-main z-20 transition-all duration-300 relative border-l border-border-main hidden lg:flex flex-shrink-0 ${
        isCollapsed ? "w-[80px] min-w-[80px] max-w-[80px]" : "w-[260px] min-w-[260px] max-w-[260px]"
      }`} 
      dir="rtl"
    > 
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-24 w-6 h-6 bg-sidebar-active rounded-full shadow-md flex items-center justify-center text-primary z-30 border border-border-main hover:scale-110 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      
      <div className={`px-4 mb-6 flex justify-center transition-all ${isCollapsed ? "scale-75" : ""}`}>
        <img src={logoImg} alt="Dental Dash" className={`${isCollapsed ? "w-10" : "w-20"} object-contain`} />
      </div>

      
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

