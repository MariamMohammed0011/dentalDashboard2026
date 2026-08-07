import React from 'react';
import { DollarSign, CreditCard, Megaphone, TrendingUp, Sparkles } from 'lucide-react';
import { Pie } from '@ant-design/plots';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';

export default function FinancialReportSection({ financialData, isLoading }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-pulse">
        {Array(3).fill(0).map((_, i) => (
          <div key={i} className="bg-bg-card border border-border-main rounded-3xl p-6 h-40 flex flex-col justify-between">
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

  // بيانات مخطط التوزيع المالي
  const chartData = [
    { type: t('reports.financial.subscriptionsRevenue'), value: activeSubscriptionsTotalRevenue },
    { type: t('reports.financial.adsRevenue'), value: paidAdsTotalRevenue },
  ].filter(item => item.value >= 0);

  const pieConfig = {
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    color: ['#10B981', '#8B5CF6'],
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500">
            <TrendingUp size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black text-text-main">{t('reports.financial.title')}</h2>
            <p className="text-xs text-text-muted">{t('reports.financial.desc')}</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Sparkles size={14} />
          {t('common.active')}
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Revenue */}
        <div className="group relative bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white rounded-[2rem] p-6 shadow-lg shadow-emerald-900/10 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 overflow-hidden">
          <div className="absolute -left-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-emerald-100/80 font-bold text-xs">{t('reports.financial.totalRevenue')}</span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight mt-1 text-white dir-ltr text-right">
                ${totalOverallRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-md text-white">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="pt-3 border-t border-white/20 flex justify-between items-center text-xs text-emerald-100">
            <span>{t('reports.financial.desc')}</span>
            <span className="font-black bg-white/20 px-2.5 py-0.5 rounded-full">{t('common.status')}</span>
          </div>
        </div>

        {/* Card 2: Subscriptions Revenue */}
        <div className="group relative bg-bg-card border border-emerald-500/20 hover:border-emerald-500 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-text-muted font-bold text-xs">{t('reports.financial.subscriptionsRevenue')}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-text-main mt-1 dir-ltr text-right">
                ${activeSubscriptionsTotalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
              <CreditCard size={24} />
            </div>
          </div>
          <div className="pt-3 border-t border-border-main flex justify-between items-center text-xs">
            <span className="text-text-muted">{t('dashboard.activeSubscriptions')}:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              {t('reports.financial.activeCount', { count: activeSubscriptionsCount })}
            </span>
          </div>
        </div>

        {/* Card 3: Paid Ads Revenue */}
        <div className="group relative bg-bg-card border border-purple-500/20 hover:border-purple-500 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-text-muted font-bold text-xs">{t('reports.financial.adsRevenue')}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-text-main mt-1 dir-ltr text-right">
                ${paidAdsTotalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-2xl">
              <Megaphone size={24} />
            </div>
          </div>
          <div className="pt-3 border-t border-border-main flex justify-between items-center text-xs">
            <span className="text-text-muted">{t('ads.title')}:</span>
            <span className="font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full">
              {t('reports.financial.adsCount', { count: paidAdsCount })}
            </span>
          </div>
        </div>
      </div>

      {/* Visual Chart Breakdown */}
      <div className="bg-bg-card border border-border-main rounded-[2rem] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 pb-4 border-b border-border-main/60">
          <div>
            <h3 className="text-base font-bold text-text-main">{t('reports.financial.chartTitle')}</h3>
            <p className="text-xs text-text-muted">{t('reports.financial.chartDesc')}</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>{t('reports.financial.subscriptionsRevenue')} (${activeSubscriptionsTotalRevenue.toLocaleString()})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 inline-block" />
              <span>{t('reports.financial.adsRevenue')} (${paidAdsTotalRevenue.toLocaleString()})</span>
            </div>
          </div>
        </div>

        <div className="h-[240px] flex items-center justify-center">
          {totalOverallRevenue === 0 ? (
            <span className="text-sm text-text-muted">{t('common.noData')}</span>
          ) : (
            <div className="w-full h-full">
              <Pie {...pieConfig} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
