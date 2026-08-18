import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, AlertCircle, RefreshCw, Calendar, FlaskConical, Clock, CheckCircle2, Table, PieChart } from 'lucide-react';
import { Pie } from '@ant-design/plots';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import AnimatedNumber from '../../../components/shared/AnimatedNumber';

export default function SubscriptionReportSection({ subscriptionData, isLoading, days, setDays }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [distributionViewMode, setDistributionViewMode] = useState('chart'); // 'chart' | 'table'

  const daysOptions = [
    { value: 7, label: '7 أيام' },
    { value: 14, label: '14 يوم' },
    { value: 30, label: '30 يوم' },
    { value: 60, label: '60 يوم' },
    { value: 90, label: '90 يوم' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" dir="rtl">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-bg-card border border-border-main rounded-2xl p-4 xs:p-5 h-32 xs:h-36"></div>
          ))}
        </div>
      </div>
    );
  }

  const {
    expiringSoonLabs = [],
    statusDistribution = {
      activeLabsCount: 0,
      suspendedLabsCount: 0,
      totalLabsCount: 0,
      activePercentage: 0,
      suspendedPercentage: 0,
    },
    retentionStats = {
      totalSubscribedLabs: 0,
      renewedLabsCount: 0,
      retentionRatePercentage: 0,
    },
  } = subscriptionData || {};

  const statusPieData = [
    { type: t('reports.subscriptionsReport.activeLabs'), value: statusDistribution.activeLabsCount || 0 },
    { type: t('reports.subscriptionsReport.suspendedLabs'), value: statusDistribution.suspendedLabsCount || 0 },
  ].filter(item => item.value > 0);

  const pieConfig = {
    data: statusPieData.length > 0 ? statusPieData : [{ type: t('common.noData'), value: 1 }],
    angleField: 'value',
    colorField: 'type',
    radius: 0.85,
    innerRadius: 0.68,
    color: ['#10B981', '#EF4444'],
    theme: theme === 'dark' ? 'dark' : 'light',
    legend: false,
    label: false,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 xs:space-y-6 sm:space-y-7 font-zain w-full overflow-hidden"
      dir="rtl"
    >
      {/* Header Section */}
      <div className="flex flex-col xs:flex-col sm:flex-row justify-between items-start sm:items-end gap-4 xs:gap-5">
        <div className="flex items-start xs:items-center gap-3 xs:gap-4 flex-1">
          <div className="p-2.5 xs:p-3 bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl xs:rounded-2xl shadow-sm border border-blue-200/40 dark:border-blue-800/30 flex items-center justify-center shrink-0">
            <FlaskConical size={20} className="xs:w-6 xs:h-6" />
          </div>
          <div className="text-right">
            <h1 className="text-xl xs:text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('reports.subscriptionsReport.title')}
            </h1>
          </div>
        </div>

        {/* Days Filter Pills - Responsive Grid */}
        <div className="flex flex-col xs:flex-row items-center gap-2.5 xs:gap-3 bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-800/30 p-2.5 xs:p-3 rounded-xl xs:rounded-2xl border border-blue-200/40 dark:border-slate-700/40 shadow-sm w-full xs:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 px-1.5 xs:px-2 font-bold shrink-0">
            <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
            <span>{t('reports.subscriptionsReport.range')}:</span>
          </div>
          <div className="grid grid-cols-5 gap-1 xs:gap-1.5 w-full xs:w-auto">
            {daysOptions.map(option => (
              <button
                type="button"
                key={option.value}
                onClick={() => setDays(option.value)}
                className={`px-1.5 xs:px-2.5 py-1.5 xs:py-2 text-[11px] xs:text-xs font-black rounded-lg xs:rounded-xl transition-all duration-300 text-center cursor-pointer whitespace-nowrap ${
                  days === option.value
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30 border border-blue-400 scale-105'
                    : 'bg-white dark:bg-slate-700/30 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/60 dark:border-slate-700/40'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards (4 Grid Columns) - Responsive */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
        {/* Total Labs */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-blue-200/50 hover:border-blue-300/70 dark:border-blue-900/30 dark:hover:border-blue-800/50 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-3 xs:mb-4">
            <span className="text-[10px] xs:text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('reports.subscriptionsReport.totalLabs')}</span>
            <div className="p-2 xs:p-2.5 rounded-lg xs:rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/40 dark:border-blue-800/30">
              <FlaskConical size={18} className="xs:w-5 xs:h-5" />
            </div>
          </div>
          <div className="text-2xl xs:text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
            <AnimatedNumber value={statusDistribution.totalLabsCount} />
          </div>
          <div className="mt-2 xs:mt-3 text-[10px] xs:text-xs font-semibold text-slate-600 dark:text-slate-400">{t('labs.title')}</div>
        </motion.div>

        {/* Active Labs */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-emerald-50 to-emerald-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-emerald-200/50 hover:border-emerald-300/70 dark:border-emerald-900/30 dark:hover:border-emerald-800/50 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-3 xs:mb-4">
            <span className="text-[10px] xs:text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('reports.subscriptionsReport.activeLabs')}</span>
            <div className="p-2 xs:p-2.5 rounded-lg xs:rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/40 dark:border-emerald-800/30">
              <UserCheck size={18} className="xs:w-5 xs:h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              <AnimatedNumber value={statusDistribution.activeLabsCount} />
            </span>
            <span className="text-[9px] xs:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 border border-emerald-200/50 dark:border-emerald-900/30 px-2 xs:px-3 py-0.5 xs:py-1 rounded-full">
              <AnimatedNumber value={statusDistribution.activePercentage} suffix="%" />
            </span>
          </div>
          <div className="mt-2 xs:mt-3 text-[10px] xs:text-xs font-semibold text-slate-600 dark:text-slate-400">{t('common.active')}</div>
        </motion.div>

        {/* Suspended Labs */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-red-50 to-red-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-red-200/50 hover:border-red-300/70 dark:border-red-900/30 dark:hover:border-red-800/50 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-3 xs:mb-4">
            <span className="text-[10px] xs:text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('reports.subscriptionsReport.suspendedLabs')}</span>
            <div className="p-2 xs:p-2.5 rounded-lg xs:rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/10 text-red-600 dark:text-red-400 border border-red-200/40 dark:border-red-800/30">
              <AlertCircle size={18} className="xs:w-5 xs:h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400">
              <AnimatedNumber value={statusDistribution.suspendedLabsCount} />
            </span>
            <span className="text-[9px] xs:text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/15 border border-red-200/50 dark:border-red-900/30 px-2 xs:px-3 py-0.5 xs:py-1 rounded-full">
              <AnimatedNumber value={statusDistribution.suspendedPercentage} suffix="%" />
            </span>
          </div>
          <div className="mt-2 xs:mt-3 text-[10px] xs:text-xs font-semibold text-slate-600 dark:text-slate-400">{t('common.suspended')}</div>
        </motion.div>

        {/* Retention Rate */}
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-slate-800/60 dark:to-slate-800/40 border-2 border-purple-200/50 hover:border-purple-300/70 dark:border-purple-900/30 dark:hover:border-purple-800/50 rounded-xl xs:rounded-2xl p-4 xs:p-5 sm:p-6 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-3 xs:mb-4">
            <span className="text-[10px] xs:text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t('reports.subscriptionsReport.retentionRate')}</span>
            <div className="p-2 xs:p-2.5 rounded-lg xs:rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/40 dark:border-purple-800/30">
              <RefreshCw size={18} className="xs:w-5 xs:h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl xs:text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400">
              <AnimatedNumber value={retentionStats.retentionRatePercentage} suffix="%" />
            </span>
            <span className="text-[9px] xs:text-xs font-semibold text-slate-600 dark:text-slate-400">
              (<AnimatedNumber value={retentionStats.renewedLabsCount} /> / <AnimatedNumber value={retentionStats.totalSubscribedLabs} />)
            </span>
          </div>
          <div className="mt-2 xs:mt-3 text-[10px] xs:text-xs font-semibold text-slate-600 dark:text-slate-400">{t('subscription.renew')}</div>
        </motion.div>
      </div>

      {/* Distribution & Expiring Soon Sections */}
      <div className="flex flex-col gap-5 xs:gap-6 w-full">
        {/* Status Distribution Card */}
        <div className="w-full bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-800/50 dark:via-slate-800/40 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-700/40 p-4 xs:p-5 sm:p-6 rounded-xl xs:rounded-2xl shadow-sm flex flex-col justify-between gap-4 xs:gap-5">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 xs:gap-3 pb-3 xs:pb-4 border-b border-slate-200/60 dark:border-slate-700/40">
            <div>
              <h3 className="text-base xs:text-lg font-black text-slate-900 dark:text-white">{t('reports.subscriptionsReport.distributionTitle')}</h3>
              <p className="text-xs xs:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">{t('reports.subscriptionsReport.desc')}</p>
            </div>
          </div>

          {/* Distribution Table - Responsive */}
          <div className="w-full overflow-x-auto">
            <table className="w-full text-right text-xs xs:text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 font-black">
                  <th className="pb-3 px-2 xs:px-4 text-right">حالة المختبر</th>
                  <th className="pb-3 px-2 xs:px-4 text-center">العدد</th>
                  <th className="pb-3 px-2 xs:px-4 text-center">النسبة المئوية</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/30 font-bold">
                <tr className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors">
                  <td className="py-3 xs:py-4 px-2 xs:px-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{t('reports.subscriptionsReport.activeLabs')}</span>
                  </td>
                  <td className="py-3 xs:py-4 px-2 xs:px-4 text-center text-slate-900 dark:text-white text-sm xs:text-base font-black">
                    <AnimatedNumber value={statusDistribution.activeLabsCount || 0} />
                  </td>
                  <td className="py-3 xs:py-4 px-2 xs:px-4 text-center">
                    <span className="px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/30 text-xs font-black">
                      <AnimatedNumber value={statusDistribution.activePercentage || 0} suffix="%" />
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-red-50/50 dark:hover:bg-red-900/10 transition-colors">
                  <td className="py-3 xs:py-4 px-2 xs:px-4 text-red-600 dark:text-red-400 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                    <span>{t('reports.subscriptionsReport.suspendedLabs')}</span>
                  </td>
                  <td className="py-3 xs:py-4 px-2 xs:px-4 text-center text-slate-900 dark:text-white text-sm xs:text-base font-black">
                    <AnimatedNumber value={statusDistribution.suspendedLabsCount || 0} />
                  </td>
                  <td className="py-3 xs:py-4 px-2 xs:px-4 text-center">
                    <span className="px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-900/30 text-xs font-black">
                      <AnimatedNumber value={statusDistribution.suspendedPercentage || 0} suffix="%" />
                    </span>
                  </td>
                </tr>
                <tr className="bg-gradient-to-r from-blue-50/60 to-indigo-50/40 dark:from-blue-900/10 dark:to-indigo-900/5 border-t-2 border-slate-200 dark:border-slate-700/60">
                  <td className="py-3 xs:py-4 px-2 xs:px-4 text-slate-900 dark:text-white font-black flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <span>إجمالي المخابر</span>
                  </td>
                  <td className="py-3 xs:py-4 px-2 xs:px-4 text-center text-slate-900 dark:text-white text-lg xs:text-xl font-black">
                    <AnimatedNumber value={statusDistribution.totalLabsCount || 0} />
                  </td>
                  <td className="py-3 xs:py-4 px-2 xs:px-4 text-center">
                    <span className="px-2.5 xs:px-3 py-0.5 xs:py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30 text-xs font-black">
                      100%
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Stats Summary */}
          <div className="flex flex-col xs:flex-row gap-2.5 xs:gap-3 text-xs xs:text-sm font-bold pt-3 xs:pt-4 border-t border-slate-200/60 dark:border-slate-700/40 flex-wrap">
            <div className="flex items-center gap-1.5 xs:gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 xs:px-3.5 py-1.5 xs:py-2 rounded-lg xs:rounded-xl border border-emerald-200/50 dark:border-emerald-900/30">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{t('reports.subscriptionsReport.activeLabs')}: <AnimatedNumber value={statusDistribution.activeLabsCount || 0} /></span>
            </div>
            <div className="flex items-center gap-1.5 xs:gap-2 text-red-600 dark:text-red-400 bg-red-500/10 px-2.5 xs:px-3.5 py-1.5 xs:py-2 rounded-lg xs:rounded-xl border border-red-200/50 dark:border-red-900/30">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <span>{t('reports.subscriptionsReport.suspendedLabs')}: <AnimatedNumber value={statusDistribution.suspendedLabsCount || 0} /></span>
            </div>
          </div>
        </div>

        {/* Expiring Soon Labs Card */}
        <div className="w-full bg-gradient-to-br from-white via-slate-50/30 to-white dark:from-slate-800/50 dark:via-slate-800/40 dark:to-slate-800/50 border border-slate-200/50 dark:border-slate-700/40 p-4 xs:p-5 sm:p-6 rounded-xl xs:rounded-2xl shadow-sm flex flex-col justify-between gap-4 xs:gap-5">
          <div className="flex flex-col xs:flex-row xs:justify-between xs:items-start gap-2 xs:gap-3 pb-3 xs:pb-4 border-b border-slate-200/60 dark:border-slate-700/40">
            <div>
              <h3 className="text-base xs:text-lg font-black text-slate-900 dark:text-white">{t('reports.subscriptionsReport.expiringSoonTitle')}</h3>
              <p className="text-xs xs:text-sm text-slate-600 dark:text-slate-400 font-medium mt-1">{t('reports.subscriptionsReport.expiringSoonDesc', { days })}</p>
            </div>
            <span className="text-xs xs:text-sm font-bold px-2.5 xs:px-3.5 py-1 xs:py-1.5 rounded-lg xs:rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-amber-900/30 shrink-0">
              {expiringSoonLabs.length}
            </span>
          </div>

          {expiringSoonLabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 xs:py-12 px-4 text-center border-2 border-dashed border-emerald-200/60 dark:border-emerald-900/30 rounded-xl xs:rounded-2xl bg-gradient-to-br from-emerald-50/50 to-emerald-50/20 dark:from-emerald-900/10 dark:to-emerald-900/5">
              <div className="w-12 xs:w-14 h-12 xs:h-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 xs:mb-4 border border-emerald-200/50 dark:border-emerald-900/30">
                <CheckCircle2 size={28} className="xs:w-8 xs:h-8" />
              </div>
              <h4 className="font-black text-slate-900 dark:text-white text-sm xs:text-base">{t('reports.subscriptionsReport.noExpiringTitle')}</h4>
              <p className="text-xs xs:text-sm text-slate-600 dark:text-slate-400 max-w-sm mt-2 xs:mt-3 font-medium">
                {t('reports.subscriptionsReport.noExpiringDesc', { days })}
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full text-right text-xs xs:text-sm">
                <thead>
                  <tr className="text-slate-600 dark:text-slate-400 font-black border-b-2 border-slate-200 dark:border-slate-700/60 pb-2">
                    <th className="pb-3 px-2 xs:px-4 text-right">{t('subscription.labName')}</th>
                    <th className="pb-3 px-2 xs:px-4 hidden sm:table-cell text-center">{t('subscription.endDate')}</th>
                    <th className="pb-3 px-2 xs:px-4 text-center">{t('common.status')}</th>
                    <th className="pb-3 px-2 xs:px-4 text-center">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/30 font-bold">
                  {expiringSoonLabs.map((lab, index) => (
                    <tr key={lab.id || lab.labId || index} className="hover:bg-amber-50/50 dark:hover:bg-amber-900/10 transition-colors">
                      <td className="py-3 xs:py-4 px-2 xs:px-4 text-slate-900 dark:text-white truncate">
                        <div className="flex items-center gap-1.5 xs:gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="truncate">{lab.labName || lab.name || `#${lab.id || index + 1}`}</span>
                        </div>
                      </td>
                      <td className="py-3 xs:py-4 px-2 xs:px-4 text-slate-600 dark:text-slate-400 dir-ltr text-right whitespace-nowrap hidden sm:table-cell">
                        {lab.expirationDate ? new Date(lab.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="py-3 xs:py-4 px-2 xs:px-4 text-center whitespace-nowrap">
                        <span className="px-2 xs:px-2.5 py-0.5 xs:py-1 rounded-lg xs:rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-200/50 dark:border-amber-900/30 text-[11px] xs:text-xs">
                          {t('reports.subscriptionsReport.daysLeft', { count: lab.daysLeft ?? 0 })}
                        </span>
                      </td>
                      <td className="py-3 xs:py-4 px-2 xs:px-4 text-center whitespace-nowrap">
                        <button type="button" className="text-xs xs:text-sm font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline cursor-pointer transition-colors">
                          {t('reports.subscriptionsReport.contactRenew')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}