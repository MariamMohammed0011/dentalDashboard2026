import React, { useState, useRef } from 'react';
import { Bell, CheckCircle2, Trash2, X, UserPlus, FileEdit, Calendar, BellRing } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  // Mock Notifications Data
  const [notifications, setNotifications] = useState([
    { id: 1, type: "join", text: "طلب انضمام جديد من د. أحمد محمود", time: "منذ 5 دقائق", read: false },
    { id: 2, type: "update", text: "تم تحديث حالة الطلب #1024", time: "منذ ساعتين", read: false },
    { id: 3, type: "reminder", text: "تذكير: اجتماع الإدارة غداً", time: "منذ يوم", read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250); 
  };

  const markAllAsSeen = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getIcon = (type, read) => {
    const baseClass = "p-2.5 rounded-2xl shrink-0 transition-all duration-300 flex items-center justify-center border shadow-sm";
    const colorClass = read 
      ? "bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800/40 dark:text-gray-500 dark:border-gray-800" 
      : "bg-primary/10 text-primary border-primary/10 dark:bg-primary/20 dark:border-primary/20";
      
    const iconProps = { size: 18, className: "stroke-[2.25]" };
    
    switch (type) {
      case 'join': return <div className={`${baseClass} ${colorClass}`}><UserPlus {...iconProps} /></div>;
      case 'update': return <div className={`${baseClass} ${colorClass}`}><FileEdit {...iconProps} /></div>;
      case 'reminder': return <div className={`${baseClass} ${colorClass}`}><Calendar {...iconProps} /></div>;
      default: return <div className={`${baseClass} ${colorClass}`}><BellRing {...iconProps} /></div>;
    }
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center text-primary font-bold relative p-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/30 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Bell size={22} className={`${unreadCount > 0 ? 'text-primary animate-[wiggle_1s_ease-in-out_infinite]' : 'text-gray-500 dark:text-gray-400'}`} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] ring-2 ring-white dark:ring-gray-900 animate-pulse">
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
              className="w-96 p-0 overflow-hidden rounded-[2rem] shadow-[0_30px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.4)] border border-gray-100/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl z-[999]" 
              align="end"
              sideOffset={12}
              onMouseEnter={handleMouseEnter} 
              onMouseLeave={handleMouseLeave}
            >
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                transition={{ type: "spring", damping: 20, stiffness: 260 }}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 bg-gradient-to-l from-primary/[0.03] to-transparent border-b border-gray-100/70 dark:border-gray-800/70">
                  <div className="flex items-center gap-3">
                    <h3 className="font-black text-base text-text-main">مركز الإشعارات</h3>
                    {unreadCount > 0 && (
                      <span className="bg-primary/10 text-primary text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-inner">
                        {unreadCount} جديد
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900 dark:hover:bg-gray-800 p-2 rounded-xl transition-all duration-200 hover:rotate-90"
                  >
                    <X size={14} className="stroke-[2.5]" />
                  </button>
                </div>

                {/* List Container */}
                <div className="max-h-[22rem] overflow-y-auto custom-scrollbar p-3 flex flex-col gap-2 bg-transparent">
                  <AnimatePresence mode="popLayout">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <motion.div
                          key={notif.id}
                          layout
                          initial={{ opacity: 0, x: 20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -30, scale: 0.95 }}
                          transition={{ type: "spring", damping: 22, stiffness: 300 }}
                          className={`group flex items-start gap-3.5 p-3.5 rounded-2xl text-sm transition-all duration-300 relative border ${
                            notif.read 
                              ? 'bg-transparent border-transparent hover:bg-gray-50/60 dark:hover:bg-gray-900/40' 
                              : 'bg-white dark:bg-gray-900 border-primary/5 dark:border-primary/10 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5'
                          }`}
                        >
                          {/* Unread Status Dot Indicator */}
                          {!notif.read && (
                            <span className="absolute top-4 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                          )}

                          {/* Icon */}
                          <div className={!notif.read ? "mr-1.5" : ""}>
                            {getIcon(notif.type, notif.read)}
                          </div>

                          {/* Content */}
                          <div className="flex flex-col gap-1 flex-1 pt-0.5">
                            <span className={`text-text-main leading-relaxed text-[13.5px] ${!notif.read ? 'font-extrabold text-gray-900 dark:text-white' : 'font-medium text-gray-600 dark:text-gray-400'}`}>
                              {notif.text}
                            </span>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500 font-semibold tracking-wide">
                              {notif.time}
                            </span>
                          </div>

                          {/* Actions - Animated Trash Icon */}
                          <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(notif.id);
                              }}
                              className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shadow-none"
                              title="حذف الإشعار"
                            >
                              <Trash2 size={15} className="stroke-[2.25]" />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        className="py-12 px-6 flex flex-col items-center justify-center gap-4 text-center"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-900 dark:to-gray-800/50 flex items-center justify-center text-gray-300 dark:text-gray-600 border border-gray-100 dark:border-gray-800 shadow-inner">
                          <BellRing size={28} className="stroke-[1.75]" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-gray-700 dark:text-gray-300 text-sm font-black">صندوق الإشعارات فارغ</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-[200px] leading-normal">رائع! لقد قمت بقراءة جميع التحديثات الواردة لنظامك.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Actions */}
                {notifications.length > 0 && (
                  <div className="flex items-center justify-between p-3.5 bg-gray-50/60 dark:bg-gray-900/40 border-t border-gray-100 dark:border-gray-800/80 backdrop-blur-md rounded-b-[2rem]">
                    <button 
                      onClick={markAllAsSeen}
                      className="flex items-center gap-2 text-xs text-primary hover:text-white font-black px-4 py-2.5 rounded-xl hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-primary/20 active:scale-95"
                    >
                      <CheckCircle2 size={14} className="stroke-[2.5]" />
                      تحديد الكل كمقروء
                    </button>
                    <button 
                      onClick={clearAll}
                      className="flex items-center gap-2 text-xs text-red-500 hover:text-white font-black px-4 py-2.5 rounded-xl hover:bg-red-500 transition-all duration-300 shadow-none active:scale-95"
                    >
                      <Trash2 size={14} className="stroke-[2.5]" />
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