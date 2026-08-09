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
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full flex flex-col gap-3" dir="rtl">
      {/* ── Desktop Header ── */}
      <div className="hidden lg:flex items-center w-full px-6 py-3  text-slate-500 dark:text-slate-400 font-extrabold text-[14px] uppercase select-none">
        <div className="w-[26%] text-center flex items-center justify-center gap-1.5">{t('subscription.labName')}</div>
        {/* <div className="w-[22%] text-center flex items-center justify-center gap-1.5">{t('subscription.email')}</div> */}
        <div className="w-[32%] text-center flex items-center justify-center gap-1.5">{t('reports.duration')}</div>
        <div className="w-[24%] text-center flex items-center justify-center gap-1.5">المدة المتبقية</div>
        {/* <div className="w-[10%] text-center flex items-center justify-center gap-1.5">{t('common.status')}</div> */}
        <div className="w-[20%] text-center flex items-center justify-center gap-1.5">{t('common.actions')}</div>
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
            {t('common.noData')}
          </div>
        ) : (
          subs.map((sub) => {
            const { labId, labName, email, subscriptionStartUtc, subscriptionEndUtc, remainingDays } = sub;
            const end = new Date(subscriptionEndUtc);
            const today = new Date();
            const isActive = remainingDays > 0 || end > today;

            const isLowRemaining = remainingDays > 0 && remainingDays <= 30;
            const remainingColor = isActive 
              ? (isLowRemaining ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 border-amber-200/60 dark:border-amber-900/40' : 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 border-blue-200/60 dark:border-blue-900/40')
              : 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-200/60 dark:border-rose-900/40';

            return (
              <div
                key={labId || sub.id}
                className="flex items-center w-full bg-bg-card dark:bg-slate-900 border border-slate-100 dark:border-slate-800/70 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-200"
              >
                {/* 1. Lab Column (Centered) */}
                <div className="w-[26%] flex items-center justify-center gap-3 min-w-0 px-2">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                    isActive ? 'from-emerald-400 to-teal-600' : 'from-rose-400 to-red-600'
                  } text-white flex items-center justify-center shadow-md shrink-0`}>
                    <Building2 size={19} />
                  </div>
                  <div className="flex flex-col text-right min-w-0">
                    <span className="font-extrabold text-text-main dark:text-gray-100 text-xs sm:text-[13px] truncate leading-snug" title={labName || `مخبر #${labId}`}>
                      {labName || `مخبر #${labId}`}
                    </span>
                    <span className="text-[10px] text-text-muted font-black">
                      ID: #{labId}
                    </span>
                  </div>
                </div>

                {/* 2. Email Column (Centered) */}
                {/* <div className="w-[22%] flex items-center justify-center gap-2 min-w-0 text-text-muted px-2">
                  <Mail size={14} className="text-sky-500 shrink-0" />
                  <span className="text-xs truncate font-semibold font-sans dir-ltr" title={email}>
                    {email || 'غير متوفر'}
                  </span>
                </div> */}

                {/* 3. Date Range Column (Centered) */}
                <div className="w-[32%] flex items-center justify-center gap-2 text-text-muted min-w-0 px-2">
                  <Calendar size={14} className="text-emerald-500 shrink-0" />
                  <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                    <span>{formatDate(subscriptionStartUtc)}</span>
                    <span className="text-gray-300 dark:text-slate-700">←</span>
                    <span>{formatDate(subscriptionEndUtc)}</span>
                  </div>
                </div>

                {/* 4. Remaining Days Column (Centered) */}
                <div className="w-[24%] flex items-center justify-center min-w-0 px-2">
                  <span className={`inline-flex items-center justify-center gap-1 px-3 py-1 text-[11px] font-black rounded-xl border ${remainingColor}`}>
                    <Hourglass size={12} className="shrink-0" />
                    {isActive ? (
                      <>
                        {isLowRemaining && <AlertTriangle size={10} className="animate-bounce text-amber-500" />}
                        متبقي {remainingDays} يوم
                      </>
                    ) : (
                      t('subscription.expiredDaysAgo', { days: Math.abs(remainingDays ?? 0) })
                    )}
                  </span>
                </div>

                {/* 5. Status Column (Centered) */}
                {/* <div className="w-[10%] flex items-center justify-center shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border ${
                    isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-900/40' 
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`} />
                    {isActive ? t('subscription.active') : t('subscription.expired')}
                  </span>
                </div> */}

                {/* 6. Actions Column (Centered) */}
                <div className="w-[20%] flex items-center justify-center shrink-0">
                  {isActive ? (
                    <button
                      onClick={() => onRenew(sub)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white dark:bg-blue-950/40 dark:hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white rounded-xl text-[11px] font-black transition-all active:scale-95 cursor-pointer group/btn"
                    >
                      <RefreshCw size={12} className="group-hover/btn:rotate-180 transition-transform duration-500" />
                      {t('subscription.renew')}
                    </button>
                  ) : (
                    <button
                      onClick={() => onActivate(sub)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-[11px] font-black shadow-sm transition-all active:scale-95 cursor-pointer group/btn"
                    >
                      <CreditCard size={12} />
                      {t('subscription.activate')}
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
            <p className="text-text-muted font-bold text-sm">{t('common.noData')}</p>
          </div>
        ) : (
          subs.map((sub) => (
            <SubscriptionCard
              key={sub.labId || sub.id}
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
