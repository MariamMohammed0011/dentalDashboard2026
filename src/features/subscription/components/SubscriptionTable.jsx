import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Building2, Mail, Calendar, Hourglass, 
  CreditCard, RefreshCw, ChevronLeft, AlertTriangle 
} from 'lucide-react';
import SubscriptionCard from './SubscriptionCard';

export default function SubscriptionTable({ subs, isLoading, onActivate, onRenew }) {
  const { t } = useTranslation();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full flex flex-col gap-3" dir="rtl">
      {/* ── Desktop Header ── */}
      <div className="hidden lg:flex items-center w-full px-6 py-2 text-slate-400 dark:text-slate-500 font-extrabold text-[12px] uppercase select-none">
        <div className="w-[25%] text-right">المخبر</div>
        <div className="w-[20%] text-right">البريد الإلكتروني</div>
        <div className="w-[25%] text-right">فترة الاشتراك</div>
        <div className="w-[12%] text-right">الأيام المتبقية</div>
        <div className="w-[8%] text-center">الحالة</div>
        <div className="w-[10%] text-left">الإجراءات</div>
      </div>

      {/* ── Desktop Rows ── */}
      <div className="hidden lg:flex flex-col gap-3">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl h-[78px] w-full" />
          ))
        ) : subs.length === 0 ? (
          <div className="bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center text-text-muted dark:text-slate-500 font-bold w-full">
            <Building2 size={36} className="mx-auto mb-2 text-text-muted/40 dark:text-slate-600" />
            لا توجد اشتراكات نشطة حالياً.
          </div>
        ) : (
          subs.map((sub) => {
            const { labId, labName, email, subscriptionStartUtc, subscriptionEndUtc, remainingDays } = sub;
            const end = new Date(subscriptionEndUtc);
            const start = new Date(subscriptionStartUtc);
            const today = new Date();
            const isActive = end > today;

            const isLowRemaining = remainingDays <= 30;
            const remainingColor = isActive 
              ? (isLowRemaining ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30' : 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30')
              : 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30';

            return (
              <div
                key={labId}
                className="flex items-center w-full bg-white dark:bg-slate-900 border border-slate-100/60 dark:border-slate-800/60 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-500/20 dark:hover:border-emerald-500/30 transition-all duration-200 gap-2"
              >
                {/* Lab Column */}
                <div className="w-[25%] flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                    isActive ? 'from-emerald-400 to-teal-600' : 'from-rose-400 to-red-600'
                  } text-white flex items-center justify-center shadow-md shrink-0`}>
                    <Building2 size={20} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-extrabold text-text-main dark:text-gray-100 text-[13px] truncate leading-normal">
                      {labName}
                    </span>
                    <span className="text-[10px] text-text-muted dark:text-slate-500 font-black">
                      ID: #{labId}
                    </span>
                  </div>
                </div>

                {/* Email Column */}
                <div className="w-[20%] flex items-center gap-2 min-w-0 text-text-muted">
                  <Mail size={15} className="text-sky-500 dark:text-sky-400 shrink-0" />
                  <span className="text-xs truncate font-semibold font-sans" title={email}>
                    {email}
                  </span>
                </div>

                {/* Date range Column */}
                <div className="w-[25%] flex items-center gap-2 text-text-muted min-w-0">
                  <Calendar size={15} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                  <div className="flex items-center gap-1.5 text-[12px] font-bold">
                    <span>{formatDate(start)}</span>
                    <span className="text-gray-300 dark:text-slate-700">←</span>
                    <span>{formatDate(end)}</span>
                  </div>
                </div>

                {/* Remaining Days Column */}
                <div className="w-[12%] flex items-center gap-2 min-w-0">
                  <Hourglass size={15} className="text-amber-500 dark:text-amber-400 shrink-0" />
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-black rounded-lg border ${remainingColor}`}>
                    {isActive ? (
                      <>
                        {isLowRemaining && <AlertTriangle size={10} className="animate-bounce" />}
                        متبقي {remainingDays} يوم
                      </>
                    ) : (
                      'منتهي'
                    )}
                  </span>
                </div>

                {/* Status Column */}
                <div className="w-[8%] flex justify-center shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black border ${
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

                {/* Actions Column */}
                <div className="w-[10%] flex justify-end shrink-0 pl-1">
                  {isActive ? (
                    <button
                      onClick={() => onRenew(sub)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/40 dark:hover:bg-blue-600 dark:text-blue-450 dark:hover:text-white rounded-lg text-[11px] font-black transition-all active:scale-95 cursor-pointer group/btn"
                    >
                      <RefreshCw size={12} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                      تجديد
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivate(sub)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-[11px] font-black shadow-sm transition-all active:scale-95 cursor-pointer group/btn"
                    >
                      <CreditCard size={12} />
                      تفعيل
                      <ChevronLeft size={12} className="group-hover/btn:-translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Mobile Layout ── */}
      <div className="grid gap-6 md:grid-cols-2 lg:hidden">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-white/60 dark:bg-slate-900/40 border border-slate-100/60 dark:border-slate-800/60 rounded-[2.5rem] h-[320px] w-full" />
          ))
        ) : subs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white/60 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-[2.5rem] text-center w-full">
            <Building2 className="text-gray-300 dark:text-slate-700 mb-4" size={48} />
            <p className="text-text-muted font-bold text-sm">لا توجد أي اشتراكات.</p>
          </div>
        ) : (
          subs.map((sub) => (
            <SubscriptionCard
              key={sub.labId}
              sub={sub}
              onActivate={onActivate}
              onRenew={onRenew}
            />
          ))
        )}
      </div>
    </div>
  );
}
