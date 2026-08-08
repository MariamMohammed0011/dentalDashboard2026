import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, AlertCircle, RefreshCw, Calendar, FlaskConical, Clock, CheckCircle2 } from 'lucide-react';
import { Pie } from '@ant-design/plots';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';

export default function SubscriptionReportSection({ subscriptionData, isLoading, days, setDays }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

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
      className="space-y-6"
      dir="rtl"
    >
      {/* Header & Days Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-sm shrink-0">
            <FlaskConical size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-text-main tracking-tight">{t('reports.subscriptionsReport.title')}</h2>
            <p className="text-xs sm:text-sm text-text-muted font-medium">{t('reports.subscriptionsReport.desc')}</p>
          </div>
        </div>

        {/* Days Filter Pills with Horizontal Scroll */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-bg-card p-1.5 rounded-2xl border border-border-main/70 shadow-sm overflow-x-auto custom-scrollbar max-w-full">
          <div className="flex items-center gap-1 text-xs text-text-muted px-2 font-bold shrink-0">
            <Calendar size={14} className="text-primary" />
            <span>{t('reports.subscriptionsReport.range')}:</span>
          </div>
          {daysOptions.map(option => (
            <button
              type="button"
              key={option.value}
              onClick={() => setDays(option.value)}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 ${
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
          <div className="text-3xl font-black text-text-main">{statusDistribution.totalLabsCount}</div>
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
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{statusDistribution.activeLabsCount}</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              {statusDistribution.activePercentage}%
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
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">{statusDistribution.suspendedLabsCount}</span>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
              {statusDistribution.suspendedPercentage}%
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
              {retentionStats.retentionRatePercentage}%
            </span>
            <span className="text-xs font-bold text-text-muted">
              ({retentionStats.renewedLabsCount} / {retentionStats.totalSubscribedLabs})
            </span>
          </div>
          <div className="mt-2 text-[11px] font-bold text-text-muted">{t('subscription.renew')}</div>
        </motion.div>
      </div>

      {/* Middle Row: Distribution & Expiring Labs */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Status Donut Chart */}
        <div className="lg:col-span-4   p-5 sm:p-6 shadow-sm border border-emerald-500/30 rounded-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-main">{t('reports.subscriptionsReport.distributionTitle')}</h3>
            <p className="text-xs text-text-muted font-medium">{t('reports.subscriptionsReport.desc')}</p>
          </div>
          {/* Custom SVG Donut Gauge */}
          <div className="h-[210px] my-3 flex items-center justify-center relative">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                <defs>
                  <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient id="suspendedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#DC2626" />
                  </linearGradient>
                </defs>

                {/* Track Circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  className="stroke-slate-200/60 dark:stroke-slate-800"
                  strokeWidth="12"
                  fill="transparent"
                />

                {/* Active Labs Arc */}
                <motion.circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke="url(#activeGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  fill="transparent"
                  initial={{ strokeDasharray: "0 377" }}
                  animate={{
                    strokeDasharray: `${((statusDistribution.activePercentage || 0) / 100) * 376.8} ${376.8 - ((statusDistribution.activePercentage || 0) / 100) * 376.8}`,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="drop-shadow-[0_4px_8px_rgba(16,185,129,0.3)]"
                />

                {/* Suspended Labs Arc */}
                {(statusDistribution.suspendedPercentage || 0) > 0 && (
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="60"
                    stroke="url(#suspendedGrad)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="transparent"
                    initial={{ strokeDasharray: "0 377" }}
                    animate={{
                      strokeDasharray: `${((statusDistribution.suspendedPercentage || 0) / 100) * 376.8} ${376.8 - ((statusDistribution.suspendedPercentage || 0) / 100) * 376.8}`,
                      strokeDashoffset: -(((statusDistribution.activePercentage || 0) / 100) * 376.8),
                    }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="drop-shadow-[0_4px_8px_rgba(239,68,68,0.3)]"
                  />
                )}
              </svg>

              {/* Center Hub */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">إجمالي المخابر</span>
                <span className="text-2xl font-black text-text-main">
                  {statusDistribution.totalLabsCount || 0}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-0.5 border border-emerald-500/20">
                  {statusDistribution.activePercentage || 0}% نشط
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-xs font-bold pt-3 border-t border-border-main/50">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{t('reports.subscriptionsReport.activeLabs')}: {statusDistribution.activeLabsCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-xl border border-rose-500/20">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{t('reports.subscriptionsReport.suspendedLabs')}: {statusDistribution.suspendedLabsCount}</span>
            </div>
          </div>
        </div>

        {/* Expiring Soon Labs Table or Empty Card */}
        <div className="lg:col-span-6  dark:bg-bg-card  p-5 sm:p-6  flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-border-main/50">
            <div>
              <h3 className="text-base font-bold text-text-main">{t('reports.subscriptionsReport.expiringSoonTitle')}</h3>
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
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-text-muted font-black border-b border-border-main pb-2">
                    <th className="pb-3 px-2">{t('subscription.labName')}</th>
                    <th className="pb-3 px-2">{t('subscription.endDate')}</th>
                    <th className="pb-3 px-2 text-center">{t('common.status')}</th>
                    <th className="pb-3 px-2 text-center">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/40 font-bold">
                  {expiringSoonLabs.map((lab, index) => (
                    <tr key={lab.id || lab.labId || index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-2 text-text-main flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="truncate">{lab.labName || lab.name || `#${lab.id || index + 1}`}</span>
                      </td>
                      <td className="py-3 px-2 text-text-muted dir-ltr text-right whitespace-nowrap">
                        {lab.expirationDate ? new Date(lab.expirationDate).toLocaleDateString('ar-EG') : 'N/A'}
                      </td>
                      <td className="py-3 px-2 text-center whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
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

