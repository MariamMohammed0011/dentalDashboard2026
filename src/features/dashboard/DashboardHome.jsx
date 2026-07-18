import React from 'react';
import { Pie, Column, Line, Area, Bar } from '@ant-design/plots';
import WelcomeHeader from './components/WelcomeHeader';
import { useTheme } from '../../context/ThemeContext';
import { useDashboardStats } from './hooks/useDashboardStats';
import { useTranslation } from 'react-i18next';
import {
  Users,
  FlaskConical,
  Activity,
  TrendingUp,
  DollarSign,
  Loader2,
  AlertTriangle
} from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, color, subDetails }) => (
  <div className="card bg-bg-card shadow-sm border border-border-main rounded-[2rem] p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-md flex flex-col justify-between h-full relative overflow-hidden text-right" dir="rtl">
    <div className="flex justify-between items-start mb-4">
      <div className="flex flex-col items-start gap-1 text-right">
        <h3 className="text-text-muted font-bold text-sm sm:text-base">{title}</h3>
        <span className="text-3xl sm:text-4xl font-black text-text-main">{count}</span>
      </div>
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100 flex items-center justify-center`}>
        <Icon size={24} />
      </div>
    </div>

    <div className="border-t border-border-main/50 pt-3 mt-auto flex flex-col gap-1.5 w-full">
      {subDetails}
    </div>
  </div>
);

export default function DashboardHome() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const {
    dentistsOrdersData,
    labsOrdersData,
    kpiStats,
    isLoading,
    isError,
    getPeriodText
  } = useDashboardStats();

  const dentistsColumnConfig = {
    data: dentistsOrdersData,
    xField: 'displayName',
    yField: 'totalOrders',
    theme: theme === 'dark' ? 'dark' : 'light',
    style: {
      fill: theme === 'dark' ? '#a78bfa' : '#8b5cf6',
      radiusTopLeft: 8,
      radiusTopRight: 8,
    },
    label: {
      text: 'totalOrders',
      style: {
        fontSize: 11,
        fontWeight: 'bold',
        dy: -8,
        fill: theme === 'dark' ? '#f8fafc' : '#1f2937',
      },
    },
    axis: {
      x: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  const labsColumnConfig = {
    data: labsOrdersData,
    xField: 'displayName',
    yField: 'totalOrders',
    theme: theme === 'dark' ? 'dark' : 'light',
    style: {
      fill: theme === 'dark' ? '#34d399' : '#10b981',
      radiusTopLeft: 8,
      radiusTopRight: 8,
    },
    label: {
      text: 'totalOrders',
      style: {
        fontSize: 11,
        fontWeight: 'bold',
        dy: -8,
        fill: theme === 'dark' ? '#f8fafc' : '#1f2937',
      },
    },
    axis: {
      x: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  const lifecycleData = [
    { type: t('dashboard.lifecycle.pending'), value: 18 },
    { type: t('dashboard.lifecycle.progress'), value: 34 },
    { type: t('dashboard.lifecycle.scanner'), value: 12 },
    { type: t('dashboard.lifecycle.completed'), value: 45 },
    { type: t('dashboard.lifecycle.cancelled'), value: 8 },
  ];

  const lifecycleConfig = {
    data: lifecycleData,
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    radius: 0.8,
    scale: {
      color: {
        range: ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'],
      },
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    legend: {
      color: {
        position: 'bottom',
        layout: 'horizontal',
        alignment: 'center',
        itemLabelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
        itemLabelFontSize: 11,
      },
    },
    label: {
      text: 'value',
      style: {
        fontSize: 12,
        fontWeight: 'bold',
        fill: theme === 'dark' ? '#ffffff' : '#1f2937',
      },
    },
    tooltip: {
      title: 'type',
      items: ['value'],
    },
  };

  // 2. مخطط اتجاهات مواد التعويضات (Column Chart)
  const trendsData = [
    { material: t('dashboard.materials.zircon'), count: 145 },
    { material: t('dashboard.materials.veneer'), count: 82 },
    { material: t('dashboard.materials.crystal'), count: 64 },
    { material: t('dashboard.materials.porcelain'), count: 38 },
  ];

  const trendsConfig = {
    data: trendsData,
    xField: 'material',
    yField: 'count',
    theme: theme === 'dark' ? 'dark' : 'light',
    style: {
      fill: theme === 'dark' ? '#3b82f6' : '#367AFF',
      radiusTopLeft: 8,
      radiusTopRight: 8,
    },
    label: {
      text: 'count',
      style: {
        fontSize: 11,
        fontWeight: 'bold',
        dy: -8,
        fill: theme === 'dark' ? '#f8fafc' : '#1f2937',
      },
    },
    axis: {
      x: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  const labData = [
    { lab: t('dashboard.labs.alpha'), metric: t('dashboard.metrics.delayRate'), value: 5 },
    { lab: t('dashboard.labs.alpha'), metric: t('dashboard.metrics.rejectRate'), value: 2 },
    { lab: t('dashboard.labs.salam'), metric: t('dashboard.metrics.delayRate'), value: 12 },
    { lab: t('dashboard.labs.salam'), metric: t('dashboard.metrics.rejectRate'), value: 8 },
    { lab: t('dashboard.labs.smile'), metric: t('dashboard.metrics.delayRate'), value: 4 },
    { lab: t('dashboard.labs.smile'), metric: t('dashboard.metrics.rejectRate'), value: 1 },
    { lab: t('dashboard.labs.elite'), metric: t('dashboard.metrics.delayRate'), value: 8 },
    { lab: t('dashboard.labs.elite'), metric: t('dashboard.metrics.rejectRate'), value: 3 },
    { lab: t('dashboard.labs.future'), metric: t('dashboard.metrics.delayRate'), value: 15 },
    { lab: t('dashboard.labs.future'), metric: t('dashboard.metrics.rejectRate'), value: 6 },
  ];

  const labConfig = {
    data: labData,
    xField: 'lab',
    yField: 'value',
    colorField: 'metric',
    point: {
      shapeField: 'circle',
      sizeField: 4,
    },
    scale: {
      color: {
        range: ['#EF4444', '#F59E0B'],
      },
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    axis: {
      x: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
    legend: {
      color: {
        position: 'bottom',
        itemLabelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  const revenueData = [
    { month: t('dashboard.months.december'), type: t('dashboard.revenue.ads'), value: 1200 },
    { month: t('dashboard.months.december'), type: t('dashboard.revenue.subs'), value: 7500 },
    { month: t('dashboard.months.january'), type: t('dashboard.revenue.ads'), value: 1500 },
    { month: t('dashboard.months.january'), type: t('dashboard.revenue.subs'), value: 8000 },
    { month: t('dashboard.months.february'), type: t('dashboard.revenue.ads'), value: 1800 },
    { month: t('dashboard.months.february'), type: t('dashboard.revenue.subs'), value: 9200 },
    { month: t('dashboard.months.march'), type: t('dashboard.revenue.ads'), value: 2100 },
    { month: t('dashboard.months.march'), type: t('dashboard.revenue.subs'), value: 10500 },
    { month: t('dashboard.months.april'), type: t('dashboard.revenue.ads'), value: 2300 },
    { month: t('dashboard.months.april'), type: t('dashboard.revenue.subs'), value: 11800 },
    { month: t('dashboard.months.may'), type: t('dashboard.revenue.ads'), value: 2400 },
    { month: t('dashboard.months.may'), type: t('dashboard.revenue.subs'), value: 12840 },
  ];

  const revenueConfig = {
    data: revenueData,
    xField: 'month',
    yField: 'value',
    colorField: 'type',
    stack: true,
    scale: {
      color: {
        range: ['#8B5CF6', '#3B82F6'],
      },
    },
    theme: theme === 'dark' ? 'dark' : 'light',
    axis: {
      x: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
      y: {
        labelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
    legend: {
      color: {
        position: 'bottom',
        itemLabelFill: theme === 'dark' ? '#94a3b8' : '#6b7280',
      },
    },
  };

  return (
    <div className="space-y-6 sm:space-y-8  animate-in fade-in duration-500 pb-8 text-right" dir="rtl">
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse bg-bg-card border border-border-main rounded-[2rem] p-6 h-48 w-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-2/3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full w-3/4"></div>
                  <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-full w-1/2"></div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-800"></div>
              </div>
              <div className="border-t border-border-main/50 pt-3 space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title={t('dashboard.totalDoctors')}
            count={kpiStats.doctors.total}
            icon={Users}
            color="bg-blue-500 text-blue-500"
            subDetails={
              <>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">{t('dashboard.activeAccounts')}</span>
                  <span className="font-bold text-green-500">{kpiStats.doctors.active} طبيب</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">{t('dashboard.pendingVerificationSyndicate')}</span>
                  <span className="font-bold text-amber-500">{kpiStats.doctors.pending} حساب</span>
                </div>
              </>
            }
          />

          <StatCard
            title={t('dashboard.totalLabs')}
            count={kpiStats.labs.total}
            icon={FlaskConical}
            color="bg-emerald-500 text-emerald-500"
            subDetails={
              <>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">{t('dashboard.activeSubscribedLabs')}</span>
                  <span className="font-bold text-green-500">{kpiStats.labs.active} مخبر</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">{t('dashboard.suspendedExpiredAccounts')}</span>
                  <span className="font-bold text-text-muted">{kpiStats.labs.suspended} مخبر</span>
                </div>
              </>
            }
          />

          <StatCard
            title={t('dashboard.activeCases')}
            count={kpiStats.cases.total}
            icon={Activity}
            color="bg-amber-500 text-amber-500"
            subDetails={
              <>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">{t('dashboard.inProgressLabs')}</span>
                  <span className="font-bold text-primary">{kpiStats.cases.inProgress} حالة</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">{t('dashboard.waitingScannerDelivery')}</span>
                  <span className="font-bold text-purple-500">{kpiStats.cases.waitingScanner} حالة</span>
                </div>
              </>
            }
          />

          <StatCard
            title={t('dashboard.monthlyRevenue')}
            count={"$" + kpiStats.revenue.total.toLocaleString()}
            icon={DollarSign}
            color="bg-violet-500 text-violet-500"
            subDetails={
              <>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">{t('dashboard.labSubscriptionsLabel')}</span>
                  <span className="font-bold text-text-main">${kpiStats.revenue.subscriptions.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-text-muted">{t('dashboard.adSpacesRevenue')}</span>
                  <span className="font-bold text-purple-500">${kpiStats.revenue.ads.toLocaleString()}</span>
                </div>
              </>
            }
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.dentistsOrders')} {getPeriodText(dentistsOrdersData)}</h3>
              <p className="text-xs text-text-muted">{t('dashboard.dentistsOrdersDesc')}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-violet-500 bg-violet-500/10 px-2 py-1 rounded-lg font-bold">
              <TrendingUp size={14} />
              <span>{t('dashboard.highActivity')}</span>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-sm text-text-muted">{t('common.loading')}</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-2 text-red-500">
                <AlertTriangle size={32} />
                <span className="text-sm">{t('dashboard.failedLoadDoctorsStats')}</span>
              </div>
            ) : dentistsOrdersData.length === 0 ? (
              <span className="text-sm text-text-muted">{t('common.noData')}</span>
            ) : (
              <div className="w-full h-full">
                <Column {...dentistsColumnConfig} />
              </div>
            )}
          </div>
        </div>

        <div className="bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.labsOrders')} {getPeriodText(labsOrdersData)}</h3>
              <p className="text-xs text-text-muted">{t('dashboard.labsOrdersDesc')}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg font-bold">
              <TrendingUp size={14} />
              <span>{t('dashboard.highProductivity')}</span>
            </div>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-primary" size={32} />
                <span className="text-sm text-text-muted">{t('common.loading')}</span>
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center gap-2 text-red-500">
                <AlertTriangle size={32} />
                <span className="text-sm">{t('dashboard.failedLoadLabsStats')}</span>
              </div>
            ) : labsOrdersData.length === 0 ? (
              <span className="text-sm text-text-muted">{t('common.noData')}</span>
            ) : (
              <div className="w-full h-full">
                <Column {...labsColumnConfig} />
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">

        <div className="lg:col-span-6 bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div className="text-right">
              <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.marketTrends')}</h3>
              <p className="text-xs text-text-muted">{t('dashboard.marketTrendsDesc')}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded-lg font-bold">
              <TrendingUp size={14} />
              <span>{t('dashboard.growing')}</span>
            </div>
          </div>
          <div className="h-[300px]">
            <Column {...trendsConfig} />
          </div>
        </div>

        <div className="lg:col-span-4 bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.orderLifecycle')}</h3>
            <p className="text-xs text-text-muted">{t('dashboard.orderLifecycleDesc')}</p>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <Pie {...lifecycleConfig} />
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.labsPerformance')}</h3>
            <p className="text-xs text-text-muted">{t('dashboard.labsPerformanceDesc')}</p>
          </div>
          <div className="h-[300px] mt-6">
            <Line {...labConfig} />
          </div>
        </div>

        <div className="bg-bg-card border border-border-main rounded-[2rem] p-4 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="text-right">
            <h3 className="text-base sm:text-lg font-bold text-text-main">{t('dashboard.financialAnalysis')}</h3>
            <p className="text-xs text-text-muted">{t('dashboard.financialAnalysisDesc')}</p>
          </div>
          <div className="h-[300px] mt-6">
            <Area {...revenueConfig} />
          </div>
        </div>

      </div>

    </div>
  );
}