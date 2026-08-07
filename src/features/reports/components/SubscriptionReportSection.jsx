import React from 'react';
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-bg-card border border-border-main rounded-3xl p-6 h-36"></div>
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
    radius: 0.8,
    innerRadius: 0.65,
    color: ['#10B981', '#EF4444'],
    theme: theme === 'dark' ? 'dark' : 'light',
    legend: false,
    label: {
      text: 'value',
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        fill: theme === 'dark' ? '#ffffff' : '#1f2937',
      },
    },
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header & Days Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-500">
            <FlaskConical size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-text-main">{t('reports.subscriptionsReport.title')}</h2>
            <p className="text-xs text-text-muted">{t('reports.subscriptionsReport.desc')}</p>
          </div>
        </div>

        {/* Days Filter Pills */}
        <div className="flex items-center gap-1.5 bg-bg-card p-1.5 rounded-2xl border border-border-main shadow-sm">
          <div className="flex items-center gap-1 text-xs text-text-muted px-2 font-bold">
            <Calendar size={14} />
            <span>{t('reports.subscriptionsReport.range')}</span>
          </div>
          {daysOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setDays(option.value)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                days === option.value
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-slate-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Labs */}
        <div className="bg-bg-card border border-border-main rounded-[2rem] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-text-muted">{t('reports.subscriptionsReport.totalLabs')}</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <FlaskConical size={20} />
            </div>
          </div>
          <div className="text-3xl font-black text-text-main">{statusDistribution.totalLabsCount}</div>
          <div className="mt-2 text-[11px] text-text-muted">{t('labs.title')}</div>
        </div>

        {/* Active Labs */}
        <div className="bg-bg-card border border-emerald-500/20 rounded-[2rem] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-text-muted">{t('reports.subscriptionsReport.activeLabs')}</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <UserCheck size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{statusDistribution.activeLabsCount}</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              {statusDistribution.activePercentage}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-text-muted">{t('common.active')}</div>
        </div>

        {/* Suspended Labs */}
        <div className="bg-bg-card border border-rose-500/20 rounded-[2rem] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-text-muted">{t('reports.subscriptionsReport.suspendedLabs')}</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
              <AlertCircle size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 dark:text-rose-400">{statusDistribution.suspendedLabsCount}</span>
            <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
              {statusDistribution.suspendedPercentage}%
            </span>
          </div>
          <div className="mt-2 text-[11px] text-text-muted">{t('common.suspended')}</div>
        </div>

        {/* Retention Rate */}
        <div className="bg-bg-card border border-purple-500/20 rounded-[2rem] p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-text-muted">{t('reports.subscriptionsReport.retentionRate')}</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
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
          <div className="mt-2 text-[11px] text-text-muted">{t('subscription.renew')}</div>
        </div>
      </div>

      {/* Middle Row: Distribution & Retention Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        {/* Status Donut Chart */}
        <div className="lg:col-span-4 bg-bg-card border border-border-main rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-text-main">{t('reports.subscriptionsReport.distributionTitle')}</h3>
            <p className="text-xs text-text-muted">{t('reports.subscriptionsReport.desc')}</p>
          </div>
          <div className="h-[200px] my-4 flex items-center justify-center">
            <Pie {...pieConfig} />
          </div>
          <div className="flex justify-center gap-4 text-xs font-bold pt-3 border-t border-border-main/50">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>{t('reports.subscriptionsReport.activeLabs')}: {statusDistribution.activeLabsCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>{t('reports.subscriptionsReport.suspendedLabs')}: {statusDistribution.suspendedLabsCount}</span>
            </div>
          </div>
        </div>

        {/* Expiring Soon Labs Table or Empty Card */}
        <div className="lg:col-span-6 bg-bg-card border border-border-main rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-border-main/50">
            <div>
              <h3 className="text-base font-bold text-text-main">{t('reports.subscriptionsReport.expiringSoonTitle')}</h3>
              <p className="text-xs text-text-muted">{t('reports.subscriptionsReport.expiringSoonDesc', { days })}</p>
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
              <p className="text-xs text-text-muted max-w-sm mt-1">
                {t('reports.subscriptionsReport.noExpiringDesc', { days })}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="text-text-muted font-bold border-b border-border-main pb-2">
                    <th className="pb-3">{t('subscription.labName')}</th>
                    <th className="pb-3">{t('subscription.endDate')}</th>
                    <th className="pb-3 text-center">{t('common.status')}</th>
                    <th className="pb-3 text-center">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-main/40">
                  {expiringSoonLabs.map((lab, index) => (
                    <tr key={lab.id || lab.labId || index} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-bold text-text-main flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        {lab.labName || lab.name || `#${lab.id || index + 1}`}
                      </td>
                      <td className="py-3 text-text-muted dir-ltr text-right">
                        {lab.expirationDate ? new Date(lab.expirationDate).toLocaleDateString('ar-EG') : 'N/A'}
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                          {t('reports.subscriptionsReport.daysLeft', { count: lab.daysLeft ?? 0 })}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <button className="text-xs font-bold text-primary hover:underline">
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
    </div>
  );
}
