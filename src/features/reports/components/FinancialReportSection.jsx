import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, Megaphone, TrendingUp, Sparkles, PieChart } from 'lucide-react';

import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import AnimatedNumber from '../../../components/shared/AnimatedNumber';

export default function FinancialReportSection({ financialData, isLoading }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-pulse " dir="rtl">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-bg-card border border-border-main rounded-[2rem] p-6 h-40 flex flex-col justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    paidAdsTotalRevenue = 0,
    paidAdsCount = 0,
    activeSubscriptionsTotalRevenue = 0,
    activeSubscriptionsCount = 0,
    totalOverallRevenue = 0,
  } = financialData || {};

  const subRevenue = Number(activeSubscriptionsTotalRevenue) || 0;
  const adRevenue = Number(paidAdsTotalRevenue) || 0;
  const totalRev = Number(totalOverallRevenue) || (subRevenue + adRevenue);

  const subPercent = totalRev > 0 ? Math.round((subRevenue / totalRev) * 100) : 0;
  const adPercent = totalRev > 0 ? Math.round((adRevenue / totalRev) * 100) : 0;

  const chartData = [
    { type: t('reports.financial.subscriptionsRevenue'), value: subRevenue > 0 ? subRevenue : 0.0001, rawValue: subRevenue },
    { type: t('reports.financial.adsRevenue'), value: adRevenue > 0 ? adRevenue : 0.0001, rawValue: adRevenue },
  ];


  // 💡 تحليل ذكي لدليل توزيع الإيرادات
  const getSmartInsight = () => {
    if (totalRev === 0) return 'لا توجد بيانات مالية مسجلة حتى الآن.';
    if (subPercent === 100) return 'تشكّل اشتراكات المخابر المصدر الرئيسي للإيرادات بنسبة 100%.';
    if (adPercent === 100) return 'تشكّل الإعلانات المدفوعة المصدر الرئيسي للإيرادات بنسبة 100%.';
    if (subPercent > adPercent) return `تهيمن اشتراكات المخابر على المداخيل بنسبة ${subPercent}% مقارنة بالإعلانات.`;
    return `تتوزع الإيرادات بتوازن ممتاز بين الاشتراكات (${subPercent}%) والإعلانات (${adPercent}%).`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-zain"
      dir="rtl"
    >
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="text-xl font-zain sm:text-2xl font-black text-text-main tracking-tight">{t('reports.financial.title')}</h2>
            <p className="text-xs font-zain sm:text-sm text-text-muted mt-0.5 font-medium">{t('reports.financial.desc')}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold font-zain px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <Sparkles size={14} className="animate-pulse" />
          {t('common.active')}
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Total Overall Revenue */}
        <motion.div
          whileHover={{ y: -3, scale: 1.01 }}
          className="group relative bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white rounded-[2rem] p-6 shadow-xl shadow-emerald-900/15 border border-emerald-400/30 overflow-hidden transition-all duration-300"
        >
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <span className="font-zain text-emerald-100/90 font-bold text-xs uppercase tracking-wider">{t('reports.financial.totalRevenue')}</span>
              <h3 className=" font-zain text-3xl sm:text-4xl font-black tracking-tight mt-1 text-white dir-ltr text-right">
                <AnimatedNumber value={totalRev} prefix="$" decimals={2} />
              </h3>
            </div>
            <div className="p-3.5 bg-white/20 rounded-2xl backdrop-blur-md text-white shadow-sm shrink-0">
              <DollarSign size={26} />
            </div>
          </div>
          <div className="pt-3 border-t border-white/20 flex justify-between items-center text-xs text-emerald-100 font-bold relative z-10">
            <span className='font-zain'>{t('reports.financial.desc')}</span>
            <span className="font-zain bg-white/20 px-3 py-0.5 rounded-full backdrop-blur-md">{t('common.status')}</span>
          </div>
        </motion.div>

        {/* Card 2: Subscriptions Revenue */}
        <motion.div
          whileHover={{ y: -3 }}
          className="group relative bg-white dark:bg-bg-card border-2 border-emerald-500/30 hover:border-emerald-500 rounded-[2rem] p-6 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-zain text-text-muted font-bold text-xs uppercase tracking-wider">{t('reports.financial.subscriptionsRevenue')}</span>
              <h3 className="font-zain text-2xl sm:text-3xl font-black text-text-main mt-1 dir-ltr text-right">
                <AnimatedNumber value={subRevenue} prefix="$" decimals={2} />
              </h3>
            </div>
            <div className="p-3.5 bg-emerald-500/15 text-emerald-500 rounded-2xl border border-emerald-500/20 shrink-0">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="pt-3 border-t border-border-main flex justify-between items-center text-xs font-bold">
            <span className="font-zain text-text-muted">{t('dashboard.activeSubscriptions')}:</span>
            <span className="font-zain text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-0.5 rounded-full">
              {t('reports.financial.activeCount', { count: activeSubscriptionsCount })}
            </span>
          </div>
        </motion.div>

        {/* Card 3: Paid Ads Revenue */}
        <motion.div
          whileHover={{ y: -3 }}
          className="group relative bg-white dark:bg-bg-card border-2 border-purple-500/30 hover:border-purple-500 rounded-[2rem] p-6 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between sm:col-span-2 md:col-span-1"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="font-zain text-text-muted font-bold text-xs uppercase tracking-wider">{t('reports.financial.adsRevenue')}</span>
              <h3 className="font-zain text-2xl sm:text-3xl font-black text-text-main mt-1 dir-ltr text-right">
                <AnimatedNumber value={adRevenue} prefix="$" decimals={2} />
              </h3>
            </div>
            <div className="p-3.5 bg-purple-500/15 text-purple-500 rounded-2xl border border-purple-500/20 shrink-0">
              <Megaphone size={24} />
            </div>
          </div>
          <div className="pt-3 border-t border-border-main flex justify-between items-center text-xs font-bold">
            <span className="font-zain text-text-muted">{t('ads.title')}:</span>
            <span className="font-zain text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-0.5 rounded-full">
              {t('reports.financial.adsCount', { count: paidAdsCount })}
            </span>
          </div>
        </motion.div>
      </div>

      {/* 🧠 Smart Revenue Analytics & Distribution Card */}
      <div className=" p-6 sm:p-8 flex flex-col gap-6 relative overflow-hidden">
        {/* Header with Smart Insight Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-border-main/60">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary/20 to-indigo-500/20 text-primary rounded-2xl border border-primary/20 shadow-sm shrink-0">
              <PieChart size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-text-main">{t('reports.financial.chartTitle')}</h3>
              <p className="text-xs text-text-muted font-medium">{t('reports.financial.chartDesc')}</p>
            </div>
          </div>

          {/* 💡 Smart Insight Tag */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-2xl text-xs font-bold self-stretch md:self-auto">
            <Sparkles size={16} className="text-blue-500 shrink-0 animate-pulse" />
            <span>{getSmartInsight()}</span>
          </div>
        </div>

        {/* 📊 Segmented Visual Revenue Ratio Bar */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              اشتراكات المخابر: ${subRevenue.toFixed(2)} ({subPercent}%)
            </span>
            <span className="text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              الإعلانات المدفوعة: ${adRevenue.toFixed(2)} ({adPercent}%)
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            </span>
          </div>
          
          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex p-0.5 border border-slate-200 dark:border-slate-800 shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${subPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-md shadow-emerald-500/20 relative group"
              title={`اشتراكات المخابر: ${subPercent}%`}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${adPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full shadow-md shadow-purple-500/20 relative group"
              title={`الإعلانات: ${adPercent}%`}
            />
          </div>
        </div>

        {/* 🎯 Smart Grid Layout: Interactive Donut Chart + Dual Revenue Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
          {/* Custom Animated Radial Donut Gauge Container */}
          <div className="lg:col-span-6 h-[250px] sm:h-[270px] flex items-center justify-center relative bg-gradient-to-br from-slate-50/80 via-white to-slate-100/50 dark:from-slate-900/60 dark:via-bg-card dark:to-slate-900/80 rounded-[2.5rem] border border-border-main/60 p-6 shadow-inner overflow-hidden group">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <defs>
                  {/* Emerald Gradient */}
                  <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                  {/* Purple Gradient */}
                  <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>

                {/* Track Circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  className="stroke-slate-200/60 dark:stroke-slate-800"
                  strokeWidth="14"
                  fill="transparent"
                />

                {/* Subscriptions Arc (Emerald) */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r="62"
                  stroke="url(#emeraldGrad)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  fill="transparent"
                  initial={{ strokeDasharray: "0 390" }}
                  animate={{
                    strokeDasharray: `${(subPercent / 100) * 389.5} ${389.5 - (subPercent / 100) * 389.5}`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="drop-shadow-[0_4px_10px_rgba(16,185,129,0.35)]"
                />

                {/* Paid Ads Arc (Purple) - Offsetted */}
                {adPercent > 0 && (
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="62"
                    stroke="url(#purpleGrad)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    fill="transparent"
                    initial={{ strokeDasharray: "0 390" }}
                    animate={{
                      strokeDasharray: `${(adPercent / 100) * 389.5} ${389.5 - (adPercent / 100) * 389.5}`,
                      strokeDashoffset: -((subPercent / 100) * 389.5),
                    }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="drop-shadow-[0_4px_10px_rgba(139,92,246,0.35)]"
                  />
                )}
              </svg>

              {/* Ultra-Sleek Center Hub Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-4">
                <span className="text-[10px] sm:text-xs font-black text-text-muted uppercase tracking-widest">
                  إجمالي المداخيل
                </span>
                <span className="text-2xl sm:text-3xl font-black text-text-main tracking-tight dir-ltr my-0.5">
                  <AnimatedNumber value={totalRev} prefix="$" decimals={2} />
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
                  <Sparkles size={12} className="animate-pulse" />
                  <AnimatedNumber value={subPercent} suffix="%" /> اشتراكات
                </span>
              </div>
            </div>
          </div>

          {/* Dual Smart Ratio Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subscriptions Smart Box */}
            <div className="p-5 rounded-3xl bg-emerald-500/5 border-2 border-emerald-500/20 hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center">
                <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  <CreditCard size={20} />
                </div>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
                  {subPercent}%
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-text-muted">{t('reports.financial.subscriptionsRevenue')}</span>
                <h4 className="text-2xl font-black text-text-main dir-ltr text-right mt-0.5">
                  ${subRevenue.toFixed(2)}
                </h4>
              </div>
              <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 pt-2 border-t border-emerald-500/20 flex justify-between items-center">
                <span>الاشتراكات النشطة:</span>
                <span>{activeSubscriptionsCount} اشتراك</span>
              </div>
            </div>

            {/* Paid Ads Smart Box */}
            <div className="p-5 rounded-3xl bg-purple-500/5 border-2 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 flex flex-col justify-between gap-4">
              <div className="flex justify-between items-center">
                <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400">
                  <Megaphone size={20} />
                </div>
                <span className="text-xl font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-xl border border-purple-500/20">
                  {adPercent}%
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-text-muted">{t('reports.financial.adsRevenue')}</span>
                <h4 className="text-2xl font-black text-text-main dir-ltr text-right mt-0.5">
                  ${adRevenue.toFixed(2)}
                </h4>
              </div>
              <div className="text-[11px] font-bold text-purple-600 dark:text-purple-400 pt-2 border-t border-purple-500/20 flex justify-between items-center">
                <span>الإعلانات المدفوعة:</span>
                <span>{paidAdsCount} إعلان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}




