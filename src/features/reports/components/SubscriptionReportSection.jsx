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
    { value: 7, label: '7 ' + t('reports.subscriptionsReport.daysLeft', { count: 7 }).replace('7', '').trim() },
    { value: 14, label: '14 ' + t('reports.subscriptionsReport.daysLeft', { count: 14 }).replace('14', '').trim() },
    { value: 30, label: '30 ' + t('reports.subscriptionsReport.daysLeft', { count: 30 }).replace('30', '').trim() },
    { value: 60, label: '60 ' + t('reports.subscriptionsReport.daysLeft', { count: 60 }).replace('60', '').trim() },
    { value: 90, label: '90 ' + t('reports.subscriptionsReport.daysLeft', { count: 90 }).replace('90', '').trim() },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse" dir="rtl">
        <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-bg-card border border-border-main rounded-[2rem] p-6 h-36"></div>
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
      className="space-y-6 font-zain w-full overflow-hidden"
      dir="rtl"
    >
     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        

        <div className="flex items-center gap-4">
          <div className="p-3.5  bg-blue-500/10 text-blue-500 rounded-2xl shadow-sm border border-primary/20 flex items-center justify-center">
            <FlaskConical size={20}  />
          </div>
          <div className="text-right">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main tracking-tight">
              {t('reports.subscriptionsReport.title')}
            </h1>
            
          </div>
        </div>

        {/* Days Filter Pills (Flex Wrap - تم إلغاء السكرول) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-bg-card p-1.5 rounded-2xl border border-border-main/70 shadow-sm max-w-full w-full sm:w-auto">
          <div className="flex items-center gap-1 text-xs text-text-muted px-2 font-bold shrink-0">
            <Calendar size={14} className="text-primary" />
            <span>{t('reports.subscriptionsReport.range')}:</span>
          </div>
          <div className="grid grid-cols-5 gap-1 w-full sm:w-auto flex-1">
            {daysOptions.map(option => (
              <button
                type="button"
                key={option.value}
                onClick={() => setDays(option.value)}
                className={`px-2 py-1.5 text-xs font-black rounded-xl transition-all duration-300 text-center cursor-pointer ${
                  days === option.value
                    ? 'bg-primary text-white shadow-md shadow-primary/25 scale-105 border-2 border-primary'
                    : 'text-text-muted hover:text-text-main hover:bg-slate-100 dark:hover:bg-slate-800/80'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Cards (4 Grid Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Labs */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-bg-card border-2 border-blue-500/30 hover:border-blue-500 rounded-[2rem] p-5 shadow-sm hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('reports.subscriptionsReport.totalLabs')}</span>
            <div className="p-2.5 rounded-2xl bg-blue-500/15 text-blue-500 border border-blue-500/20">
              <FlaskConical size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-text-main">
            <AnimatedNumber value={statusDistribution.totalLabsCount} />
          </div>
          <div className="mt-2 text-[11px] font-bold text-text-muted">{t('labs.title')}</div>
        </motion.div>

        {/* Active Labs */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-bg-card border-2 border-emerald-500/30 hover:border-emerald-500 rounded-[2rem] p-5 shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('reports.subscriptionsReport.activeLabs')}</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              <AnimatedNumber value={statusDistribution.activeLabsCount} />
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              <AnimatedNumber value={statusDistribution.activePercentage} suffix="%" />
            </span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-text-muted">{t('common.active')}</div>
        </motion.div>

        {/* Suspended Labs */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-bg-card border-2 border-rose-500/30 hover:border-rose-500 rounded-[2rem] p-5 shadow-sm hover:shadow-lg hover:shadow-rose-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('reports.subscriptionsReport.suspendedLabs')}</span>
            <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-500 border border-rose-500/20">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">
              <AnimatedNumber value={statusDistribution.suspendedLabsCount} />
            </span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
              <AnimatedNumber value={statusDistribution.suspendedPercentage} suffix="%" />
            </span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-text-muted">{t('common.suspended')}</div>
        </motion.div>

        {/* Retention Rate */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white dark:bg-bg-card border-2 border-purple-500/30 hover:border-purple-500 rounded-[2rem] p-5 shadow-sm hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{t('reports.subscriptionsReport.retentionRate')}</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-500 border border-purple-500/20">
              <RefreshCw size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-600 dark:text-purple-400">
              <AnimatedNumber value={retentionStats.retentionRatePercentage} suffix="%" />
            </span>
            <span className="text-xs font-bold text-text-muted">
              ({retentionStats.renewedLabsCount} / {retentionStats.totalSubscribedLabs})
            </span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-text-muted">{t('subscription.renew')}</div>
        </motion.div>
      </div>

      {/* Middle & Expiring Soon Sections */}
      <div className="flex flex-col gap-6 w-full">
        {/* Status Distribution Card */}
        <div className="w-full  dark:bg-bg-card p-5 sm:p-6   flex flex-col justify-between gap-4">
          <div className="flex justify-between items-start pb-3 border-b border-border-main/50">
            <div>
              <h3 className="text-base font-black text-text-main">{t('reports.subscriptionsReport.distributionTitle')}</h3>
              <p className="text-xs text-text-muted font-medium">{t('reports.subscriptionsReport.desc')}</p>
            </div>
            
          </div>

         
          
            <div className="my-2 w-full overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-border-main/60 text-text-muted font-black">
                    <th className="pb-2.5 px-3">حالة المختبر</th>
                    <th className="pb-2.5 px-3 text-center">العدد</th>
                    <th className="pb-2.5 px-3 text-center">النسبة المئوية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/40 font-bold">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{t('reports.subscriptionsReport.activeLabs')}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-text-main text-sm font-black">
                      <AnimatedNumber value={statusDistribution.activeLabsCount || 0} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-black">
                        <AnimatedNumber value={statusDistribution.activePercentage || 0} suffix="%" />
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 text-rose-600 dark:text-rose-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                      <span>{t('reports.subscriptionsReport.suspendedLabs')}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-text-main text-sm font-black">
                      <AnimatedNumber value={statusDistribution.suspendedLabsCount || 0} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-black">
                        <AnimatedNumber value={statusDistribution.suspendedPercentage || 0} suffix="%" />
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-slate-50/70 dark:bg-slate-800/50">
                    <td className="py-3 px-3 text-text-main font-black flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                      <span>إجمالي المخابر</span>
                    </td>
                    <td className="py-3 px-3 text-center text-text-main text-base font-black">
                      <AnimatedNumber value={statusDistribution.totalLabsCount || 0} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-black">
                        100%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        

          <div className="flex justify-center gap-4 text-xs font-bold pt-3 border-t border-border-main/50 flex-wrap">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{t('reports.subscriptionsReport.activeLabs')}: <AnimatedNumber value={statusDistribution.activeLabsCount || 0} /></span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-xl border border-rose-500/20">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{t('reports.subscriptionsReport.suspendedLabs')}: <AnimatedNumber value={statusDistribution.suspendedLabsCount || 0} /></span>
            </div>
          </div>
        </div>

        {/* Expiring Soon Labs Table or Empty Card (بدون سكرول) */}
        <div className="w-full  dark:bg-bg-card p-5 sm:p-6  flex flex-col justify-between gap-4">
          <div className="flex justify-between items-center pb-3 border-b border-border-main/50">
            <div>
              <h3 className="text-base font-black text-text-main">{t('reports.subscriptionsReport.expiringSoonTitle')}</h3>
              <p className="text-xs text-text-muted font-medium">{t('reports.subscriptionsReport.expiringSoonDesc', { days })}</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {expiringSoonLabs.length}
            </span>
          </div>

          {expiringSoonLabs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-emerald-500/20 rounded-2xl bg-emerald-500/[0.02]">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="font-bold text-text-main text-sm">{t('reports.subscriptionsReport.noExpiringTitle')}</h4>
              <p className="text-xs text-text-muted max-w-sm mt-1 font-medium">
                {t('reports.subscriptionsReport.noExpiringDesc', { days })}
              </p>
            </div>
          ) : (
            <div className="w-full overflow-hidden">
              <table className="w-full text-right text-xs table-fixed">
                <thead>
                  <tr className="text-text-muted font-black border-b border-border-main pb-2">
                    <th className="pb-3 px-2 w-2/5">{t('subscription.labName')}</th>
                    <th className="pb-3 px-2 hidden sm:table-cell w-1/4">{t('subscription.endDate')}</th>
                    <th className="pb-3 px-2 text-center w-1/4 sm:w-1/5">{t('common.status')}</th>
                    <th className="pb-3 px-2 text-center w-1/4 sm:w-1/5">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/40 font-bold">
                  {expiringSoonLabs.map((lab, index) => (
                    <tr key={lab.id || lab.labId || index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2 text-text-main truncate">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                          <span className="truncate">{lab.labName || lab.name || `#${lab.id || index + 1}`}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-text-muted dir-ltr text-right whitespace-nowrap hidden sm:table-cell">
                        {lab.expirationDate ? new Date(lab.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                      </td>
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 text-[11px]">
                          {t('reports.subscriptionsReport.daysLeft', { count: lab.daysLeft ?? 0 })}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <button type="button" className="text-xs font-bold text-primary hover:underline cursor-pointer">
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