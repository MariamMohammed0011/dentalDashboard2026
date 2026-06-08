import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, CheckCircle2, Trash2, X, UserPlus, FileEdit, Calendar, 
  BellRing, MessageSquare, MessageCircle, Clock, ChevronLeft,
  Check, CheckCheck
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from './hooks/useNotifications';

// أنميشن مخصص للقائمة المنسدلة (تأثير مرن وحديث)
const dropdownVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.96, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { type: "spring", damping: 25, stiffness: 350, staggerChildren: 0.04 }
  },
  exit: { 
    opacity: 0, 
    y: 8, 
    scale: 0.97, 
    filter: 'blur(4px)',
    transition: { duration: 0.15, ease: "easeInOut" }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function NotificationMenu() {
  const {
    isOpen,
    setIsOpen,
    notifications,
    unreadCount,
    handleMouseEnter,
    handleMouseLeave,
    markAllAsSeen,
    clearAll,
    removeNotification,
    toggleReadStatus
  } = useNotifications();

  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'الكل', icon: Bell },
    { id: 'join', label: 'طلبات', icon: UserPlus },
    { id: 'message', label: 'رسائل', icon: MessageSquare },
    { id: 'update', label: 'تحديثات', icon: FileEdit },
    { id: 'reminder', label: 'تنبيهات', icon: Calendar }
  ];
const getTabCount = (tabId) => {
  if (tabId === 'all') return notifications.length;
  if (tabId === 'update') return notifications.filter(n => n.type === 'update' || n.type === 'comment').length;
  return notifications.filter(n => n.type === tabId).length;
};

const getFilteredNotifications = () => {
  if (activeTab === 'all') return notifications;
  if (activeTab === 'update') return notifications.filter(n => n.type === 'update' || n.type === 'comment');
  return notifications.filter(n => n.type === activeTab);
};

  const getIcon = (type, read) => {
    const baseClass = "p-2 rounded-xl shrink-0 transition-all duration-300 flex items-center justify-center border shadow-sm";
    let colorClass = "";
    
    if (read) {
      colorClass = "bg-gray-50/50 text-gray-400 border-gray-100 dark:bg-gray-900/30 dark:text-gray-600 dark:border-gray-900/60";
    } else {
      switch (type) {
        case 'join':
          colorClass = "bg-emerald-500/10 text-emerald-600 border-emerald-500/10 dark:bg-emerald-500/20 dark:border-emerald-500/20";
          break;
        case 'message':
          colorClass = "bg-blue-500/10 text-blue-600 border-blue-500/10 dark:bg-blue-500/20 dark:border-blue-500/20";
          break;
        case 'update':
          colorClass = "bg-amber-500/10 text-amber-600 border-amber-500/10 dark:bg-amber-500/20 dark:border-amber-500/20";
          break;
        case 'comment':
          colorClass = "bg-purple-500/10 text-purple-600 border-purple-500/10 dark:bg-purple-500/20 dark:border-purple-500/20";
          break;
        case 'reminder':
          colorClass = "bg-rose-500/10 text-rose-600 border-rose-500/10 dark:bg-rose-500/20 dark:border-rose-500/20";
          break;
        default:
          colorClass = "bg-primary/10 text-primary border-primary/10 dark:bg-primary/20 dark:border-primary/20";
      }
    }
    
    const iconProps = { size: 18, className: "stroke-[2.25] transition-transform duration-300" };
    
    switch (type) {
      case 'join': return <div className={`${baseClass} ${colorClass}`}><UserPlus {...iconProps} /></div>;
      case 'message': return <div className={`${baseClass} ${colorClass}`}><MessageSquare {...iconProps} /></div>;
      case 'update': return <div className={`${baseClass} ${colorClass}`}><FileEdit {...iconProps} /></div>;
      case 'comment': return <div className={`${baseClass} ${colorClass}`}><MessageCircle {...iconProps} /></div>;
      case 'reminder': return <div className={`${baseClass} ${colorClass}`}><Calendar {...iconProps} /></div>;
      default: return <div className={`${baseClass} ${colorClass}`}><BellRing {...iconProps} /></div>;
    }
  };

  const getActionLink = (type) => {
    switch (type) {
      case 'join':
        return { label: "معاينة طلب الانتساب", url: "/dashboard/membership-requests" };
      case 'message':
        return { label: "الذهاب للرسائل", url: "/dashboard/messages" };
      case 'update':
        return { label: "تتبع حالة الطلبات", url: "/dashboard/orders" };
      case 'comment':
        return { label: "عرض التقارير", url: "/dashboard/reports" };
      case 'reminder':
        return { label: "عرض المواعيد", url: "/dashboard/appointments" };
      default:
        return null;
    }
  };

  const notifBadge = {
    join: { label: "انضمام جديد", color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/10" },
    message: { label: "رسالة جديدة", color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 dark:border-blue-500/10" },
    update: { label: "تحديث حالة", color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/10" },
    reminder: { label: "تنبيه هام", color: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/10" },
    comment: { label: "تعليق جديد", color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/10" }
  };

  const filteredNotifications = getFilteredNotifications();
console.log("Mapped Notifications:", notifications);
  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center text-primary relative p-3 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer pointer-events-auto"
          >
            <Bell size={21} className={`${unreadCount > 0 ? 'text-primary animate-[wiggle_1s_ease-in-out_infinite]' : 'text-gray-500 dark:text-gray-400'}`} />
            {unreadCount > 0 && (
              <span className="absolute top-2 end-2 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </motion.button>
        </PopoverTrigger>
        
        <AnimatePresence>
          {isOpen && (
            <PopoverContent 
              forceMount
              asChild
              className="w-[calc(100vw-32px)] mt-[-10px] sm:w-[28rem] max-w-md p-0 overflow-hidden rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_35px_70px_-10px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-gray-900 bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl z-[999] pointer-events-auto" 
              align="end"
              side="bottom"
              sideOffset={12}
              collisionPadding={16}
              dir="rtl"
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-l from-primary/[0.02] to-transparent border-b border-gray-100 dark:border-gray-900">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-gray-50">مركز الإشعارات</h3>
                    {unreadCount > 0 && (
                      <span className="bg-primary/10 text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {unreadCount} غير مقروء
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 p-2 rounded-xl transition-all duration-200 hover:rotate-90 cursor-pointer"
                  >
                    <X size={14} className="stroke-[2.5]" />
                  </button>
                </div>

                {/* Tabs */}
                <div 
                  className="flex items-center gap-1 px-3.5 py-2 border-b border-gray-100 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/20 overflow-x-auto select-none [&::-webkit-scrollbar]:hidden"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const count = getTabCount(tab.id);
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer whitespace-nowrap z-10 ${
                          isActive
                            ? "text-primary"
                            : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-900/40"
                        }`}
                      >
                        <TabIcon size={14} className={isActive ? "stroke-[2.5]" : "stroke-[2] opacity-70"} />
                        <span>{tab.label}</span>
                        {count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold transition-colors duration-300 ${
                            isActive 
                              ? "bg-primary/10 text-primary" 
                              : "bg-gray-100 text-gray-500 dark:bg-gray-800/80 dark:text-gray-400"
                          }`}>
                            {count}
                          </span>
                        )}
                        
                        {isActive && (
                          <motion.div 
                            layoutId="activeTabIndicator"
                            className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10 dark:border-primary/20 -z-10"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Notifications List */}
                <div className="max-h-[min(24rem,calc(100vh-220px))] overflow-y-auto custom-scrollbar flex flex-col bg-transparent divide-y divide-gray-100 dark:divide-gray-900/60 px-2">
                  <AnimatePresence mode="popLayout">
                    {filteredNotifications.length > 0 ? (
                      filteredNotifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          variants={itemVariants}
                          layout
                          exit={{ opacity: 0, x: -40, filter: 'blur(4px)', transition: { duration: 0.2 } }}
                          onClick={() => {
                            if (!notif.read) toggleReadStatus(notif.id);
                          }}
                          className={`group flex flex-col gap-1.5 p-3 sm:p-3.5 text-xs sm:text-sm transition-all duration-300 relative cursor-pointer select-none ${
                            notif.read 
                              ? 'bg-transparent hover:bg-gray-50/50 dark:hover:bg-gray-900/20' 
                              : 'bg-primary/[0.02] dark:bg-primary/[0.03] hover:bg-primary/[0.04] dark:hover:bg-primary/[0.05]'
                          }`}
                        >
                          
                          {!notif.read && (
                            <span className="absolute start-0 top-3 bottom-3 w-1 bg-primary rounded-e-full" />
                          )}

                          <div className="flex items-start gap-2.5 sm:gap-3.5 relative">
                            
                            <div className="relative shrink-0">
                              {getIcon(notif.type, notif.read)}
                              {!notif.read && (
                                <span className="absolute -top-0.5 -end-0.5 w-3 h-3 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-950 animate-pulse z-10" />
                              )}
                            </div>

                            <div className="flex flex-col gap-1 flex-grow pt-0.5 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {notifBadge[notif.type] && (
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${notifBadge[notif.type].color}`}>
                                    {notifBadge[notif.type].label}
                                  </span>
                                )}
                                
                                {!notif.read && (
                                  <span className="text-[9px] bg-primary/10 text-primary font-bold px-1.5 py-0.5 rounded">
                                    جديد
                                  </span>
                                )}
                              </div>

                              <span className={`text-gray-800 dark:text-gray-200 leading-relaxed text-[13px] transition-colors duration-200 ${!notif.read ? 'font-bold' : 'font-normal text-gray-500 dark:text-gray-400'}`}>
                                {notif.text}
                              </span>
                              
                              <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                                <Clock size={11} className="stroke-[2.25] opacity-70" />
                                <span className="text-[10.5px] font-medium">
                                  {notif.time}
                                </span>
                              </div>
                            </div>

                            {/* Actions Panel */}
                            <div className="flex items-center gap-1 lg:opacity-0 group-hover:opacity-100 opacity-100 transition-opacity duration-200 native-hover-fix shrink-0 self-center">
                              {/* Read Status Indicator Button */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  toggleReadStatus(notif.id);
                                }}
                                className={`p-2 rounded-xl border border-transparent transition-all cursor-pointer ${
                                  notif.read 
                                    ? 'text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' 
                                    : 'text-primary hover:text-primary-dark hover:bg-primary/5'
                                }`}
                                title={notif.read ? "تحديد كغير مقروء" : "تحديد كمقروء"}
                              >
                                {notif.read ? (
                                  <CheckCheck size={16} className="stroke-[2.5]" />
                                ) : (
                                  <Check size={16} className="stroke-[2.5]" />
                                )}
                              </button>

                              {/* Delete Button */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation(); 
                                  removeNotification(notif.id);
                                }}
                                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl border border-transparent transition-colors cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 size={14} className="stroke-[2.25]" />
                              </button>
                            </div>
                          </div>

                          {/* Contextual Action Link */}
                          {getActionLink(notif.type) && (
                            <div className="flex justify-end ps-10 sm:ps-14 mt-0.5">
                              <Link
                                to={getActionLink(notif.type).url}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsOpen(false);
                                }}
                                className="flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-dark transition-colors bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/5 hover:border-primary/10"
                              >
                                <span>{getActionLink(notif.type).label}</span>
                                <ChevronLeft size={10} className="stroke-[3] -translate-y-[0.5px]" />
                              </Link>
                            </div>
                          )}
                        </motion.div>
                      ))
                    ) : (
                      /* Empty State */
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="py-14 px-6 flex flex-col items-center justify-center gap-4 text-center"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-gray-300 dark:text-gray-700 border border-gray-100 dark:border-gray-800/80">
                          <BellRing size={26} className="stroke-[1.75]" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-800 dark:text-gray-200 text-sm font-bold">صندوق الإشعارات فارغ</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[220px] leading-normal">
                            لا توجد إشعارات جديدة في هذا القسم حالياً.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Actions */}
                {notifications.length > 0 && (
                  <div className="flex items-center justify-between p-3 bg-gray-50/70 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-900 backdrop-blur-md rounded-b-2xl">
                    <button 
                      onClick={markAllAsSeen}
                      className="flex items-center gap-1.5 text-xs text-primary font-bold px-3 py-2 rounded-lg hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                    >
                      <CheckCircle2 size={14} className="stroke-[2.5]" />
                      تحديد الكل كمقروء
                    </button>
                    <button 
                      onClick={clearAll}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 font-bold px-3 py-2 rounded-lg hover:bg-red-500/5 transition-all duration-200 cursor-pointer"
                    >
                      <Trash2 size={14} className="stroke-[2.25]" />
                      مسح الكل
                    </button>
                  </div>
                )}
              </motion.div>
            </PopoverContent>
          )}
        </AnimatePresence>
      </Popover>
    </div>
  );
}