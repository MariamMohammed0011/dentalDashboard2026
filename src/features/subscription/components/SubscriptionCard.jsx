import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Building2, Mail, Calendar, Hourglass, 
  AlertTriangle, CreditCard, 
  RefreshCw, ChevronLeft 
} from 'lucide-react';
import framerImg from '../../../assets/framer.png';

export default function SubscriptionCard({ sub, onActivate, onRenew }) {
  const { t } = useTranslation();
  const { labId, labName, email, subscriptionStartUtc, subscriptionEndUtc, remainingDays } = sub;
  
  const end = new Date(subscriptionEndUtc);
  const start = new Date(subscriptionStartUtc);
  const today = new Date();
  const isActive = end > today;

  // Formatting dates
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Color configurations based on remaining days and status
  const isLowRemaining = remainingDays <= 30;
  const remainingColor = isActive 
    ? (isLowRemaining ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30' : 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30')
    : 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white dark:bg-bg-card rounded-[2.5rem] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden h-[320px] w-full border border-slate-100 dark:border-slate-800"
      dir="rtl"
    >
      {/* Background Frame Image decoration */}
      <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.06] pointer-events-none z-0">
        <img
          src={framerImg}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 flex flex-col justify-between h-full w-full">
        {/* Header section */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {/* Gradient Icon Wrapper */}
            <div className={`w-14 h-14 bg-gradient-to-br ${
              isActive 
                ? 'from-emerald-400 to-teal-600 shadow-emerald-100 dark:shadow-none' 
                : 'from-rose-400 to-red-600 shadow-rose-100 dark:shadow-none'
            } text-white rounded-[1.25rem] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300 shrink-0`}>
              <Building2 size={26} />
            </div>

            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] text-gray-400 dark:text-slate-500 font-black tracking-widest uppercase">
                {t('labs.labType')} #{labId}
              </span>
              <h3 className="font-bold text-text-main dark:text-gray-100 text-[15px] tracking-tight truncate leading-tight">
                {labName}
              </h3>
            </div>
          </div>

          {/* Active / Expired badge */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border shrink-0 ${
            isActive 
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-100/50 dark:border-emerald-900/30' 
              : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-100/50 dark:border-rose-900/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`} />
            {isActive ? 'نشط' : 'منتهي'}
          </span>
        </div>

        {/* Info Rows */}
        <div className="space-y-3 my-4 pr-1">
          {/* Email Row */}
          <div className="flex items-center gap-3 text-text-muted">
            <Mail size={16} className="text-sky-500 dark:text-sky-400 shrink-0" />
            <span className="text-xs truncate font-medium max-w-[240px] font-sans" title={email}>
              {email}
            </span>
          </div>

          {/* Dates Row */}
          <div className="flex items-center gap-3 text-text-muted">
            <Calendar size={16} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
            <div className="flex flex-wrap gap-1 text-[11px] font-bold">
              <span>{formatDate(start)}</span>
              <span className="text-gray-300 dark:text-slate-700">←</span>
              <span>{formatDate(end)}</span>
            </div>
          </div>

          {/* Remaining Days Row */}
          <div className="flex items-center gap-3">
            <Hourglass size={16} className="text-amber-500 dark:text-amber-400 shrink-0" />
            <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-xl border ${remainingColor}`}>
              {isActive ? (
                <>
                  {isLowRemaining && <AlertTriangle size={12} className="animate-bounce" />}
                  متبقي {remainingDays} يوم
                </>
              ) : (
                'منتهي الصلاحية'
              )}
            </span>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="flex items-center justify-end border-t border-slate-50 dark:border-slate-800/40 pt-4 mt-auto">
          {isActive ? (
            <button
              onClick={() => onRenew(sub)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/40 dark:hover:bg-blue-600 dark:text-blue-450 dark:hover:text-white rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer group/btn"
            >
              <RefreshCw size={14} className="group-hover/btn:rotate-180 transition-transform duration-500" />
              تجديد الاشتراك
            </button>
          ) : (
            <button
              onClick={() => onActivate(sub)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-100 dark:shadow-none transition-all active:scale-95 cursor-pointer group/btn"
            >
              <CreditCard size={14} />
              تفعيل وتنشيط الاشتراك
              <ChevronLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
