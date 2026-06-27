import React from 'react';
import { 
  BellRing, Check, CheckCheck, Trash2, Clock, Megaphone, 
  MessageSquare, UserPlus, FileEdit, Calendar, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationsTable = ({ 
  notifications, 
  isLoading, 
  onToggleRead, 
  onDelete 
}) => {

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
        case 'ad':
          colorClass = "bg-sky-500/10 text-sky-600 border-sky-500/10 dark:bg-sky-500/20 dark:border-sky-500/20";
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
      case 'reminder': return <div className={`${baseClass} ${colorClass}`}><Calendar {...iconProps} /></div>;
      case 'ad': return <div className={`${baseClass} ${colorClass}`}><Megaphone {...iconProps} /></div>;
      default: return <div className={`${baseClass} ${colorClass}`}><Bell {...iconProps} /></div>;
    }
  };

  const notifBadge = {
    join: { label: "طلب انضمام", color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-900/30" },
    message: { label: "رسالة جديدة", color: "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-900/30" },
    update: { label: "تحديث نظام", color: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-900/30" },
    reminder: { label: "تنبيه هام", color: "bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30" },
    ad: { label: "سعر الإعلان", color: "bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-200/50 dark:border-sky-900/30" }
  };

  return (
    <div className="w-full flex flex-col gap-3" dir="rtl">
      
      {/* Table Headers (Desktop View) */}
      <div className="hidden md:flex items-center w-full px-6 py-2 text-slate-450 dark:text-slate-500 font-extrabold text-[12px] uppercase select-none">
        <div className="w-[12%] text-right">معرف الإشعار</div>
        <div className="w-[15%] text-right">النوع</div>
        <div className="w-[45%] text-right">مضمون الإشعار</div>
        <div className="w-[15%] text-right">تاريخ الإرسال</div>
        <div className="w-[13%] text-center">الإجراءات</div>
      </div>

      {/* Desktop Rows */}
      <div className="hidden md:flex flex-col gap-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl h-[78px] w-full" />
          ))
        ) : notifications.length === 0 ? (
          <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center text-text-muted dark:text-slate-500 font-bold w-full">
            <BellRing size={36} className="mx-auto mb-2 text-text-muted/40 dark:text-slate-600" />
            لا توجد إشعارات حالياً
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {notifications.map((notif) => (
              <motion.div 
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className={`flex items-center w-full bg-white dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-[#367AFF]/20 dark:hover:border-[#367AFF]/30 transition-all duration-200 gap-2 ${
                  !notif.read ? 'border-r-4 border-r-[#367AFF]' : ''
                }`}
              >
                {/* ID */}
                <div className="w-[12%] font-mono text-xs text-gray-500 font-bold">
                  #{notif.id}
                </div>

                {/* Type Badge */}
                <div className="w-[15%] flex items-center gap-2">
                  {getIcon(notif.type, notif.read)}
                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${
                    notifBadge[notif.type]?.color || 'bg-slate-50 text-slate-500'
                  }`}>
                    {notifBadge[notif.type]?.label || "تنبيه"}
                  </span>
                </div>

                {/* Text Content */}
                <div className="w-[45%] text-right font-medium text-text-main dark:text-gray-250 text-[13px] pr-2 pl-4 truncate">
                  <span className={!notif.read ? 'font-black text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                    {notif.text}
                  </span>
                </div>

                {/* Send Date/Time */}
                <div className="w-[15%] text-[11.5px] text-text-muted dark:text-slate-400 font-semibold flex items-center gap-1.5 min-w-0">
                  <Clock size={12} className="text-violet-500 dark:text-violet-400 shrink-0" />
                  <span>{notif.time || "غير محدد"}</span>
                </div>

                {/* Actions Panel */}
                <div className="w-[13%] flex items-center justify-center gap-2 shrink-0">
                  {/* Mark as read/unread button */}
                  <button 
                    onClick={() => onToggleRead(notif.id)}
                    className={`p-2 rounded-xl border border-transparent transition-all duration-200 cursor-pointer ${
                      notif.read 
                        ? 'text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' 
                        : 'text-primary hover:text-primary-dark hover:bg-primary/5'
                    }`}
                    title={notif.read ? "تحديد كغير مقروء" : "تحديد كمقروء"}
                  >
                    {notif.read ? <CheckCheck size={16} className="stroke-[2.5]" /> : <Check size={16} className="stroke-[2.5]" />}
                  </button>

                  {/* Delete Button */}
                  <button 
                    onClick={() => onDelete(notif.id)}
                    className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl border border-transparent transition-all duration-200 cursor-pointer"
                    title="حذف الإشعار"
                  >
                    <Trash2 size={15} className="stroke-[2.25]" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Mobile Responsive Layout */}
      <div className="block md:hidden">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-800/30 p-5 rounded-2xl animate-pulse h-[110px]" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-12 text-center text-text-muted dark:text-slate-500 font-bold bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-100/60 dark:border-slate-800/60">
            <BellRing size={36} className="mx-auto mb-2 text-text-muted/40 dark:text-slate-600" />
            لا توجد إشعارات حالياً
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {notifications.map((notif) => (
                <motion.div 
                  key={notif.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm relative overflow-hidden flex flex-col gap-3 hover:shadow-md hover:border-[#367AFF]/25 transition-all duration-300 ${
                    !notif.read ? 'border-r-4 border-r-[#367AFF]' : ''
                  }`}
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/50">
                    <span className="text-xs font-bold text-text-muted dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 px-2.5 py-0.5 rounded-lg">ID: #{notif.id}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${
                      notifBadge[notif.type]?.color || 'bg-slate-50 text-slate-500'
                    }`}>
                      {notifBadge[notif.type]?.label || "تنبيه"}
                    </span>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    {getIcon(notif.type, notif.read)}
                    <div className="text-right flex flex-col gap-1 flex-grow">
                      <p className={`text-xs leading-relaxed ${
                        !notif.read ? 'font-black text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 font-medium'
                      }`}>
                        {notif.text}
                      </p>
                      
                      <div className="flex items-center gap-1.5 text-gray-400 dark:text-slate-500 mt-1 text-[10px] font-bold">
                        <Clock size={11} className="stroke-[2.25] text-violet-500" />
                        <span>{notif.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-1 pt-2.5 border-t border-slate-100 dark:border-slate-800/50">
                    {/* Mark as read/unread button */}
                    <button 
                      onClick={() => onToggleRead(notif.id)}
                      className={`p-1.5 rounded-lg border border-transparent transition-all duration-200 cursor-pointer ${
                        notif.read 
                          ? 'text-emerald-500 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' 
                          : 'text-primary hover:text-primary-dark hover:bg-primary/5'
                      }`}
                      title={notif.read ? "تحديد كغير مقروء" : "تحديد كمقروء"}
                    >
                      {notif.read ? <CheckCheck size={15} /> : <Check size={15} />}
                    </button>

                    {/* Delete Button */}
                    <button 
                      onClick={() => onDelete(notif.id)}
                      className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg border border-transparent transition-colors cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
};

export default NotificationsTable;
