import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Building2, Mail, Calendar, Hourglass, 
  AlertTriangle, CreditCard, RefreshCw, ChevronLeft, CheckCircle2, ShieldAlert
} from 'lucide-react';
import framerImg from '../../../assets/framer.png';

export default function SubscriptionCardGrid({ subs, isLoading, onActivate, onRenew }) {
  const { t } = useTranslation();

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-[2.2rem] h-[280px] w-full" />
        ))}
      </div>
    );
  }

  if (!subs || subs.length === 0) {
    return (
      <div className="bg-bg-card border border-border-main/60 rounded-[2.2rem] p-12 text-center text-text-muted font-bold w-full flex flex-col items-center justify-center gap-3">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl text-emerald-500">
          <Building2 size={36} />
        </div>
        <p className="text-text-main text-base font-extrabold">{t('common.noData')}</p>
        <p className="text-xs text-text-muted max-w-sm">لا توجد اشتراكات مسجلة في هذا القائمة حالياً.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full" dir="rtl">
      <AnimatePresence mode="popLayout">
        {subs.map((sub, index) => {
          const { labId, labName, email, subscriptionStartUtc, subscriptionEndUtc, remainingDays } = sub;
          const end = new Date(subscriptionEndUtc);
          const start = new Date(subscriptionStartUtc);
          const today = new Date();
          const isActive = remainingDays > 0 || end > today;
          const isLowRemaining = remainingDays > 0 && remainingDays <= 30;

          // Calculate approximate percentage of elapsed time
          const totalDuration = Math.max(1, end - start);
          const elapsed = Math.max(0, today - start);
          const progressPercent = isActive ? Math.min(100, Math.max(5, Math.round((elapsed / totalDuration) * 100))) : 100;

          return (
            <motion.div
              key={labId || sub.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              whileHover={{ y: -6 }}
              className={`bg-bg-card border rounded-[2.2rem] p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group border-border-main/70 h-[340px] w-full ${
                isActive ? 'hover:border-emerald-500/30' : 'hover:border-rose-500/30'
              }`}
            >
              {/* Background Frame Texture */}
              <div className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04] pointer-events-none z-0">
                <img src={framerImg} alt="" className="w-full h-full object-cover" />
              </div>

              {/* Ambient Glow */}
              <div className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none ${
                isActive ? 'bg-emerald-500' : 'bg-rose-500'
              }`} />

              <div className="relative z-10 flex flex-col justify-between h-full w-full">
                
                {/* 1. Header (Fixed height h-[52px]) */}
                <div className="flex items-center justify-between gap-3 h-[52px] shrink-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                      isActive 
                        ? 'from-emerald-400 to-teal-600 text-white shadow-lg shadow-emerald-500/20' 
                        : 'from-rose-400 to-red-600 text-white shadow-lg shadow-rose-500/20'
                    } flex items-center justify-center shrink-0 group-hover:rotate-[6deg] transition-transform duration-300`}>
                      <Building2 size={22} />
                    </div>

                    <div className="flex flex-col text-right min-w-0 flex-1">
                      <span className="text-[10px] text-text-muted font-black tracking-wider uppercase">
                        المخبر #{labId}
                      </span>
                      <h3 className="font-black text-text-main text-sm sm:text-base truncate leading-snug" title={labName || `مخبر #${labId}`}>
                        {labName || `مخبر #${labId}`}
                      </h3>
                    </div>
                  </div>

                  {/* Status Pill */}
                  {/* <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border shrink-0 ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40' 
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40'
                  }`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`} />
                    {isActive ? t('subscription.active') : t('subscription.expired')}
                  </span> */}
                </div>

                {/* 2. Progress Bar (Fixed height h-[38px]) */}
                <div className="flex flex-col justify-center gap-1.5 h-[38px] shrink-0">
                  <div className="flex justify-between items-center text-[10px] font-extrabold text-text-muted">
                    <span>نسبة استهلاك فترة الاشتراك</span>
                    <span className={isActive ? (isLowRemaining ? 'text-amber-500' : 'text-emerald-500') : 'text-rose-500'}>
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        !isActive 
                          ? 'bg-rose-500' 
                          : isLowRemaining 
                            ? 'bg-amber-500' 
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* 3. Info Details Box (Fixed height h-[110px]) */}
                <div className="dark:bg-slate-900/50 p-3.5    flex flex-col justify-between h-[110px] shrink-0">
                  {/* Email */}
                  <div className="flex items-center gap-2.5 text-xs text-text-muted h-6">
                    <Mail size={14} className="text-sky-500 shrink-0" />
                    <span className="truncate font-semibold dir-ltr text-right flex-1" title={email}>{email || 'غير متوفر'}</span>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-2.5 text-xs text-text-muted h-6">
                    <Calendar size={14} className="text-emerald-500 shrink-0" />
                    <div className="flex items-center gap-1.5 font-bold truncate">
                      <span>{formatDate(subscriptionStartUtc)}</span>
                      <span className="text-gray-300 dark:text-slate-700">←</span>
                      <span>{formatDate(subscriptionEndUtc)}</span>
                    </div>
                  </div>

                  {/* Remaining Days */}
                  <div className="flex items-center gap-2.5 text-xs h-6">
                    <Hourglass size={14} className={isActive ? (isLowRemaining ? 'text-amber-500' : 'text-emerald-500') : 'text-rose-500'} />
                    <span className={`font-black truncate ${
                      isActive 
                        ? (isLowRemaining ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400')
                        : 'text-rose-600 dark:text-rose-400'
                    }`}>
                      {isActive ? (
                        <span className="flex items-center gap-1">
                          {isLowRemaining && <AlertTriangle size={12} className="animate-bounce text-amber-500" />}
                          متبقي {remainingDays} يوم ينتهي الموعد
                        </span>
                      ) : (
                        t('subscription.expiredDaysAgo', { days: Math.abs(remainingDays ?? 0) })
                      )}
                    </span>
                  </div>
                </div>

                {/* 4. Actions Footer (Fixed height h-[46px]) */}
                <div className="flex items-center justify-end h-[46px] shrink-0">
                  {isActive ? (
                    <button
                      onClick={() => onRenew(sub)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/40 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white rounded-2xl text-xs font-black transition-all active:scale-95 cursor-pointer group/btn"
                    >
                      <RefreshCw size={14} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                      <span>تجديد الاشتراك وتمديده</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivate(sub)}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer group/btn"
                    >
                      <CreditCard size={14} />
                      <span>تفعيل وتنشيط الاشتراك</span>
                      <ChevronLeft size={14} className="group-hover/btn:-translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
